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
import { DeviceAppApi, Configuration } from 'js-client';
import * as Logger from '../common/logger/logger';
import { getMessage } from '../common/logger/getMessage';
import { ErrorCodes, genericErrorMessage, validationErrorMessage } from '../common/errorCodes';
import { Config } from '../common/config';

/**
 * ImportDeviceApp Json Body
 * @export
 * @interface ImportDeviceAppQueryParam
 */
export interface ImportDeviceAppQueryParam {
    /**
     * Set the compiled flg.
     *  - Value definition \
     *   0 : Specified App is not compiled \
     *   1 : Specified App is compiled
     * @type {string}
     * @memberof ImportDeviceAppQueryParam
     */
    compiled_flg: string;
    /**
     * App entry point.
     * @type {string}
     * @memberof ImportDeviceAppQueryParam
     */
    entry_point?: string;
    /**
     * App name. \
     * Allow only the following characters.
     *  - Alphanumeric characters
     *  - Under bar
     *  - Dot \
     * The maximum number of characters is app_name + version_number <=31.
     * @type {string}
     * @memberof ImportDeviceAppQueryParam
     */
    app_name: string;
    /**
     * App version number. \
     * Allow only the following characters.
     *  - Alphanumeric characters
     *  - Under bar
     *  - Dot \
     * The maximum number of characters is app_name + version_number <=31.
     * @type {string}
     * @memberof ImportDeviceAppQueryParam
     */
    version_number: string;
    /**
     * Comment. *Max. 100 characters.
     * @type {string}
     * @memberof ImportDeviceAppQueryParam
     */
    comment?: string;
    /**
     * filename.
     * @type {string}
     * @memberof ImportDeviceAppQueryParam
     */
    file_name: string;
    /**
     * App file content in base64 encoding.
     * @type {string}
     * @memberof ImportDeviceAppQueryParam
     */
    file_content: string;
    /**
    * 
    * @type {SchemaInfo}
    * @memberof ImportDeviceAppQueryParam
    */
    schema_info?: SchemaInfo;
}

interface SchemaInfo {
    /**
     * 
     * @type {SchemaInfoInterfaces}
     * @memberof SchemaInfo
     */
    'interfaces'?: SchemaInfoInterfaces;
}

interface SchemaInfoInterfaces {
    /**
     * 
     * @type {Array<SchemaInfoInterfacesInInner>}
     * @memberof SchemaInfoInterfaces
     */
    'in'?: Array<SchemaInfoInterfacesInInner>;
}

interface SchemaInfoInterfacesInInner {
    /**
     * Set the metadata format ID.
     * @type {string}
     * @memberof SchemaInfoInterfacesInInner
     */
    'metadataFormatId'?: string;
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
 * This class provide method to A list of deployment configs.
 */
export class ImportDeviceApp {
    config: Config;
    ajv = new Ajv();
    api: DeviceAppApi;

    /**
     * Constructor Method for the class DeleteDeployConfiguration
     * @param config Object of Config Class
     */
    constructor(config: Config) {
        this.config = config;
    }

    schema = {
        type: 'object',
        properties: {
            compiled_flg: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for compiledFlg',
                    isNotEmpty: 'compiledFlg required or can\'t be empty string',
                },
            },
            app_name: {
                type: 'string',
                isNotEmpty: true,
                pattern: '^[A-Za-z0-9_.]*$',
                errorMessage: {
                    type: 'Invalid string for appName',
                    pattern: 'appName has forbidden characters',
                    isNotEmpty: 'appName required or can\'t be empty string',
                },
            },
            version_number: {
                type: 'string',
                isNotEmpty: true,
                pattern: '^[A-Za-z0-9_.]*$',
                errorMessage: {
                    type: 'Invalid string for versionNumber',
                    pattern: 'version_number has forbidden characters',
                    isNotEmpty:
                        'versionNumber required or can\'t be empty string',
                },
            },
            file_name: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for fileName',
                    isNotEmpty: 'fileName required or can\'t be empty string',
                },
            },
            file_content: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for fileContent',
                    isNotEmpty: 'fileContent required or can\'t be empty string',
                },
            },
            entry_point: {
                type: 'string',
                default: 'ppl',
                errorMessage: {
                    type: 'Invalid string for entryPoint'
                },
            },
            comment: {
                type: 'string',
                errorMessage: {
                    type: 'Invalid string for comment'
                },
            },
            schema_info: {
                type: 'object',
                errorMessage: {
                    type: 'Invalid object for schemaInfo'
                },
            }
        },
        required: [
            'compiled_flg',
            'file_content',
            'file_name',
            'version_number',
            'app_name',
        ],
        additionalProperties: false,
        errorMessage: {
            required: {
                compiled_flg: 'compiledFlg is required',
                file_content: 'fileContent is required',
                file_name: 'fileName is required',
                version_number: 'versionNumber is required',
                app_name: 'appName is required',
            },
        },
    };

    /**
     *  importDeviceApp - Import Device app.
     *  @params
     * - compiledFlg (str, required): Set the compiled flg. \
            - Value definition \
              0 : Specified App is not compiled \
              1 : Specified App is compiled
     * - appName (str, required): App name. Allow only the following characters. \
                    - Alphanumeric characters \
                    - Under bar \
                    - Dot \
                    The maximum number of characters is app_name + version_number <=31.
     * - versionNumber (str, required): App version number. Allow only the following characters. \
                    - Alphanumeric characters \
                    - Under bar \
                    - Dot \
                    The maximum number of characters is app_name + version_number <=31.
     * - fileName (str, required): filename.
     * - fileContent (str, required): App file content in base64 encoding.
     * - entryPoint (str, optional): App entry point.
     * - comment (str, optional): Comment. *Max. 100 characters.
     * - schemaInfo (object, optional): Schema info.
     * ```ts
     *                {
     *                    <interface> : [
     *                        {
     *                            "metadataFormatId": <metadataFormatId>
     *                        }
     *                    ]
     *                }
     * ```
     *      - `interface`: Set the metadata format IDs.
     *          - `metadataFormatId`: Set the metadata format ID.
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
     *   if any input string parameter found empty
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
     *    const compiledFlg = '__compiledFlg__';
     *    const appName = '__appName__';
     *    const versionNumber = '__versionNumber__';
     *    const fileName = '__fileName__';
     *    const fileContent = '__fileContent__';
     *    const entryPoint = '__entryPoint__';
     *    const comment = '__comment__';
     *    const schemaInfo = '__schemaInfo__';
     *    const response= await client.deployment.importDeviceApp(compiledFlg,
     *           appName, versionNumber, fileName, fileContent, entryPoint, comment, schemaInfo);
     */
    async importDeviceApp(
        compiledFlg: string,
        appName: string,
        versionNumber: string,
        fileName: string,
        fileContent: string,
        entryPoint?: string,
        comment?: string,
        schemaInfo?: object
    ) {
        Logger.info('importDeviceApp');
        let valid = true;
        const queryParams: ImportDeviceAppQueryParam = {
            compiled_flg: compiledFlg,
            app_name: appName,
            version_number: versionNumber,
            file_name: fileName,
            file_content: fileContent,
            entry_point: entryPoint,
            comment,
            schema_info: schemaInfo
        };
        try {
            const validate = ajv.compile(this.schema);
            valid = validate({ ...queryParams });

            if (!valid) {
                Logger.error(`${validate.errors}`);
                throw validate.errors;
            }

            if (appName.length + versionNumber.length > 32) {
                valid = false;
                const errorMessage = 'Exceed the maximum number of characters is appName + versionNumber ⇐31';
                Logger.error(getMessage(ErrorCodes.ERROR, errorMessage));
                return validationErrorMessage(getMessage(ErrorCodes.ERROR, errorMessage));
            }

            const accessToken = await this.config.getAccessToken();
            const baseOptions = await this.config.setOption();

            const apiConfig = new Configuration({
                basePath: this.config.consoleEndpoint,
                accessToken,
                baseOptions,
            });
            this.api = new DeviceAppApi(apiConfig);

            let res;
            if (this.config.applicationId) {
                res = await this.api.importDeviceApp(queryParams, 'client_credentials');
            } else {
                res = await this.api.importDeviceApp(queryParams);
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
