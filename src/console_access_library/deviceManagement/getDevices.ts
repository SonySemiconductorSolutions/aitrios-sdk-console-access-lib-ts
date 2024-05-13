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

import { ManageDevicesApi, Configuration } from 'js-client';
import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import * as Logger from '../common/logger/logger';
import { getMessage } from '../common/logger/getMessage';
import { Config } from '../common/config';
import { ErrorCodes, genericErrorMessage, validationErrorMessage } from '../common/errorCodes';

export interface getDevicesSchema {
    deviceId?: string;
    deviceName?: string;
    connectionState?: string;
    deviceGroupId?: string;
    deviceIds?: string;
    scope?: string;
}

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
 * This class implements API to get Edge Devices list information.
 */
export class GetDevices {
    config: Config;
    api: ManageDevicesApi;

    /**
     * Constructor Method for the class GetDevices
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
                default: '',
                errorMessage: {
                    type: 'Invalid string for deviceId',
                },
            },
            deviceName: {
                type: 'string',
                default: '',
                errorMessage: {
                    type: 'Invalid string for deviceName',
                },
            },
            connectionState: {
                type: 'string',
                default: '',
                errorMessage: {
                    type: 'Invalid string for connectionState'
                },
            },
            deviceGroupId: {
                type: 'string',
                default: '',
                errorMessage: {
                    type: 'Invalid string for deviceGroupId'
                },
            },
            deviceIds: {
                type: 'string',
                default: '',
                errorMessage: {
                    type: 'Invalid string for deviceIds'
                },
            },
            scope: {
                type: 'string',
                default: 'full',
                errorMessage: {
                    type: 'Invalid string for scope'
                },
            },
        },
        additionalProperties: false,
    };

    /**
     * getDevices- Get the Edge Device list information.
     * @params
     *  - 'deviceId' (str, optional) : Device ID. Partial match search. Default:""
     *  - 'deviceName' (str, optional) : Device name. Partial match search. Default:""
     *  - 'connectionState' (str, optional) :  Connection status. Default:"" \
                Value definition \
                    - Connected \
                    - Disconnected
     *  - 'deviceGroupId' (str, optional) : Device group ID. Default:""
     *  - 'device_ids' (str, required) : Specify multiple device IDs separated by commas. Default:""
     *  - 'scope' (str, optional) : Specify the scope of response parameters to return. Default:'full'\
                Value definition \
                    - full : Return full parameters \
                    - minimal : Return minimal parameters fast response speed
     * @returns
     * - Object: table:: Success Response

            +------------+--------------------+-----------+--------------------------------+
            | *Level1*   | *Level2*           |*Type*     | *Description*                  |
            +============+====================+===========+================================+
            | ``devices``|                    |``array``  |                                |
            +------------+--------------------+-----------+--------------------------------+
            |            | ``device_id``      |``string`` | Set the device ID              |
            +------------+--------------------+-----------+--------------------------------+
            |            | ``place``          |``string`` | Set the location               |
            +------------+--------------------+-----------+--------------------------------+
            |            | ``comment``        |``string`` | Set the device description     |
            +------------+--------------------+-----------+--------------------------------+
            |            | ``property``       |``array``  | Refer : Table : 1.0            |
            |            |                    |           | for more details               |
            +------------+--------------------+-----------+--------------------------------+
            |            | ``device_type``    |``string`` | Set the device type.           |
            +------------+--------------------+-----------+--------------------------------+
            |            |``display_device_   |``string`` | Set the display device type.   |
            |            |type``              |           |                                |
            +------------+--------------------+-----------+--------------------------------+
            |            | ``ins_id``         |``string`` | Set the device author.         |
            +------------+--------------------+-----------+--------------------------------+
            |            | ``ins_date``       |``string`` | Set the date                   |
            |            |                    |           | the device was created.        |
            +------------+--------------------+-----------+--------------------------------+
            |            | ``upd_id``         |``string`` | Set the device updater.        |
            +------------+--------------------+-----------+--------------------------------+
            |            | ``upd_date``       |``string`` | Set the date the device was    |
            |            |                    |           | updated.                       |
            +------------+--------------------+-----------+--------------------------------+
            |            |``connectionState`` |``string`` | Set the device connection state|
            +------------+--------------------+-----------+--------------------------------+
            |            |``lastActivityTime``|``string`` | Set the date the device last   |
            |            |                    |           | connected.                     |
            +------------+--------------------+-----------+--------------------------------+
            |            | ``models``         |``array``  | Refer : Table : 1.1            |
            |            |                    |           | for more details               |
            +------------+--------------------+-----------+--------------------------------+
            |            | ``configuration``  |``array``  |                                |
            +------------+--------------------+-----------+--------------------------------+
            |            | ``state``          |``array``  |                                |
            +------------+--------------------+-----------+--------------------------------+
            |            | ``device_groups``  |``array``  | Refer : Table : 1.2            |
            |            |                    |           | for more details               |
            +------------+--------------------+-----------+--------------------------------+

            @Table : 1.0 - property schema details

            +-------------------+--------------------+------------+--------------------------+
            | *Level1*          | *Level2*           | *Type*     | *Description*            |
            +===================+====================+============+==========================+
            | ``property``      |                    | ``array``  |                          |
            +-------------------+--------------------+------------+--------------------------+
            |                   |``device_name``     | ``string`` | Set the device name.     |
            +-------------------+--------------------+------------+--------------------------+
            |                   |``internal_device_  | ``string`` | Set the internal device  |
            |                   |id``                |            | id.                      |
            +-------------------+--------------------+------------+--------------------------+

            @Table : 1.1 - models schema details

            +-------------------+--------------------+------------+--------------------------+
            | *Level1*          | *Level2*           | *Type*     | *Description*            |
            +===================+====================+============+==========================+
            | ``models``        |                    | ``array``  |                          |
            +-------------------+--------------------+------------+--------------------------+
            |                   |``model_version_id``| ``string`` | Set the model version ID.|
            |                   |                    |            | Format: modelid:v1.01    |
            |                   |                    |            | For model that does not  |
            |                   |                    |            | exist in the system,     |
            |                   |                    |            | display network_id       |
            |                   |                    |            | Example: 000237          |
            +-------------------+--------------------+------------+--------------------------+

            @Table : 1.2 - device_groups schema details

            +-------------------+--------------------+------------+--------------------------+
            | *Level1*          | *Level2*           | *Type*     | *Description*            |
            +===================+====================+============+==========================+
            | ``device_groups`` |                    | ``array``  |                          |
            +-------------------+--------------------+------------+--------------------------+
            |                   |``device_group_id`` | ``string`` | Set the device group ID  |
            +-------------------+--------------------+------------+--------------------------+
            |                   |``device_type``     | ``string`` | Set the device type      |
            +-------------------+--------------------+------------+--------------------------+
            |                   | ``comment``        |``string``  | Set the device           |
            |                   |                    |            | group comment.           |
            +-------------------+--------------------+------------+--------------------------+
            |                   | ``ins_id``         |``string``  | Set the date the device  |
            |                   |                    |            | group was created.       |
            +-------------------+--------------------+------------+--------------------------+
            |                   | ``ins_date``       |``string``  | Set the device group     |
            |                   |                    |            | author.                  |
            +-------------------+--------------------+------------+--------------------------+
            |                   | ``upd_id``         |``string``  | Set the device group     |
            |                   |                    |            | updater                  |
            +-------------------+--------------------+------------+--------------------------+
            |                   | ``upd_date``       |``string``  | Set the date the device  |
            |                   |                    |            | group was updated.       |
            +-------------------+--------------------+------------+--------------------------+

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
     *    import { Client, Config } from 'consoleaccesslibrary'
     *
     *    const consoleEndpoint: "__consoleEndpoint__";
     *    const portalAuthorizationEndpoint: "__portalAuthorizationEndpoint__";
     *    const clientId: '__clientId__';
     *    const clientSecret: '__clientSecret__';
     *    const applicationId: '__applicationId__';
     *    const config = new Config(consoleEndpoint,portalAuthorizationEndpoint,
     *                              clientId, clientSecret, applicationId);
     *
     *    const client = await Client.createInstance(config);
     *    const deviceId = '__deviceId__';
     *    const deviceName = '__deviceName__';
     *    const connectionState = '__connectionState__';
     *    const deviceGroupId = '__deviceGroupId__';
     *    const deviceIds = '__deviceIds__';
     *    const scope = '__scope__'
     *    const response= await client.deviceManagement.getDevices(deviceId, deviceName,
     *                               connectionState, deviceGroupId, deviceIds, scope );
     *
     */
    async getDevices(
        deviceId?: string,
        deviceName?: string,
        connectionState?: string,
        deviceGroupId?: string,
        deviceIds?: string,
        scope?: string
    ) {
        let valid = true;
        const queryParams = {
            deviceId,
            deviceName,
            connectionState,
            deviceGroupId,
            deviceIds,
            scope
        };
        try {
            Logger.info(`getDevices ${queryParams}`);
            const validate = ajv.compile(this.schema);
            valid = validate(queryParams);
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
            this.api = new ManageDevicesApi(apiConfig);
            let res;
            if (this.config.applicationId) {
                res = await this.api.getDevices(
                    'client_credentials',
                    queryParams.connectionState,
                    queryParams.deviceName,
                    queryParams.deviceId,
                    queryParams.deviceGroupId,
                    queryParams.deviceIds,
                    queryParams.scope,
                );
            } else {
                res = await this.api.getDevices(
                    undefined,
                    queryParams.connectionState,
                    queryParams.deviceName,
                    queryParams.deviceId,
                    queryParams.deviceGroupId,
                    queryParams.deviceIds,
                    queryParams.scope,
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
