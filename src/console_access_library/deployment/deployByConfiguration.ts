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

import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import { DeployApi, Configuration } from 'js-client';
import { Config } from '../common/config';
import * as Logger from '../common/logger/logger';
import { ErrorCodes, genericErrorMessage, validationErrorMessage } from '../common/errorCodes';
import { getMessage } from '../common/logger/getMessage';

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
 * This class implements DeployByConfiguration API.
 */
export class DeployByConfiguration {
    config: Config;
    api: DeployApi;

    /**
     * Constructor Method for the class DeployByConfiguration
     * @param config Object of Config Class
     */
    constructor(config: Config) {
        this.config = config;
    }

    /**
    * Schema for API to get the deployment history for a specified device.

    Args:
        Schema (object): Ajv JSON schema Validator
    */

    schema = {
        type: 'object',
        properties: {
            configId: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for configId',
                    isNotEmpty: 'configId required or can\'t be empty string'
                },
            },
            deviceIds: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for deviceIds',
                    isNotEmpty: 'deviceIds required or can\'t be empty string'
                },
            },
            replaceModelId: {
                type: 'string',
                default: '',
                errorMessage: {
                    type: 'Invalid string for replaceModelId'
                },
            },
            comment: {
                type: 'string',
                default: '',
                errorMessage: {
                    type: 'Invalid string for comment'
                },
            },
        },
        required: ['configId', 'deviceIds'],
        additionalProperties: false,
        errorMessage: {
            required: {
                configId: 'configId is required',
                deviceIds: 'deviceIds is required',
            },
        },
    };

    /**
     *  deployByConfiguration - Provide a function for deploying the following to devices \
     *                          specified with deploy config. \
     *                          - Firmware \
     *                          - AIModel
     *  @params
     * - configId (str, required) : Setting ID.
     * - deviceIds (str, required) : Specify multiple device IDs separated by commas.
     * - replaceModelId (str, optional) : Specify the model ID or network_id. \
     *           If the model with the specified model ID does not exist in the database, \
     *           treat the entered value as the network_id and process it. \
     *           Default: ''
     * - comment (str, optional) : Max. 100 characters. Default: ''
     * @returns
     * - Object: table:: Success Response

            +------------+------------+-------------------------------+
            | *Level1*   | *Type*     | *Description*                 |
            +============+============+===============================+
            | ``result`` | ``string`` | Set "SUCCESS" fixing          |
            +------------+------------+-------------------------------+

     * - 'Generic Error Response' :
     *   If Any generic error returned from the Low Level SDK. Object with below key and value pairs.
     *      - 'result' (str) : "ERROR"
     *      - 'message' (str) : error message returned from the Low Level SDK API
     *      - 'code' (str) : "Generic Error"
     *      - 'datetime' (str) : Time
     * 
     * - 'Validation Error Response' :
     *   If incorrect API input parameters OR \
         if any input string parameter found empty.
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
     *    import  { Client, Config } from 'consoleaccesslibrary';
     *
     *    const consoleEndpoint: '__consoleEndpoint__';
     *    const portalAuthorizationEndpoint: '__portalAuthorizationEndpoint__';
     *    const clientId: '__clientId__';
     *    const clientSecret: '__clientSecret__';
     *    const applicationId: '__applicationId__';
     *    const config = new Config(consoleEndpoint,portalAuthorizationEndpoint,
     *                              clientId, clientSecret, applicationId);
     *
     *    const client = await Client.createInstance(config);
     *    const configId = '__config_id__';
     *    const deviceIds = '__device_ids__';
     *    const replaceModelId = '__replaceModelId__';
     *    const comment = '__comment__';
     *    const response= await client.deployment.deployByConfiguration(configId, deviceIds, replaceModelId, comment);
     */
    async deployByConfiguration(
        configId: string,
        deviceIds: string,
        replaceModelId?: string,
        comment?: string
    ) {
        Logger.info('deployByConfiguration');
        let valid = true;
        try {
            const validate = ajv.compile(this.schema);
            valid = validate({ configId, deviceIds, replaceModelId, comment });
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
            this.api = new DeployApi(apiConfig);

            let res;
            if (this.config.applicationId) {
                res = await this.api.deployByConfiguration(
                    configId,
                    deviceIds,
                    'client_credentials',
                    replaceModelId,
                    comment
                );
            } else {
                res = await this.api.deployByConfiguration(
                    configId,
                    deviceIds,
                    undefined,
                    replaceModelId,
                    comment
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
