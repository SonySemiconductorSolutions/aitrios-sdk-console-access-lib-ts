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
 * This class implements API to get the latest data of saved inference results.
 */
export class GetLastInferenceData {
    config: Config;
    api: InsightApi;

    /**
     * Constructor Method for the class GetLastInferenceData
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
     * getLastInferenceData- Retrieves the latest inference result metadata list information for a specified device.
     *  @params
     * - deviceId (str, required) - The Device Id
     * @returns
     * - Object: table:: Success Response
    - when time parameter is not specified
         
            +-------------+-----------+------------------------------------+
            |  Level1     |    Type   |  Description                       |
            +-------------+-----------+------------------------------------+
            | `id`        |  `string` | The ID of the inference            |
            |             |           | result metadata.                   |
            +-------------+-----------+------------------------------------+
            | `device_id` |  `string` | Device ID.                         |
            +-------------+-----------+------------------------------------+
            | `model_id`  |  `string` | Model ID.                          |
            +-------------+-----------+------------------------------------+
            | `model      | `string`  | Dnn Model Version                  |
            |_version_id` |           |                                    |
            +-------------+-----------+------------------------------------+
            | `model      | `string`  | Model  Type  .                     |
            |_type`       |           |                                    |
            |             |           | 00: Image classification           |
            |             |           |                                    |
            |             |           | 01: Object detection               |
            |             |           |                                    |
            |             |           | * In the case of imported          |
            |             |           | models, 01 is fixed at the         |
            |             |           | current level.                     |
            +-------------+-----------+------------------------------------+
            | `training   | `string`  | Name of the training_kit           |
            |_kit_name`   |           |                                    |
            +-------------+-----------+------------------------------------+
            | `_ts`       | `string`  | Timestamp. = System                |
            |             |           | registration date and time         |
            +-------------+-----------+------------------------------------+
            | `inference  | `string`  |Refer : Table : 1.0                 |
            |_result`     |           |for more details                    |
            +-------------+-----------+------------------------------------+
            
    - when time parameter is specified
            
            +--------------+-----------+--------------------------------+
            |  Level1      |    Type   |  Description                   |
            +--------------+-----------+--------------------------------+
            | `id`         |  `string` | The ID of the inference result |
            |              |           | metadata. = GUID automatically |
            |              |           | fired by CosmosDB              |
            +--------------+-----------+--------------------------------+
            | `device_id`  |  `string` | Device ID.                     |
            +--------------+-----------+--------------------------------+
            | `model_id`   |  `string` | Model ID.                      |
            +--------------+-----------+--------------------------------+
            | `_ts`        | `string`  | Timestamp. = System            |
            |              |           | registration date and time     |
            +--------------+-----------+--------------------------------+
            | `inferences` | `array`   |Refer : Table : 1.1             |
            |              |           |for more details                |
            +--------------+-----------+--------------------------------+

        @Table : 1.0 - inference_result schema details

            +--------------------+--------------+------------+-------------------------------+
            |  Level1            |  Level2      |    Type    |  Description                  |
            +--------------------+--------------+------------+-------------------------------+
            | `inference_result` |              |  `array`   |Raw data for inference result  |
            |                    |              |            |in ascending order of project  |
            |                    |              |            |Type and model project name.   |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `device_id`  |  `string`  |Device ID                      |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `model_id`   | `string`   |DnnModelVersion                |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `image`      | `boolean`  |Is it synchronized with        |
            |                    |              |            |the output of InputTensor?     |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `inferences` | `array`    |Refer : Table : 1.1            |
            |                    |              |            |for more details               |
            +--------------------+--------------+------------+-------------------------------+

           
        @Table : 1.1 - inferences schema details

            +--------------------+--------------+------------+-------------------------------+
            |  Level1            |  Level2      |    Type    |  Description                  |
            +--------------------+--------------+------------+-------------------------------+
            | `inferences`       |              |  `array`   |Inference result Array         |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `T`          |  `string`  |The time at which the data     |
            |                    |              |            |was acquired from the sensor.  |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `O`          | `string`   |Outputtensor output without    |
            |                    |              |            |going through PPL              |
            +--------------------+--------------+------------+-------------------------------+

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
     * .. code-block::  Type  script
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
     *    const response= await client.insight.getLastInferenceData(deviceId);
    */

    async getLastInferenceData(deviceId: string) {
        Logger.info('getLastInferenceData');
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
            const numberOfInferenceResult = 1;
            const filter = undefined;
            const raw = 1;
            const res = await this.api.getInferenceResults(
                deviceId,
                numberOfInferenceResult,
                filter,
                raw
            );
            if (res) {
                return res?.data[0];
            } else {
                return res;
            }
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
