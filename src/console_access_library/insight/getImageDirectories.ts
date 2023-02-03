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

import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import { InsightApi, Configuration } from 'js-client';
import { Config } from '../common/config';
import * as Logger from '../common/logger/logger';
import { getMessage } from '../common/logger/getMessage';
import {
    ErrorCodes,
    genericErrorMessage,
    validationErrorMessage,
} from '../common/errorCodes';

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

/**
 * This class implements API for each device group, a list of image storage \
 *      directories for each device is acquired.
 */
export class GetImageDirectories {
    config: Config;
    api: InsightApi;

    /**
     * Constructor Method for the class GetImageDirectories
     * @param config Object of Config Class
     */
    constructor(config: Config) {
        this.config = config;
    }

    schema = {
        type: 'object',
        properties: {
            deviceId: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for deviceId',
                    isNotEmpty: 'deviceId required or can\'t be empty string',
                },
            },
        },
        required: ['deviceId'],
        additionalProperties: false,
        errorMessage: {
            required: {
                deviceId: 'deviceId is required',
            },
        },
    };

    /**
     * getImageDirectories- Image storage directory list retrieval API. For each device group, a list of image \
            storage directories for each device is acquired.
     *  @params 
     * - deviceId(str, optional):  Device ID \
                If specified, the image directory list associated with the specified \
                device ID is returned. Case-sensitive 
     * @returns
     * - Object: table:: Success Response

            +------------------+------------+------------+-------------------------------+
            |  Level1          |  Level2    |  Type      |  Description                  |
            +------------------+------------+------------+-------------------------------+
            |  `No_item_name`  |            |            | Device Affiliation Group Array|
            +------------------+------------+------------+-------------------------------+
            |                  | `group_id` |   `string` | Set the device group ID.      |
            +------------------+------------+------------+-------------------------------+
            |                  |  `devices` |  `array`   | Refer : Table : 1.0           |
            |                  |            |            | for more details              |
            +------------------+------------+------------+-------------------------------+
            
        @Table : 1.0 - devices schema details

            +-------------------+--------------------+------------+--------------------------+
            |  Level1           |  Level2            |  Type      |  Description             |
            +-------------------+--------------------+------------+--------------------------+
            |  `devices`        |   `array`          |            | Device Array.            |
            |                   |                    |            | The subordinate          |
            |                   |                    |            | elements are listed      |
            |                   |                    |            | in ascending order       |
            |                   |                    |            | by device ID             |   
            +-------------------+--------------------+------------+--------------------------+
            |                   | `device_id`        |   `string` | Device ID.               |
            +-------------------+--------------------+------------+--------------------------+
            |                   | `device_name`      |   `string` | Device name at the time  |
            |                   |                    |            | of registration          | 
            +-------------------+--------------------+------------+--------------------------+
            |                   | `Image`            |  `array`   | The descendant elements  |
            |                   |                    |            | are listed in ascending  | 
            |                   |                    |            | order by directory name. | 
            +-------------------+--------------------+------------+--------------------------+

     * - 'Generic Error Response' :
     *   If Any generic error returned from the Low Level SDK. Object with below key and value pairs.
     *      - 'result' (str) : "ERROR"
     *      - 'message' (str) : error message returned from the Low Level SDK API
     *      - 'code' (str) : "Generic Error"
     *      - 'datetime' (str) : Time
     * 
     * - 'Validation Error Response' :
     *   If incorrect API input parameters OR \
     *  if any input string parameter found empty. \
     *  Then, Object with below key and value pairs.
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
     *   import { Client, Config } from 'consoleaccesslibrary'
     * 
     *    const consoleEndpoint: '__consoleEndpoint__';
     *    const portalAuthorizationEndpoint: '__portalAuthorizationEndpoint__';
     *    const clientId: '__clientId__';
     *    const clientSecret: '__clientSecret__';
     *    const config = new Config(consoleEndpoint,portalAuthorizationEndpoint, clientId, clientSecret);
     *  
     *    const client = await Client.createInstance(config);
     *    const deviceId = '__deviceId__';
     *    const response= await client.insight.getImageDirectories(deviceId);
     *
     */
    async getImageDirectories(deviceId?: string) {
        Logger.info('getImageDirectories');
        let valid = true;
        try {
            const validate = ajv.compile(this.schema);
            valid = validate({ deviceId: deviceId });
            if (!valid) {
                Logger.error(`${validate.errors}`);
                throw validate.errors;
            }
            const accessToken= await this.config.getAccessToken();
            const baseOptions= await this.config.setOption();

            const apiConfig = new Configuration({
                basePath: this.config.consoleEndpoint,
                accessToken,
                baseOptions
            });
            this.api = new InsightApi(apiConfig);
            const res = await this.api.getImageDirectories(deviceId);
            return res;
        } catch (error) {
            if (!valid) {
                Logger.error(getMessage(ErrorCodes.ERROR, error[0].message));
                return validationErrorMessage(
                    getMessage(ErrorCodes.ERROR, error[0].message)
                );
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
