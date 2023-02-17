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

import { Configuration, DeployApi } from 'js-client';
import { Config } from '../common/config';
import * as Logger from '../common/logger/logger';
import { ErrorCodes, genericErrorMessage } from '../common/errorCodes';

/**
 * This class implements GetDeployConfigurations API.
 */
export class GetDeployConfigurations {
    config: Config;
    api: DeployApi;

    /**
     * Constructor Method for the class GetDeployConfigurations
     * @param config Object of Config Class
     */
    constructor(config: Config) {
        this.config = config;
    }

    /**
     * getDeployConfigurations - Get deployment config information list.
     * @returns
     * - Object: table:: Success Response

            +-------------------------+------------------+------------+-------------------+
            |  Level1                 |  Level2          |  Type      |  Description      |
            +-------------------------+------------------+------------+-------------------+
            | `deploy_configurations` |                  |  `array`   | Ascending order of|
            |                         |                  |            | config_id         |
            +-------------------------+------------------+------------+-------------------+
            |                         |  `config_id`     |  `string`  |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         |  `device_type`   |  `string`  |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         | `config_comment` |  `string`  |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         |   `running_cnt`  |  `int`     |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         |   `success_cnt`  |  `int`     |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         |   `fail_cnt`     |  `int`     |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         |   `firmware`     |  `array`   |Refer : Table : 1.0|
            |                         |                  |            | for more details  |
            +-------------------------+------------------+------------+-------------------+
            |                         |   `model`        |  `array`   |Refer : Table : 2.0|
            |                         |                  |            | for more details  |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         | `custom_setting` |  `array`   |Refer : Table : 3.0|
            |                         |                  |            | for more details  |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         | `ins_id`         |  `string`  |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         | `ins_date`       |  `string`  |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         | `upd_id`         |  `string`  |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         | `upd_date`       |  `string`  |                   |
            +-------------------------+------------------+------------+-------------------+

        @Table : 1.0 - firmware schema details

            +-------------------+--------------------+------------+-------------------+
            | *Level1*          | *Level2*           | *Type*     | *Description*     |
            +-------------------+--------------------+------------+-------------------+
            | ``firmware``      |                    | ``array``  |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_loader_    | ``string`` |                   |
            |                   |file_name``         |            |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_loader_    | ``string`` |                   |
            |                   |version_number``    |            |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_loader_    | ``string`` |                   |
            |                   |firmware_comment``  |            |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_file_name``| ``string`` |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_           | ``string`` |                   |
            |                   |version_number``    |            |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_           |``string``  |                   |
            |                   |firmware_comment``  |            |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``apfw_file_name``  |``string``  |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``apfw_version_     |``string``  |                   |
            |                   |number``            |            |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``apfw_firmware_    |``string``  |                   |
            |                   |comment``           |            |                   |
            +-------------------+--------------------+------------+-------------------+

        @Table : 2.0 - model schema details

            +-------------------+--------------------+------------+-------------------+
            | *Level1*          | *Level2*           | *Type*     | *Description*     |
            +-------------------+--------------------+------------+-------------------+
            | ``model``         |                    | ``array``  |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   | ``model_id``       | ``string`` |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``model_            | ``string`` |                   |
            |                   |version_number``    |            |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   | ``model_comment``  | ``string`` |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``model_            | ``string`` |                   |
            |                   |version_comment``   |            |                   |
            +-------------------+--------------------+------------+-------------------+

        @Table : 3.0 - custom_setting schema details

            +--------------+--------------------+------------+---------------+
            | *Level1*     | *Level2*           | *Type*     | *Description* |
            +--------------+--------------------+------------+---------------+
            |``custom_     |                    | ``array``  |               |
            |setting``     |                    |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``color_matrix_     |``string``  |               |
            |              |mode``              |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``color_matrix_     | ``string`` |               |
            |              |file_name``         |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``color_matrix_     |``string``  |               |
            |              |comment``           |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``gamma_            |``string``  |               |
            |              |mode``              |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``gamma_            |``string``  |               |
            |              |file_name``         |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``gamma_            |``string``  |               |
            |              |comment``           |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``lscisp_           |``string``  |               |
            |              |mode``              |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``lscisp_           |``string``  |               |
            |              |file_name``         |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``lscisp_           |``string``  |               |
            |              |comment``           |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``lscraw_           |``string``  |               |
            |              |mode``              |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``lscraw_           |``string``  |               |
            |              |file_name``         |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``lscraw_           |``string``  |               |
            |              |comment``           |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``prewb_            |``string``  |               |
            |              |mode``              |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``prewb_            |``string``  |               |
            |              |file_name``         |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``prewb_            |``string``  |               |
            |              |comment``           |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``dewarp_           |``string``  |               |
            |              |mode``              |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``dewarp_           |``string``  |               |
            |              |file_name``         |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``dewarp_           |``string``  |               |
            |              |comment``           |            |               |
            +--------------+--------------------+------------+---------------+

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
     *    const response= await client.deployment.getDeployConfigurations();
     */

    async getDeployConfigurations() {
        Logger.info('getDeployConfigurations');
        try {
            const accessToken= await this.config.getAccessToken();
            const baseOptions= await this.config.setOption();

            const apiConfig = new Configuration({
                basePath: this.config.consoleEndpoint,
                accessToken,
                baseOptions
            });
            this.api = new DeployApi(apiConfig);

            const res = await this.api.getDeployConfigurations();
            return res;
        } catch (error) {
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
