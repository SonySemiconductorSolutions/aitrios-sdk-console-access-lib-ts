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
import { Configuration, DeployApi } from 'js-client';
import { Config } from '../common/config';
import * as Logger from '../common/logger/logger';
import {
    ErrorCodes,
    genericErrorMessage,
    validationErrorMessage,
} from '../common/errorCodes';
import { getMessage } from '../common/logger/getMessage';

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
 * This class implements GetDeployHistory API.
 */
export class GetDeployHistory {
    config: Config;
    api: DeployApi;

    /**
     * Constructor Method for the class GetDeployHistory
     * @param config Object of Config Class
     */
    constructor(config: Config) {
        this.config = config;
    }

    /**
    * Schema for API to get the deployment history for a specified device.

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
     * getDeployHistory - Get the deployment history for a specified device.
     * @params
     * - deviceId (str, required) - Device ID. Case-sensitive
     * @returns
     * - Object: table:: Success Response
    
            +----------+----------------------+------------+------------------------------+
            |  Level1  |  Level2              |  Type      |  Description                 |
            +----------+----------------------+------------+------------------------------+
            | `deploy` |                      |  `array`   | Descending order of          |
            |          |                      |            | ins_date                     |
            +----------+----------------------+------------+------------------------------+
            |          |  `id`                |  `number`  |                              |
            +----------+----------------------+------------+------------------------------+
            |          |  `deploy_type`       |  `string`  | 0: Deployment configuration  |
            |          |                      |            |                              |
            |          |                      |            | 1: Device model,             |
            |          |                      |            | App:DeviceApp                |
            +----------+----------------------+------------+------------------------------+
            |          | `deploy_status`      |  `string`  | Target device status         |
            |          |                      |            |                              |
            |          |                      |            | 0: Deploying                 |
            |          |                      |            |                              |
            |          |                      |            | 1: Succeeding                |
            |          |                      |            |                              |
            |          |                      |            | 2: failed                    |
            |          |                      |            |                              |
            |          |                      |            | 3: canceled                  |
            |          |                      |            |                              |
            |          |                      |            | 9: DeviceApp Undeploy        |
            +----------+----------------------+------------+------------------------------+
            |          | `deploy_comment`     |  `string`  |                              |
            +----------+----------------------+------------+------------------------------+
            |          |   `config_id`        |  `string`  |                              |
            +----------+----------------------+------------+------------------------------+
            |          | `replace_network_id` |  `string`  |                              |
            +----------+----------------------+------------+------------------------------+
            |          |  `current_target`    |  `string`  |                              |
            +----------+----------------------+------------+------------------------------+
            |          | `total_status`       |  `string`  | Total deployment status      |
            |          |                      |            | including other devices      |
            |          |                      |            |                              |
            |          |                      |            | 0: Deploying                 |
            |          |                      |            |                              |
            |          |                      |            | 1: Succeeding                |
            |          |                      |            |                              |
            |          |                      |            | 2: failed                    |
            |          |                      |            |                              |
            |          |                      |            | 3: canceled                  |
            |          |                      |            |                              |
            |          |                      |            | 9: DeviceApp Undeploy        |
            +----------+----------------------+------------+------------------------------+
            |          |  `firmware`          |  `array`   |  Refer : Table : 1.0         |
            |          |                      |            |  for more details            |
            +----------+----------------------+------------+------------------------------+
            |          |   `model`            |  `array`   |  Refer : Table : 1.1         |
            |          |                      |            |  for more details            |
            +----------+----------------------+------------+------------------------------+
            |          | `custom_setting`     |  `array`   |  Refer : Table : 1.2         |
            |          |                      |            |  for more details            |
            +----------+----------------------+------------+------------------------------+
            |          | `ins_id`             |  `string`  |                              |
            +----------+----------------------+------------+------------------------------+
            |          | `ins_date`           |  `string`  |                              |
            +----------+----------------------+------------+------------------------------+
            |          | `upd_id`             |  `string`  |                              |
            +----------+----------------------+------------+------------------------------+
            |          | `upd_date`           |  `string`  |                              |
            +----------+----------------------+------------+------------------------------+

        @Table : 1.0 - `firmware` schema details

            +------------+--------------------+------------+-----------------------------------+
            |  Level1    |  Level2            |  Type      |  Description                      |
            +------------+--------------------+------------+-----------------------------------+
            | `firmware` |                    |  `array`   |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_loader_    |  `string`  | 0: Not eligible                   |
            |            |target_flg`         |            |                                   |
            |            |                    |            | 1: Eligible                       |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_loader_    | `string`   | 0: Waiting to run                 |
            |            |status`             |            |                                   |
            |            |                    |            | 1: Running                        |
            |            |                    |            |                                   |
            |            |                    |            | 2: Successful                     |
            |            |                    |            |                                   |
            |            |                    |            | 3: Failed                         |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_loader_    | `string`   |                                   |
            |            |retry_count`        |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_loader_    | `string`   |                                   |
            |            |start_date`         |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_loader_    |  `string`  |                                   |
            |            |end_date`           |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_loader_    | `string`   |                                   |
            |            |version_number`     |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_loader_    | `string`   |                                   |
            |            |version_comment`    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_target_    | `string`   | 0: Not eligible                   |
            |            |flg`                |            |                                   |
            |            |                    |            | 1: Eligible                       |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_status`    |  `string`  | 0: Waiting to run                 |
            |            |                    |            | 1: Running                        |
            |            |                    |            | 2: Successful                     |
            |            |                    |            | 3: Failed                         |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_retry_     | `string`   |                                   |
            |            |count`              |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_start_     | `string`   |                                   |
            |            |date`               |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_end_date`  | `string`   |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_version_   | `string`   |                                   |
            |            |number`             |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_version_   | `string`   |                                   |
            |            |comment`            |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `apfw_target_flg`  | `string`   | 0: Not eligible                   |
            |            |                    |            |                                   |
            |            |                    |            | 1: Eligible                       |
            +------------+--------------------+------------+-----------------------------------+
            |            | `apfw_status`      | `string`   | 0: Waiting to run                 |
            |            |                    |            | 1: Running                        |
            |            |                    |            | 2: Successful                     |
            |            |                    |            | 3: Failed                         |
            +------------+--------------------+------------+-----------------------------------+
            |            | `apfw_retry_count` | `string`   |                                   |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `apfw_start_date`  | `string`   |                                   |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `apfw_end_date`    | `string`   |                                   |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `apfw_version_     | `string`   |                                   |
            |            |number`             |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `apfw_version_     | `string`   |                                   |
            |            |comment`            |            |                                   |
            +------------+--------------------+------------+-----------------------------------+

        @Table : 1.1 - `model` schema details

            +------------+--------------------+------------+-----------------------------------+
            |  Level1    |  Level2            |  Type      |  Description                      |
            +------------+--------------------+------------+-----------------------------------+
            | `model`    |                    |  `array`   |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_target_flg` |  `string`  | 0: Not eligible                   |
            |            |                    |            |                                   |
            |            |                    |            | 1: Eligible                       |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_status`     | `string`   | 0: Waiting to run                 |
            |            |                    |            |                                   |
            |            |                    |            | 1: Running                        |
            |            |                    |            |                                   |
            |            |                    |            | 2: Successful                     |
            |            |                    |            |                                   |
            |            |                    |            | 3: Failed                         |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_retry_      | `string`   |                                   |
            |            |count`              |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_start_date` | `string`   |                                   |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_end_date`   |  `string`  |                                   |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_id`         | `string`   |                                   |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_version_    | `string`   |                                   |
            |            |number`             |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_comment`    | `string`   |                                   |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_version_    |  `string`  |                                   |
            |            |comment`            |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `dnn_parame_set    | `string`   |                                   |
            |            |ting_target_flg`    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `dnn_parame_       | `string`   |                                   |
            |            |settingstatus`      |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `dnn_parame_sett   | `string`   |                                   |
            |            |ing_retry_count`    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `dnn_parame_set    | `string`   |                                   |
            |            |ting_start_date`    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `dnn_parame_set    | `string`   |                                   |
            |            |ting_end_date`      |            |                                   |
            +------------+--------------------+------------+-----------------------------------+

        @Table : 1.2 - `custom_setting` schema details

            +--------------+--------------------+------------+---------------------------------+
            |  Level1      |  Level2            |  Type      |  Description                    |
            +--------------+--------------------+------------+---------------------------------+
            | `custom_     |                    |  `array`   |                                 |
            |setting`      |                    |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `color_matrix_     |  `string`  | 0: Not eligible                 |
            |              |target_flg`         |            |                                 |
            |              |                    |            | 1: Eligible                     |
            +--------------+--------------------+------------+---------------------------------+
            |              | `color_matrix_     | `string`   | 0: Waiting to run               |
            |              |status`             |            |                                 |
            |              |                    |            | 1: Running                      |
            |              |                    |            | 2: Successful                   |
            |              |                    |            | 3: Failed                       |
            +--------------+--------------------+------------+---------------------------------+
            |              | `color_matrix_     |  `string`  |                                 |
            |              |retry_count`        |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `color_matrix_     | `string`   |                                 |
            |              |start_date`         |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `color_matrix_     |  `string`  |                                 |
            |              |end_date`           |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `color_matrix_     | `string`   |                                 |
            |              |mode`               |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `color_matrix_     |  `string`  |                                 |
            |              |file_name`          |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `color_matrix_     | `string`   |                                 |
            |              |comment`            |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `gamma_            | `string`   | 0: Not eligible                 |
            |              |target_flg`         |            |                                 |
            |              |                    |            | 1: Eligible                     |
            +--------------+--------------------+------------+---------------------------------+
            |              | `gamma_            | `string`   | 0: Waiting to run               |
            |              |status`             |            |                                 |
            |              |                    |            | 1: Running                      |
            |              |                    |            |                                 |
            |              |                    |            | 2: Successful                   |
            |              |                    |            |                                 |
            |              |                    |            | 3: Failed                       |
            +--------------+--------------------+------------+---------------------------------+
            |              | `gamma_            | `string`   |                                 |
            |              |retry_count`        |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `gamma_            | `string`   |                                 |
            |              |start_date`         |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `gamma_            | `string`   |                                 |
            |              |end_date`           |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `gamma_            | `string`   |                                 |
            |              |mode`               |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `gamma_            | `string`   |                                 |
            |              |file_name`          |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `gamma_            | `string`   |                                 |
            |              |comment`            |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscisp_           | `string`   | 0: Not eligible                 |
            |              |target_flg`         |            |                                 |
            |              |                    |            | 1: Eligible                     |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscisp_           | `string`   | 0: Waiting to run               |
            |              |status`             |            |                                 |
            |              |                    |            | 1: Running                      |
            |              |                    |            | 2: Successful                   |
            |              |                    |            | 3: Failed                       |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscisp_           | `string`   |                                 |
            |              |retry_count`        |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscisp_           | `string`   |                                 |
            |              |start_date`         |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscisp_           | `string`   |                                 |
            |              |end_date`           |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscisp_           | `string`   |                                 |
            |              |mode`               |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscisp_           | `string`   |                                 |
            |              |file_name`          |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscisp_           | `string`   |                                 |
            |              |comment`            |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscraw_           | `string`   | 0: Not eligible                 |
            |              |target_flg`         |            |                                 |
            |              |                    |            | 1: Eligible                     |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscraw_           | `string`   | 0: Waiting to run               |
            |              |status`             |            |                                 |
            |              |                    |            | 1: Running                      |
            |              |                    |            |                                 |
            |              |                    |            | 2: Successful                   |
            |              |                    |            |                                 |
            |              |                    |            | 3: Failed                       |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscraw_           | `string`   |                                 |
            |              |retry_count`        |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscraw_           | `string`   |                                 |
            |              |start_date`         |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscraw_           | `string`   |                                 |
            |              |end_date`           |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscraw_           | `string`   |                                 |
            |              |mode`               |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscraw_           | `string`   |                                 |
            |              |file_name`          |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscraw_           | `string`   |                                 |
            |              |comment`            |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `prewb_            | `string`   | 0: Not eligible                 |
            |              |target_flg`         |            |                                 |
            |              |                    |            | 1: Eligible                     |
            +--------------+--------------------+------------+---------------------------------+
            |              | `prewb_            | `string`   | 0: Waiting to run               |
            |              |status`             |            |                                 |
            |              |                    |            | 1: Running                      |
            |              |                    |            | 2: Successful                   |
            |              |                    |            | 3: Failed                       |
            +--------------+--------------------+------------+---------------------------------+
            |              | `prewb_            | `string`   |                                 |
            |              |retry_count`        |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `prewb_            | `string`   |                                 |
            |              |start_date`         |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `prewb_            | `string`   |                                 |
            |              |end_date`           |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `prewb_            | `string`   |                                 |
            |              |mode`               |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `prewb_            | `string`   |                                 |
            |              |file_name`          |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `prewb_            | `string`   |                                 |
            |              |comment`            |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `dewarp_           | `string`   | 0: Not eligible                 |
            |              |target_flg`         |            |                                 |
            |              |                    |            | 1: Eligible                     |
            +--------------+--------------------+------------+---------------------------------+
            |              | `dewarp_           | `string`   | 0: Waiting to run               |
            |              |status`             |            |                                 |
            |              |                    |            | 1: Running                      |
            |              |                    |            |                                 |
            |              |                    |            | 2: Successful                   |
            |              |                    |            |                                 |
            |              |                    |            | 3: Failed                       |
            +--------------+--------------------+------------+---------------------------------+
            |              | `dewarp_           | `string`   |                                 |
            |              |retry_count`        |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `dewarp_           | `string`   |                                 |
            |              |start_date`         |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `dewarp_           | `string`   |                                 |
            |              |end_date`           |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `dewarp_           | `string`   |                                 |
            |              |mode`               |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `dewarp_           | `string`   |                                 |
            |              |file_name`          |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `dewarp_           | `string`   |                                 |
            |              |comment`            |            |                                 |
            +--------------+--------------------+------------+---------------------------------+

     * - 'Generic Error Response' :
     *   If Any generic error returned from the Low Level SDK.
     *   Object with below key and value pairs.
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
     *    import  { Client, Config } from 'consoleaccesslibrary';
     *
     *    const consoleEndpoint: '__consoleEndpoint__';
     *    const portalAuthorizationEndpoint: '__portalAuthorizationEndpoint__';
     *    const clientId: '__clientId__';
     *    const clientSecret: '__clientSecret__';
     *    const config = new Config(consoleEndpoint, portalAuthorizationEndpoint, clientId, clientSecret);
     *
     *    const client = await Client.createInstance(config);
     *    const deviceId = '__device_id__';
     *    const response= await client.deployment.getDeployHistory(deviceId);
     */

    async getDeployHistory(deviceId: string) {
        Logger.info('GetDeployHistory');
        let valid = true;
        try {
            const validate = ajv.compile(this.schema);
            valid = validate({ deviceId });
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
            this.api = new DeployApi(apiConfig);

            const res = await this.api.getDeployHistory(deviceId);
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
