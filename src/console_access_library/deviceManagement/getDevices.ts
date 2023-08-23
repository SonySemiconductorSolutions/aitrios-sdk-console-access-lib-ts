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

import { ManageDevicesApi, Configuration } from 'js-client';
import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import * as Logger from '../common/logger/logger';
import { getMessage } from '../common/logger/getMessage';
import { Config } from '../common/config';
import {
    ErrorCodes,
    genericErrorMessage,
    validationErrorMessage,
} from '../common/errorCodes';

export interface getDevicesSchema {
    deviceId?: string;
    deviceName?: string;
    connectionState?: string;
    deviceGroupId?: string;
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
 * This class implements API to get devices list information.
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
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for deviceId',
                    isNotEmpty: 'deviceId required or can\'t be empty string',
                },
            },
            deviceName: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for deviceName',
                    isNotEmpty: 'deviceName required or can\'t be empty string',
                },
            },
            connectionState: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for connectionState',
                    isNotEmpty:
                        'connectionState required or can\'t be empty string',
                },
            },
            deviceGroupId: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for deviceGroupId',
                    isNotEmpty:
                        'deviceGroupId required or can\'t be empty string',
                },
            },
        },
        additionalProperties: false,
    };

    /**
     * getDevices- Get devices list information API
     * @params
     *  - 'deviceId' (str, optional) : Device ID. Partial search, case insensitive
     *  - 'deviceName' (str, optional) : Edge AI device name. Partial search, case insensitive. \
                If not specified, search all device_names.
     *  - 'connectionState' (str, optional) : Connection status. For  \
                connected state: Connected \
                Disconnected state: Disconnected \
                Exact match search, case insensitive. \
                If not specified, search all connection_states.
     *  - 'deviceGroupId' (str, optional) : Affiliated Edge AI device group. \
                Exact match search, case insensitive. \
                Search all device_group_id if not specified.
     * @returns
     * - Object: table:: Success Response
    
            +------------+--------------------+-----------+--------------------------------+
            |  Level1    |  Level2            | Type      |  Description                   |
            +------------+--------------------+-----------+--------------------------------+
            |  `devices` |                    | `array`   | The subordinate elements are   |
            |            |                    |           | listed in ascending order by   |
            |            |                    |           | device ID                      |
            +------------+--------------------+-----------+--------------------------------+
            |            |  `device_id`       |  `string` | Set the device ID              |
            +------------+--------------------+-----------+--------------------------------+
            |            |  `place`           |  `string` | Set the location               |
            +------------+--------------------+-----------+--------------------------------+
            |            |  `comment`         |  `string` | Set the device description     |
            +------------+--------------------+-----------+--------------------------------+
            |            |  `property`        |  `string` | Set device properties          |
            |            |                    |           | (device_name, etc.)            |
            +------------+--------------------+-----------+--------------------------------+
            |            |  `ins_id`          |  `string` | Set the creator of the device  |
            +------------+--------------------+-----------+--------------------------------+
            |            |  `ins_date`        |  `string` | Set the date and               |
            |            |                    |           | time the device was created.   |
            +------------+--------------------+-----------+--------------------------------+
            |            |  `upd_id`          |  `string` | Set up an updater for          |
            |            |                    |           | your device                    |
            +------------+--------------------+-----------+--------------------------------+
            |            |  `upd_date`        |  `string` | Set the date and time          |
            |            |                    |           | of the device update.          |
            +------------+--------------------+-----------+--------------------------------+
            |            | `connectionState`  |  `string` | Set the connection status      |
            |            |                    |           | of the device.                 |
            +------------+--------------------+-----------+--------------------------------+
            |            | `lastActivityTime` |  `string` | Set the last connection date   |
            |            |                    |           | and time of the device.        |
            +------------+--------------------+-----------+--------------------------------+
            |            |  `device_groups`   | `array`   | Refer : Table : 1.0            |
            |            |                    |           | for more details               |
            +------------+--------------------+-----------+--------------------------------+
            |            |  `models`          | `array`   | Refer : Table : 1.1            |
            |            |                    |           | for more details               |
            +------------+--------------------+-----------+--------------------------------+
            
            @Table : 1.0 - device_groups schema details
            
            +-------------------+--------------------+------------+--------------------------+
            |  Level1           |  Level2            |  Type      |  Description             |
            +-------------------+--------------------+------------+--------------------------+
            |  `device_groups`  |                    |  `array`   | The subordinate          |
            |                   |                    |            | elements are listed      |
            |                   |                    |            | in ascending order       |
            |                   |                    |            | by device group ID       |   
            +-------------------+--------------------+------------+--------------------------+
            |                   | `device_group_id`  |   `string` | Set the device group ID  |
            +-------------------+--------------------+------------+--------------------------+
            |                   | `device_type`      |   `string` | Set the device type      |
            +-------------------+--------------------+------------+--------------------------+
            |                   |  `comment`         |  `string`  | Set the device           |
            |                   |                    |            | bdescription             |
            +-------------------+--------------------+------------+--------------------------+
            |                   |  `ins_id`          |  `string`  | Set the date and time    |
            |                   |                    |            | that the device group    |
            |                   |                    |            | was created.             |
            +-------------------+--------------------+------------+--------------------------+
            |                   |  `ins_date`        |  `string`  | Set the creator of the   |
            |                   |                    |            | device group.            |
            +-------------------+--------------------+------------+--------------------------+
            |                   |  `upd_id`          |  `string`  | Set the updater for      |
            |                   |                    |            | the device group         |
            +-------------------+--------------------+------------+--------------------------+
            |                   |  `upd_date`        |  `string`  | Set the date and time of |
            |                   |                    |            | the device group update. |
            +-------------------+--------------------+------------+--------------------------+
          
            @Table : 1.1 - models schema details

            +-------------------+--------------------+------------+--------------------------+
            |  Level1           |  Level2            |  Type      |  Description             |
            +-------------------+--------------------+------------+--------------------------+
            |  `models`         |                    |  `array`   | The subordinate          |
            |                   |                    |            | elements are listed      |
            |                   |                    |            | in ascending order       |
            |                   |                    |            | by device group ID       |   
            +-------------------+--------------------+------------+--------------------------+
            |                   | `model_version_id` |   `string` | Set the model version ID |
            |                   |                    |            | Format: ModelID:v1.0001  |
            |                   |                    |            | * If DnnModelVersion does|
            |                   |                    |            | not exist in the DB, the |
            |                   |                    |            | network_id is displayed. |
            |                   |                    |            | Example) 0201020002370200|
            |                   |                    |            | In the above case, 000237|
            |                   |                    |            | (7~12 digits) If it is 16|
            |                   |                    |            | digits,it is displayed   |
            |                   |                    |            | as is.                   |
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
     *    const config = new Config(consoleEndpoint,portalAuthorizationEndpoint, clientId, clientSecret);
     *  
     *    const client = await Client.createInstance(config);
     *    const deviceId = '__deviceId__';
     *    const deviceName = '__deviceName__';
     *    const connectionState = '__connectionState__';
     *    const deviceGroupId = '__deviceGroupId__';
     *    const response= await client.deviceManagement.getDevices(deviceId, deviceName, connectionState, deviceGroupId );
     *
     */
    async getDevices(
        deviceId?: string,
        deviceName?: string,
        connectionState?: string,
        deviceGroupId?: string
    ) {
        let valid = true;
        const queryParams = {
            deviceId,
            deviceName,
            connectionState,
            deviceGroupId,
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
            const res = await this.api.getDevices(
                queryParams.connectionState,
                queryParams.deviceName,
                queryParams.deviceId,
                queryParams.deviceGroupId
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
