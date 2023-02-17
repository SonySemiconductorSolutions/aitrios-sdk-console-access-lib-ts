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
 * This class implements API to get images.
 */
export class GetImages {
    config: Config;
    api: InsightApi;

    /**
     * Constructor Method for the class GetImages
     * @param config Object of Config Class
     */
    constructor(config: Config) {
        this.config = config;
    }

    /**
    * Schema for API to get a (saved) image of the specified device.

    Args:
        Schema (object): Ajv JSON schema Validator
    */

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
            subDirectoryName: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for subDirectoryName',
                    isNotEmpty:
                        'subDirectoryName required or can\'t be empty string',
                },
            },
            numberOfImages: {
                type: 'number',
                default: 50,
                minimum: 0,
                errorMessage: {
                    type: 'Invalid number for numberOfImages',
                    minimum: 'numberOfImages is required or can\'t be negative',
                },
            },
            skip: {
                type: 'number',
                default: 0,
                minimum: 0,
                errorMessage: {
                    type: 'Invalid number for skip',
                    minimum: 'skip is required or can\'t be negative',
                },
            },
            orderBy: {
                type: 'string',
                isNotEmpty: true,
                default: 'ASC',
                errorMessage: {
                    type: 'Invalid string for orderBy',
                    isNotEmpty: 'orderBy required or can\'t be empty string',
                },
            },
        },
        required: ['deviceId', 'subDirectoryName'],
        additionalProperties: false,
        errorMessage: {
            required: {
                deviceId: 'deviceId is required',
                subDirectoryName: 'subDirectoryName is required',
            },
        },
    };

    /**
     * getImages- Get a (saved) image of the specified device.
     *  @params
     * - deviceId (str, required) - Device ID. Case-sensitive
     * - subDirectoryName (str, required) - Image storage subdirectory. \
                The subdirectory is the directory notified by the response of \
                start_upload_inference_result or the directory obtained by \
                get_image_directories.
     * - numberOfImages (int, optional) - Number of images acquired. \
                0-256. If not specified: 50.
     * - skip (int, optional) - Number of images to skip fetching. \
                If not specified: 0.
     * - orderBy (str, optional) - Sort Order: Sort order by date and time the \
                image was created. DESC, ASC, desc, asc. \
                If not specified: ASC. 
     * 
     * @returns
     * - Object: table:: Success Response
    
            +-----------------------+------------+------------+---------------------------+
            |  Level1               |  Level2    |  Type      |  Description              |
            +-----------------------+------------+------------+---------------------------+
            |  `total_image_count`  |            |   `int`    | Set the total number of   |
            |                       |            |            | images                    |
            +-----------------------+------------+------------+---------------------------+
            | `images`              |            |  `array`   | Image file name array     |
            |                       |            |            | The descendant elements   |
            |                       |            |            | are listed in ascending   |
            |                       |            |            | order by image file name. |
            +-----------------------+------------+------------+---------------------------+
            |                       |  `name`    |  `string`  | Set the image file name.  |
            +-----------------------+------------+------------+---------------------------+
            |                       | `contents` |  `string`  | Image file contents       |
            |                       |            |            | \*Base64 encoding         |
            +-----------------------+------------+------------+---------------------------+

     * - 'Generic Error Response' :
     *   If Any generic error returned from the Low Level SDK. Object with below key and value pairs.
     *      - 'result' (str) : "ERROR"
     *      - 'message' (str) : error message returned from the Low Level SDK API
     *      - 'code' (str) : "Generic Error"
     *      - 'datetime' (str) : Time
     * 
     * - 'Validation Error Response' :
     *   If incorrect API input parameters OR \
     *   if any input string parameter found empty OR \
     *   if any input integer parameter found negative OR \
     *   if any input non integer parameter found.
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
     *    const config = new Config(consoleEndpoint,portalAuthorizationEndpoint, clientId, clientSecret);
     *  
     *    const client = await Client.createInstance(config);
     *    const deviceId = '__deviceId__';
     *    const subDirectoryName = '__subDirectoryName__';
     *    const numberOfImages = '__numberOfImages__';
     *    const skip = '__skip__';
     *    const orderBy = '__orderBy__';     * 
     *    const response= await client.insight.getImages(deviceId, subDirectoryName, numberOfImages, skip, orderBy);
     *
     */

    async getImages(
        deviceId: string,
        subDirectoryName: string,
        numberOfImages = 50,
        skip = 0,
        orderBy = 'ASC'
    ) {
        Logger.info('getImages');
        let valid = true;
        try {
            const validate = ajv.compile(this.schema);
            valid = validate({
                deviceId: deviceId,
                subDirectoryName: subDirectoryName,
                orderBy: orderBy,
                numberOfImages: numberOfImages,
                skip: skip,
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
                baseOptions,
            });
            this.api = new InsightApi(apiConfig);

            const res = await this.api.getImages(
                deviceId,
                subDirectoryName,
                orderBy,
                numberOfImages,
                skip
            );
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
