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

import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import ValidationError from "ajv/dist/runtime/validation_error";
import { InsightApi, Configuration } from 'js-client';
import { Config } from "../common/config";
import { Logger } from '../common/logger';

const ajv = new Ajv({allErrors: true});
ajvErrors(ajv);

/**
 * This class provide method to Retrieves (saved) inference result metadata list information for a specified device.
 */
export class GetInferenceresults {
    
    config: Config;
    api: InsightApi;

    constructor(config: Config) {
        this.config = config;
    }
    
    /**
    * Schema for API to retrieve (saved) inference result metadata list information for a specified device.

    Args:
        Schema (object): Ajv JSON schema Validator
    */
   
    schema = {
        type: "object",
        properties: {
            deviceId: {
                type: "string",
                errorMessage: {
                    type: 'Invalid string for deviceId',
                }
            },
            filter: {
                type: "string",
                errorMessage: {
                    type: 'Invalid string for filter',
                }
            },
            numberOfInferenceresults: {
                type: "number",
                errorMessage: {
                    type: 'Invalid number for numberOfInferenceresults',
                }
            },
            raw: {
                type: "number",
                errorMessage: {
                    type: 'Invalid number for raw',
                }
            },
            time: {
                type: "string",
                errorMessage: {
                    type: 'Invalid string for time',
                }
            }
        },
        required: ["deviceId"],
        additionalProperties: false,
        errorMessage: {
            required: {
                deviceId: 'deviceId is required'
            }
        }
    };
   
    /**
     * Retrieves (saved) inference result metadata list information for a specified device.     * 
     *  @params Object with key/value pair to be passed.
     * - deviceId - The Device ID.
     * - filter - The filter.  
     * - numberOfInferenceresults - The number Of Inference results.
     * - raw - The raw.   
     * - time - The time.
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
import { Config } from '../common/config';
     *      const configuration = {
     *          baseUrl: "__base_url__"
     *        	tokenUrl: "__token_url__"
     *          clientSecret: '__client_secret__'
     *          clientId: '__client_id__'
     *      }
     *  
     *      const client = await Client.createInstance(configuration);
     *      const response= await client.insight.getInferenceresults(deviceId, filter, numberOfInferenceresults, raw, time);
     *
    */

    async getInferenceresults(deviceId: string, numberOfInferenceresults?: number, filter?: string, raw?: number, time?: string){
        Logger.info('getInferenceresults');
        try {
            const validate = ajv.compile(this.schema);
            const valid = validate({deviceId:deviceId, numberOfInferenceresults:numberOfInferenceresults, filter:filter, raw:raw, time:time});
            if (!valid){
                Logger.error(validate.errors);
                throw validate.errors;
            }
            const accessToken= await this.config.getAccessToken();
            const apiConfig = new Configuration({ basePath: this.config.baseUrl, accessToken });
            this.api = new InsightApi(apiConfig);

            const res = await this.api.getInferenceResults(deviceId, numberOfInferenceresults, filter, raw, time);
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