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

import { CommandParameterFileApi, Configuration } from 'js-client';
import { Config } from '../common/config';
import * as Logger from '../common/logger/logger';
import { ErrorCodes, genericErrorMessage } from '../common/errorCodes';

/**
 * This class implements API to get a commandParameterFile list
 */
export class GetCommandParameterFile {
    config: Config;
    api: CommandParameterFileApi;

    /**
     * Constructor Method for the class GetCommandParameterFile
     * @param config : Object of Config Class
     */
    constructor(config: Config) {
        this.config = config;
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
            |                   |``comment``   |``string``  | comment                       |
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
     *    const response= await client.deviceManagement.getCommandParameterFile();
     *
     */
    async getCommandParameterFile() {
        Logger.info('getCommandParameterFile');
        try {
            const accessToken = await this.config.getAccessToken();
            const baseOptions = await this.config.setOption();

            const apiConfig = new Configuration({
                basePath: this.config.consoleEndpoint,
                accessToken,
                baseOptions
            });
            this.api = new CommandParameterFileApi(apiConfig);
            let res;
            if (this.config.applicationId) {
                res = await this.api.getCommandParameterFile('client_credentials');
            } else {
                res = await this.api.getCommandParameterFile();
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
