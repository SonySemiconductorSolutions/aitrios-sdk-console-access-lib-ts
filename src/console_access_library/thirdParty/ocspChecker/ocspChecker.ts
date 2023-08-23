/*
 * Copyright 2022 Sony Semiconductor Solutions Corp. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as x509 from '@peculiar/x509';
import axios from 'axios';
import { X509Certificate } from '@peculiar/x509';
import * as asnX509 from '@peculiar/asn1-x509';
import { AsnParser, AsnSerializer, OctetString } from '@peculiar/asn1-schema';
import { Convert } from 'pvtsutils';
import { AlgorithmIdentifier } from './../ocspUtils/algoIdentifier';
import { CertID } from './../ocspUtils/certId';
import { OCSPRequest } from './../ocspUtils/ocsp_req';
import { TBSRequest } from './../ocspUtils/tbs_req';
import { Request } from './../ocspUtils/request';
import * as crypto from 'crypto';
import { Certificate } from './../ocspUtils/certificate';
import { OCSPResponse } from './../ocspUtils/ocsp_response';
import * as URLParser from 'url';
import { BasicOCSPResponse } from './../ocspUtils/basic_ocsp_response';
import * as Logger from './../../common/logger/logger';
import { OCSPHandler } from './ocspHandler';
import { HttpsProxyAgent } from 'https-proxy-agent';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const https = require('https');

// analyzer will help to validate the input details
const analyzer = {
    String: (string, replace) => {
        if (string.length === 0) {
            return replace;
        } else {
            return string;
        }
    },
    OCSP: (cert) => {
        try {
            const _OCSP = cert.infoAccess['OCSP - URI'];

            return _OCSP;
        } catch {
            return [undefined];
        }
    },
    CA: (cert) => {
        try {
            const _CA = cert.infoAccess['CA Issuers - URI'];

            if (_CA[0].endsWith('/')) return [undefined];

            return _CA;
        } catch {
            return [undefined];
        }
    },
    inputs: {
        Port: (port) => {
            return (
                !isNaN(parseFloat(port)) &&
                Math.sign(port) === 1 &&
                typeof port === 'number'
            );
        },
        Method: (method) => {
            if (method === 'GET' || method === 'HEAD') return true;
            if (method !== 'GET' && method !== 'HEAD') return false;
        },
        check: {
            Options: (input) => {
                const output: any = {};

                if (input?.method) output.method = input.method;
                if (input?.port) output.port = input.port;

                return output;
            },
        },
    },
};

const default_options = {
    agent: new https.Agent({
        maxCachedSessions: 0,
    }),
    method: 'GET',
    port: 443,
    path: '/',
};

/**
 * getOCSPStatus: Get OCSP status for host Url from CA.
 * @param inputURL: inputUrl to verify the OCSP status
 * @param proxy : proxy url if applicable
 * @param options : options of port and request method
 * @returns response object with 'status' and 'serialNumber'
 */
export function getOCSPStatus(inputURL, proxy, options) {
    return new Promise((resolve, reject) => {
        const response: any = {
            status: 'Unknown',
            serialNumber: '',
        };
        try {
            // validation of input url
            if (!inputURL || typeof inputURL !== 'string')
                return reject(new Error('Invalid url'));

            const _URL = new URL(inputURL);

            // validation of protocol
            if (_URL.protocol !== 'http:' && _URL.protocol !== 'https:')
                return reject(new Error('Invalid protocol'));

            // validation of input options
            if (
                !!options === true &&
                Object.prototype.toString.call(options) !== '[object Object]'
            )
                return reject(new Error('Invalid options'));

            options = Object.assign(
                {},
                default_options,
                analyzer.inputs.check.Options(options)
            );

            // validation of request method
            if (analyzer.inputs.Method(options.method) !== true)
                return reject(new Error('Invalid method'));

            // validation of request port
            if (analyzer.inputs.Port(options.port) !== true)
                return reject(new Error('Invalid port'));

            // fetching the server certificate with help of get-ssl-certificate
            getSSLCertificate(_URL.host, proxy).then(async function (certificate) {
                const serverCertBase64 = certificate.raw.toString('base64');
                const scoreManager = OCSPHandler.getInstance();

                try {
                    const cert = new x509.X509Certificate(
                        certificate.pemEncoded
                    );
                    const nowTime = new Date();
                    response.status = 'Unknown';
                    response.serialNumber = cert.serialNumber;

                    if (cert.notAfter < nowTime || cert.notBefore > nowTime) {
                        // checking the validity date of certificate
                        response.status = 'Expired';
                        return resolve(response);
                    } else {
                        // extracting the AIA information
                        const aiaExt: any =
                            cert.getExtension('1.3.6.1.5.5.7.1.1');
                        const aiaExtVal = AsnParser.parse(
                            aiaExt?.value,
                            asnX509.AuthorityInfoAccessSyntax
                        );

                        // retrieving ocspServerURL with help of AIA value of server certificate

                        /**
                         Certificate AIA(Authority Information access) contains 2 parts:
                         1. Access Method=On-line Certificate Status Protocol (1.3.6.1.5.5.7.48.1)
                         2. Access Method=Certification Authority Issuer (1.3.6.1.5.5.7.48.2) 

                         Obtain the OCSP Responder URL using Access Method=On-line Certificate
                         Status Protocol (1.3.6.1.5.5.7.48.1)
                        **/

                        let ocspServerURL;
                        aiaExtVal.forEach((aiaItem) => {
                            if (
                                aiaItem &&
                                aiaItem.accessMethod === '1.3.6.1.5.5.7.48.1'
                            ) {
                                ocspServerURL =
                                    aiaItem?.accessLocation
                                        ?.uniformResourceIdentifier;
                                return;
                            }
                        });
                        Logger.info(`OCSP URL: ${ocspServerURL}`);

                        // fetching the intermediate certificate data in base64 format using Host
                        const intermediateCertBase64 =
                            await getIntermediateCertData(_URL.host, proxy);

                        //Check if Alredy verified
                        if (
                            !intermediateCertBase64 &&
                            scoreManager.getStatus(_URL.host) &&
                            scoreManager.getStatus(_URL.host).toLowerCase() ===
                            'good'
                        ) {
                            response.status = 'Good';
                            return resolve(response);
                        }
                        // converting serverCertBase64 to X509Certificate format
                        const certificate = new X509Certificate(
                            serverCertBase64.toString()
                        );

                        // converting intermediateCertBase64 to X509Certificate format
                        const interCert = new X509Certificate(
                            intermediateCertBase64.toString()
                        );
                        let intermediateCert: any = {};

                        // parsing interCert data using AsnParser
                        intermediateCert = AsnParser.parse(
                            Buffer.from(interCert.toString('base64'), 'base64'),
                            Certificate
                        );

                        // preparing issuerKeyHash with intermediate certificate
                        const issuerKeyHash = crypto
                            .createHash('sha1')
                            .update(
                                Buffer.from(
                                    intermediateCert.tbsCertificate
                                        .subjectPublicKeyInfo.subjectPublicKey
                                )
                            )
                            .digest('hex');

                        // preparing issuerNameHash with intermediate certificate
                        const issuerNameHash = crypto
                            .createHash('sha1')
                            .update(
                                Buffer.from(
                                    AsnSerializer.serialize(
                                        intermediateCert.tbsCertificate.subject
                                    )
                                )
                            )
                            .digest('hex');

                        // preparing OCSP request with help of issuerNameHash, issuerKeyHash and Server certifcate serialNumber
                        const request = new OCSPRequest({
                            tbsRequest: new TBSRequest({
                                requestList: [
                                    new Request({
                                        reqCert: new CertID({
                                            hashAlgorithm:
                                                new AlgorithmIdentifier({
                                                    algorithm: '1.3.14.3.2.26',
                                                }),
                                            issuerNameHash: new OctetString(
                                                Convert.FromHex(issuerNameHash)
                                            ),
                                            issuerKeyHash: new OctetString(
                                                Convert.FromHex(issuerKeyHash)
                                            ),
                                            serialNumber: Convert.FromHex(
                                                certificate.serialNumber
                                            ),
                                        }),
                                    }),
                                ],
                            }),
                        });

                        // serialization and encoding the request
                        const der = AsnSerializer.serialize(request);
                        const arr = new Uint8Array(der);

                        // converting arr to base64 and apply URI encoding
                        const urlEncodedValue = encodeURIComponent(
                            Convert.ToBase64(arr)
                        )
                            .replace('\'', '%27')
                            .replace('/', '%2F');

                        // preparing the final url to get ocsp status by get request
                        const finalOCSPRequestUrl =
                            ocspServerURL + '/' + urlEncodedValue;
                        const options: any = { responseType: 'arraybuffer' };

                        //start- logic to apply the proxy if applicaple
                        const baseProxy: any = {};
                        const baseAuth: any = {};

                        if (proxy) {
                            // parsing proxy data
                            const proxyHostname =
                                URLParser.parse(proxy).hostname || '';
                            const proxyPort =
                                URLParser.parse(proxy).port || '8080';
                            const auth = URLParser.parse(proxy).auth;
                            const protocol =
                                URLParser.parse(proxy).protocol || 'http';

                            // update proxy protocol, host, port
                            baseProxy.protocol = protocol;
                            baseProxy.host = proxyHostname;
                            baseProxy.port = parseInt(proxyPort);

                            if (auth) {
                                // add auth credentials with proxy
                                const creds = auth.split(':');
                                baseAuth.username = creds[0];
                                baseAuth.password = creds[1];
                                baseProxy.auth = baseAuth;
                            }
                        }
                        if (baseProxy && baseProxy.host) {
                            // add proxy with options
                            options.proxy = baseProxy;
                        }
                        // end- logic to apply the proxy if applicaple

                        //axios request to get OCSP status by using finalOCSPRequestUrl
                        await axios
                            .get(finalOCSPRequestUrl, {
                                ...options,
                            })
                            .then(async (res) => {
                                const data = res.data;
                                let parsedRes: any = {};

                                // parsing the response using AsnParser
                                parsedRes = AsnParser.parse(data, OCSPResponse);
                                if (
                                    parsedRes.responseStatus === 1 ||
                                    parsedRes.responseStatus === 2
                                ) {
                                    response.status = 'Unknown';
                                    return resolve(response);
                                }

                                // extracting the response body from responseBytes
                                const ocspRes: any =
                                    parsedRes.responseBytes?.response
                                        .toASN()
                                        .toJSON();

                                // convert valueBlock fromHex and parsing using AsnParser
                                let basicOCSPResponse: any = {};
                                basicOCSPResponse = AsnParser.parse(
                                    Convert.FromHex(
                                        ocspRes.valueBlock.valueHex
                                    ),
                                    BasicOCSPResponse
                                );

                                // extracting the certStatus from basicOCSPResponse
                                const certStatus =
                                    basicOCSPResponse.tbsResponseData
                                        .responses[0].certStatus;

                                // parsing certStatus using JSON parser
                                const finalStatusObj = JSON.parse(
                                    JSON.stringify(certStatus)
                                );

                                if ('good' in finalStatusObj) {
                                    // update response status as Good if final status is good
                                    response.status = 'Good';
                                    scoreManager.setStatus(_URL.host, 'Good');
                                }
                                return resolve(response);
                            })
                            // eslint-disable-next-line no-unused-vars
                            .catch(() => {
                                response.status = 'Unknown';
                                return resolve(response);
                            });
                    }
                } catch (e) {
                    return resolve(response);
                }
            });
        } catch (error) {
            return resolve(response);
        }
    });
}

/**
 * getIntermediateCertData: fetching the intermetaite certificate from host
 * @param hostName
 * @param proxy : proxy url if applicable
 * @returns base64 endoced data of intermediate certificate
 */
async function getIntermediateCertData(hostName: string, proxy?: string) {
    return new Promise((resolve) => {
        let data = '';
        const agent = getProxyAgent(proxy);
        https.get(
            {
                host: hostName,
                path: '/',
                method: 'GET',
                checkServerIdentity: function (host, cert) {
                    data = cert.issuerCertificate.raw.toString('base64');
                    resolve(data);
                },
                agent,
            },
            // eslint-disable-next-line no-unused-vars
            () => {
                if (!data) {
                    resolve(data);
                }
            }
        );
    });
}

type SSLCertificate = {
    raw: Buffer,
    pemEncoded: string,
}

/**
 * getSSLCertificate: fetching the ssl certificate from host
 * @param hostName
 * @param proxy : proxy url if applicable
 * @returns certificate object with raw data and pem format
 */
function getSSLCertificate(hostname: string, proxy?: string): Promise<SSLCertificate> {
    const agent = getProxyAgent(proxy);
    const options = {
        hostname: hostname,
        ciphers: 'ALL',
        agent,
    };
    return new Promise((resolve, reject) => {
        https.get(options, (res: { socket: { getPeerCertificate: () => any; }; }) => {
            const cert: any = res.socket.getPeerCertificate();
            if (!cert || Object.keys(cert).length < 1) {
                reject('The website did not provide a certificate');
            } else {
                if (cert.raw) {
                    const work = cert.raw.toString('base64');
                    const pem = [];
                    pem.push('-----BEGIN CERTIFICATE-----\n');
                    for (let i = 1; i <= work.length; i++) {
                        pem.push(work[i - 1]);
                        const mod = i % 64;
                        if (mod === 0) {
                            pem.push('\n');
                        }
                    }
                    pem.push('\n-----END CERTIFICATE-----');
                    cert['pemEncoded'] = pem.join('');
                }
                resolve(cert);
            }
        });
    });
}

/**
 * getProxyAgent: returns an HttpsProxyAgent object if needed 
 * @param proxy : proxy url if applicable
 * @returns HttpsProxyAgent
 */
function getProxyAgent(proxy?: string): (boolean | HttpsProxyAgent) {
    let agent: boolean | HttpsProxyAgent;
    if (proxy) {
        const proxyHostname = URLParser.parse(proxy).hostname;
        const proxyPort = URLParser.parse(proxy).port;
        const auth = URLParser.parse(proxy).auth;
        const httpsAgent = new HttpsProxyAgent({
            host: proxyHostname,
            port: proxyPort,
            auth: auth,
        });
        agent = httpsAgent;
    } else {
        agent = false;
    }
    return agent;
}
