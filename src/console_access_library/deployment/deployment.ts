/* eslint-disable @typescript-eslint/ban-types */
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
        this.deleteDeployConfigurationObj = new DeleteDeployConfiguration(
            this.config
        );
        this.deployDeviceAppObj = new DeployDeviceApp(this.config);
        this.undeployDeviceAppObj = new UndeployDeviceApp(this.config);
        this.createDeployConfigurationObj = new CreateDeployConfiguration(
            this.config
        );
        this.deployByConfigurationObj = new DeployByConfiguration(this.config);
        this.getDeployConfigurationsObj = new GetDeployConfigurations(
            this.config
        );
        this.getDeployHistoryObj = new GetDeployHistory(this.config);
        this.getDeviceAppDeploysObj = new GetDeviceAppDeploys(this.config);
        this.deployByConfigurationWaitResponseObj =
            new DeployByConfigurationWaitResponse(this.config);
        this.deployDeviceAppWaitResponseObj = new DeployDeviceAppWaitResponse(
            this.config
        );
    }

    /**
     * importDeviceApp - Import DeviceApp
     *  @params
     * - compiledFlg (str, required): Specify compile FLG Value definition \
                - 0: Uncompiled (compile process) \
                - 1: Compiled (no compilation process)
     * - appName (str, required): DeviceApp name. The maximum number of \
                characters is app_name + version_number ⇐31. Characters other than the \
                following are forbidden characters \
                    - Alphanumeric \
                    - Underbar \
                    - Dot

     * - versionNumber (str, required): DeviceApp version. The maximum number of \
                characters is app_name + version_number ⇐31. Characters other than the \
                following are forbidden characters \
                    - Alphanumeric \
                    - Underbar \
                    - Dot
     * - fileName (str, required): DeviceApp file name.
     * - fileContent (str, required): Contents of DeviceApp file. Base64 encoded string.
     * - entryPoint (str, optional): EVP module entry point. "ppl" if not specified.
     * - comment (str, optional): DeviceApp Description. up to 100 characters \
                No comment if not specified.
     * @returns 
     * - Object: table:: Success Response

            +------------+------------+-------------------------------+
            |  Level1    |  Type      |  Description                  |
            +------------+------------+-------------------------------+
            |  `result`  |  `string`  | Set "SUCCESS" pinning         |
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
        comment?: string
    ) {
        const response = this.importDeviceAppObj.importDeviceApp(
            compiledFlg,
            appName,
            versionNumber,
            fileName,
            fileContent,
            entryPoint,
            comment
        );
        return response;
    }

    /**
     * deleteDeviceApp - Delete DeviceApp
     * @params
     * - appName (str, required) - Set the app name.
     * - versionNumber (str, required) - Set the version Number.
     * @returns 
    * - Object: table:: Success Response

            +------------+------------+-------------------------------+
            |  Level1    |  Type      |  Description                  |
            +------------+------------+-------------------------------+
            |  `result`  |  `string`  | Set "SUCCESS" pinning         |
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
        const response = this.deleteDeviceAppObj.deleteDeviceApp(
            appName,
            versionNumber
        );
        return response;
    }

    /**
     * getDeviceApps -  DeviceApp information list acquisition
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
     * createDeployConfiguration - Register the deployment config information to deploy the following to the device. \
     *   Firmware, AIModel.
     * @params
     * - configId (str, required) : The config ID. Up to 20 characters \
     *           half-width only. \
                The following characters are allowed \
                Alphanumeric characters \
                -hyphen \
                _ Underscore \
                () Small parentheses \
                . dot
     * - comment (str, optional) : 100 characters or less
     * - sensorLoaderVersionNumber (str, optional) : If -1 is specified \
                the default version is applied The default value is system setting "DVC0017"
     * - sensorVersionNumber (str, optional) : If -1 is specified \
                the default version is applied The default value is system setting "DVC0018"
     * - modelId (str, optional) : The model_id. \
     *           If not specified, no model deployment.
     * - modelVersionNumber (str, optional) : The Model version number. \
     *           If not specified, the latest version is applied.
     * - apFwVersionNumber (str, optional) : The ApFw version number. \
     *           If not specified, no firmware deployment.
     * @returns
     * - Object: table:: Success Response

            +------------+------------+-------------------------------+
            |  Level1    |  Type      |  Description                  |
            +------------+------------+-------------------------------+
            |  `result`  |  `string`  | Set "SUCCESS" pinning         |
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
     * deployByConfiguration - Provides a Function to deploy the following to the device specified from the \
     *   deployment config. Firmware, AIModel.
     * @params
     * - configId (str, required) : The config_id.
     * - deviceIds (str, required) : Specify multiple device IDs separated by commas. \
                Case-sensitive
     * - replaceModelId (str, optional) : Replacement target model ID \
     *           Specify "model_id" or "network_id" If the specified model ID does \
     *           not exist in the DB, treat the input value as network_id \
     *           (console internal management ID) and perform processing \
     *           If not specified, do not replace.
     * - comment (str, optional) : deploy comment \
     *           up to 100 characters No comment if not specified
     * @returns
     * - Object: table:: Success Response

            +------------+------------+-------------------------------+
            |  Level1    |  Type      |  Description                  |
            +------------+------------+-------------------------------+
            |  `result`  |  `string`  | Set "SUCCESS" pinning         |
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
     * getDeployConfigurations - Get deployment config information list.
     * @returns
     * - Object: table:: Success Response

            +-------------------------+------------------+------------+-------------------+
            |  Level1                 |  Level2          |  Type      |  Description      |
            +-------------------------+------------------+------------+-------------------+
            | `deploy_configurations` |                  |  `array`   | Ascending order of|
            |                         |                  |            | config_id         |
            +-------------------------+------------------+------------+-------------------+
            |                         |  `config_id`     |  `string`  |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         |  `device_type`   |  `string`  |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         | `config_comment` |  `string`  |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         |   `running_cnt`  |  `int`     |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         |   `success_cnt`  |  `int`     |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         |   `fail_cnt`     |  `int`     |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         |   `firmware`     |  `array`   |Refer : Table : 1.0|
            |                         |                  |            | for more details  |
            +-------------------------+------------------+------------+-------------------+
            |                         |   `model`        |  `array`   |Refer : Table : 2.0|
            |                         |                  |            | for more details  |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         | `custom_setting` |  `array`   |Refer : Table : 3.0|
            |                         |                  |            | for more details  |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         | `ins_id`         |  `string`  |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         | `ins_date`       |  `string`  |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         | `upd_id`         |  `string`  |                   |
            +-------------------------+------------------+------------+-------------------+
            |                         | `upd_date`       |  `string`  |                   |
            +-------------------------+------------------+------------+-------------------+

        @Table : 1.0 - firmware schema details

            +-------------------+--------------------+------------+-------------------+
            | *Level1*          | *Level2*           | *Type*     | *Description*     |
            +-------------------+--------------------+------------+-------------------+
            | ``firmware``      |                    | ``array``  |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_loader_    | ``string`` |                   |
            |                   |file_name``         |            |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_loader_    | ``string`` |                   |
            |                   |version_number``    |            |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_loader_    | ``string`` |                   |
            |                   |firmware_comment``  |            |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_file_name``| ``string`` |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_           | ``string`` |                   |
            |                   |version_number``    |            |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``sensor_           |``string``  |                   |
            |                   |firmware_comment``  |            |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``apfw_file_name``  |``string``  |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``apfw_version_     |``string``  |                   |
            |                   |number``            |            |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``apfw_firmware_    |``string``  |                   |
            |                   |comment``           |            |                   |
            +-------------------+--------------------+------------+-------------------+

        @Table : 2.0 - model schema details

            +-------------------+--------------------+------------+-------------------+
            | *Level1*          | *Level2*           | *Type*     | *Description*     |
            +-------------------+--------------------+------------+-------------------+
            | ``model``         |                    | ``array``  |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   | ``model_id``       | ``string`` |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``model_            | ``string`` |                   |
            |                   |version_number``    |            |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   | ``model_comment``  | ``string`` |                   |
            +-------------------+--------------------+------------+-------------------+
            |                   |``model_            | ``string`` |                   |
            |                   |version_comment``   |            |                   |
            +-------------------+--------------------+------------+-------------------+

        @Table : 3.0 - custom_setting schema details

            +--------------+--------------------+------------+---------------+
            | *Level1*     | *Level2*           | *Type*     | *Description* |
            +--------------+--------------------+------------+---------------+
            |``custom_     |                    | ``array``  |               |
            |setting``     |                    |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``color_matrix_     |``string``  |               |
            |              |mode``              |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``color_matrix_     | ``string`` |               |
            |              |file_name``         |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``color_matrix_     |``string``  |               |
            |              |comment``           |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``gamma_            |``string``  |               |
            |              |mode``              |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``gamma_            |``string``  |               |
            |              |file_name``         |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``gamma_            |``string``  |               |
            |              |comment``           |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``lscisp_           |``string``  |               |
            |              |mode``              |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``lscisp_           |``string``  |               |
            |              |file_name``         |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``lscisp_           |``string``  |               |
            |              |comment``           |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``lscraw_           |``string``  |               |
            |              |mode``              |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``lscraw_           |``string``  |               |
            |              |file_name``         |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``lscraw_           |``string``  |               |
            |              |comment``           |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``prewb_            |``string``  |               |
            |              |mode``              |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``prewb_            |``string``  |               |
            |              |file_name``         |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``prewb_            |``string``  |               |
            |              |comment``           |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``dewarp_           |``string``  |               |
            |              |mode``              |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``dewarp_           |``string``  |               |
            |              |file_name``         |            |               |
            +--------------+--------------------+------------+---------------+
            |              |``dewarp_           |``string``  |               |
            |              |comment``           |            |               |
            +--------------+--------------------+------------+---------------+

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
        const response =
            this.getDeployConfigurationsObj.getDeployConfigurations();
        return response;
    }

    /**
     * getDeployHistory - Get the deployment history for a specified device.
     * @params
     * - deviceId (str, required) - Device ID. Case-sensitive
     * @returns
     * - Object: table:: Success Response
    
            +----------+----------------------+------------+------------------------------+
            |  Level1  |  Level2              |  Type      |  Description                 |
            +----------+----------------------+------------+------------------------------+
            | `deploy` |                      |  `array`   | Descending order of          |
            |          |                      |            | ins_date                     |
            +----------+----------------------+------------+------------------------------+
            |          |  `id`                |  `number`  |                              |
            +----------+----------------------+------------+------------------------------+
            |          |  `deploy_type`       |  `string`  | 0: Deployment configuration  |
            |          |                      |            |                              |
            |          |                      |            | 1: Device model,             |
            |          |                      |            | App:DeviceApp                |
            +----------+----------------------+------------+------------------------------+
            |          | `deploy_status`      |  `string`  | Target device status         |
            |          |                      |            |                              |
            |          |                      |            | 0: Deploying                 |
            |          |                      |            |                              |
            |          |                      |            | 1: Succeeding                |
            |          |                      |            |                              |
            |          |                      |            | 2: failed                    |
            |          |                      |            |                              |
            |          |                      |            | 3: canceled                  |
            |          |                      |            |                              |
            |          |                      |            | 9: DeviceApp Undeploy        |
            +----------+----------------------+------------+------------------------------+
            |          | `deploy_comment`     |  `string`  |                              |
            +----------+----------------------+------------+------------------------------+
            |          |   `config_id`        |  `string`  |                              |
            +----------+----------------------+------------+------------------------------+
            |          | `replace_network_id` |  `string`  |                              |
            +----------+----------------------+------------+------------------------------+
            |          |  `current_target`    |  `string`  |                              |
            +----------+----------------------+------------+------------------------------+
            |          | `total_status`       |  `string`  | Total deployment status      |
            |          |                      |            | including other devices      |
            |          |                      |            |                              |
            |          |                      |            | 0: Deploying                 |
            |          |                      |            |                              |
            |          |                      |            | 1: Succeeding                |
            |          |                      |            |                              |
            |          |                      |            | 2: failed                    |
            |          |                      |            |                              |
            |          |                      |            | 3: canceled                  |
            |          |                      |            |                              |
            |          |                      |            | 9: DeviceApp Undeploy        |
            +----------+----------------------+------------+------------------------------+
            |          |  `firmware`          |  `array`   |  Refer : Table : 1.0         |
            |          |                      |            |  for more details            |
            +----------+----------------------+------------+------------------------------+
            |          |   `model`            |  `array`   |  Refer : Table : 1.1         |
            |          |                      |            |  for more details            |
            +----------+----------------------+------------+------------------------------+
            |          | `custom_setting`     |  `array`   |  Refer : Table : 1.2         |
            |          |                      |            |  for more details            |
            +----------+----------------------+------------+------------------------------+
            |          | `ins_id`             |  `string`  |                              |
            +----------+----------------------+------------+------------------------------+
            |          | `ins_date`           |  `string`  |                              |
            +----------+----------------------+------------+------------------------------+
            |          | `upd_id`             |  `string`  |                              |
            +----------+----------------------+------------+------------------------------+
            |          | `upd_date`           |  `string`  |                              |
            +----------+----------------------+------------+------------------------------+

        @Table : 1.0 - `firmware` schema details

            +------------+--------------------+------------+-----------------------------------+
            |  Level1    |  Level2            |  Type      |  Description                      |
            +------------+--------------------+------------+-----------------------------------+
            | `firmware` |                    |  `array`   |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_loader_    |  `string`  | 0: Not eligible                   |
            |            |target_flg`         |            |                                   |
            |            |                    |            | 1: Eligible                       |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_loader_    | `string`   | 0: Waiting to run                 |
            |            |status`             |            |                                   |
            |            |                    |            | 1: Running                        |
            |            |                    |            |                                   |
            |            |                    |            | 2: Successful                     |
            |            |                    |            |                                   |
            |            |                    |            | 3: Failed                         |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_loader_    | `string`   |                                   |
            |            |retry_count`        |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_loader_    | `string`   |                                   |
            |            |start_date`         |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_loader_    |  `string`  |                                   |
            |            |end_date`           |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_loader_    | `string`   |                                   |
            |            |version_number`     |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_loader_    | `string`   |                                   |
            |            |version_comment`    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_target_    | `string`   | 0: Not eligible                   |
            |            |flg`                |            |                                   |
            |            |                    |            | 1: Eligible                       |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_status`    |  `string`  | 0: Waiting to run                 |
            |            |                    |            | 1: Running                        |
            |            |                    |            | 2: Successful                     |
            |            |                    |            | 3: Failed                         |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_retry_     | `string`   |                                   |
            |            |count`              |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_start_     | `string`   |                                   |
            |            |date`               |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_end_date`  | `string`   |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_version_   | `string`   |                                   |
            |            |number`             |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `sensor_version_   | `string`   |                                   |
            |            |comment`            |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `apfw_target_flg`  | `string`   | 0: Not eligible                   |
            |            |                    |            |                                   |
            |            |                    |            | 1: Eligible                       |
            +------------+--------------------+------------+-----------------------------------+
            |            | `apfw_status`      | `string`   | 0: Waiting to run                 |
            |            |                    |            | 1: Running                        |
            |            |                    |            | 2: Successful                     |
            |            |                    |            | 3: Failed                         |
            +------------+--------------------+------------+-----------------------------------+
            |            | `apfw_retry_count` | `string`   |                                   |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `apfw_start_date`  | `string`   |                                   |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `apfw_end_date`    | `string`   |                                   |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `apfw_version_     | `string`   |                                   |
            |            |number`             |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `apfw_version_     | `string`   |                                   |
            |            |comment`            |            |                                   |
            +------------+--------------------+------------+-----------------------------------+

        @Table : 1.1 - `model` schema details

            +------------+--------------------+------------+-----------------------------------+
            |  Level1    |  Level2            |  Type      |  Description                      |
            +------------+--------------------+------------+-----------------------------------+
            | `model`    |                    |  `array`   |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_target_flg` |  `string`  | 0: Not eligible                   |
            |            |                    |            |                                   |
            |            |                    |            | 1: Eligible                       |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_status`     | `string`   | 0: Waiting to run                 |
            |            |                    |            |                                   |
            |            |                    |            | 1: Running                        |
            |            |                    |            |                                   |
            |            |                    |            | 2: Successful                     |
            |            |                    |            |                                   |
            |            |                    |            | 3: Failed                         |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_retry_      | `string`   |                                   |
            |            |count`              |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_start_date` | `string`   |                                   |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_end_date`   |  `string`  |                                   |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_id`         | `string`   |                                   |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_version_    | `string`   |                                   |
            |            |number`             |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_comment`    | `string`   |                                   |
            |            |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_version_    |  `string`  |                                   |
            |            |comment`            |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `dnn_parame_set    | `string`   |                                   |
            |            |ting_target_flg`    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `dnn_parame_       | `string`   |                                   |
            |            |settingstatus`      |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `dnn_parame_sett   | `string`   |                                   |
            |            |ing_retry_count`    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `dnn_parame_set    | `string`   |                                   |
            |            |ting_start_date`    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `dnn_parame_set    | `string`   |                                   |
            |            |ting_end_date`      |            |                                   |
            +------------+--------------------+------------+-----------------------------------+

        @Table : 1.2 - `custom_setting` schema details

            +--------------+--------------------+------------+---------------------------------+
            |  Level1      |  Level2            |  Type      |  Description                    |
            +--------------+--------------------+------------+---------------------------------+
            | `custom_     |                    |  `array`   |                                 |
            |setting`      |                    |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `color_matrix_     |  `string`  | 0: Not eligible                 |
            |              |target_flg`         |            |                                 |
            |              |                    |            | 1: Eligible                     |
            +--------------+--------------------+------------+---------------------------------+
            |              | `color_matrix_     | `string`   | 0: Waiting to run               |
            |              |status`             |            |                                 |
            |              |                    |            | 1: Running                      |
            |              |                    |            | 2: Successful                   |
            |              |                    |            | 3: Failed                       |
            +--------------+--------------------+------------+---------------------------------+
            |              | `color_matrix_     |  `string`  |                                 |
            |              |retry_count`        |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `color_matrix_     | `string`   |                                 |
            |              |start_date`         |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `color_matrix_     |  `string`  |                                 |
            |              |end_date`           |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `color_matrix_     | `string`   |                                 |
            |              |mode`               |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `color_matrix_     |  `string`  |                                 |
            |              |file_name`          |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `color_matrix_     | `string`   |                                 |
            |              |comment`            |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `gamma_            | `string`   | 0: Not eligible                 |
            |              |target_flg`         |            |                                 |
            |              |                    |            | 1: Eligible                     |
            +--------------+--------------------+------------+---------------------------------+
            |              | `gamma_            | `string`   | 0: Waiting to run               |
            |              |status`             |            |                                 |
            |              |                    |            | 1: Running                      |
            |              |                    |            |                                 |
            |              |                    |            | 2: Successful                   |
            |              |                    |            |                                 |
            |              |                    |            | 3: Failed                       |
            +--------------+--------------------+------------+---------------------------------+
            |              | `gamma_            | `string`   |                                 |
            |              |retry_count`        |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `gamma_            | `string`   |                                 |
            |              |start_date`         |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `gamma_            | `string`   |                                 |
            |              |end_date`           |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `gamma_            | `string`   |                                 |
            |              |mode`               |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `gamma_            | `string`   |                                 |
            |              |file_name`          |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `gamma_            | `string`   |                                 |
            |              |comment`            |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscisp_           | `string`   | 0: Not eligible                 |
            |              |target_flg`         |            |                                 |
            |              |                    |            | 1: Eligible                     |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscisp_           | `string`   | 0: Waiting to run               |
            |              |status`             |            |                                 |
            |              |                    |            | 1: Running                      |
            |              |                    |            | 2: Successful                   |
            |              |                    |            | 3: Failed                       |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscisp_           | `string`   |                                 |
            |              |retry_count`        |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscisp_           | `string`   |                                 |
            |              |start_date`         |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscisp_           | `string`   |                                 |
            |              |end_date`           |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscisp_           | `string`   |                                 |
            |              |mode`               |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscisp_           | `string`   |                                 |
            |              |file_name`          |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscisp_           | `string`   |                                 |
            |              |comment`            |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscraw_           | `string`   | 0: Not eligible                 |
            |              |target_flg`         |            |                                 |
            |              |                    |            | 1: Eligible                     |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscraw_           | `string`   | 0: Waiting to run               |
            |              |status`             |            |                                 |
            |              |                    |            | 1: Running                      |
            |              |                    |            |                                 |
            |              |                    |            | 2: Successful                   |
            |              |                    |            |                                 |
            |              |                    |            | 3: Failed                       |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscraw_           | `string`   |                                 |
            |              |retry_count`        |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscraw_           | `string`   |                                 |
            |              |start_date`         |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscraw_           | `string`   |                                 |
            |              |end_date`           |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscraw_           | `string`   |                                 |
            |              |mode`               |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscraw_           | `string`   |                                 |
            |              |file_name`          |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `lscraw_           | `string`   |                                 |
            |              |comment`            |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `prewb_            | `string`   | 0: Not eligible                 |
            |              |target_flg`         |            |                                 |
            |              |                    |            | 1: Eligible                     |
            +--------------+--------------------+------------+---------------------------------+
            |              | `prewb_            | `string`   | 0: Waiting to run               |
            |              |status`             |            |                                 |
            |              |                    |            | 1: Running                      |
            |              |                    |            | 2: Successful                   |
            |              |                    |            | 3: Failed                       |
            +--------------+--------------------+------------+---------------------------------+
            |              | `prewb_            | `string`   |                                 |
            |              |retry_count`        |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `prewb_            | `string`   |                                 |
            |              |start_date`         |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `prewb_            | `string`   |                                 |
            |              |end_date`           |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `prewb_            | `string`   |                                 |
            |              |mode`               |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `prewb_            | `string`   |                                 |
            |              |file_name`          |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `prewb_            | `string`   |                                 |
            |              |comment`            |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `dewarp_           | `string`   | 0: Not eligible                 |
            |              |target_flg`         |            |                                 |
            |              |                    |            | 1: Eligible                     |
            +--------------+--------------------+------------+---------------------------------+
            |              | `dewarp_           | `string`   | 0: Waiting to run               |
            |              |status`             |            |                                 |
            |              |                    |            | 1: Running                      |
            |              |                    |            |                                 |
            |              |                    |            | 2: Successful                   |
            |              |                    |            |                                 |
            |              |                    |            | 3: Failed                       |
            +--------------+--------------------+------------+---------------------------------+
            |              | `dewarp_           | `string`   |                                 |
            |              |retry_count`        |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `dewarp_           | `string`   |                                 |
            |              |start_date`         |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `dewarp_           | `string`   |                                 |
            |              |end_date`           |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `dewarp_           | `string`   |                                 |
            |              |mode`               |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `dewarp_           | `string`   |                                 |
            |              |file_name`          |            |                                 |
            +--------------+--------------------+------------+---------------------------------+
            |              | `dewarp_           | `string`   |                                 |
            |              |comment`            |            |                                 |
            +--------------+--------------------+------------+---------------------------------+

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
     * cancelDeployment -  Force cancel the device deployment state.It only restores the \
        state of the database being deployed, but cannot return the deployed state to the edge AI device. \
        Used when edge AI device deployment fails and there is a deviation from the state of the database.
     *  @params
     * - deviceId (str, required) - Device ID. Case-sensitive
     * - deployId (str, required) - The Deployment id. \
     *          Id that can be obtained with getDeployHistory.
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
     */

    cancelDeployment(deviceId: string, deployId: string) {
        const response = this.cancelDeploymentObj.cancelDeployment(
            deviceId,
            deployId
        );
        return response;
    }

    /**
     * deleteDeployConfiguration - delete deployment config information.
     *  @params
     * - configId (str, required) - The config ID.
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
     */

    deleteDeployConfiguration(configId: string) {
        const response =
            this.deleteDeployConfigurationObj.deleteDeployConfiguration(
                configId
            );
        return response;
    }

    /**
     * deployDeviceApp - DeviceApp deployment.
     *  @params
     * - appName (str, required) - The App name.
     * - versionNumber (str, required) - App version.
     * - deviceIds (str, required) - Specify multiple device IDs separated by commas. \
                Case-sensitive
     * - deployParameter (str, optional) -  Deployment parameters \
                Base64 encoded string in Json format No parameters if not specified.
     * - comment (str, optional) - deploy comment \
                up to 100 characters \
                No comment if not specified.
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
     */

    deployDeviceApp(
        appName: string,
        versionNumber: string,
        deviceIds: string,
        deployParameter?: string,
        comment?: string
    ) {
        const response = this.deployDeviceAppObj.deployDeviceApp(
            appName,
            versionNumber,
            deviceIds,
            deployParameter,
            comment
        );
        return response;
    }

    /**
     * undeployDeviceApp - Undeploy the device app.
     *  @params
     * - deviceIds (str, required) - Specify multiple device IDs separated by commas \
                Case-sensitive
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
     */

    undeployDeviceApp(deviceIds: string) {
        const response = this.undeployDeviceAppObj.undeployDeviceApp(deviceIds);
        return response;
    }

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
        const response = this.getDeviceAppDeploysObj.getDeviceAppDeploys(
            appName,
            versionNumber
        );
        return response;
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
     *   if type of callback paramter not a function.
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
        deployParameter?: string,
        comment?: string,
        callback?: Function
    ) {
        const response =
            this.deployDeviceAppWaitResponseObj.deployDeviceAppWaitResponse(
                appName,
                versionNumber,
                deviceIds,
                deployParameter,
                comment,
                callback
            );
        return response;
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
     *   if any input integer parameter found negative OR \
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
