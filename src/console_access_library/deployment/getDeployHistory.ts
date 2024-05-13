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

import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import { Configuration, DeployApi } from 'js-client';
import { Config } from '../common/config';
import * as Logger from '../common/logger/logger';
import { ErrorCodes, genericErrorMessage, validationErrorMessage } from '../common/errorCodes';
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
    * Schema for API to get the deployment history for a specified Edge Device.

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
     * getDeployHistory - Get the deploy history for a specified Edge Device.
     * @params
     * - deviceId (str, required) - Device ID
     * @returns
     * - Object: table:: Success Response
    
            +----------+----------------------+------------+-------------------------------+
            | *Level1* | *Level2*             | *Type*     | *Description*                 |
            +==========+======================+============+===============================+
            |``deploy  |                      | ``array``  |                               |
            |s``       |                      |            |                               |
            +----------+----------------------+------------+-------------------------------+
            |          | ``id``               | ``number`` | Deploy ID.                    |
            +----------+----------------------+------------+-------------------------------+
            |          | ``deploy_type``      | ``string`` | Set the deploy type.          |
            |          |                      |            | - Value definition            |
            |          |                      |            |                               |
            |          |                      |            | 0: Deploy config              |
            |          |                      |            |                               |
            |          |                      |            | 1: Device model               |
            |          |                      |            |                               |
            |          |                      |            | App: DeviceApp                |
            +----------+----------------------+------------+-------------------------------+
            |          |``deploy_status``     | ``string`` | Set the deploy status. Target |
            |          |                      |            | device deployment status.     |
            |          |                      |            | - Value definition            |
            |          |                      |            |                               |
            |          |                      |            | 0: Deploying                  |
            |          |                      |            |                               |
            |          |                      |            | 1: Success                    |
            |          |                      |            |                               |
            |          |                      |            | 2: Fail                       |
            |          |                      |            |                               |
            |          |                      |            | 3: Cancel                     |
            |          |                      |            |                               |
            |          |                      |            | App: DeviceApp undeploy       |
            +----------+----------------------+------------+-------------------------------+
            |          |``update_progress``   | ``string`` | Set the update progress in    |
            |          |                      |            | percentage.                   |
            +----------+----------------------+------------+-------------------------------+
            |          |``deploy_comment``    | ``string`` | Set the deploy comment.       |
            +----------+----------------------+------------+-------------------------------+
            |          |  ``config_id``       | ``string`` | Set the deploy config ID.     |
            +----------+----------------------+------------+-------------------------------+
            |          |``replace_network_id``| ``string`` | Set the replace network ID.   |
            +----------+----------------------+------------+-------------------------------+
            |          | ``current_target``   | ``string`` | Set the current target.       |
            +----------+----------------------+------------+-------------------------------+
            |          |``total_status``      | ``string`` | Set the deploy status.        |
            |          |                      |            | Total status of Edge Devices  |
            |          |                      |            | deployed together.            |
            |          |                      |            | - Value definition            |
            |          |                      |            |                               |
            |          |                      |            | 0: Deploying                  |
            |          |                      |            |                               |
            |          |                      |            | 1: Success                    |
            |          |                      |            |                               |
            |          |                      |            | 2: Fail                       |
            |          |                      |            |                               |
            |          |                      |            | 3: Cancel                     |
            +----------+----------------------+------------+-------------------------------+
            |          | ``app_name``         | ``string`` | Set the app name.             |
            +----------+----------------------+------------+-------------------------------+
            |          | ``version_number``   | ``string`` | Set the version number.       |
            +----------+----------------------+------------+-------------------------------+
            |          | ``firmware``         | ``array``  |Refer : Table : 1.0            |
            |          |                      |            |for more details               |
            +----------+----------------------+------------+-------------------------------+

            @Table : 1.0 - firmware schema details

            +------------+--------------------+------------+-----------------------------------+
            | *Level1*   | *Level2*           | *Type*     | *Description*                     |
            +============+====================+============+===================================+
            |``firmware``|                    | ``array``  |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_loader_    | ``string`` | Set the deploy target flg.        |
            |            |target_flg``        |            | - Value definition                |
            |            |                    |            |                                   |
            |            |                    |            | 0: Not for deployment             |
            |            |                    |            |                                   |
            |            |                    |            | 1: Deployment target              |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_loader_    |``string``  | Set the deploy status.            |
            |            |status``            |            | - Value definition                |
            |            |                    |            |                                   |
            |            |                    |            | 0: Waiting                        |
            |            |                    |            |                                   |
            |            |                    |            | 1: Deploying                      |
            |            |                    |            |                                   |
            |            |                    |            | 2: Success                        |
            |            |                    |            |                                   |
            |            |                    |            | 3: Fail                           |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_loader_    |``number``  | Set the sensor loader retry count.|
            |            |retry_count``       |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_loader_    |``string``  | Set the sensor loader start date. |
            |            |start_date``        |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_loader_    | ``string`` | Set the sensor loader end date.   |
            |            |end_date``          |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_loader_    |``string``  | Set the sensor loader version     |
            |            |version_number``    |            | number.                           |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_loader_    |``string``  | Set the sensor loader version     |
            |            |version_comment``   |            | comment.                          |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_target_    |``string``  | Set the deploy target flg.        |
            |            |flg``               |            | - Value definition                |
            |            |                    |            |                                   |
            |            |                    |            | 0: Not for deployment             |
            |            |                    |            |                                   |
            |            |                    |            | 1: Deployment target              |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_status``   | ``string`` | Set the deploy status.            |
            |            |                    |            |                                   |
            |            |                    |            | - Value definition                |
            |            |                    |            |                                   |
            |            |                    |            | 0: Waiting                        |
            |            |                    |            |                                   |
            |            |                    |            | 1: Deploying                      |
            |            |                    |            |                                   |
            |            |                    |            | 2: Success                        |
            |            |                    |            |                                   |
            |            |                    |            | 3: Fail                           |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_retry_     |``number``  | Set the sensor retry count.       |
            |            |count``             |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_start_     |``string``  | Set the sensor start date.        |
            |            |date``              |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_end_date`` |``string``  | Set the sensor end date.          |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_version_   |``string``  | Set the sensor version number.    |
            |            |number``            |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_version_   |``string``  | Set the sensor version comment.   |
            |            |comment``           |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``apfw_target_flg`` |``string``  | Set the deploy target flg.        |
            |            |                    |            |                                   |
            |            |                    |            |- Value definition                 |
            |            |                    |            |                                   |
            |            |                    |            | 0: Not for deployment             |
            |            |                    |            |                                   |
            |            |                    |            | 1: Deployment target              |
            +------------+--------------------+------------+-----------------------------------+
            |            |``apfw_status``     |``string``  | Set the deploy status.            |
            |            |                    |            |                                   |
            |            |                    |            | - Value definition                |
            |            |                    |            |                                   |
            |            |                    |            | 0: Waiting                        |
            |            |                    |            |                                   |
            |            |                    |            | 1: Deploying                      |
            |            |                    |            |                                   |
            |            |                    |            | 2: Success                        |
            |            |                    |            |                                   |
            |            |                    |            | 3: Fail                           |
            +------------+--------------------+------------+-----------------------------------+
            |            |``apfw_retry_count``|``number``  | Set the appfw retry count.        |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``apfw_start_date`` |``string``  | Set the appfw start date.         |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``apfw_end_date``   |``string``  | Set the appfw end date.           |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``apfw_version_     |``string``  | Set the appfw version number.     |
            |            |number``            |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``apfw_version_     |``string``  | Set the appfw version comment.    |
            |            |comment``           |            |                                   |
            +------------+--------------------+------------+-----------------------------------+

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
                res = await this.api.getDeployHistory(deviceId, 'client_credentials');
            } else {
                res = await this.api.getDeployHistory(deviceId);
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
