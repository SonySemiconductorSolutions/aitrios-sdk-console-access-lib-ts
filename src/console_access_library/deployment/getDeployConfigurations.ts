/*
 * Copyright 2022, 2023 Sony Semiconductor Solutions Corp. All rights reserved.
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
     * getDeployConfigurations - Get the deploy config list.
     * @returns
     * - Object: table:: Success Response

            +-----------------+------------+------------+---------------------------------+
            | *Level1*        | *Level2*   | *Type*     | *Description*                   |
            +=================+============+============+=================================+
            |``deploy_        |            | ``array``  |                                 |
            |configurations`` |            |            |                                 |
            +-----------------+------------+------------+---------------------------------+
            |                 |``config_   | ``string`` | Set the config ID.              |
            |                 |id``        |            |                                 |
            +-----------------+------------+------------+---------------------------------+
            |                 |``device_   | ``string`` | Set the device type.            |
            |                 |type``      |            |                                 |
            +-----------------+------------+------------+---------------------------------+
            |                 |``config_   | ``string`` | Set the config comment.         |
            |                 |comment``   |            |                                 |
            +-----------------+------------+------------+---------------------------------+
            |                 |``running_  | ``number`` | Set the running cnt.            |
            |                 |cnt``       |            |                                 |
            +-----------------+------------+------------+---------------------------------+
            |                 |``success_  | ``number`` | Set the success cnt.            |
            |                 |cnt``       |            |                                 |
            +-----------------+------------+------------+---------------------------------+
            |                 |``fail_cnt``| ``number`` | Set the fail cnt.               |
            +-----------------+------------+------------+---------------------------------+
            |                 |``firmware``| ``array``  | Refer : Table : 1.0             |
            |                 |            |            | for more details                |
            +-----------------+------------+------------+---------------------------------+
            |                 |``model``   | ``array``  | Refer : Table : 1.1             |
            |                 |            |            | for more details                |
            +-----------------+------------+------------+---------------------------------+
            |                 |``ins_id``  | ``string`` | Set the deployment author.      |
            +-----------------+------------+------------+---------------------------------+
            |                 |``ins_date``| ``string`` | Set the date the deployment     |
            |                 |            |            | was created.                    |
            +-----------------+------------+------------+---------------------------------+
            |                 |``upd_id``  | ``string`` | Set the deployment updater.     |
            +-----------------+------------+------------+---------------------------------+
            |                 |``upd_date``| ``string`` | Set the date the deployment     |
            |                 |            |            | was updated.                    |
            +-----------------+------------+------------+---------------------------------+

            @Table : 1.0 - firmware schema details

            +-------------------+--------------------+------------+-------------------+
            | *Level1*          | *Level2*           | *Type*     | *Description*     |
            +===================+====================+============+===================+
            | ``firmware``      |                    | ``array``  |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_loader_    | ``string`` | Set the sensor    |
            |                   |file_name``         |            | loader filename.  |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_loader_    | ``string`` | Set the sensor    |
            |                   |version_number``    |            | loader version    |
            |                   |                    |            | number.           |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_loader_    | ``string`` | Set the sensor    |
            |                   |firmware_comment``  |            | loader firmware   |
            |                   |                    |            | comment.          |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_file_name``| ``string`` | Set the sensor    |
            |                   |                    |            | filename.         |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_           | ``string`` | Set the sensor    |
            |                   |version_number``    |            | version number.   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_           |``string``  | Set the sensor    |
            |                   |firmware_comment``  |            | firmware comment. |
            +-------------------+--------------------+------------+-------------------+
            |                   |``apfw_file_name``  |``string``  | Set the apfw      |
            |                   |                    |            | filename.         |
            +-------------------+--------------------+------------+-------------------+
            |                   |``apfw_version_     |``string``  | Set the apfw      |
            |                   |number``            |            | version number.   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``apfw_firmware_    |``string``  | Set the apfw      |
            |                   |comment``           |            | firmware comment. |
            +-------------------+--------------------+------------+-------------------+

            @Table : 1.1 - model schema details

            +-------------------+--------------------+------------+-------------------+
            | *Level1*          | *Level2*           | *Type*     | *Description*     |
            +===================+====================+============+===================+
            | ``model``         |                    | ``array``  |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   | ``model_id``       | ``string`` | Set the model ID. |
            +-------------------+--------------------+------------+-------------------+
            |                   |``model_            | ``string`` | Set the model     |
            |                   |version_number``    |            | version number.   |
            +-------------------+--------------------+------------+-------------------+
            |                   | ``model_comment``  | ``string`` | Set the model     |
            |                   |                    |            | comment.          |
            +-------------------+--------------------+------------+-------------------+
            |                   |``model_            | ``string`` | Set the model     |
            |                   |version_comment``   |            | version comment.  |
            +-------------------+--------------------+------------+-------------------+

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
     *    const applicationId: '__applicationId__';
     *    const config = new Config(consoleEndpoint,portalAuthorizationEndpoint,
     *                              clientId, clientSecret, applicationId);
     *
     *    const client = await Client.createInstance(config);
     *    const response= await client.deployment.getDeployConfigurations();
     */

    async getDeployConfigurations() {
        Logger.info('getDeployConfigurations');
        try {
            const accessToken = await this.config.getAccessToken();
            const baseOptions = await this.config.setOption();

            const apiConfig = new Configuration({
                basePath: this.config.consoleEndpoint,
                accessToken,
                baseOptions
            });
            this.api = new DeployApi(apiConfig);

            let res;
            if (this.config.applicationId) {
                res = await this.api.getDeployConfigurations('client_credentials');
            } else {
                res = await this.api.getDeployConfigurations();
            }
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
