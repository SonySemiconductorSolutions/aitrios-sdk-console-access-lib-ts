/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
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

import axios from 'axios';
import Ajv from 'ajv';
import * as Logger from './logger/logger';
import { Configuration } from 'js-client';
import ajvErrors from 'ajv-errors';
import { ErrorCodes } from '../common/errorCodes';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { getOCSPStatus } from '../thirdParty/ocspChecker';
import { HttpsProxyAgent } from 'https-proxy-agent';
import url from 'url';

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv);

/**
 * Access Token Validation Status Enum Value
 */
enum TokenValidationEnum {
    VALID_TOKEN = '00',
    TOKEN_EXPIRED = '01',
    INVALID_TOKEN = '02',
}

export class Config {
    consoleEndpoint: string;
    configuration: Configuration;
    portalAuthorizationEndpoint: string;
    clientSecret: string;
    clientId: string;
    saveLastAccessToken: string;

    /**
     * Constructor Method for the class Config
     *  @params
     * - 'consoleEndpoint' (str, optional): Console access URL. \
     *      If not specified, read from environment variables.
     * - 'portalAuthorizationEndpoint' (str, optional): Access token issuance URL \
     *      required for console access.
     *       If not specified, read from environment variables.
     * - 'clientId' (str, optional): Client ID required to issue an access token. \
     *       If not specified, read from environment variables.
     * - 'clientSecret' (str, optional): Client Secret required to issue an access token. \
     *       If not specified, read from environment variables.
     */
    constructor(
        consoleEndpoint: string,
        portalAuthorizationEndpoint: string,
        clientId: string,
        clientSecret: string
    ) {
        this.consoleEndpoint = consoleEndpoint;
        this.portalAuthorizationEndpoint = portalAuthorizationEndpoint;
        this.clientSecret = clientSecret;
        this.clientId = clientId;
        //Check if console access settings data is null or blank then read from evnironment varriable
        if (!consoleEndpoint) {
            this.consoleEndpoint = process.env.CONSOLE_ENDPOINT;
        }
        if (!portalAuthorizationEndpoint) {
            this.portalAuthorizationEndpoint =
                process.env.PORTAL_AUTHORIZATION_ENDPOINT;
        }
        if (!clientSecret) {
            this.clientSecret = process.env.CLIENT_SECRET;
        }
        if (!clientId) {
            this.clientId = process.env.CLIENT_ID;
        }

        const validate = ajv.compile(this.schema);
        this.saveLastAccessToken = undefined;
        const valid = validate({
            consoleEndpoint: this.consoleEndpoint,
            portalAuthorizationEndpoint: this.portalAuthorizationEndpoint,
            clientId: this.clientId,
            clientSecret: this.clientSecret,
        });

        if (!valid) {
            Logger.error(JSON.stringify(validate.errors));
            throw validate.errors;
        }

        this.configuration = new Configuration();
        this.configuration.basePath = this.consoleEndpoint;
    }

    schema = {
        type: 'object',
        properties: {
            consoleEndpoint: {
                type: 'string',
                nullable: true,
                errorMessage: {
                    type: 'Invalid string for consoleEndpoint',
                },
            },
            portalAuthorizationEndpoint: {
                type: 'string',
                nullable: true,
                errorMessage: {
                    type: 'Invalid string for portalAuthorizationEndpoint',
                },
            },
            clientSecret: {
                type: 'string',
                nullable: true,
                errorMessage: {
                    type: 'Invalid string for clientSecret',
                },
            },
            clientId: {
                type: 'string',
                nullable: true,
                errorMessage: {
                    type: 'Invalid string for clientId',
                },
            },
        },
        required: [
            'consoleEndpoint',
            'portalAuthorizationEndpoint',
            'clientSecret',
        ],
        additionalProperties: false,
        errorMessage: {
            required: {
                consoleEndpoint: 'consoleEndpoint is required',
                portalAuthorizationEndpoint:
                    'portalAuthorizationEndpoint is required',
                clientSecret: 'clientSecret is required',
                clientId: 'clientId is required',
            },
        },
    };

    /**
     *
     * Get Access Token from Token Server needed for API.
     * @returns
     * - 'On Success Response' :
     *        access_token_str
     * - 'On Error Response' :
     *        Throw exception on event of error occur
     */
    async generateAccessToken() {
        try {
            let httpsAgent;
            const proxy = this.getProxyEnv();
            if (proxy != null) {
                const proxyHostname = url.parse(proxy).hostname;
                const proxyPort = url.parse(proxy).port;
                const auth = url.parse(proxy).auth;

                httpsAgent = new HttpsProxyAgent({
                    host: proxyHostname,
                    port: proxyPort,
                    auth: auth,
                });
            }
            const { data } = await axios.post(
                this.portalAuthorizationEndpoint,
                {
                    grant_type: 'client_credentials',
                    client_secret: this.clientSecret,
                    scope: 'system',
                    client_id: this.clientId,
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    httpsAgent: httpsAgent ? httpsAgent : null,
                    proxy: false,
                }
            );
            const { access_token } = data || {};
            return access_token;
        } catch (error) {
            Logger.error(`${ErrorCodes.GENERIC_ERROR}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Function to Validate Access Token
     * @params
     * - accessToken (str, required):  Access Token for Authentication
     * @returns
     * - "00" for Valid Token
     * - "01" for Token expired
     * - "02" for Invalid token.
     */

    validateAccessToken(accessToken: string) {
        try {
            const decoded: JwtPayload = jwt_decode<JwtPayload>(accessToken);
            const exp = decoded.exp;
            const currenctTime = Math.round(new Date().getTime()) / 1000;
            const remainingTokenLife = exp - currenctTime;
            if (remainingTokenLife <= 180) {
                //Logger.debug("Less than 3 mins for Token Expiry or Token Already expired");
                return TokenValidationEnum.TOKEN_EXPIRED;
            }
            return TokenValidationEnum.VALID_TOKEN;
        } catch (e) {
            return TokenValidationEnum.INVALID_TOKEN;
        }
    }

    /**
     * Function to get the OCSP status of SSL certificate from CA (Certification Authority)
     * @params
     * - url (str, required):  Server access URL
     * @returns
     * - true for Valid SSL
     *   Throw exception on event of error occur
     */

    async getOcspStatus(url: string) {
        try {
            const proxy = this.getProxyEnv();
            const response: any = await getOCSPStatus(url, proxy, {
                port: 443,
                method: 'GET',
            });
            const { status = 'unknown' } = response || {};
            if ('good' === status.toLowerCase()) {
                Logger.info(`OCSP Status: ${status}`);
                return true;
            } else {
                return false;
            }
        } catch (e) {
            Logger.error('Certificate Expired or Invalid certificate');
            return false;
        }
    }

    /**
     * Check if access token is available or not, and check its validity.
     * @returns
     * - accessToken (str): On Success
     * - Generic Error: If an error occurs when obtaining an access token
     * - Throws error if OCSP status "is not good" for any of the URLs(consoleEndpoint or
     *   portalAuthorizationEndpoint)
     *
     */
    async getAccessToken() {
        const validationCode = this.validateAccessToken(
            this.saveLastAccessToken
        );
        // If the Access token variable has a token, check the validity of the token,
        // if expired or invalid token found generate new access token
        if (validationCode != TokenValidationEnum.VALID_TOKEN) {
            // To avoid multiple OCSP request, check OCSP status for consoleEndpoint
            // and portalAuthorizationEndpoint when requesting for access token
            // verify revocation of certificate
            const consoleEndpointOcspStatus = await this.getOcspStatus(
                this.consoleEndpoint
            );
            const portalAuthorizationEndpointOcspStatus =
                await this.getOcspStatus(this.portalAuthorizationEndpoint);
            if (!consoleEndpointOcspStatus) {
                throw new Error(
                    `OCSP Status of URL ${this.consoleEndpoint} is not good`
                );
            }
            if (!portalAuthorizationEndpointOcspStatus) {
                throw new Error(
                    `OCSP Status of URL ${this.portalAuthorizationEndpoint} is not good`
                );
            }
            this.saveLastAccessToken = await this.generateAccessToken();
        }
        //  Return the access token stored the Access token variable
        return this.saveLastAccessToken;
    }

    async setOption() {
        let baseOptions;
        const proxy = this.getProxyEnv();
        if (proxy != null) {
            const proxyHostname = url.parse(proxy).hostname;
            const proxyPort = url.parse(proxy).port;
            const auth = url.parse(proxy).auth;

            const httpsAgent = new HttpsProxyAgent({
                host: proxyHostname,
                port: proxyPort,
                auth: auth,
            });
            baseOptions = {
                httpsAgent,
                proxy: false,
            };
        }
        return baseOptions;
    }
    getProxyEnv() {
        const envKeys = ['https_proxy', 'HTTPS_PROXY'];
        for (const key of envKeys) {
            const val = process.env[key];
            if (val) {
                return val;
            }
        }
    }
}
