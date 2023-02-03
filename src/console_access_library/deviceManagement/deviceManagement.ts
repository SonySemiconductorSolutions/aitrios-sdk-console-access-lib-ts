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

import { GetDevices } from './getDevices';
import { GetCommandParameterFile } from './getCommandParameterFile';
import { StartUploadInferenceResult } from './startUploadInferenceResult';
import { StopUploadInferenceResult } from './stopUploadInferenceResult';
import { Config } from '../common/config';

/**
 * Abstract class to access Console Access Library DeviceManagement component
 * APIs from deviceManagement component
 */
export class DeviceManagement {
    getDevicesObj: GetDevices;
    getCommandParameterFileObj: GetCommandParameterFile;
    startUploadInferenceResultObj: StartUploadInferenceResult;
    stopUploadInferenceResultObj: StopUploadInferenceResult;

    /**
     * Constructor Method for DeviceManagement Abstract class
     **/
    constructor(config: Config) {
        this.getDevicesObj = new GetDevices(config);
        this.getCommandParameterFileObj = new GetCommandParameterFile(config);
        this.startUploadInferenceResultObj = new StartUploadInferenceResult(
            config
        );
        this.stopUploadInferenceResultObj = new StopUploadInferenceResult(
            config
        );
    }

    /**
     * getDevices- Abstract function call to `getDevices` API
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
     */
    getDevices(
        deviceId?: string,
        deviceName?: string,
        connectionState?: string,
        deviceGroupId?: string
    ) {
        const response = this.getDevicesObj.getDevices(
            deviceId,
            deviceName,
            connectionState,
            deviceGroupId
        );
        return response;
    }

    /**
     * getCommandParameterFile- Abstract function call to `getCommandParameterFile` API
     * @returns 
     * - Object: table:: Success Response

            +-------------------+--------------+----------+-------------------------------+
            |  Level1           | Level2       | Type     |  Description                  |
            +-------------------+--------------+----------+-------------------------------+
            |  `parameter_list` |              | `array`  | Parameter file list           |
            +-------------------+--------------+----------+-------------------------------+
            |                   | `parameter`  | `string` | The setting value. json       |
            +-------------------+--------------+----------+-------------------------------+
            |                   | `filename`   | `string` | File Name                     |
            +-------------------+--------------+----------+-------------------------------+
            |                   | `comment`    | `string` | comment                       |
            +-------------------+--------------+----------+-------------------------------+
            |                   | `isdefault`  | `string` | True: Default parameter       |
            |                   |              |          | not False: Default            |
            +-------------------+--------------+----------+-------------------------------+
            |                   | `device_ids` | `List`   | List of target devices.       |
            +-------------------+--------------+----------+-------------------------------+
            |                   | `ins_id`     | `string` | Set the creator of the setting|
            +-------------------+--------------+----------+-------------------------------+
            |                   | `ins_date`   | `string` | Set the date and time that    |
            |                   |              |          | the setting was created       |
            +-------------------+--------------+----------+-------------------------------+
            |                   | `upd_id`     | `string` | Set who updated the settings. |
            +-------------------+--------------+----------+-------------------------------+
            |                   | `upd_date`   | `string` | Set the date and time when    |
            |                   |              |          | the settings were updated     |
            +-------------------+--------------+----------+-------------------------------+

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
     */
    getCommandParameterFile() {
        const response =
            this.getCommandParameterFileObj.getCommandParameterFile();
        return response;
    }

    /**
     * startUploadInferenceResult- Abstract function call to `startUploadInferenceResult` API
     * @params 
     * - deviceId (str, required): Device ID. Case-sensitive
     * @returns 
     * - Object: table:: Success Response
   
            +------------------------+------------+---------------------------+
            |  Level1                |  Type      |  Description              |
            +------------------------+------------+---------------------------+
            |  `result`              |  `string`  | Set "SUCCESS" pinning     |
            +------------------------+------------+---------------------------+
            |  `outputSubDirectory`  |  `string`  | Input Image storage path  |
            |                        |            | UploadMethod:BlobStorage  |
            |                        |            | only                      |
            +------------------------+------------+---------------------------+
   
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
     */
    startUploadInferenceResult(deviceId: string) {
        const response =
            this.startUploadInferenceResultObj.startUploadInferenceResult(
                deviceId
            );
        return response;
    }

    /**
     * stopUploadInferenceResult- Abstract function call to `stopUploadInferenceResult` API
     * @params 
     * - deviceId (str, required): Device ID. Case-sensitive
     * @returns 
     * - Object: table:: Success Response
            
            +-----------------------+------------+---------------------------+
            |  Level1               |  Type      |  Description              |
            +-----------------------+------------+---------------------------+
            |  `result`             |  `string`  | Set "SUCCESS" pinning     |
            +-----------------------+------------+---------------------------+

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
     */
    stopUploadInferenceResult(deviceId: string) {
        const response =
            this.stopUploadInferenceResultObj.stopUploadInferenceResult(
                deviceId
            );
        return response;
    }
}
