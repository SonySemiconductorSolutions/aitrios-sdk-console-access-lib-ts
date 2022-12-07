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

import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import ValidationError from 'ajv/dist/runtime/validation_error';
import { DeviceCommandApi, Configuration } from 'js-client';
import { Config } from '../common/config';
import { Logger } from '../common/logger';

const ajv = new Ajv({allErrors: true});
ajvErrors(ajv);

/**
 * This class provides method to Execute instructions to stop acquiring inference result metadata (Output Tensor) \
            and image (Input Tensor) to the specified device API
 */
export class StopUploadInferenceResult {
    
    config: Config;
    api: DeviceCommandApi;

    constructor(config: Config) {
        this.config = config;
    }

    schema = {
        type: "object",
        properties: {
            deviceId: {
                type: "string",
                errorMessage: {
                    type: 'Invalid string for deviceId',
                }
            }
        },
        required: ['deviceId'],
        additionalProperties: false,
        errorMessage: {
            required: {
                deviceId: 'deviceId is required'
            }
        }
    };

    /**
     * Execute instructions to stop acquiring inference result metadata (Output Tensor) \
            and image (Input Tensor) to the specified device API
     * @params   Object with key/value pair to be passed.
     * - deviceId - The device Id.
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
     *      const response= await client.deviceManagement.stopUploadInferenceResult(deviceId);
     
    */
    async stopUploadInferenceResult(deviceId:string){
        Logger.info('stopUploadInferenceResult');
        try {
            const validate = ajv.compile(this.schema);
            const valid = validate({deviceId: deviceId});
            if (!valid){
                Logger.error(validate.errors);
                throw validate.errors;
            }
            const accessToken= await this.config.getAccessToken();
            const baseOptions= await this.config.setOption();

            const apiConfig = new Configuration({
                basePath: this.config.baseUrl,
                accessToken,
                baseOptions
            });
            this.api = new DeviceCommandApi(apiConfig);
            const res = await this.api.stopUploadInferenceResult(deviceId);
            return res;
        }
        catch(error){
            if( error instanceof ValidationError){
                return error.message;
            }
            return error;
        }
    }
}