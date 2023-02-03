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
import { Configuration, TrainModelApi } from 'js-client';
import * as Logger from '../common/logger/logger';
import { getMessage } from '../common/logger/getMessage';
import {
    ErrorCodes,
    genericErrorMessage,
    validationErrorMessage,
} from '../common/errorCodes';
import { Config } from '../common/config';

/**
 * todo
 * @export
 * @interface ImportBaseModelParamSchema
 */
export interface ImportBaseModelParamSchema {
    /**
     *
     * @type {string}
     * @memberof ImportBaseModelParamSchema
     */
    model_id: string;
    /**
     *
     * @type {string}
     * @memberof ImportBaseModelParamSchema
     */
    model: string;
    /**
     *
     * @type {boolean}
     * @memberof ImportBaseModelParamSchema
     */
    converted?: boolean;
    /**
     *
     * @type {string}
     * @memberof ImportBaseModelParamSchema
     */
    vendor_name?: string;
    /**
     *
     * @type {string}
     * @memberof ImportBaseModelParamSchema
     */
    comment?: string;
    /**
     *
     * @type {string}
     * @memberof ImportBaseModelParamSchema
     */
    input_format_param?: string;
    /**
     *
     * @type {string}
     * @memberof ImportBaseModelParamSchema
     */
    network_config?: string;
    /**
     *
     * @type {string}
     * @memberof ImportBaseModelParamSchema
     */
    network_type?: string;
    /**
     *
     * @type {Array<string>}
     * @memberof ImportBaseModelParamSchema
     */
    labels?: Array<string>;
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
 * This class provide method to Import the base model. For a new model ID, save it as a new one. \
        If a model ID already registered in the system is specified, the version is upgraded. \
        Note that it is not possible to create a device model based on the base model \
        imported with this API.
 *          
 */
export class ImportBaseModel {
    config: Config;
    ajv = new Ajv();
    api: TrainModelApi;

    constructor(config: Config) {
        this.config = config;
    }

    /**
    * Nested Schema for API import the base model. For a new model ID, save it as a new one. \
        If a model ID already registered in the system is specified, the version is upgraded. \
        Note that it is not possible to create a device model based on the base model \
        imported with this API.
    Args:
        Schema (object): Ajv JSON schema Validator
    */

    schema = {
        type: 'object',
        properties: {
            model_id: {
                type: 'string',
                isNotEmpty: true,
                pattern: '^[A-Za-z0-9_()-.]*$',
                errorMessage: {
                    type: 'Invalid string for modelId',
                    pattern: 'modelId has forbidden characters',
                    isNotEmpty: 'modelId required or can\'t be empty string',
                },
            },
            model: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    isNotEmpty: 'model required or can\'t be empty string',
                    type: 'Invalid string for model',
                },
            },
            converted: {
                type: 'boolean',
                default: false,
                errorMessage: {
                    type: 'Invalid boolean for converted',
                },
            },
            vendor_name: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for vendorName',
                    isNotEmpty: 'vendor_name required or can\'t be empty string',
                },
            },
            comment: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for comment',
                    isNotEmpty: 'comment required or can\'t be empty string',
                },
            },
            input_format_param: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for input format param',
                    isNotEmpty:
                        'input_format_param required or can\'t be empty string',
                },
            },
            network_config: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for networkConfig',
                    isNotEmpty:
                        'network_config required or can\'t be empty string',
                },
            },
            network_type: {
                type: 'string',
                isNotEmpty: true,
                default: '1',
                errorMessage: {
                    type: 'Invalid string for networkType',
                    isNotEmpty:
                        'network_type required or can\'t be empty string',
                },
            },
            labels: {
                type: 'array',
                items: {
                    type: 'string',
                },
                minItems: 1,
                errorMessage: {
                    type: 'Invalid array of string for labels',
                    minItems:
                        'labels required or can\'t be empty array of string',
                },
            },
        },
        required: ['model_id', 'model'],
        additionalProperties: false,
        errorMessage: {
            required: {
                model_id: 'modelId is required',
                model: 'model is required',
            },
        },
    };

    /**
     * importBaseModel - For a new model ID, save it as a new one. \
        If a model ID already registered in the system is specified, the version is upgraded. \
        Note that it is not possible to create a device model based on the base model \
        imported with this API.
     * @params
     * - modelId (str, required) - Model ID. \
                The model ID to be saved or upgraded. 100 characters or less \
                The following characters are allowed \
                Alphanumeric characters \
                -hyphen \
                _ Underscore \
                () Small parentheses \
                . dot
     * - model (str, required) - Model file SAS URI
     * - converted (bool, optional) - Convert flag. \
                True: Converted Model \
                False: Unconverted Model \
                False if not specified
     * - vendorName (str, optional) -  Vendor Name.  (specified when saving as new) \
                Up to 100 characters. Not specified for version upgrade. \
                No vendor name if not specified.
     * - comment (str, optional) - Explanation about the model to be entered when \
                registering a new model. When newly saved, it is set as \
                a description of the model and version. \
                When the version is upgraded, it is set as the \
                description of the version. Within 100 characters If not specified, there is no \
                explanation about the model to be entered when registering a new model.
     * - inputFormatParam (str, optional) - input format param file (json format) URI \
                Evaluate Azure: SAS URI+ AWS: Presigned URIs Usage: Packager conversion \
                information (image format information). Illegal characters except for SAS URI \
                format json format is an array of objects (each object contains the following \
                values). Example ordinal: Order of DNN input to converter (value range: 0-2) \
                format: format ("RGB" or "BGR") If not specified, do not evaluate.
     * - networkConfig (str, optional) - URI of network config file (json format) \
                Evaluate Azure: SAS URI+ AWS: Presigned URIs In case of pre-conversion \
                model, specify. (=Ignored for post-conversion model) Usage: Conversion parameter \
                information of model converter. Illegal characters except for SAS URI format \
                If not specified, do not evaluate.
     * - networkType (str, optional) - The Network Type. (Valid only for \
                new model registration). \
                - 0: Custom Vision(Third party trademark)+ \
                - 1: Non-CustomVision+ \
                1 if not specified.
     * - labels (Array<str>, optional) - Label Name. Example: ["label01","label02","label03"]
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
     *    const consoleEndpoint: '__consoleEndpoint__';
     *    const portalAuthorizationEndpoint: '__portalAuthorizationEndpoint__';
     *    const clientId: '__clientId__';
     *    const clientSecret: '__clientSecret__';
     *    const config = new Config(consoleEndpoint,portalAuthorizationEndpoint, clientId, clientSecret);
     *  
     *    const client = await Client.createInstance(config);
     *    const modelId = '__modelId__';
     *    const model = '__model__';
     *    const converted = '__converted__';
     *    const vendorName = '__vendorName__';
     *    const comment = '__comment__';
     *    const inputFormatParam = '__inputFormatParam__'; 
     *    const networkConfig = '__networkConfig__'; 
     *    const networkType = '__networkType__'; 
     *    const labels = '__labels__';
     * 
     *    const response= await client.aiModel.importBaseModel(modelId, model, converted, vendorName, comment, inputFormatParam, networkConfig, networkType, labels);
     *
    */
    async importBaseModel(
        modelId: string,
        model: string,
        converted?: boolean,
        vendorName?: string,
        comment?: string,
        inputFormatParam?: string,
        networkConfig?: string,
        networkType = '1',
        labels?: Array<string>
    ) {
        Logger.info('importBaseModel');
        let valid = true;
        const queryParams: ImportBaseModelParamSchema = {
            model_id: modelId,
            model,
            converted,
            vendor_name: vendorName,
            comment,
            input_format_param: inputFormatParam,
            network_config: networkConfig,
            network_type: networkType,
            labels,
        };

        try {
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
                baseOptions,
            });
            this.api = new TrainModelApi(apiConfig);

            const res = await this.api.importBaseModel(queryParams);
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
