/* eslint-disable @typescript-eslint/ban-types */
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

import { ImportDeviceApp } from './importDeviceApp';
import { DeleteDeviceApp } from './deleteDeviceApp';
import { GetDeviceApps } from './getDeviceApps';
import { Config } from '../common/config';
import { CancelDeployment } from './cancelDeployment';
import { DeleteDeployConfiguration } from './deleteDeployConfiguration';
import { DeployDeviceApp } from './deployDeviceApp';
import { UndeployDeviceApp } from './undeployDeviceApp';
import { CreateDeployConfiguration } from './createDeployConfiguration';
import { DeployByConfiguration } from './deployByConfiguration';
import { GetDeployConfigurations } from './getDeployConfigurations';
import { GetDeployHistory } from './getDeployHistory';
import { GetDeviceAppDeploys } from './getDeviceAppDeploys';
import { DeployByConfigurationWaitResponse } from './deployByConfigurationWaitResponse';
import { DeployDeviceAppWaitResponse } from './deployDeviceAppWaitResponse';

/**
 * This Class provide all access of all methods which is related to Deployment
 */
export class Deployment {
    /**
     * @ignorea
     */
    config: Config;
    importDeviceAppObj: ImportDeviceApp;
    deleteDeviceAppObj: DeleteDeviceApp;
    getDeviceAppsObj: GetDeviceApps;
    cancelDeploymentObj: CancelDeployment;
    deleteDeployConfigurationObj: DeleteDeployConfiguration;
    deployDeviceAppObj: DeployDeviceApp;
    undeployDeviceAppObj: UndeployDeviceApp;
    createDeployConfigurationObj: CreateDeployConfiguration;
    deployByConfigurationObj: DeployByConfiguration;
    getDeployConfigurationsObj: GetDeployConfigurations;
    getDeployHistoryObj: GetDeployHistory;
    getDeviceAppDeploysObj: GetDeviceAppDeploys;
    deployByConfigurationWaitResponseObj: DeployByConfigurationWaitResponse;
    deployDeviceAppWaitResponseObj: DeployDeviceAppWaitResponse;

    constructor(config: Config) {
        this.config = config;
        this.importDeviceAppObj = new ImportDeviceApp(this.config);
        this.deleteDeviceAppObj = new DeleteDeviceApp(this.config);
        this.getDeviceAppsObj = new GetDeviceApps(this.config);
        this.cancelDeploymentObj = new CancelDeployment(this.config);
        this.deleteDeployConfigurationObj = new DeleteDeployConfiguration(this.config);
        this.deployDeviceAppObj = new DeployDeviceApp(this.config);
        this.undeployDeviceAppObj = new UndeployDeviceApp(this.config);
        this.createDeployConfigurationObj = new CreateDeployConfiguration(this.config);
        this.deployByConfigurationObj = new DeployByConfiguration(this.config);
        this.getDeployConfigurationsObj = new GetDeployConfigurations(this.config);
        this.getDeployHistoryObj = new GetDeployHistory(this.config);
        this.getDeviceAppDeploysObj = new GetDeviceAppDeploys(this.config);
        this.deployByConfigurationWaitResponseObj = new DeployByConfigurationWaitResponse(this.config);
        this.deployDeviceAppWaitResponseObj = new DeployDeviceAppWaitResponse(this.config);
    }

    /**
     * importDeviceApp - Import Device app.
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
     * - entryPoint (str, optional): App entry point. Default: ppl
     * - comment (str, optional): Comment. *Max. 100 characters.
     * - schemaInfo (object, optional): Schema info.
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
     */
    importDeviceApp(
        compiledFlg: string,
        appName: string,
        versionNumber: string,
        fileName: string,
        fileContent: string,
        entryPoint?: string,
        comment?: string,
        schemaInfo?: object
    ) {
        const response = this.importDeviceAppObj.importDeviceApp(
            compiledFlg,
            appName,
            versionNumber,
            fileName,
            fileContent,
            entryPoint,
            comment,
            schemaInfo
        );
        return response;
    }

    /**
     * deleteDeviceApp - Delete device app.
     * @params
     * - appName (str, required) - App name.
     * - versionNumber (str, required) - App version number.
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
     */
    deleteDeviceApp(appName: string, versionNumber: string) {
        const response = this.deleteDeviceAppObj.deleteDeviceApp(appName, versionNumber);
        return response;
    }

    /**
     * getDeviceApps -  Get the device app list information.
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
     */
    getDeviceApps() {
        const response = this.getDeviceAppsObj.getDeviceApps();
        return response;
    }

    /**
     * createDeployConfiguration - Register the deploy config information to deploy \
     *                             to the following Edge Devices. \
     *                              - Firmware \
     *                              - AIModel.
     * @params
     * - configId (str, required) : Max. 20 single characters, single-byte characters only.
     * - comment (str, optional) : Max. 100 characters. Default: ''
     * - sensorLoaderVersionNumber (str, optional) : Sensor loader version number. Default: ''
     * - sensorVersionNumber (str, optional) : Sensor version number. Default: ''
     * - modelId (str, optional) : Model ID. Default: ''
     * - modelVersionNumber (str, optional) : Model version number. Default: ''
     * - apFwVersionNumber (str, optional) : AppFw version number. Default: ''
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
     */
    createDeployConfiguration(
        configId: string,
        comment?: string,
        sensorLoaderVersionNumber?: string,
        sensorVersionNumber?: string,
        modelId?: string,
        modelVersionNumber?: string,
        apFwVersionNumber?: string
    ) {
        const response =
            this.createDeployConfigurationObj.createDeployConfiguration(
                configId,
                comment,
                sensorLoaderVersionNumber,
                sensorVersionNumber,
                modelId,
                modelVersionNumber,
                apFwVersionNumber
            );
        return response;
    }

    /**
     * deployByConfiguration - Provide a function for deploying the following to Edge Devices \
     *                          specified with deploy config. \
     *                          - Firmware \
     *                          - AIModel
     * @params
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
     */

    deployByConfiguration(
        configId: string,
        deviceIds: string,
        replaceModelId?: string,
        comment?: string
    ) {
        const response = this.deployByConfigurationObj.deployByConfiguration(
            configId,
            deviceIds,
            replaceModelId,
            comment
        );
        return response;
    }

    /**
     * getDeployConfigurations - Get the deploy config list.
     * @returns
     * - Object: table:: Success Response

            +-----------------+------------+------------+---------------------------------+
            | *Level1*        | *Level2*   | *Type*     | *Description*                   |
            +=================+============+============+=================================+
            |``deploy_        |            | ``array``  |                                 |
            |configurations`` |            |            |                                 |
            +-----------------+------------+------------+---------------------------------+
            |                 |``config_   | ``string`` | Set the config ID.              |
            |                 |id``        |            |                                 |
            +-----------------+------------+------------+---------------------------------+
            |                 |``device_   | ``string`` | Set the device type.            |
            |                 |type``      |            |                                 |
            +-----------------+------------+------------+---------------------------------+
            |                 |``config_   | ``string`` | Set the config comment.         |
            |                 |comment``   |            |                                 |
            +-----------------+------------+------------+---------------------------------+
            |                 |``running_  | ``number`` | Set the running cnt.            |
            |                 |cnt``       |            |                                 |
            +-----------------+------------+------------+---------------------------------+
            |                 |``success_  | ``number`` | Set the success cnt.            |
            |                 |cnt``       |            |                                 |
            +-----------------+------------+------------+---------------------------------+
            |                 |``fail_cnt``| ``number`` | Set the fail cnt.               |
            +-----------------+------------+------------+---------------------------------+
            |                 |``firmware``| ``array``  | Refer : Table : 1.0             |
            |                 |            |            | for more details                |
            +-----------------+------------+------------+---------------------------------+
            |                 |``model``   | ``array``  | Refer : Table : 1.1             |
            |                 |            |            | for more details                |
            +-----------------+------------+------------+---------------------------------+
            |                 |``custom_   |            |                                 |
            |                 |setting``   |            |                                 |
            +-----------------+------------+------------+---------------------------------+
            |                 |``ins_id``  | ``string`` | Set the deployment author.      |
            +-----------------+------------+------------+---------------------------------+
            |                 |``ins_date``| ``string`` | Set the date the deployment     |
            |                 |            |            | were created.                   |
            +-----------------+------------+------------+---------------------------------+
            |                 |``upd_id``  | ``string`` | Set the deployment updater.     |
            +-----------------+------------+------------+---------------------------------+
            |                 |``upd_date``| ``string`` | Set the date the deployment     |
            |                 |            |            | were updated.                   |
            +-----------------+------------+------------+---------------------------------+

            @Table : 1.0 - firmware schema details

            +-------------------+--------------------+------------+-------------------+
            | *Level1*          | *Level2*           | *Type*     | *Description*     |
            +===================+====================+============+===================+
            | ``firmware``      |                    | ``array``  |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_loader_    | ``string`` | Set the sensor    |
            |                   |file_name``         |            | loader filename.  |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_loader_    | ``string`` | Set the sensor    |
            |                   |version_number``    |            | loader version    |
            |                   |                    |            | number.           |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_loader_    | ``string`` | Set the sensor    |
            |                   |firmware_comment``  |            | loader firmware   |
            |                   |                    |            | comment.          |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_file_name``| ``string`` | Set the sensor    |
            |                   |                    |            | filename.         |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_           | ``string`` | Set the sensor    |
            |                   |version_number``    |            | version number.   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_           |``string``  | Set the sensor    |
            |                   |firmware_comment``  |            | firmware comment. |
            +-------------------+--------------------+------------+-------------------+
            |                   |``apfw_file_name``  |``string``  | Set the apfw      |
            |                   |                    |            | filename.         |
            +-------------------+--------------------+------------+-------------------+
            |                   |``apfw_version_     |``string``  | Set the apfw      |
            |                   |number``            |            | version number.   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``apfw_firmware_    |``string``  | Set the apfw      |
            |                   |comment``           |            | firmware comment. |
            +-------------------+--------------------+------------+-------------------+

            @Table : 1.1 - model schema details

            +-------------------+--------------------+------------+-------------------+
            | *Level1*          | *Level2*           | *Type*     | *Description*     |
            +===================+====================+============+===================+
            | ``model``         |                    | ``array``  |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   | ``model_id``       | ``string`` | Set the model ID. |
            +-------------------+--------------------+------------+-------------------+
            |                   |``model_            | ``string`` | Set the model     |
            |                   |version_number``    |            | version number.   |
            +-------------------+--------------------+------------+-------------------+
            |                   | ``model_comment``  | ``string`` | Set the model     |
            |                   |                    |            | comment.          |
            +-------------------+--------------------+------------+-------------------+
            |                   |``model_            | ``string`` | Set the model     |
            |                   |version_comment``   |            | version comment.  |
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
     */

    getDeployConfigurations() {
        const response = this.getDeployConfigurationsObj.getDeployConfigurations();
        return response;
    }

    /**
     * getDeployHistory - Get the deploy history for a specified Edge Device.
     * @params
     * - deviceId (str, required) - Device ID.
     * @returns
     * - Object: table:: Success Response
    
            +----------+----------------------+------------+-------------------------------+
            | *Level1* | *Level2*             | *Type*     | *Description*                 |
            +==========+======================+============+===============================+
            |``deploy  |                      | ``array``  |                               |
            |s``       |                      |            |                               |
            +----------+----------------------+------------+-------------------------------+
            |          | ``id``               | ``number`` | Deploy ID.                    |
            +----------+----------------------+------------+-------------------------------+
            |          | ``deploy_type``      | ``string`` | Set the deploy type.          |
            |          |                      |            | - Value definition            |
            |          |                      |            |                               |
            |          |                      |            | 0: Deploy config              |
            |          |                      |            |                               |
            |          |                      |            | 1: Device model               |
            |          |                      |            |                               |
            |          |                      |            | App: DeviceApp                |
            +----------+----------------------+------------+-------------------------------+
            |          |``deploy_status``     | ``string`` | Set the deploy status. Target |
            |          |                      |            | Edge Device deployment status.|
            |          |                      |            | - Value definition            |
            |          |                      |            |                               |
            |          |                      |            | 0: Deploying                  |
            |          |                      |            |                               |
            |          |                      |            | 1: Success                    |
            |          |                      |            |                               |
            |          |                      |            | 2: Fail                       |
            |          |                      |            |                               |
            |          |                      |            | 3: Cancel                     |
            |          |                      |            |                               |
            |          |                      |            | App: DeviceApp undeploy       |
            +----------+----------------------+------------+-------------------------------+
            |          |``update_progress``   | ``string`` | Set the update progress in    |
            |          |                      |            | percentage.                   |
            +----------+----------------------+------------+-------------------------------+
            |          |``deploy_comment``    | ``string`` | Set the deploy comment.       |
            +----------+----------------------+------------+-------------------------------+
            |          |  ``config_id``       | ``string`` | Set the deploy config ID.     |
            +----------+----------------------+------------+-------------------------------+
            |          |``replace_network_id``| ``string`` | Set the replace network ID.   |
            +----------+----------------------+------------+-------------------------------+
            |          | ``current_target``   | ``string`` | Set the current target.       |
            +----------+----------------------+------------+-------------------------------+
            |          |``total_status``      | ``string`` | Set the deploy status.        |
            |          |                      |            | Total status of Edge Devices  |
            |          |                      |            | deployed together.            |
            |          |                      |            | - Value definition            |
            |          |                      |            |                               |
            |          |                      |            | 0: Deploying                  |
            |          |                      |            |                               |
            |          |                      |            | 1: Success                    |
            |          |                      |            |                               |
            |          |                      |            | 2: Fail                       |
            |          |                      |            |                               |
            |          |                      |            | 3: Cancel                     |
            +----------+----------------------+------------+-------------------------------+
            |          | ``app_name``         | ``string`` | Set the app name.             |
            +----------+----------------------+------------+-------------------------------+
            |          | ``version_number``   | ``string`` | Set the version number.       |
            +----------+----------------------+------------+-------------------------------+
            |          | ``firmware``         | ``array``  |Refer : Table : 1.0            |
            |          |                      |            |for more details               |
            +----------+----------------------+------------+-------------------------------+

            @Table : 1.0 - firmware schema details

            +------------+--------------------+------------+-----------------------------------+
            | *Level1*   | *Level2*           | *Type*     | *Description*                     |
            +============+====================+============+===================================+
            |``firmware``|                    | ``array``  |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_loader_    | ``string`` | Set the deploy target flg.        |
            |            |target_flg``        |            | - Value definition                |
            |            |                    |            |                                   |
            |            |                    |            | 0: Not for deployment             |
            |            |                    |            |                                   |
            |            |                    |            | 1: Deployment target              |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_loader_    |``string``  | Set the deploy status.            |
            |            |status``            |            | - Value definition                |
            |            |                    |            |                                   |
            |            |                    |            | 0: Waiting                        |
            |            |                    |            |                                   |
            |            |                    |            | 1: Deploying                      |
            |            |                    |            |                                   |
            |            |                    |            | 2: Success                        |
            |            |                    |            |                                   |
            |            |                    |            | 3: Fail                           |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_loader_    |``number``  | Set the sensor loader retry count.|
            |            |retry_count``       |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_loader_    |``string``  | Set the sensor loader start date. |
            |            |start_date``        |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_loader_    | ``string`` | Set the sensor loader end date.   |
            |            |end_date``          |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_loader_    |``string``  | Set the sensor loader version     |
            |            |version_number``    |            | number.                           |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_loader_    |``string``  | Set the sensor loader version     |
            |            |version_comment``   |            | comment.                          |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_target_    |``string``  | Set the deploy target flg.        |
            |            |flg``               |            | - Value definition                |
            |            |                    |            |                                   |
            |            |                    |            | 0: Not for deployment             |
            |            |                    |            |                                   |
            |            |                    |            | 1: Deployment target              |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_status``   | ``string`` | Set the deploy status.            |
            |            |                    |            |                                   |
            |            |                    |            | - Value definition                |
            |            |                    |            |                                   |
            |            |                    |            | 0: Waiting                        |
            |            |                    |            |                                   |
            |            |                    |            | 1: Deploying                      |
            |            |                    |            |                                   |
            |            |                    |            | 2: Success                        |
            |            |                    |            |                                   |
            |            |                    |            | 3: Fail                           |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_retry_     |``number``  | Set the sensor retry count.       |
            |            |count``             |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_start_     |``string``  | Set the sensor start date.        |
            |            |date``              |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_end_date`` |``string``  | Set the sensor end date.          |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_version_   |``string``  | Set the sensor version number.    |
            |            |number``            |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``sensor_version_   |``string``  | Set the sensor version comment.   |
            |            |comment``           |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``apfw_target_flg`` |``string``  | Set the deploy target flg.        |
            |            |                    |            |                                   |
            |            |                    |            |- Value definition                 |
            |            |                    |            |                                   |
            |            |                    |            | 0: Not for deployment             |
            |            |                    |            |                                   |
            |            |                    |            | 1: Deployment target              |
            +------------+--------------------+------------+-----------------------------------+
            |            |``apfw_status``     |``string``  | Set the deploy status.            |
            |            |                    |            |                                   |
            |            |                    |            | - Value definition                |
            |            |                    |            |                                   |
            |            |                    |            | 0: Waiting                        |
            |            |                    |            |                                   |
            |            |                    |            | 1: Deploying                      |
            |            |                    |            |                                   |
            |            |                    |            | 2: Success                        |
            |            |                    |            |                                   |
            |            |                    |            | 3: Fail                           |
            +------------+--------------------+------------+-----------------------------------+
            |            |``apfw_retry_count``|``number``  | Set the appfw retry count.        |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``apfw_start_date`` |``string``  | Set the appfw start date.         |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``apfw_end_date``   |``string``  | Set the appfw end date.           |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``apfw_version_     |``string``  | Set the appfw version number.     |
            |            |number``            |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``apfw_version_     |``string``  | Set the appfw version comment.    |
            |            |comment``           |            |                                   |
            +------------+--------------------+------------+-----------------------------------+

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
     */

    getDeployHistory(deviceId: string) {
        const response = this.getDeployHistoryObj.getDeployHistory(deviceId);
        return response;
    }

    /**
     * cancelDeployment -  Force cancellation of the Edge Device deployment status.
     *  @params
     * - deviceId (str, required) - Device ID.
     * - deployId (str, required) - Deploy ID.
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
     *   if any input string parameter found empty OR \
     *   if any input number parameter found negative OR \
     *   if any input non number parameter found.
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
     */

    cancelDeployment(deviceId: string, deployId: string) {
        const response = this.cancelDeploymentObj.cancelDeployment(deviceId, deployId);
        return response;
    }

    /**
     * deleteDeployConfiguration - Delete the information for a specified deploy config.
     *  @params
     * - configId (str, required) - Config ID
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
     */

    deleteDeployConfiguration(configId: string) {
        const response = this.deleteDeployConfigurationObj.deleteDeployConfiguration(configId);
        return response;
    }

    /**
     * deployDeviceApp - Deploy device app.
     *  @params
     * - appName (str, required) - App Name.
     * - versionNumber (str, required) - App version number.
     * - deviceIds (str, required) - Device IDs.
     * - comment (str, optional) - Comment. *Max. 100 characters.
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
     */

    deployDeviceApp(
        appName: string,
        versionNumber: string,
        deviceIds: string,
        comment?: string
    ) {
        const response = this.deployDeviceAppObj.deployDeviceApp(
            appName,
            versionNumber,
            deviceIds,
            comment
        );
        return response;
    }

    /**
     * undeployDeviceApp - Undeploy device app.
     *  @params
     * - deviceIds (str, required) - Specify multiple device IDs separated by commas.
     * @returns
     * - Object: table:: Success Response

            +------------+------------+-------------------------------+
            | *Level1*   | *Type*     | *Description*                 |
            +============+============+============+==================+
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
     */

    undeployDeviceApp(deviceIds: string) {
        const response = this.undeployDeviceAppObj.undeployDeviceApp(deviceIds);
        return response;
    }

    /**
     * getDeviceAppDeploys - Get Device App Deploys.
     *  @params
     * - appName (str, required) - App name
     * - versionNumber (str, required) - App version number
     * @returns
     * - Object: table:: Success Response

            +-----------+--------------------+-----------+---------------------------+
            | *Level1*  | *Level2*           | *Type*    | *Description*             |
            +===========+====================+===========+===========================+
            |``deploys``|                    | ``array`` |                           |
            +-----------+--------------------+-----------+---------------------------+
            |           | ``id``             | ``number``| Set the deploy id.        |
            +-----------+--------------------+-----------+---------------------------+
            |           | ``total_status``   | ``string``| Set the total status.     |
            |           |                    |           |                           |
            |           |                    |           | - Value definition        |
            |           |                    |           |                           |
            |           |                    |           | 0: Running                |
            |           |                    |           |                           |
            |           |                    |           | 1: Successfully completed |
            |           |                    |           |                           |
            |           |                    |           | 2: Failed                 |
            |           |                    |           |                           |
            |           |                    |           | 3: Canceled               |
            +-----------+--------------------+-----------+---------------------------+
            |           |``deploy_parameter``| ``string``| Set the deploy parameter. |
            +-----------+--------------------+-----------+---------------------------+
            |           |``devices``         | ``array`` | Refer : Table : 1.0       |
            |           |                    |           | for more details          |
            +-----------+--------------------+-----------+---------------------------+

            @Table : 1.0 - devices schema details

            +-------------------+-----------------+------------+--------------------------+
            | *Level1*          | *Level2*        | *Type*     | *Description*            |
            +===================+=================+============+==========================+
            |``devices``        |                 | ``array``  |                          |
            +-------------------+-----------------+------------+--------------------------+
            |                   |``device_id``    | ``string`` | Set the device id.       |
            +-------------------+-----------------+------------+--------------------------+
            |                   |``status``       | ``string`` | Set the total status.    |
            |                   |                 |            |                          |
            |                   |                 |            | - Value definition       |
            |                   |                 |            |                          |
            |                   |                 |            | 0: Running               |
            |                   |                 |            |                          |
            |                   |                 |            | 1: Successfully completed|
            |                   |                 |            |                          |
            |                   |                 |            | 2: Failed                |
            |                   |                 |            |                          |
            |                   |                 |            | 3: Canceled              |
            +-------------------+-----------------+------------+--------------------------+
            |                   |``latest_        | ``string`` | Set the deployment flg.  |
            |                   |deployment_flg`` |            |                          |
            |                   |                 |            | - Value definition       |
            |                   |                 |            |                          |
            |                   |                 |            | 0: Old deployment history|
            |                   |                 |            |                          |
            |                   |                 |            | 1: Recent deployment     |
            |                   |                 |            | history                  |
            +-------------------+-----------------+------------+--------------------------+
            |                   |``ins_id``       | ``string`` | Set the settings author. |
            +-------------------+-----------------+------------+--------------------------+
            |                   |``ins_date``     | ``string`` | Set the date the settings|
            |                   |                 |            | were created.            |
            +-------------------+-----------------+------------+--------------------------+
            |                   |``upd_id``       | ``string`` | Set the settings updater.|
            +-------------------+-----------------+------------+--------------------------+
            |                   |``upd_date``     | ``string`` | Set the date the settings|
            |                   |                 |            | were updated.            |
            +-------------------+-----------------+------------+--------------------------+

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
     */

    getDeviceAppDeploys(appName: string, versionNumber: string) {
        const response = this.getDeviceAppDeploysObj.getDeviceAppDeploys(appName, versionNumber);
        return response;
    }

    /**
      * deployDeviceAppWaitResponse - deploy and wait for completion
     * @params
     * - appName (str, required) - App Name.
     * - versionNumber (str, required) - App version number.
     * - deviceIds (str, required) - Specify multiple device IDs separated by commas.
     * - comment (str, optional) - Comment. *Max. 100 characters.
    * - callback (function, optional) : A function handle of the form - \
                `deployDeviceAppCallback(deviceStatusArray)`, where `deviceStatusArray`\
                is the array of the dictionary for each Edge Device :
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
                - `found_position`: index of the device id from Edge Devices array of the \
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
            +===================+===================+============+============================+
            | ``No_item_name``  |                   | ``array``  | deploy device app          |
            |                   |                   |            | wait response array        |
            +-------------------+-------------------+------------+----------------------------+
            |                   | ``device_id``     | ``string`` | Set the device id          |
            +-------------------+-------------------+------------+----------------------------+
            |                   | ``result``        | ``string`` | "SUCCESS"                  |
            +-------------------+-------------------+------------+----------------------------+
            |                   | ``process_time``  | ``string`` | Processing Time            |
            +-------------------+-------------------+------------+----------------------------+

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
     *   if any input string parameter found empty OR
     *   if type of callback parameter not a function.
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
     */

    deployDeviceAppWaitResponse(
        appName: string,
        versionNumber: string,
        deviceIds: string,
        comment?: string,
        callback?: Function
    ) {
        const response =
            this.deployDeviceAppWaitResponseObj.deployDeviceAppWaitResponse(
                appName,
                versionNumber,
                deviceIds,
                comment,
                callback
            );
        return response;
    }

    /**
     *  deployByConfigurationWaitResponse - Provide a function for deploying the following to Edge Devices \
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
    * - timeout (number, optional) : Timeout waiting for completion. There are cases where the \
                Edge Device hangs up during the deployment process,\
                so there are cases where the process remains in progress,\
                so timeout to exit the process, 3600 seconds if not specified.
     * - callback (function, optional) : A function handle of the form - \
                `deployCallback(deviceStatusArray)`, where `deviceStatusArray`
                is the array of the dictionary for each Edge Device :
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
            +===================+===================+============+============================+
            | ``No_item_name``  |                   | ``array``  | deploy by configuration    |
            |                   |                   |            | wait response array        |
            +-------------------+-------------------+------------+----------------------------+
            |                   | ``device_id``     | ``string`` | Set the device id          |
            +-------------------+-------------------+------------+----------------------------+
            |                   | ``result``        | ``string`` | "SUCCESS"                  |
            +-------------------+-------------------+------------+----------------------------+
            |                   | ``process_time``  | ``string`` | Processing Time            |
            +-------------------+-------------------+------------+----------------------------+

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
     *   if any input number parameter found negative OR \
     *   if type of callback parameter not a function. \
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
     */

    deployByConfigurationWaitResponse(
        configId: string,
        deviceIds: string,
        replaceModelId?: string,
        comment?: string,
        timeout?: number,
        callback?: Function
    ) {
        const response =
            this.deployByConfigurationWaitResponseObj.deployByConfigurationWaitResponse(
                configId,
                deviceIds,
                replaceModelId,
                comment,
                timeout,
                callback
            );
        return response;
    }
}
