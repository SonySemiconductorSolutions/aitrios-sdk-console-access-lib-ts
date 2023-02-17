/*
 * Copyright 2022 Sony Semiconductor Solutions Corp. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import { Config } from '../common/config';
import * as Logger from '../common/logger/logger';
import {
    ErrorCodes,
    genericErrorMessage,
    validationErrorMessage,
} from '../common/errorCodes';
import { getMessage } from '../common/logger/getMessage';
import { GetDeployHistory } from './getDeployHistory';
import { DeployByConfiguration } from './deployByConfiguration';

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
 * Deploy By Configuration Enum Status
 *
 */

export enum DeployByConfigurationStatus {
    // eslint-disable-next-line no-unused-vars
    DEPLOYING = '0',
    // eslint-disable-next-line no-unused-vars
    SUCCESSFUL = '1',
    // eslint-disable-next-line no-unused-vars
    FAILED = '2',
    // eslint-disable-next-line no-unused-vars
    CANCELED = '3',
    // eslint-disable-next-line no-unused-vars
    DEVICEAPP_UNDEPLOY = '9',
}

export interface ResponseDeployByConfiguration {
    result: string;
    code: string;
    message: string;
    datetime: Date;
}

/**
 * This class implements deployByConfigurationWaitResponse API.
 */
export class DeployByConfigurationWaitResponse {
    config: Config;
    getDeployHistoryObj: GetDeployHistory;
    deployByConfigObj: DeployByConfiguration;
    deployCallbackStatusArray = [];
    /**
     * Constructor Method for the class DeployByConfigurationWaitResponse
     * @param config Object of Config Class
     */
    constructor(config: Config) {
        this.config = config;
    }

    /**
    * Schema for API to get the DeployByConfigurationWaitResponse.

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
                    isNotEmpty: 'configId required or can\'t be empty string',
                },
            },
            deviceIds: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for deviceIds',
                    isNotEmpty: 'deviceIds required or can\'t be empty string',
                },
            },
            replaceModelId: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for replaceModelId',
                    isNotEmpty:
                        'replaceModelId required or can\'t be empty string',
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
            timeout: {
                type: 'number',
                minimum: 0,
                default: 3600,
                errorMessage: {
                    type: 'Invalid number for timeout',
                    minimum: 'timeout is required or can\'t be negative',
                },
            },
            callback: {
                type: 'object',
                errorMessage: {
                    type: 'Invalid return for callback ',
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
     * Update the device id deploy status information to global array
     * @param
     * - deviceId (str): Device ID, Case sensitive
     * - status (str, optional): The notified deployment status for that device_id.
     *
     */
    setValues(deviceId: string, status = '') {
        if (deviceId) {
            const foundData = this.deployCallbackStatusArray.find(
                (item) => deviceId in item
            );
            if (foundData) {
                foundData[deviceId]['status'] = status;
            } else {
                this.deployCallbackStatusArray.push({ [deviceId]: { status } });
            }
        }
    }

    /**
     * Get device id deploy status information from the global array
     * @param
     * - deviceId (str): Device ID, Case sensitive
     * @returns
     * obj: if device ID found.
     * undefined: if device ID not found.
     */

    getValues(deviceId: string) {
        const foundData = this.deployCallbackStatusArray.find(
            (item) => deviceId in item
        );
        return foundData[deviceId];
    }

    /**
     *  deployByConfigurationWaitResponse -Provides a Function to deploy the following to the device specified from the
        deployment config.
     *  @params
     * - configId (str, required) : Configuration ID.
     * - deviceIds (str, required) : Device ID. Specify multiple device IDs separated by commas.
     * - replaceModelId (str, optional) : Model ID to be replaced. Specify "Model ID" or \
                "network_id". If the specified model ID does not exist in the DB, the \
                entered value is regarded as a network_id and processed is performed.
     * - comment (str, optional) : The comment. 100 character or less
     * - timeout (int, optional) : Timeout waiting for completion. There are cases where the \
                edge AI device hangs up during the deployment process,\
                so there are cases where the process remains in progress,\
                so timeout to exit the process, 3600 seconds if not specified.
     * - callback (function, optional) : A function handle of the form - \
                `deployCallback(deviceStatusArray)`, where `deviceStatusArray`
                is the array of the dictionary for each device :
     * ```ts
     *            [
     *                {
     *                    <deviceId> : {
     *                        "status":<status>,
     *                    }
     *                },
     *            ]
     * ```
                here - `deviceId`: is device ID,
                    - `status`: is the notified deployment status for that deviceId,
                Callback function to check the deploying status with `getDeployHistory`,\
                and if not completed, call the callback function and notify the deploying status.\
                If not specified, no callback notification.
     * @returns
     * - Object: table:: Success Response

            +-------------------+-------------------+------------+----------------------------+
            |  Level1           |  Level2           |  Type      |  Description               |
            +-------------------+-------------------+------------+----------------------------+
            |  `No_item_name`   |                   |  `array`   | deploy by configuration    |
            |                   |                   |            | wait response array        |
            +-------------------+-------------------+------------+----------------------------+
            |                   |  `device_id`      |  `string`  | Set the device id          |
            +-------------------+-------------------+------------+----------------------------+
            |                   |  `result`         |  `string`  | "SUCCESS"                  |
            +-------------------+-------------------+------------+----------------------------+
            |                   |  `process_time`   |  `string`  | Processing Time            |
            +-------------------+-------------------+------------+----------------------------+

     * - 'Generic Error Response' :
     *   If Any generic error returned from the Low Level SDK. Object with below key and value pairs.
     *      - 'result' (str) : "ERROR"
     *      - 'message' (str) : error message returned from the Low Level SDK API
     *      - 'code' (str) : "Generic Error"
     *      - 'datetime' (str) : Time
     * 
     * - 'Validation Error Response' :
     *   If incorrect API input parameters OR \
           if any input string parameter found empty OR \
           if any input integer parameter found negative OR \
           if type of callback paramter not a function. \
           Then, Object with below key and value pairs.
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
     *    const configId = '__config_id__';
     *    const deviceIds = '__device_ids__';
     *    const replaceModelId = '__replaceModelId__';
     *    const comment = '__comment__';
     *    const timeout = '__timeout__';
     *    const callback = '__callback__';
     *    // callback is user defined function reference
     *    // function deployCallback(deployStatusArray):
     *    // Process callback received for the `deviceId` with `status`
     * 
     *    const response= await client.deployment.deployByConfigurationWaitResponse(configId, deviceIds, replaceModelId, comment, timeout, callback);
     * ```
    */
    async deployByConfigurationWaitResponse(
        configId: string,
        deviceIds: string,
        replaceModelId?: string,
        comment?: string,
        timeout = 3600,
        // eslint-disable-next-line @typescript-eslint/ban-types
        callback?: Function
    ) {
        Logger.info('deployByConfigurationWaitResponse');
        let valid = true;
        try {
            const validate = ajv.compile(this.schema);
            valid = validate({
                configId,
                deviceIds,
                replaceModelId,
                comment,
                timeout,
            });
            if (!valid) {
                Logger.error(`${validate.errors}`);
                throw validate.errors;
            }

            const loopTimeOut = new Date();
            loopTimeOut.setHours(loopTimeOut.getHours() + timeout);
            const returnDeployByConfigurationWaitResponseAllDeviceIds: any = [];
            const deviceIdList = !deviceIds
                ? []
                : deviceIds
                      // eslint-disable-next-line indent
                      .trim()
                      .replace(/,$/, '')
                      .split(',')
                      .map((item: string) => item.trim());
            let returnDeployByConfigurationWaitResponse = {};
            this.getDeployHistoryObj = new GetDeployHistory(this.config);
            this.deployByConfigObj = new DeployByConfiguration(this.config);
            const alwaysTrue = true;
            let count = 0;
            const deployStartTime = new Date().getTime();
            const returnDeployByConfiguration: any =
                await this.deployByConfigObj.deployByConfiguration(
                    configId,
                    deviceIds,
                    replaceModelId,
                    comment
                );
            if (
                'data' in returnDeployByConfiguration &&
                returnDeployByConfiguration.data['result'] === 'SUCCESS'
            ) {
                // Wait till deployment status is failed or success
                while (alwaysTrue) {
                    //  Check deployment status for individual deviceId
                    for (const deviceId of deviceIdList) {
                        let deployStatus;
                        // get deploy history for all devices
                        const returnGetDeployHistory: any =
                            await this.getDeployHistoryObj.getDeployHistory(
                                deviceId
                            );
                        if (returnGetDeployHistory.data) {
                            /**
                             * loop through all deploy configurations to check the deploy status
                             * of `configId` passed as parameter
                             */
                            for (const deploys of returnGetDeployHistory.data[
                                'deploys'
                            ]) {
                                const getConfigId = deploys['config_id'];
                                if (getConfigId === configId) {
                                    deployStatus = deploys['total_status'];

                                    /**
                                     * Check if the device_id is not present in global array,
                                     * Then, add the first occurence of device_id to the
                                     * global array.
                                     */
                                    const foundData =
                                        this.deployCallbackStatusArray.find(
                                            (item) => deviceId in item
                                        );

                                    if (!foundData) {
                                        this.setValues(deviceId, deployStatus);
                                    } else {
                                        /**
                                         * Check whether it's first occurence
                                         * Then update status of the added device to
                                         * the global array
                                         */
                                        this.setValues(deviceId, deployStatus);
                                    }

                                    /**
                                     * Check whether the deployment for requested device_id updated
                                     * if deployment status is completed successfully or failed,
                                     * prepare response with required information
                                     */
                                    if (
                                        [
                                            DeployByConfigurationStatus.SUCCESSFUL,
                                            DeployByConfigurationStatus.FAILED,
                                            DeployByConfigurationStatus.DEVICEAPP_UNDEPLOY,
                                            DeployByConfigurationStatus.CANCELED,
                                        ].includes(deployStatus)
                                    ) {
                                        returnDeployByConfigurationWaitResponse =
                                            {};
                                        /**
                                         * deployment status is completed successfully,
                                         * prepare response with required information
                                         */
                                        if (
                                            deployStatus ===
                                            DeployByConfigurationStatus.SUCCESSFUL
                                        ) {
                                            returnDeployByConfigurationWaitResponse[
                                                'result'
                                            ] = 'SUCCESS';
                                        }
                                        /**
                                         * deployment status is failed, prepare response
                                         * with required information
                                         */
                                        if (
                                            deployStatus ===
                                            DeployByConfigurationStatus.FAILED
                                        ) {
                                            returnDeployByConfigurationWaitResponse[
                                                'result'
                                            ] = 'ERROR';
                                        }
                                        /**
                                         * deployment status is failed, prepare response
                                         * with required information
                                         */
                                        if (
                                            deployStatus ===
                                            DeployByConfigurationStatus.CANCELED
                                        ) {
                                            returnDeployByConfigurationWaitResponse[
                                                'result'
                                            ] = 'ERROR';
                                        }
                                        /**
                                         * deployment status is failed, prepare response
                                         * with required information
                                         */
                                        if (
                                            deployStatus ===
                                            DeployByConfigurationStatus.DEVICEAPP_UNDEPLOY
                                        ) {
                                            returnDeployByConfigurationWaitResponse[
                                                'result'
                                            ] = 'ERROR';
                                        }
                                        returnDeployByConfigurationWaitResponse[
                                            'device_id'
                                        ] = deviceId;
                                        const deployEndTime =
                                            new Date().getTime();
                                        const deployTimeSeconds =
                                            deployEndTime - deployStartTime;
                                        // convert seconds to "HH:MM:SS" format
                                        const totalDeployTimeStr = new Date(
                                            deployTimeSeconds
                                        )
                                            .toISOString()
                                            .substring(11, 8);
                                        returnDeployByConfigurationWaitResponse[
                                            'process_time'
                                        ] = totalDeployTimeStr;

                                        /**
                                         * append the respective deviceId's deployByConfigurationWaitResponse
                                         * to the array returnDeployByConfigurationWaitResponseAllDeviceIds
                                         */
                                        returnDeployByConfigurationWaitResponseAllDeviceIds.push(
                                            returnDeployByConfigurationWaitResponse
                                        );
                                        count += 1;
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    // Update Callback function
                    if (callback) {
                        callback(this.deployCallbackStatusArray);
                    }
                    // Break the loop, if the deployment for all device_ids updated
                    if (count === deviceIdList.length) {
                        break;
                    }
                    /**
                     * stop while loop, if deployment is taking more than
                     * `loopTimeout` (in minutes)
                     */
                    const currentTime = new Date();
                    if (currentTime >= loopTimeOut) {
                        break;
                    }
                }
                return returnDeployByConfigurationWaitResponseAllDeviceIds;
            }
            return returnDeployByConfiguration;
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
