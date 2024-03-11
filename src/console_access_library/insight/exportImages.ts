/*
 * Copyright 2022, 2023 Sony Semiconductor Solutions Corp. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import { InsightApi, Configuration } from 'js-client';
import * as Logger from '../common/logger/logger';
import { getMessage } from '../common/logger/getMessage';
import { ErrorCodes, genericErrorMessage, validationErrorMessage } from '../common/errorCodes';
import { Config } from '../common/config';

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv);

ajv.addKeyword('isNotEmpty', {
    type: 'string',
    validate: (schema: any, data: string) => {
        if (schema) {
            return typeof data === 'string' && data.trim() !== '';
        } else return true;
    },
    keyword: '',
});
ajv.addFormat('date-time', {
    validate: (dateTimeString: string) =>
        /^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)$/.test(dateTimeString),
});
/**
 * This class implements API to export images
 */
export class ExportImages {
    config: Config;
    api: InsightApi;

    /**
     * Constructor Method for the class ExportImages
     * @param config  Object of Config Class
     */
    constructor(config: Config) {
        this.config = config;
    }

    /**
    * Schema for API to get the URL to export the images of specified conditions in zip \
        file format. *For encrypted images for learning in other environments

    Args:
        Schema (object): Ajv JSON schema Validator
    */

    schema = {
        type: 'object',
        properties: {
            key: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for key',
                    isNotEmpty: 'key required or can\'t be empty string',
                },
            },
            fromDatetime: {
                type: 'string',
                format: 'date-time',
                default: '',
                errorMessage: {
                    type: 'Invalid string for fromDatetime'
                },
            },
            toDatetime: {
                type: 'string',
                format: 'date-time',
                default: '',
                errorMessage: {
                    type: 'Invalid string for toDatetime'
                },
            },
            deviceId: {
                type: 'string',
                default: '',
                errorMessage: {
                    type: 'Invalid string for deviceId'
                },
            },
            fileFormat: {
                type: 'string',
                default: '',
                errorMessage: {
                    type: 'Invalid string for fileFormat'
                },
            },
        },
        required: ['key'],
        additionalProperties: false,
        errorMessage: {
            required: {
                key: 'key is required',
            },
        },
    };

    /**
     * exportImages- Get the URL to export the images of specified conditions in zip file format. \
        *For encrypted images for learning in other environments

        [Prerequisites]
        - The encryption method is public key cryptography.
        - A zip file containing the target images can be downloaded by accessing a URL. \
          Each image is encoded using the method described hereafter.
        - The key used for encryption is a shared key of 32 characters issued 
          randomly by the API each time.
        - The image encryption method is AES128, MODE_CBC
        - The iv (initial vector, 16 digits) and encrypted data are stored in a zip file.

        [Generating a Key]
        - Private keys are issued by Sier itself.
        - Public and private keys are issued with a length of 1024 or 2048.
        - The public key (key) specified to the parameter of this API passes \
          the pem file content of the public key in a base64 encoded format.

          Example: Base64 encode the entire string as follows:

          -----BEGIN PUBLIC KEY-----

          MIGfMA0GCSqGSIb3DQEBAQUAA4GNADC

          ...

          -----END PUBLIC KEY-----
     *  @params
     * - key (str, required) : Public key. \
            *Base64-encoded format of the entire pem file contents of the public key
     * - fromDatetime (str, optional) : Date and time (From). \
            - Format: yyyyMMddhhmm \
            Default: ""
     * - toDatetime (str, optional) : Date/Time (To). \
            - Format: yyyyMMddhhmm \
            Default: ""
     * - deviceId (str, optional) : Device ID. \
            Default: ""
     * - fileFormat (str, optional) : Image file format. \
            If this is not specified, there is no filtering. \
            - Value definition \
                JPG \
                BMP \
            Default: ""
     * @returns
     * - Object: table:: Success Response
    
            +-------------+------------+---------------------------+
            | *Level1*    | *Type*     | *Description*             |
            +=============+============+===========================+
            | ``key``     | ``string`` | Shared key for decrypting |
            |             |            | images encrypted by       |
            |             |            | a public key.             |
            +-------------+------------+---------------------------+
            | ``url``     | ``string`` | SUS URI for downloading   |
            +-------------+------------+---------------------------+

     * - 'Generic Error Response' :
     *   If Any generic error returned from the Low Level SDK. Object with below key and value pairs.
     *      - 'result' (str) : "ERROR"
     *      - 'message' (str) : error message returned from the Low Level SDK API
     *      - 'code' (str) : "Generic Error"
     *      - 'datetime' (str) : Time
     * 
     * - 'Validation Error Response' :
     *   If incorrect API input parameters OR \
     *   if any input string parameter found empty.
     *   Then, Object with below key and value pairs.
     *      - 'result' (str) : "ERROR"
     *      - 'message' (str) : validation error message for respective input parameter
     *      - 'code' (str) : "E001"
     *      - 'datetime' (str) : Time
     * 
     * - 'HTTP Error Response' :
     *   If the API http_status returned from the Console Server
     *   is other than 200. Object with below key and value pairs.
     *      - 'result' (str) : "ERROR"
     *      - 'message' (str) : error message returned from the Console server.
     *      - 'code' (str) : error code received from the Console server.
     *      - 'datetime' (str) : Time
     *
     * @example
     * Below is the example of result format.
     * .. code-block:: typescript
     *    import { Client, Config } from 'consoleaccesslibrary'
     *
     *    const consoleEndpoint: '__consoleEndpoint__';
     *    const portalAuthorizationEndpoint: '__portalAuthorizationEndpoint__';
     *    const clientId: '__clientId__';
     *    const clientSecret: '__clientSecret__';
     *    const applicationId: '__applicationId__';
     *    const config = new Config(consoleEndpoint,portalAuthorizationEndpoint,
     *                              clientId, clientSecret, applicationId);
     *
     *    const client = await Client.createInstance(config);
     *    const key = '__key__';
     *    const fromDatetime = '__fromDatetime__';
     *    const toDatetime = '__toDatetime__';
     *    const deviceId = '__deviceId__';
     *    const fileFormat = '__fileFormat__';
     *    const response= await client.insight.exportImages(key, fromDatetime, toDatetime, deviceId, fileFormat);
     */
    async exportImages(
        key: string,
        fromDatetime?: string,
        toDatetime?: string,
        deviceId?: string,
        fileFormat?: string
    ) {
        Logger.info('exportImages');
        let valid = true;
        try {
            const validate = ajv.compile(this.schema);
            valid = validate({
                key,
                fromDatetime,
                toDatetime,
                deviceId,
                fileFormat,
            });
            if (!valid) {
                Logger.error(`${validate.errors}`);
                throw validate.errors;
            }
            const accessToken = await this.config.getAccessToken();
            const baseOptions = await this.config.setOption();

            const apiConfig = new Configuration({
                basePath: this.config.consoleEndpoint,
                accessToken,
                baseOptions
            });
            this.api = new InsightApi(apiConfig);

            let res;
            if (this.config.applicationId) {
                res = await this.api.exportImages(
                    key,
                    'client_credentials',
                    fromDatetime,
                    toDatetime,
                    deviceId,
                    fileFormat
                );
            } else {
                res = await this.api.exportImages(
                    key,
                    undefined,
                    fromDatetime,
                    toDatetime,
                    deviceId,
                    fileFormat
                );
            }
            return res;
        } catch (error) {
            if (!valid) {
                Logger.error(getMessage(ErrorCodes.ERROR, error[0].message));
                return validationErrorMessage(getMessage(ErrorCodes.ERROR, error[0].message));
            }
            if (error.response) {
                /*
                 * The request was made and the server responded with a
                 * status code that falls out of the range of 2xx
                 */
                Logger.error(`${JSON.stringify(error.response.data)}`);
                return error.response.data;
            }
            Logger.error(`${ErrorCodes.GENERIC_ERROR}: ${error.message}`);
            return genericErrorMessage(error.message);
        }
    }
}
