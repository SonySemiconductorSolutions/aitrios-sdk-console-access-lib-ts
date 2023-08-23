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
import * as Logger from '../common/logger/logger';
import { getMessage } from '../common/logger/getMessage';
import {
    ErrorCodes,
    genericErrorMessage,
    validationErrorMessage,
} from '../common/errorCodes';
import { Config } from '../common/config';
import { PublishModel } from './publishModel';
import { GetBaseModelStatus } from './getBaseModelStatus';

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
 * Publish Model Status Enum Values
 *
 */
export enum PublishModelStatus {
    // eslint-disable-next-line no-unused-vars
    BEFORE_CONVERSION = '01',
    // eslint-disable-next-line no-unused-vars
    CONVERTING = '02',
    // eslint-disable-next-line no-unused-vars
    CONVERSION_FAILED = '03',
    // eslint-disable-next-line no-unused-vars
    CONVERSION_COMPLETE = '04',
    // eslint-disable-next-line no-unused-vars
    ADDING_TO_CONFIGURATION = '05',
    // eslint-disable-next-line no-unused-vars
    ADD_TO_CONFIGURATION_FAILED = '06',
    // eslint-disable-next-line no-unused-vars
    ADD_TO_CONFIGURATION_COMPLETE = '07',
    // eslint-disable-next-line no-unused-vars
    SAVING = '11',
}

/**
 * This class implements API to publish model and wait for completion
 */
export class PublishModelWaitResponse {
    config: Config;
    publishModelObj: PublishModel;
    getBaseModelStatusObj: GetBaseModelStatus;

    /**
     * Constructor Method for the class PublishModelWaitResponse
     * @param config Object of Config Class
     */
    constructor(config: Config) {
        this.config = config;
    }

    /**
    * Schema for API to This class implements API to publish model and wait for completion

    Args:
        Schema (object): Ajv JSON schema Validator
    */

    schema = {
        type: 'object',
        properties: {
            modelId: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for modelId',
                    isNotEmpty: 'modelId required or can\'t be empty string',
                },
            },
            deviceId: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for deviceId',
                    isNotEmpty: 'deviceId required or can\'t be empty string',
                },
            },
            callback: {
                type: 'object',
                errorMessage: {
                    type: 'Invalid return for callback ',
                },
            },
        },
        required: ['modelId'],
        additionalProperties: false,
        errorMessage: {
            required: {
                modelId: 'Model Id is required',
            },
        },
    };

    /**
     *
     * publishModelWaitResponse -  Provide the ability to publish transformation models
     *                             and wait for completion.
     * @params
     * - modelId (str, required) : The model Id.
     * - deviceId (str, optional) : The ID of edge AI device. \
                Specify when the device model is the target \
                If the base model is the target, do not specify.
     * - callback (function, optional) : A function handle of the form - \
                `publishCallback(status)`, where `status` is the notified publish status. \
                Callback Function to check the publishing status with `getBaseModelStatus`,
                and if not completed, call the callback function to notify the publishing status.\
                If not specified, no callback notification.
     * @returns
     * - Object: table:: Success Response

            +-------------------+------------+-------------------------------+
            |  Level1           |  Type      |  Description                  |
            +-------------------+------------+-------------------------------+
            |  `result`         |  `string`  | "SUCCESS"                     |
            +-------------------+------------+-------------------------------+
            |  `process time`   |  `string`  | Processing Time               |
            +-------------------+------------+-------------------------------+

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
     *   if any input string parameter found empty OR \
     *   if type of callback paramter not a function. \
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
     * ```ts
     *    import  { Client, Config } from 'consoleaccesslibrary';
     *
     *    const consoleEndpoint: '__consoleEndpoint__';
     *    const portalAuthorizationEndpoint: '__portalAuthorizationEndpoint__';
     *    const clientId: '__clientId__';
     *    const clientSecret: '__clientSecret__';
     *    const config = new Config(consoleEndpoint, portalAuthorizationEndpoint, clientId, clientSecret);
     *
     *    const client = await Client.createInstance(config);
     *    const modelId = '__modelId__';
     *    const deviceId = '__deviceId__';
     *    const callback = '__callback__';
     *    // callback is user defined function reference
     *    // function publishCallback(status)
     *    // Process callback received for the `status`.
     * 
     *    const response= await client.aiModel.publishModelWaitResponse(modelId, deviceId, callback);
     * ```
     */
    async publishModelWaitResponse(
        modelId: string,
        deviceId?: string,
        // eslint-disable-next-line @typescript-eslint/ban-types
        callback?: Function
    ) {
        Logger.info('publishModelWaitResponse');
        let valid = true;
        try {
            const validate = ajv.compile(this.schema);
            valid = validate({ modelId, deviceId });
            if (!valid) {
                Logger.error(`${validate.errors}`);
                throw validate.errors;
            }

            if (callback && typeof callback !== 'function') {
                valid = false;
                const errorMessage = 'Invalid return for callback';
                Logger.error(getMessage(ErrorCodes.ERROR, errorMessage));
                return validationErrorMessage(
                    getMessage(ErrorCodes.ERROR, errorMessage)
                );
            }
            this.publishModelObj = new PublishModel(this.config);
            this.getBaseModelStatusObj = new GetBaseModelStatus(this.config);
            let returnPublishModelWaitResponse: any = {}; 
            Logger.info('Publishing... ');
            const publishStartTime = new Date().getTime();

            const returnPublishModel = await this.publishModelObj.publishModel(
                modelId,
                deviceId
            );
            Logger.info(`ReturnPublishModel: ${returnPublishModel}`);
            if (
                'data' in returnPublishModel &&
                'result' in returnPublishModel.data &&
                returnPublishModel.data.result === 'SUCCESS'
            ) {
                let publishStatus = undefined;
                const publishLookup = true;
                while (publishLookup) {
                    const latestType = '1';
                    const modelStatus =
                        await this.getBaseModelStatusObj.getBaseModelStatus(
                            modelId,
                            latestType
                        );
                    if ('projects' in modelStatus.data) {
                        publishStatus =
                            modelStatus.data['projects'][0]['versions'][0][
                                'version_status'
                            ];
                    }

                    // if callback parameter exist then
                    // invoke callback function with `publishStatus`
                    if (callback && typeof callback === 'function') {
                        callback(publishStatus);
                    }

                    if (
                        publishStatus === PublishModelStatus.CONVERSION_FAILED
                    ) {
                        // if `publishStatus` is error, while conversion then
                        // stop polling for model publish status
                        const message = 'Conversion failed';
                        Logger.error(`${ErrorCodes.GENERIC_ERROR}: ${message}`);
                        returnPublishModelWaitResponse =
                            genericErrorMessage(message);
                        break;
                    } else if (
                        publishStatus ===
                        PublishModelStatus.ADD_TO_CONFIGURATION_FAILED
                    ) {
                        // if `publishStatus` is error then
                        // stop polling for model publish status
                        const message = 'Add to configuration failed';
                        Logger.error(`${ErrorCodes.GENERIC_ERROR}: ${message}`);
                        returnPublishModelWaitResponse =
                            genericErrorMessage(message);
                        break;
                    } else if (
                        publishStatus ===
                        PublishModelStatus.ADD_TO_CONFIGURATION_COMPLETE
                    ) {
                        // if `publishStatus` is success then calculate process time and
                        // stop polling for model publish status
                        returnPublishModelWaitResponse['result'] = 'SUCCESS';
                        const publishEndTime = new Date().getTime();
                        const publishTimeSecond =
                            publishEndTime - publishStartTime;
                        //convert seconds to "HH:MM:SS" format
                        const totalPublishTimestr = new Date(publishTimeSecond)
                            .toISOString()
                            .substring(11, 8);
                        returnPublishModelWaitResponse['process_time'] =
                            totalPublishTimestr;
                        break;
                    } else {
                        Logger.info(publishStatus);
                    }
                }
            } else {
                returnPublishModelWaitResponse = returnPublishModel;
            }
            return returnPublishModelWaitResponse;
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
