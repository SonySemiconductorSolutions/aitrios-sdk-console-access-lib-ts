/*
 * Copyright 2021 Sony Semiconductor Solutions Corp.
 *
 * This is UNPUBLISHED PROPRIETARY SOURCE CODE of Sony Semiconductor Solutions Corp.
 * No part of this file may be copied, modified, sold, and distributed in any
 * form or by any means without prior explicit permission in writing from
 * Sony Semiconductor Solutions Corp.
 *
 */

import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import { DeviceAppApi, Configuration } from 'js-client';
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
 * This class implements GetDeviceAppDeploys API
 */
export class GetDeviceAppDeploys {
    config: Config;
    ajv = new Ajv();
    api: DeviceAppApi;

    /**
     * Constructor Method for the class GetDeviceAppDeploys
     * @param config Object of Config Class
     */
    constructor(config: Config) {
        this.config = config;
    }

    /**
    * Schema for getDeviceAppDeploys.

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
        },
        required: ['appName', 'versionNumber'],
        additionalProperties: false,
        errorMessage: {
            required: {
                appName: 'appName is required',
                versionNumber: 'versionNumber is required',
            },
        },
    };

    /**
     * getDeviceAppDeploys - Get Device app Deployment History.
     *  @params
     * - appName (str, required) - Set the App name
     * - versionNumber (str, required) - Set the App version
     * @returns
     * - Object: table:: Success Response

            +-----------+----------------------+------------+------------------------+
            |  Level1   |  Level2              |  Type      |  Description           |
            +-----------+----------------------+------------+------------------------+
            | `deploy`  |                      |  `array`   | Descending order of    |
            |           |                      |            | ins_date               |
            +-----------+----------------------+------------+------------------------+
            |           |  `id`                |  `number`  |                        |
            +-----------+----------------------+------------+------------------------+
            |           |  `total_status`      |  `string`  | 0: Running             |
            |           |                      |            | 1: Normal              |
            |           |                      |            | 2: Failure             |
            |           |                      |            | 3: Cancellation        |
            +-----------+----------------------+------------+------------------------+
            |           | `deploy_parameter`   |  `dict`    |                        |
            +-----------+----------------------+------------+------------------------+
            |           | `devices`            |  `array`   |  Refer : Table : 1.0   |
            |           |                      |            |  for more details      |
            +-----------+----------------------+------------+------------------------+
            |           | `ins_id`             |  `string`  |                        |
            +-----------+----------------------+------------+------------------------+
            |           | `ins_date`           |  `string`  |                        |
            +-----------+----------------------+------------+------------------------+
            |           | `upd_id`             |  `string`  |                        |
            +-----------+----------------------+------------+------------------------+
            |           | `upd_date`           |  `string`  |                        |
            +-----------+----------------------+------------+------------------------+
                        
    @Table : 1.0 - `devices` schema details
            
            +-------------------+-----------------+------------+--------------------------+
            |  Level1           |  Level2         |  Type      |  Description             |
            +-------------------+-----------------+------------+--------------------------+
            | `devices`         |                 |  `array`   | Ascending order of       |
            |                   |                 |            | device IDs               |
            +-------------------+-----------------+------------+--------------------------+
            |                   | `device_id`     |  `string`  |                          |
            +-------------------+-----------------+------------+--------------------------+
            |                   | `status`        |  `string`  | 0: Running               |
            |                   |                 |            | 1: Successful            |
            |                   |                 |            | 2: Failed                |
            |                   |                 |            | 3: Canceled              |
            |                   |                 |            | Cancellation supplement  |
            |                   |                 |            | During deployment, if    |
            |                   |                 |            | the device is deleted,it |
            |                   |                 |            | will be in this status   |
            +-------------------+-----------------+------------+--------------------------+
            |                   | `latest_        |  `string`  | 0: Not Latest            |
            |                   |deployment_flg`  |            |                          |
            |                   |                 |            | 1: Latest                |
            +-------------------+-----------------+------------+--------------------------+

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
     *    const config = new Config(consoleEndpoint, portalAuthorizationEndpoint, clientId, clientSecret);
     *
     *    const client = await Client.createInstance(config);
     *    const appName = '__appName__';
     *    const versionNumber = '__versionNumber__';
     *    const response= await client.deployment.getDeviceAppDeploys(appName, versionNumber);
     */
    async getDeviceAppDeploys(appName: string, versionNumber: string) {
        Logger.info('getDeviceAppDeploys');
        let valid = true;
        try {
            const validate = ajv.compile(this.schema);
            valid = validate({
                appName: appName,
                versionNumber: versionNumber,
            });
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
            this.api = new DeviceAppApi(apiConfig);

            const res = await this.api.getDeviceAppDeploys(
                appName,
                versionNumber
            );
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
