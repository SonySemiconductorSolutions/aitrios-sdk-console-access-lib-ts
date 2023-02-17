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
import { DeployApi, Configuration } from 'js-client';
import * as Logger from '../common/logger/logger';
import { getMessage } from '../common/logger/getMessage';
import {
    ErrorCodes,
    genericErrorMessage,
    validationErrorMessage,
} from '../common/errorCodes';
import { Config } from '../common/config';

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
 * This class force cancel deployment state
 */
export class CancelDeployment {
    config: Config;
    api: DeployApi;

    /**
     * Constructor Method for the class Canceldeployment
     * @param config Object of Config Class
     */
    constructor(config: Config) {
        this.config = config;
    }

    /**
    * Schema for API to Canceldeployment

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
            deployId: {
                type: 'number',
                minimum: 0,
                errorMessage: {
                    type: 'Invalid string for deployId',
                    minimum:
                        'numberOfInferenceResults is required or can\'t be negative',
                },
            },
        },
        required: ['deviceId', 'deployId'],
        additionalProperties: false,
        errorMessage: {
            required: {
                deviceId: 'deviceId is required',
                deployId: 'deployId is required',
            },
        },
    };

    /**
     * cancelDeployment -  Force cancel the device deployment state.It only restores the \
        state of the database being deployed, but cannot return the deployed state to the edge AI device. \
        Used when edge AI device deployment fails and there is a deviation from the state of the database.
     *  @params
     * - deviceId (str, required) - Device ID. Case-sensitive.
     * - deployId (int, required) - The Deployment id. \
     *           Id that can be obtained with getDeployHistory.
     * @returns
     * - Object: table:: Success Response

            +------------+------------+-------------------------------+
            |  Level1    |  Type      |  Description                  |
            +------------+------------+-------------------------------+
            |  `result`  |  `string`  | Set "SUCCESS" pinning         |
            +------------+------------+-------------------------------+

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
     *   if any input string parameter found empty OR
     *   if any input integer parameter found negative OR
     *   if any input non integer parameter found.
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
     * @example
     * Below is the example of result format.
     * .. code-block:: typescript
     *    import  { Client, Config } from 'consoleaccesslibrary';
     * 
     *    const consoleEndpoint: '__consoleEndpoint__';
     *    const portalAuthorizationEndpoint: '__portalAuthorizationEndpoint__';
     *    const clientId: '__clientId__';
     *    const clientSecret: '__clientSecret__';
     *    const config = new Config(consoleEndpoint, portalAuthorizationEndpoint, clientId, clientSecret);
     *  
     *    const client = await Client.createInstance(config);
     *    const deviceId = '__deviceId__';
     *    const deployId = '__deployId__';
     *    const response= await client.deployment.cancelDeployment(deviceId, deployId);
    */
    async cancelDeployment(deviceId: string, deployId: number) {
        Logger.info('cancelDeployment');
        let valid = true;
        try {
            const validate = ajv.compile(this.schema);
            valid = validate({ deviceId, deployId });
            if (!valid) {
                Logger.error(`${validate.errors}`);
                throw validate.errors;
            }
            const accessToken= await this.config.getAccessToken();
            const baseOptions= await this.config.setOption();

            const apiConfig = new Configuration({
                basePath: this.config.consoleEndpoint,
                accessToken,
                baseOptions
            });
            this.api = new DeployApi(apiConfig);
            const res = await this.api.cancelDeployment(deviceId, deployId+'');
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
