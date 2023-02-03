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
     * getCommandParameterFile- Get command parameter file list.
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
     *    const response= await client.deviceManagement.getCommandParameterFile();
     *
     */
    async getCommandParameterFile() {
        Logger.info('getCommandParameterFile');
        try {
            const accessToken= await this.config.getAccessToken();
            const baseOptions= await this.config.setOption();

            const apiConfig = new Configuration({
                basePath: this.config.consoleEndpoint,
                accessToken,
                baseOptions
            });
            this.api = new CommandParameterFileApi(apiConfig);
            const res = await this.api.getCommandParameter();
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
