/*
 * Copyright 2021, 2022, 2023 Sony Semiconductor Solutions Corp.
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
     * getDeviceApps - Get the device app list information.
     * @returns
     * - Object: table:: Success Response

            +----------+-------------+------------+------------------------------------------+
            | *Level1* | *Level2*    | *Type*     | *Description*                            |
            +==========+=============+============+==========================================+
            | ``apps`` |             | ``array``  |                                          |
            +----------+-------------+------------+------------------------------------------+
            |          | ``name``    | ``string`` | Set the app name.                        |
            +----------+-------------+------------+------------------------------------------+
            |          |``create_by``| ``string`` | Set the create_by.                       |
            |          |             |            |                                          |
            |          |             |            | - Value definition                       |
            |          |             |            |                                          |
            |          |             |            | Self: Self-training models               |
            |          |             |            |                                          |
            |          |             |            | Marketplace: Marketplace purchacing model|
            +----------+-------------+------------+------------------------------------------+
            |          |``package_   | ``string`` | Set the marketplace package ID.          |
            |          |id``         |            |                                          |
            +----------+-------------+------------+------------------------------------------+
            |          |``product    | ``string`` | Set the marketplace product ID.          |
            |          |_id``        |            |                                          |
            +----------+-------------+------------+------------------------------------------+
            |          |``schema_    | ``array``  | Refer : Table : 1.0                      |
            |          |info``       |            | for more details                         |
            +----------+-------------+------------+------------------------------------------+
            |          |``versions`` | ``array``  | Refer : Table : 1.1                      |
            |          |             |            | for more details                         |
            +----------+-------------+------------+------------------------------------------+

            @Table : 1.0 - schema_info schema details

            +-------------------+-----------------+------------+-------------------------------+
            | *Level1*          | *Level2*        | *Type*     | *Description*                 |
            +===================+=================+============+===============================+
            | ``schema_info``   |                 | ``array``  | Schema info.                  |
            +-------------------+-----------------+------------+-------------------------------+
            |                   | ``VnSAppId``    | ``string`` | Set the VnS app ID            |
            +-------------------+-----------------+------------+-------------------------------+
            |                   | ``version``     | ``string`` | Set the app version no.       |
            +-------------------+-----------------+------------+-------------------------------+
            |                   | ``interfaces``  | ``array``  |Refer : Table : 1.2            |
            |                   |                 |            |for more details               |
            +-------------------+-----------------+------------+-------------------------------+

            @Table : 1.2 - interfaces schema details

            +-------------------+-----------------+------------+-------------------------------+
            | *Level1*          | *Level2*        | *Type*     | *Description*                 |
            +===================+=================+============+===============================+
            | ``interfaces``    |                 | ``array``  | Set the metadata format IDs.  |
            +-------------------+-----------------+------------+-------------------------------+
            |                   | ``in``          | ``array``  | Refer : Table : 1.3           |
            |                   |                 |            | for more details              |
            +-------------------+-----------------+------------+-------------------------------+

            @Table : 1.3 - in schema details

            +-------------------+-----------------+------------+-------------------------------+
            | *Level1*          | *Level2*        | *Type*     | *Description*                 |
            +===================+=================+============+===============================+
            | ``in``            |                 | ``array``  |                               |
            +-------------------+-----------------+------------+-------------------------------+
            |                   |``metadata       | ``string`` | Set the metadata format ID.   |
            |                   |FormatId``       |            |                               |
            +-------------------+-----------------+------------+-------------------------------+

            @Table : 1.1 - versions schema details

            +-------------------+--------------------+------------+-------------------+
            | *Level1*          | *Level2*           | *Type*     | *Description*     |
            +===================+====================+============+===================+
            | ``versions``      |                    | ``array``  |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   | ``version``        | ``string`` | Set the app       |
            |                   |                    |            | version number.   |
            +-------------------+--------------------+------------+-------------------+
            |                   | ``compiled_flg``   | ``string`` | Set the compiled  |
            |                   |                    |            | flg.              |
            |                   |                    |            |                   |
            |                   |                    |            | - Value definition|
            |                   |                    |            |                   |
            |                   |                    |            | 0 : Specified App |
            |                   |                    |            | is not compiled   |
            |                   |                    |            |                   |
            |                   |                    |            | 1 : Specified App |
            |                   |                    |            | is compiled       |
            +-------------------+--------------------+------------+-------------------+
            |                   | ``status``         | ``string`` | Set the status.   |
            |                   |                    |            |                   |
            |                   |                    |            | - Value definition|
            |                   |                    |            |                   |
            |                   |                    |            | 0: before         |
            |                   |                    |            | compilation       |
            |                   |                    |            |                   |
            |                   |                    |            | 1: during         |
            |                   |                    |            | compilation       |
            |                   |                    |            |                   |
            |                   |                    |            | 2: successful     |
            |                   |                    |            |                   |
            |                   |                    |            | 3: failed         |
            +-------------------+--------------------+------------+-------------------+
            |                   | ``comment``        | ``string`` | Set the comment.  |
            +-------------------+--------------------+------------+-------------------+
            |                   | ``deploy_count``   | ``string`` | Set the deploy    |
            |                   |                    |            | count.            |
            +-------------------+--------------------+------------+-------------------+
            |                   |  ``ins_id``        |``string``  | Set the settings  |
            |                   |                    |            | author.           |
            +-------------------+--------------------+------------+-------------------+
            |                   |  ``ins_date``      |``string``  | Set the date the  |
            |                   |                    |            | settings were     |
            |                   |                    |            | created.          |
            +-------------------+--------------------+------------+-------------------+
            |                   |  ``upd_id``        |``string``  | Set the settings  |
            |                   |                    |            | updater.          |
            +-------------------+--------------------+------------+-------------------+
            |                   |  ``upd_date``      |``string``  | Set the date the  |
            |                   |                    |            | settings were     |
            |                   |                    |            | updated.          |
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
     *    const applicationId: '__applicationId__';
     *    const config = new Config(consoleEndpoint,portalAuthorizationEndpoint,
     *                              clientId, clientSecret, applicationId);
     *
     *    const client = await Client.createInstance(config);
     *    const response= await client.deployment.getDeviceApps();
     */
    async getDeviceApps() {
        Logger.info('getDeviceApps');
        try {
            const accessToken = await this.config.getAccessToken();
            const baseOptions = await this.config.setOption();

            const apiConfig = new Configuration({
                basePath: this.config.consoleEndpoint,
                accessToken,
                baseOptions
            });
            this.api = new DeviceAppApi(apiConfig);

            let res;
            if (this.config.applicationId) {
                res = await this.api.getDeviceApps('client_credentials');
            } else {
                res = await this.api.getDeviceApps();
            }
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
