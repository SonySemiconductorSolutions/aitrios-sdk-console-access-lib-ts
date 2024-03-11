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
import { Configuration, TrainModelApi } from 'js-client';
import * as Logger from '../common/logger/logger';
import { getMessage } from '../common/logger/getMessage';
import { ErrorCodes, genericErrorMessage, validationErrorMessage } from '../common/errorCodes';
import { Config } from '../common/config';

/**
 * todo
 * @export
 * @interface ImportBaseModelJsonBody
 */
export interface ImportBaseModelJsonBody {
    /**
     *
     * @type {string}
     * @memberof ImportBaseModelJsonBody
     */
    model_id: string;
    /**
     *
     * @type {string}
     * @memberof ImportBaseModelJsonBody
     */
    model: string;
    /**
     *
     * @type {boolean}
     * @memberof ImportBaseModelJsonBody
     */
    converted?: boolean;
    /**
     *
     * @type {string}
     * @memberof ImportBaseModelJsonBody
     */
    vendor_name?: string;
    /**
     *
     * @type {string}
     * @memberof ImportBaseModelJsonBody
     */
    comment?: string;
    /**
     *
     * @type {string}
     * @memberof ImportBaseModelJsonBody
     */
    input_format_param?: string;
    /**
     *
     * @type {string}
     * @memberof ImportBaseModelJsonBody
     */
    network_config?: string;
    /**
     *
     * @type {string}
     * @memberof ImportBaseModelJsonBody
     */
    network_type?: string;
    /**
     *
     * @type {string}
     * @memberof ImportBaseModelJsonBody
     */
    metadata_format_id?: string;
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
 * This class provide method to Import the base model. In addition, in the case of a new model \
        ID, it is newly saved. If you specify a model ID that has already been registered \
        in the system, the version will be upgraded.
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
    * Nested Schema for API import the base model. In addition, in the case of a new model \
        ID, it is newly saved. If you specify a model ID that has already been registered \
        in the system, the version will be upgraded.
    Args:
        Schema (object): Ajv JSON schema Validator
    */

    schema = {
        type: 'object',
        properties: {
            model_id: {
                type: 'string',
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
                errorMessage: {
                    type: 'Invalid string for vendorName'
                },
            },
            comment: {
                type: 'string',
                errorMessage: {
                    type: 'Invalid string for comment'
                },
            },
            input_format_param: {
                type: 'string',
                errorMessage: {
                    type: 'Invalid string for input format param'
                },
            },
            network_config: {
                type: 'string',
                errorMessage: {
                    type: 'Invalid string for networkConfig'
                },
            },            
            network_type: {
                type: 'string',
                default: '1',
                errorMessage: {
                    type: 'Invalid string for networkType'
                },
            },
            metadata_format_id: {
                type: 'string',
                errorMessage: {
                    type: 'Invalid array of string for metadataFormatId',
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
     * importBaseModel - Import the base model. In addition, in the case of a new model \
        ID, it is newly saved. If you specify a model ID that has already been registered \
        in the system, the version will be upgraded.
     * @params
     * - modelId (str, required) - Model ID for new registration or version upgrade. \
                                   Max. 100 characters. \
                                   The following characters are allowed \
                                   Alphanumeric characters \
                                   -hyphen \
                                   _ Underscore \
                                   () Small parentheses \
                                   . dot
     * - model (str, required) - SAS URI or Presigned URI of the model file.
     * - converted (bool, optional) - Specify whether to convert the specified model file.
     * - vendorName (str, optional) -  Vendor Name. Max. 100 characters. \
            *Specify only when registering a new base model.
     * - comment (str, optional) - Description. Max. 100 characters. \
            *When saving new, it is set as a description of the model and version. \
            *When saving version-up, it is set as a description of the version.
     * - inputFormatParam (str, optional) - SAS URI or Presigned URI of the input format \
     *           param file. \
                 - Usage: Packager conversion information (image format information). \
                 - The json format is an array of objects. Each object contains the \
                   following values. \
                     - ordinal: Order of DNN input to converter (value range: 0 to 2) \
                     - format: Format ("RGB" or "BGR")
     *           - Example:  
     * ```ts
     *           [
     *              { 
     *                 "ordinal": 0,
     *                 "format": "RGB"
     *              }, 
     *              { 
     *                  "ordinal": 1,
     *                  "format": "RGB" 
     *              }
     *           ]
     * ```
     * - networkConfig (str, optional) - SAS URI or Presigned URI of the network config file. \
                - Usage: Conversion parameter information of modelconverter. \
                Therefore, it is not necessary to specify when specifying the model
                before conversion.
     *          - Example: 
     * ```ts
     *           {
     *               "Postprocessor": {
     *                   "params": {
     *                       "background": false,
     *                       "scale_factors": [ 10.0, 10.0, 5.0, 5.0 ],
     *                       "score_thresh": 0.01,
     *                       "max_size_per_class": 64,
     *                       "max_total_size": 64,
     *                       "clip_window": [ 0, 0, 1, 1 ],
     *                       "iou_threshold": 0.45
     *                   }
     *               }
     *           }
     * ```
     * - networkType (str, optional) - Specify whether or not application is required for the \
                model. \
            - Value definition \
              0 : Model required application \
              1 : Model do not required application
     * - metadataFormatId (str, optional) - Metadata Format ID. Max. 100 characters.
     * @returns
     * - Object: table:: Success Response
    
            +------------+------------+-------------------------------+
            | *Level1*   | *Type*     | *Description*                 |
            +============+============+===============================+
            | ``result`` | ``string`` | Set "SUCCESS" fixing          |
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
     *    const applicationId: '__applicationId__';
     *    const config = new Config(consoleEndpoint,portalAuthorizationEndpoint,
     *                              clientId, clientSecret, applicationId);
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
     *    const metadataFormatId = '__metadataFormatId__';
     * 
     *    const response= await client.aiModel.importBaseModel(modelId, model, converted, vendorName, comment, inputFormatParam, networkConfig, networkType, metadataFormatId);
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
        networkType?: string,
        metadataFormatId?: string
    ) {
        Logger.info('importBaseModel');
        let valid = true;
        const queryParams: ImportBaseModelJsonBody = {
            model_id: modelId,
            model,
            converted,
            vendor_name: vendorName,
            comment,
            input_format_param: inputFormatParam,
            network_config: networkConfig,
            network_type: networkType,
            metadata_format_id: metadataFormatId,
        };

        try {
            const validate = ajv.compile(this.schema);
            valid = validate({ ...queryParams });
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
            this.api = new TrainModelApi(apiConfig);

            let res;
            if (this.config.applicationId) {
                res = await this.api.importBaseModel(queryParams, 'client_credentials');
            } else {
                res = await this.api.importBaseModel(queryParams);
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
