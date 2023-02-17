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
import { ErrorCodes, genericErrorMessage } from '../common/errorCodes';
import { Config } from '../common/config';

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv);

/**
 * This class implements GetDeviceApps API.
 */
export class GetDeviceApps {
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

    /**
     * getDeviceApps - Get device apps.
     * @returns
     * - Object: table:: Success Response

            +----------+-------------+------------+------------------------------------------+
            |  Level1  |  Level2     |  Type      |  Description                             |
            +----------+-------------+------------+------------------------------------------+
            |  `apps`  |             |  `array`   | App array                                |
            +----------+-------------+------------+------------------------------------------+
            |          |  `name`     |   `string` | App name                                 |
            +----------+-------------+------------+------------------------------------------+
            |          |  `versions` |  `array`   | Refer : Table : 1.0                      |
            |          |             |            | for more details                         |
            +----------+-------------+------------+------------------------------------------+
          
        @Table : 1.0 - versions schema details
          
            +-------------------+--------------------+------------+-------------------+
            |  Level1           |  Level2            |  Type      |  Description      |
            +-------------------+--------------------+------------+-------------------+
            |  `versions`       |                    |  `array`   |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |  `version`         |   `string` |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |  `compiled_flg`    |   `string` | 0: Uncompiled     |
            |                   |                    |            | (compile process) |
            |                   |                    |            |                   |
            |                   |                    |            | 1: Compiled (no   |
            |                   |                    |            | compilation       |
            |                   |                    |            | process)          |
            +-------------------+--------------------+------------+-------------------+
            |                   |  `status`          |   `string` | 0: Before         |
            |                   |                    |            | compilation       |
            |                   |                    |            |                   |
            |                   |                    |            | 1: Compiling      |
            |                   |                    |            | 2: Successful     |
            |                   |                    |            | 3: Failed         |
            +-------------------+--------------------+------------+-------------------+
            |                   |  `comment`         |   `string` |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |  `deploy_count`    |   `string` |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |   `ins_id`         |  `string`  | App Version       |
            |                   |                    |            | Author            |
            +-------------------+--------------------+------------+-------------------+
            |                   |   `ins_date`       |  `string`  | Date and time the |
            |                   |                    |            | app version was   |
            |                   |                    |            | created           |
            +-------------------+--------------------+------------+-------------------+
            |                   |   `upd_id`         |  `string`  | App version       |
            |                   |                    |            | updated by        |
            +-------------------+--------------------+------------+-------------------+
            |                   |   `upd_date`       |  `string`  | Date and time the |
            |                   |                    |            | app version was   |
            |                   |                    |            | updated           |
            +-------------------+--------------------+------------+-------------------+

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
     *    const response= await client.deployment.getDeviceApps();
     */
    async getDeviceApps() {
        Logger.info('getDeviceApps');
        try {
            const accessToken= await this.config.getAccessToken();
            const baseOptions= await this.config.setOption();

            const apiConfig = new Configuration({
                basePath: this.config.consoleEndpoint,
                accessToken,
                baseOptions
            });
            this.api = new DeviceAppApi(apiConfig);

            const res = await this.api.getDeviceApps();
            return res;
        } catch (error) {
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
