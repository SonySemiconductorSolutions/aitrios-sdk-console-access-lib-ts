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
import { Config } from '../common/config';
import * as Logger from '../common/logger/logger';
import {
    ErrorCodes,
    genericErrorMessage,
    validationErrorMessage,
} from '../common/errorCodes';
import { getMessage } from '../common/logger/getMessage';
import { DeployDeviceApp } from './deployDeviceApp';
import { GetDeviceAppDeploys } from './getDeviceAppDeploys';

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv);

/**
 * Deploy Device App Enum Status
 *
 */
export enum DeployDeviceAppStatus {
    // eslint-disable-next-line no-unused-vars
    DEPLOYING = '0',
    // eslint-disable-next-line no-unused-vars
    DEPLOYMENT_DONE = '1',
    // eslint-disable-next-line no-unused-vars
    DEPLOYMENT_FAILED = '2',
    // eslint-disable-next-line no-unused-vars
    DEPLOYMENT_CANCELED = '3',
}

/**
 * This class implements DeployDeviceAppWaitResponse API.
 */
export class DeployDeviceAppWaitResponse {
    config: Config;
    deployDeviceAppObj: DeployDeviceApp;
    getDeviceAppDeployStatusObj: GetDeviceAppDeploys;
    deployCallbackStatusArray = [];

    /**
     * Constructor Method for the class DeployDeviceAppWaitResponse
     * @param config Object of Config Class
     */
    constructor(config: Config) {
        this.config = config;
    }

    /**
    * Schema for API for DeployDeviceAppWaitResponse

    Args:
        Schema (object): Ajv JSON schema Validator
    */

    schema = {
        type: 'object',
        properties: {
            appName: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for appName',
                    isNotEmpty: 'appName required or can\'t be empty string',
                },
            },
            versionNumber: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for versionNumber',
                    isNotEmpty:
                        'versionNumber required or can\'t be empty string',
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
            deployParameter: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for deployParameter ',
                    isNotEmpty:
                        'deployParameter required or can\'t be empty string',
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

            callback: {
                type: 'object',
                errorMessage: {
                    type: 'Invalid return for callback ',
                },
            },
            required: ['appName', 'versionNumber', 'deviceIds'],
            additionalProperties: false,
            errorMessage: {
                required: {
                    appName: 'appName is required',
                    versionNumber: 'versionNumber is required',
                    deviceIds: 'deviceIds is required',
                },
            },
        },
    };

    /**
     * Update the device id deploy status information to global array
     * @param
     * - deviceId (str): Device ID, Case sensitive
     * - status (str, optional): The notified deployment status for that device_id.
     * - foundPosition (int, optional): index of the device id from devices array \
     *           of the ``get_device_app_deploys`` response. Defaults to 0.
     * - skip (int, optional): deploy status has captured, so skip for next iteration\
     *          inside the loop. Defaults to 0.
     */
    setValues(deviceId: string, status = '', foundPosition = 0, skip = 0) {
        if (deviceId) {
            const foundData = this.deployCallbackStatusArray.find(
                (item) => deviceId in item
            );
            if (foundData) {
                foundData[deviceId]['status'] = status;
                foundData[deviceId]['found_position'] = foundPosition;
                foundData[deviceId]['skip'] = skip;
            } else {
                this.deployCallbackStatusArray.push({
                    [deviceId]: { status, found_position: foundPosition, skip },
                });
            }
        }
    }

    /**
     * Get device id deploy status information from the global array
     * @param
     * - deviceId (str): Device ID, Case sensitive
     * @returns
     * - obj: if device ID found.
     * - undefined: if device ID not found.
     */
    getValues(deviceId: string) {
        const foundData = this.deployCallbackStatusArray.find(
            (item) => deviceId in item
        );
        return foundData[deviceId];
    }
    /**
     * deployDeviceAppWaitResponse -deploy and wait for completion
     * @params
     * - appName (str, required) : App name
     * - versionNumber (str, required) : App version
     * - deviceIds (str, required) : IDs of edge AI devices \
                Specify multiple device IDs separated by commas
    * - deployParameter (str, optional) : Deployment parameters \
                Base64 encoded string in Json format No parameters if not specified.
    * - comment (str, optional) : deploy comment \
                up to 100 characters \
                No comment if not specified.
    * - callback (function, optional) : A function handle of the form - \
                `deployDeviceAppCallback(deviceStatusArray)`, where `deviceStatusArray`\
                is the array of the dictionary for each device :
    * ```ts
    *                [
    *                    {
    *                        <deviceId> : {
    *                           "status":<status>,
    *                            "found_position":<foundPosition>,
    *                           "skip":<skip>
    *                        }
    *                    },
    *                ]
    * ```
                - `deviceId`: is device ID,
                - `status`: is the notified deployment status for that deviceId,
                - `found_position`: index of the device id from devices array of the \
                        `get_device_app_deploys` response
                - `skip`: deploy status has captured, so skip for next iteration \
                        inside the loop

                Callback function to check the deploying status with `getDeviceAppDeploys`,\
                and if not completed, call the callback function and notify the deploying status.
                If not specified, no callback notification.
     * @returns
     * - Object: table:: Success Response
                
            +-------------------+-------------------+------------+----------------------------+
            |  Level1           |  Level2           |  Type      |  Description               |
            +-------------------+-------------------+------------+----------------------------+
            |  `No_item_name`   |                   |  `array`   | deploy device app          |
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
     *    const appName = '__appName__';
     *    const versionNumber = '__versionNumber__';
     *    const deviceIds = '__deviceIds__';
     *    const deployParameter = '__deployParameter__';
     *    const comment = '__comment__';
     *    const callback = '__callback__';
     *    // callback is user defined function reference
     *    // function deployDeviceAppCallback(deployStatusArray):
     *    // Process callback received for the `deviceId` with `status`
     * 
     *    const response= await client.deployment.deployDeviceAppWaitResponse(appName, versionNumber, deviceIds, deployParameter, comment, callback);
     *  ```
    */

    async deployDeviceAppWaitResponse(
        appName: string,
        versionNumber: string,
        deviceIds: string,
        deployParameter?: string,
        comment?: string,
        // eslint-disable-next-line @typescript-eslint/ban-types
        callback?: Function
    ) {
        const valid = true;
        try {
            this.deployDeviceAppObj = new DeployDeviceApp(this.config);
            this.getDeviceAppDeployStatusObj = new GetDeviceAppDeploys(
                this.config
            );
            let returnDeployDeviceAppWaitResponse: any = {};
            const returnDeployDeviceAppWaitResponseAllDeviceIds = [];
            let count = 0;
            const deviceIdList = !deviceIds
                ? []
                : deviceIds
                    .trim()
                    .replace(/,$/, '')
                    .split(',')
                    .map((item: string) => item.trim());
            const deployDeviceAppStartTime = new Date().getTime();
            Logger.info('Deploying Device App... ');

            const returnDeployDeviceApp =
                await this.deployDeviceAppObj.deployDeviceApp(
                    appName,
                    versionNumber,
                    deviceIds,
                    deployParameter,
                    comment
                );

            if (
                'data' in returnDeployDeviceApp &&
                'result' in returnDeployDeviceApp.data &&
                returnDeployDeviceApp.data['result'] === 'SUCCESS'
            ) {
                // Wait till Deploy status is failed or success
                let deployDeviceAppStatus;
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    const returnGetDeviceAppDeployStatus: any =
                        await this.getDeviceAppDeployStatusObj.getDeviceAppDeploys(
                            appName,
                            versionNumber
                        );
                    // Check Get Device App Deploys Status is not undefined
                    if (returnGetDeviceAppDeployStatus.data) {
                        returnGetDeviceAppDeployStatus.data['deploys'].some(
                            (deployResponse, index) => {
                                const deployDeviceAppStatusJson =
                                    deployResponse['devices'];

                                // traverse device_id status from the "devices" array
                                deployDeviceAppStatusJson.some(
                                    (devicesIdIndex) => {
                                        deployDeviceAppStatus =
                                            devicesIdIndex['status'];
                                        const devicesIdFromResponse =
                                            devicesIdIndex['device_id'];

                                        //check if the deviceId is present in user provided devices list
                                        if (
                                            deviceIdList.includes(
                                                devicesIdFromResponse
                                            )
                                        ) {
                                            /**
                                             * Check if the device_id is not present in global array,
                                             * Then, add the first occurence of device_id to the
                                             * global array.
                                             * Set found_position of the first occurence of device_id
                                             * to the global array
                                             */
                                            const foundData =
                                                this.deployCallbackStatusArray.find(
                                                    (item) =>
                                                        devicesIdFromResponse in
                                                        item
                                                );

                                            if (!foundData) {
                                                this.setValues(
                                                    devicesIdFromResponse,
                                                    deployDeviceAppStatus,
                                                    index + 1
                                                );
                                            } else if (
                                                foundData &&
                                                this.deployCallbackStatusArray
                                                    .length !== 0
                                            ) {
                                                const arrayDeviceJson =
                                                    this.getValues(
                                                        devicesIdFromResponse
                                                    );

                                                const foundPosition =
                                                    arrayDeviceJson[
                                                        'found_position'
                                                    ];

                                                const skip =
                                                    arrayDeviceJson['skip'];
                                                /**
                                                 * Check whether it's first occurence
                                                 * Then Add status of the added device to
                                                 * the global array
                                                 */

                                                if (
                                                    index === foundPosition &&
                                                    skip === 0
                                                ) {
                                                    this.setValues(
                                                        devicesIdFromResponse,
                                                        deployDeviceAppStatus,
                                                        foundPosition,
                                                        skip
                                                    );
                                                    /**
                                                     * if deployment status is canceled,
                                                     * completed successfully or failed,
                                                     * then set the skip value as 1 of the respective
                                                     * device in global array
                                                     * and prepare response with required information
                                                     */
                                                    if (
                                                        [
                                                            DeployDeviceAppStatus.DEPLOYMENT_DONE,
                                                            DeployDeviceAppStatus.DEPLOYMENT_CANCELED,
                                                            DeployDeviceAppStatus.DEPLOYMENT_FAILED,
                                                        ].includes(
                                                            deployDeviceAppStatus
                                                        )
                                                    ) {
                                                        /**
                                                         * Set the skip value as 1 of the respective
                                                         * device in global array
                                                         */
                                                        this.setValues(
                                                            devicesIdFromResponse,
                                                            deployDeviceAppStatus,
                                                            foundPosition,
                                                            1
                                                        );

                                                        /**
                                                         * Fill Response information for selected
                                                         * device_id
                                                         */
                                                        returnDeployDeviceAppWaitResponse =
                                                            {};
                                                        // result
                                                        if (
                                                            deployDeviceAppStatus ===
                                                            DeployDeviceAppStatus.DEPLOYMENT_FAILED
                                                        ) {
                                                            returnDeployDeviceAppWaitResponse[
                                                                'result'
                                                            ] = 'FAILED';
                                                        }
                                                        if (
                                                            deployDeviceAppStatus ===
                                                            DeployDeviceAppStatus.DEPLOYMENT_DONE
                                                        ) {
                                                            returnDeployDeviceAppWaitResponse[
                                                                'result'
                                                            ] = 'SUCCESS';
                                                        }
                                                        if (
                                                            deployDeviceAppStatus ===
                                                            DeployDeviceAppStatus.DEPLOYMENT_CANCELED
                                                        ) {
                                                            returnDeployDeviceAppWaitResponse[
                                                                'result'
                                                            ] = 'CANCELED';
                                                        }
                                                        // "deviceId"
                                                        returnDeployDeviceAppWaitResponse[
                                                            'device_id'
                                                        ] =
                                                            devicesIdFromResponse;
                                                        const deployDeviceAppEndTime =
                                                            new Date().getTime();
                                                        const deployDeviceAppTimeSeconds =
                                                            deployDeviceAppEndTime -
                                                            deployDeviceAppStartTime;
                                                        // convert seconds to "HH:MM:SS" format
                                                        const totalDeployDeviceAppTimeStr =
                                                            new Date(
                                                                deployDeviceAppTimeSeconds
                                                            )
                                                                .toISOString()
                                                                .substring(
                                                                    11,
                                                                    8
                                                                );
                                                        returnDeployDeviceAppWaitResponse[
                                                            'process_time'
                                                        ] =
                                                            totalDeployDeviceAppTimeStr;
                                                        /**
                                                         * append the respective device_id's
                                                         * deploy_by_configuration_wait_response
                                                         * to the array
                                                         * _return_deploy_device_app_wait_response_all_device_ids
                                                         */
                                                        returnDeployDeviceAppWaitResponseAllDeviceIds.push(
                                                            returnDeployDeviceAppWaitResponse
                                                        );

                                                        count += 1;
                                                    }
                                                }
                                            }
                                        }
                                        return deviceIdList.length === count;
                                    }
                                );

                                return deviceIdList.length === count;
                            }
                        );
                    }
                    // Update Callback function
                    if (callback) {
                        callback(this.deployCallbackStatusArray);
                    }

                    // break the main loop if all device ids are updated
                    if (deviceIdList.length === count) {
                        break;
                    }
                }
                return returnDeployDeviceAppWaitResponseAllDeviceIds;
            }
            return returnDeployDeviceApp;
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
