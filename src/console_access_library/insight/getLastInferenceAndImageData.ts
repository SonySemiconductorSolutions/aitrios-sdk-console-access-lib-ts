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
 * This class implements API to get the latest data of saved inference result and image.
 */
export class GetLastInferenceAndImageData {
    config: Config;
    api: InsightApi;

    /**
     * Constructor Method for the class GetLastInferenceAndImageData
     * @param config Object of Config Class
     */
    constructor(config: Config) {
        this.config = config;
    }

    /**
    * Schema for API to retrieve (saved) inference result metadata list information for a specified device.

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
        },
        required: ['deviceId', 'subDirectoryName'],
        additionalProperties: false,
        errorMessage: {
            required: {
                deviceId: 'deviceId is required',
                subDirectoryName: 'subDirectoryName is required'
            },
        },
    };

    /**
     * getLastInferenceAndImageData- Get the latest data of saved inference result and image.
     *  @params
     * - deviceId (str, required) - Edge AI Device ID.
     * - subDirectoryName (str, required) - The Sub Directory Name. \
                The subdirectory will be the directory notified in the response \
                of startUploadInferenceResult.
     * @returns
     * - Object: table:: Success Response
    - when time parameter is not specified
         
            +--------------------+------------+------------------------------------+
            |  Level1            |  Type      |  Description                       |
            +--------------------+------------+------------------------------------+
            |  `image_data`      | `array`    | Refer :ref: Table : 1.0            |
            |                    |            | for more details                   |
            +--------------------+------------+------------------------------------+
            | `inference_data`   | `array`    | Refer :  Table : 1.1               |
            |                    |            | for more details                   |
            +--------------------+------------+------------------------------------+

        @Table : 1.0 - image_data schema details

            +----------------+----------------------+------------+---------------------------+
            |  Level1        |  Level2              |  Type      |  Description              |
            +----------------+----------------------+------------+---------------------------+
            |  `image_data`  |                      |  `array`   | image data                |
            |                |                      |            |                           |
            +----------------+----------------------+------------+---------------------------+
            |                |  `total_image_count` |   `int`    | Set the total number of   |
            |                |                      |            | images                    |
            +----------------+----------------------+------------+---------------------------+
            |                |  `images`            |  `array`   | Refer : Table : 1.2       |
            |                |                      |            | for more details          |
            +----------------+----------------------+------------+---------------------------+

        @Table : 1.1 - inference_data schema details

            +------------------+-------------+-----------+------------------------------------+
            |  Level1          |  Level2     |  Type     |  Description                       |
            +------------------+-------------+-----------+------------------------------------+
            | `inference_data` |             | `array`   | inference_data                     |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `id`        |  `string` | The ID of the inference            |
            |                  |             |           | result metadata.                   |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `device_id` |  `string` | Device ID.                         |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `model_id`  |  `string` | Model ID.                          |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `model      | `string`  | Dnn Model Version                  |
            |                  |_version_id` |           |                                    |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `model      | `string`  |Model type.                         |
            |                  |_type`       |           |                                    |
            |                  |             |           |00: Image classification            |
            |                  |             |           |                                    |
            |                  |             |           |01: Object detection                |
            |                  |             |           |                                    |
            |                  |             |           |* In the case of imported           |
            |                  |             |           |models, 01 is fixed at the          |
            |                  |             |           |current level.                      |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `training   | `string`  |Name of the training_kit            |
            |                  |_kit_name`   |           |                                    |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `_ts`       | `string`  |Timestamp. = System                 |
            |                  |             |           |registration date and time          |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `inference  | `string`  |Refer :  Table : 1.3                |
            |                  |_result`     |           |for more details                    |
            +------------------+-------------+-----------+------------------------------------+

        @Table : 1.2 - images schema details

            +-----------------------+------------+------------+---------------------------+
            |  Level1               |  Level2    |  Type      |  Description              |
            +-----------------------+------------+------------+---------------------------+
            | `images`              |            |  `array`   | Image file name array     |
            |                       |            |            | The descendant elements   |
            |                       |            |            | are listed in ascending   |
            |                       |            |            | order by image file name. |
            +-----------------------+------------+------------+---------------------------+
            |                       | `name`     |  `string`  | Set the image file name.  |
            +-----------------------+------------+------------+---------------------------+
            |                       | `contents` |  `string`  | Image file contents       |
            |                       |            |            | * Base64 encoding         |
            +-----------------------+------------+------------+---------------------------+

        @Table : 1.3 - inference_result schema details

            +--------------------+--------------+------------+-------------------------------+
            |  Level1            |  Level2      |  Type      |  Description                  |
            +--------------------+--------------+------------+-------------------------------+
            | `inference_result` |              |  `array`   |Raw data for inference result  |
            |                    |              |            |in ascending order of project  |
            |                    |              |            |type and model project name.   |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `device_id`  |  `string`  |Device ID                      |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `model_id`   | `string`   |DnnModelVersion                |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `image`      | `boolean`  |Is it synchronized with        |
            |                    |              |            |the output of InputTensor?     |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `inferences` | `array`    |Refer : Table : 1.4            |
            |                    |              |            |for more details               |
            +--------------------+--------------+------------+-------------------------------+

        @Table : 1.4 - inferences schema details

            +--------------------+--------------+------------+-------------------------------+
            |  Level1            |  Level2      |  Type      |  Description                  |
            +--------------------+--------------+------------+-------------------------------+
            | `inferences`       |              |  `array`   |Inference result Array         |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `T`          |  `string`  |The time at which the data     |
            |                    |              |            |was acquired from the sensor.  |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `O`          | `string`   |Outputtensor output without    |
            |                    |              |            |going through PPL              |
            +--------------------+--------------+------------+-------------------------------+
            
    - when time parameter is specified

            +--------------------+------------+------------------------------------+
            |  Level1            |  Type      |  Description                       |
            +--------------------+------------+------------------------------------+
            |  `image_data`      | `array`    | Refer : Table : 1.5                |
            |                    |            | for more details                   |
            +--------------------+------------+------------------------------------+
            | `inference_data`   | `array`    | Refer : Table : 1.6                |
            |                    |            | for more details                   |
            +--------------------+------------+------------------------------------+

        @Table : 1.5 - image_data schema details

            +----------------+----------------------+------------+---------------------------+
            |  Level1        |  Level2              |  Type      |  Description              |
            +----------------+----------------------+------------+---------------------------+
            |  `image_data`  |                      |  `array`   | image data                |
            |                |                      |            |                           |
            +----------------+----------------------+------------+---------------------------+
            |                |  `total_image_count `|   `int`    | Set the total number of   |
            |                |                      |            | images                    |
            +----------------+----------------------+------------+---------------------------+
            |                |  `images`            |  `array`   | Refer : Table : 1.7     ` |
            |                |                      |            | for more details          |
            +----------------+----------------------+------------+---------------------------+

        @Table : 1.6 - inference_data schema details

            +------------------+--------------+-----------+--------------------------------+
            |  Level1          |  Level2      |  Type     |  Description                   |
            +------------------+--------------+-----------+--------------------------------+
            | `inference_data` |              | `array`   | inference_data                 |
            +------------------+--------------+-----------+--------------------------------+
            |                  | `id`         |  `string` | The ID of the inference result |
            |                  |              |           | metadata. = GUID automatically |
            |                  |              |           | fired by CosmosDB              |
            +------------------+--------------+-----------+--------------------------------+
            |                  | `device_id`  |  `string` | Device ID.                     |
            +------------------+--------------+-----------+--------------------------------+
            |                  | `model_id`   |  `string` | Model ID.                      |
            +------------------+--------------+-----------+--------------------------------+
            |                  | `_ts`        | `string`  | Timestamp. = System            |
            |                  |              |           | registration date and time     |
            +------------------+--------------+-----------+--------------------------------+
            |                  | `inferences` | `array`   |Refer : Table : 1.4             |
            |                  |              |           |for more details                |
            +------------------+--------------+-----------+--------------------------------+

        @Table : 1.7 - images schema details

            +-----------------------+------------+------------+---------------------------+
            |  Level1               |  Level2    |  Type      |  Description              |
            +-----------------------+------------+------------+---------------------------+
            | `images`              |            |  `array`   | Image file name array     |
            |                       |            |            | The descendant elements   |
            |                       |            |            | are listed in ascending   |
            |                       |            |            | order by image file name. |
            +-----------------------+------------+------------+---------------------------+
            |                       |  `name`    |  `string`  | Set the image file name.  |
            +-----------------------+------------+------------+---------------------------+
            |                       | `contents` |  `string`  | Image file contents       |
            |                       |            |            | * Base64 encoding         |
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
     *    const consoleEndpoint: "__consoleEndpoint__";
     *    const portalAuthorizationEndpoint: "__portalAuthorizationEndpoint__";
     *    const clientId: '__clientId__';
     *    const clientSecret: '__clientSecret__';
     *    const config = new Config(consoleEndpoint,portalAuthorizationEndpoint, clientId, clientSecret);
     *  
     *    const client = await Client.createInstance(config);
     *    const deviceId = '__deviceId__';
     *    const subDirectoryName = '__subDirectoryName__';
     *    const response= await client.insight.getLastInferenceAndImageData(deviceId, subDirectoryName);
    */

    async getLastInferenceAndImageData(
        deviceId: string,
        subDirectoryName: string
    ) {
        Logger.info('getLastInferenceAndImageData');
        let valid = true;
        const data = {
            deviceId: deviceId,
            subDirectoryName: subDirectoryName,
        };
        try {
            const validate = ajv.compile(this.schema);
            valid = validate(data);
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
            let latestImageTS = '';

            const numberOfImages = 1;
            const skip = 0;
            const orderBy = 'DESC';

            const imgRes = await this.api.getImages(
                data.deviceId,
                data.subDirectoryName,
                orderBy,
                numberOfImages,
                skip
            );

            if (imgRes && imgRes.data['images'] && imgRes.data['images'][0]) {
                
                latestImageTS = imgRes.data['images'][0]['name'].replace(
                    '.jpg',
                    ''
                );
            }

            const numberOfInferenceResult = 1;
            const filter = undefined;
            const raw = 1;
            const time = latestImageTS;
            const inferenceRes = await this.api.getInferenceResults(
                deviceId,
                numberOfInferenceResult,
                filter,
                raw,
                time
            );

            return {
                image_data: imgRes?.data,
                inference_data: inferenceRes?.data[0],
            };
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
