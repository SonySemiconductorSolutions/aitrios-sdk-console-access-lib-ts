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
        this.startUploadInferenceResultObj = new StartUploadInferenceResult(config);
        this.stopUploadInferenceResultObj = new StopUploadInferenceResult(config);
    }

    /**
     * getDevices- Get the device list information.
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
     */
    getDevices(
        deviceId?: string,
        deviceName?: string,
        connectionState?: string,
        deviceGroupId?: string,
        deviceIds?: string,
        scope?: string
    ) {
        const response = this.getDevicesObj.getDevices(
            deviceId,
            deviceName,
            connectionState,
            deviceGroupId,
            deviceIds,
            scope
        );
        return response;
    }

    /**
     * getCommandParameterFile- Get the command parameter file list information.
     * @returns 
     * - Object: table:: Success Response

            +-------------------+--------------+------------+-------------------------------+
            | *Level1*          |*Level2*      |*Type*      | *Description*                 |
            +===================+==============+============+===============================+
            | ``parameter_list``|              |``array``   |                               |
            +-------------------+--------------+------------+-------------------------------+
            |                   |``parameter`` |``array``   | Refer : Table : 1.0           |
            |                   |              |            | for more details              |
            +-------------------+--------------+------------+-------------------------------+
            |                   |``filename``  |``string``  | Name of file                  |
            +-------------------+--------------+------------+-------------------------------+
            |                   |``comment``   |``string``  | Comment                       |
            +-------------------+--------------+------------+-------------------------------+
            |                   |``isdefault`` |``string``  | True: Default parameter;      |
            |                   |              |            | False: Not default            |
            +-------------------+--------------+------------+-------------------------------+
            |                   |``device_ids``|``string[]``| Target device list.           |
            +-------------------+--------------+------------+-------------------------------+
            |                   |``ins_id``    |``string``  | Set the settings author.      |
            +-------------------+--------------+------------+-------------------------------+
            |                   |``ins_date``  |``string``  | Set the date the settings     |
            |                   |              |            | were created.                 |
            +-------------------+--------------+------------+-------------------------------+
            |                   |``upd_id``    |``string``  | Set the settings updater.     |
            +-------------------+--------------+------------+-------------------------------+
            |                   |``upd_date``  |``string``  | Set the date the settings     |
            |                   |              |            | were updated.                 |
            +-------------------+--------------+------------+-------------------------------+

            @Table : 1.0 - parameter schema details

            +-------------------+-----------------+------------+----------------------------+
            | *Level1*          | *Level2*        | *Type*     | *Description*              |
            +===================+=================+============+============================+
            | ``parameter``     |                 | ``array``  | Setting value. json        |
            +-------------------+-----------------+------------+----------------------------+
            |                   |``commands``     | ``array``  | Refer : Table : 1.1        |
            |                   |                 |            | for more details           |
            +-------------------+-----------------+------------+----------------------------+

            @Table : 1.1 - commands schema details

            +-------------------+-----------------+------------+-----------------------------+
            | *Level1*          | *Level2*        | *Type*     | *Description*               |
            +===================+=================+============+=============================+
            | ``commands``      |                 | ``array``  |                             |
            +-------------------+-----------------+------------+-----------------------------+
            |                   |``command_name`` | ``string`` | Command name.               |
            +-------------------+-----------------+------------+-----------------------------+
            |                   |``parameters``   | ``array``  | Refer : Table : 1.2         |
            |                   |                 |            | for more details            |
            +-------------------+-----------------+------------+-----------------------------+

            @Table : 1.2 - parameters schema details

            +-------------------+-----------------+------------+-----------------------------+
            | *Level1*          | *Level2*        | *Type*     | *Description*               |
            +===================+=================+============+=============================+
            | ``parameters``    |                 | ``array``  |                             |
            +-------------------+-----------------+------------+-----------------------------+
            |                   |``Mode``         | ``number`` | Collection mode.            |
            |                   |                 |            | - Value definition          |
            |                   |                 |            | 0 : Input Image only        |
            |                   |                 |            | 1 : Input Image & Inference |
            |                   |                 |            | Result                      |
            |                   |                 |            | 2 : Inference Result only   |
            +-------------------+-----------------+------------+-----------------------------+
            |                   |``UploadMethod`` | ``string`` | It specifies how to upload  |
            |                   |                 |            | Input Image.                |
            |                   |                 |            | - Value definition          |
            |                   |                 |            | BlobStorage                 |
            |                   |                 |            | HTTPStorage                 |
            +-------------------+-----------------+------------+-----------------------------+
            |                   |``FileFormat``   | ``string`` | Image file format.          |
            |                   |                 |            | - Value definition: JPG, BMP|
            +-------------------+-----------------+------------+-----------------------------+
            |                   |``UploadMethod   | ``string`` | It specifies how to         |
            |                   |IR``             |            | Inference Result.           |
            |                   |                 |            | - Value definition:         |
            |                   |                 |            | Mqtt                        |
            |                   |                 |            | BlobStorage                 |
            |                   |                 |            | HTTPStorage                 |
            +-------------------+-----------------+------------+-----------------------------+
            |                   |``CropHOffset``  | ``number`` | Hoffset for Image crop.     |
            |                   |                 |            | - Value range : 0 to 4055   |
            +-------------------+-----------------+------------+-----------------------------+
            |                   |``CropVOffset``  | ``number`` | Voffset for Image crop.     |
            |                   |                 |            | - Value range : 0 to 3039   |
            +-------------------+-----------------+------------+-----------------------------+
            |                   |``CropHSize``    | ``number`` | Hsize for Image crop.       |
            |                   |                 |            | - Value range : 0 to 4056   |
            +-------------------+-----------------+------------+-----------------------------+
            |                   |``CropVSize``    | ``number`` | Vsize for Image crop.       |
            |                   |                 |            | - Value range : 0 to 3040   |
            +-------------------+-----------------+------------+-----------------------------+
            |                   |``NumberOf       | ``number`` | Number of images to fetch   |
            |                   |Images``         |            | (Input Image).              |
            |                   |                 |            | When it is 0, continue      |
            |                   |                 |            | fetching images until stop  |
            |                   |                 |            | instruction is mentioned    |
            |                   |                 |            | explicitly.                 |
            |                   |                 |            | - Value range : 0 to 10000  |
            +-------------------+-----------------+------------+-----------------------------+
            |                   |``Upload         | ``number`` | Upload interval.            |
            |                   |Interval``       |            | - Value range : 1 to 2592000|
            |                   |                 |            | If 60 is specified,         |
            |                   |                 |            | 0.5FPS (=30/60)             |
            +-------------------+-----------------+------------+-----------------------------+
            |                   |``NumberOfInferen| ``number`` | Number of inference         |
            |                   |cesPerMessage``  |            | results to include in one   |
            |                   |                 |            | message (Inference Result). |
            |                   |                 |            | - Value range : 1  to 100   |
            +-------------------+-----------------+------------+-----------------------------+
            |                   |``MaxDetections  | ``number`` | No. of Objects included in  |
            |                   |PerFrame``       |            | 1 frame with respect to the |
            |                   |                 |            | Inference results metadata. |
            |                   |                 |            | - Value range : 1 to 5      |
            +-------------------+-----------------+------------+-----------------------------+
            |                   |``ModelId``      | ``string`` | Model ID.                   |
            +-------------------+-----------------+------------+-----------------------------+
            |                   |``PPLParameter`` | ``object`` |PPL parameter                |
            +-------------------+-----------------+------------+-----------------------------+

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
        const response = this.getCommandParameterFileObj.getCommandParameterFile();
        return response;
    }

    /**
     * startUploadInferenceResult- Implement instructions to a specified device to start to get the \
        inference result metadata (Output Tensor) and image (Input image).
     * @params 
     * - deviceId (str, required): Device ID.
     * @returns 
     * - Object: table:: Success Response

            +--------------------------+------------+---------------------------+
            | *Level1*                 | *Type*     | *Description*             |
            +==========================+============+===========================+
            | ``result``               | ``string`` | Set "SUCCESS" fixing      |
            +--------------------------+------------+---------------------------+
            | ``outputSubDirectory``   | ``string`` | Input Image storage path, |
            |                          |            | UploadMethod:BlobStorage  |
            |                          |            | only                      |
            +--------------------------+------------+---------------------------+
            | ``outputSubDirectoryIR`` | ``string`` | Input Inference result    |
            |                          |            | storage path,             |
            |                          |            | UploadMethodIR:BlobStorage|
            |                          |            | only                      |
            +--------------------------+------------+---------------------------+

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
        const response = this.startUploadInferenceResultObj.startUploadInferenceResult(deviceId);
        return response;
    }

    /**
     * stopUploadInferenceResult- Implement instructions to a specified device to stop getting the \
        inference result metadata (Output Tensor) and image (Input image).
     * @params 
     * - deviceId (str, required): Device ID.
     * @returns 
     * - Object: table:: Success Response

            +-----------------------+------------+---------------------------+
            | *Level1*              | *Type*     | *Description*             |
            +=======================+============+===========================+
            | ``result``            | ``string`` | Set "SUCCESS" fixing      |
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
        const response = this.stopUploadInferenceResultObj.stopUploadInferenceResult(deviceId);
        return response;
    }
}
