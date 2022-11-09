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
import { Logger } from '../common/logger';

/**
 * This class provides method to get a commandParameterFile list.
 */
export class GetCommandParameterFile {
    
    config: Config;
    api: CommandParameterFileApi;

    constructor(config: Config) {
        this.config = config;
    }
    

    /**
     * Get a commandParameterFile list.
     * @returns
     * - 'Success Response' : Object with below key and value pairs.
     *       - 'parameter_list' (object) : List of CommandParameters registered in Console Access Library
     * - 'Generic Error Response' :
     *       If the http_status returned from the Low Level SDK
     *       API is other than 200. Dictionary with below key and value pairs.
     *       - 'message' (str) : error message returned from the Low Level SDK API
     *       - 'error_code' (str) : "Generic Error"
     * - 'Validation Error Response' :
     *   If incorrect API input parameters. Dictionary with below key and value pairs.
     *   - 'message' (str) : validation error message for respective input parameter
     *   - 'error_code' (str) : "E001"
     * - 'Key Error Response' :
     *   If API key error returned from the Low Level SDK API.
     *   Dictionary with below key and value pairs.
     *   - 'message' (str) : error message returned from the Low Level SDK API
     *   - 'error_code' (str) : "Key Error"
     * - 'Type Error Response' :
     *   If API type error returned from the Low Level SDK API.
     *   Dictionary with below key and value pairs.
     *   - 'message' (str) : error message returned from the Low Level SDK API
     *   - 'error_code' (str) : "Type Error"
     * - 'Attribute Error Response' :
     *   If API attribute error returned from the Low Level SDK API.
     *   Dictionary with below key and value pairs.
     *   - 'message' (str) : error message returned from the Low Level SDK API
     *   - 'error_code' (str) : "Attribute Error"
     * - 'Value Error Response' :
     *   If API value error returned from the Low Level SDK API.
     *   Dictionary with below key and value pairs.
     *   - 'message' (str) : error message returned from the Low Level SDK API
     *   - 'error_code' (str) : "Value Error"
     *
     * @example
     * Below is the example of result format.
     * .. code-block:: typescript
     *    import  { Client } from 'consoleaccesslibrary';
     *      const configuration = {
     *          baseUrl: "__base_url__"
     *        	tokenUrl: "__token_url__"
     *          clientSecret: '__client_secret__'
     *          clientId: '__client_id__'
     *      }
     *  
     *      const client = await Client.createInstance(configuration);
     *      const response= await client.deviceManagement.getCommandParameterFile();
     *
    */
    async getCommandParameterFile(){
        Logger.info('getCommandParameterFile');
        try {
            const accessToken= await this.config.getAccessToken();
            const apiConfig = new Configuration({ basePath: this.config.baseUrl, accessToken });
            this.api = new CommandParameterFileApi(apiConfig);
            const res = await this.api.getCommandParameter();
            return res;
        }
        catch(error){
           return error; 
        }
    }
}