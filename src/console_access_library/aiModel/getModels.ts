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
import { Configuration, TrainModelApi } from 'js-client';
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
 * This class provide method to Get model list information.
 */
export class GetModels {
    config: Config;
    ajv = new Ajv();
    api: TrainModelApi;

    constructor(config: Config) {
        this.config = config;
    }

    /**
    * Schema for API to get model list information.

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
            comment: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for comment',
                    isNotEmpty: 'comment required or can\'t be empty string',
                },
            },
            projectName: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for projectName',
                    isNotEmpty: 'projectName required or can\'t be empty string',
                },
            },
            modelPlatform: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for modelPlatform',
                    isNotEmpty:
                        'modelPlatform required or can\'t be empty string',
                },
            },
            projectType: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for projectType',
                    isNotEmpty: 'projectType required or can\'t be empty string',
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
            latestType: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for latestType',
                    isNotEmpty: 'latestType required or can\'t be empty string',
                },
            },
        },
        additionalProperties: false,
    };

    /**
     * getModels - Get model information list
     * @params
     * - modelId (str, optional) -  Model ID. Partial search \
                If not specified, all model_id searches.
     * - comment (str, optional) - Model Description. Partial search \
                If not specified, search all comments.
     * - projectName (str, optional) - Project Name. Partial search \
                Search all project_name if not specified.
     * - modelPlatform (str, optional) - Model platform \
                - 0 : Custom Vision(Third party trademark)\
                - 1 : Non Custom Vision \
                - 2 : Model Retrainer \
                Exact search, If not specified, search all model_platforms.
     * - projectType (str, optional) - The project Type. \
                - 0 : Base \
                - 1 : Device \
                Exact search, Search all project_types if not specified.
     * - deviceId (str, optional)- Device Id. \
                Specify when you want to search for device models. \
                Exact match search criteria. Case-sensitive.
     * - latestType (str, optional) - Latest version type. \
                - 0 : latest published version \
                - 1 : Latest version (latest including model version in process of \
                conversion/publishing) \
                Exact search, 1 if not specified.
     * @returns
     * - Object: table:: Success Response

            +------------+-------------------+------------+-------------------------------+
            |  Level1    |  Level2           |  Type      |  Description                  |
            +------------+-------------------+------------+-------------------------------+
            |  `models`  |                   |  `array`   | The subordinate elements are  |
            |            |                   |            | listed in ascending order of  |
            |            |                   |            | model ID                      |
            +------------+-------------------+------------+-------------------------------+
            |            |  `model_id`       |   `string` | Set the model ID              |
            +------------+-------------------+------------+-------------------------------+
            |            |  `device_type`    |   `string` | Set the model type            |
            +------------+-------------------+------------+-------------------------------+
            |            |  `functionality`  |   `string` | Set the feature description   |
            +------------+-------------------+------------+-------------------------------+
            |            |  `vendor_name`    |   `string` | Set the vendor name           |
            +------------+-------------------+------------+-------------------------------+
            |            |  `model_comment`  |   `string` | Set the description           |
            +------------+-------------------+------------+-------------------------------+
            |            |  `network_type`   |   `string` | 0: Custom Vision(Third        |
            |            |                   |            | party trademark)              |
            |            |                   |            | 1: NonCustomVision            |
            +------------+-------------------+------------+-------------------------------+
            |            |  `projects`       |  `array`   | Refer : Table : 1.0           |
            |            |                   |            | for more details              |
            +------------+-------------------+------------+-------------------------------+
        
        @Table : 1.0 - projects schema details
 
            +------------+--------------------+------------+-----------------------------------+
            |  Level1    |  Level2            |  Type      |  Description                      |
            +------------+--------------------+------------+-----------------------------------+
            | `projects` |                    |  `array`   |The subordinate elements are listed|
            |            |                    |            |in ascending order of project type |
            |            |                    |            |and model project name.            |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_project_    |   `string` |Set the model project name         |
            |            |name`               |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_platform`   |  `string`  |Set up the model platform          |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_type`       |  `string`  |Set the model type                 |
            +------------+--------------------+------------+-----------------------------------+
            |            | `project_type`     |  `string`  |Set the project type               |
            +------------+--------------------+------------+-----------------------------------+
            |            | `device_id`        |  `string`  |Set the device ID * This is not an |
            |            |                    |            |internal ID                        |
            +------------+--------------------+------------+-----------------------------------+
            |            | `versions`         | `array`    |Refer : Table : 1.1                |
            |            |                    |            |for more details                   |
            +------------+--------------------+------------+-----------------------------------+

        @Table : 1.1 - Versions schema details
        
            +------------+--------------------+------------+-----------------------------------+
            |  Level1    |  Level2            |  Type      |  Description                      |
            +------------+--------------------+------------+-----------------------------------+
            | `versions` |                    |  `array`   |Although it is a subordinate       |
            |            |                    |            |element, in the case of this API,  |
            |            |                    |            |there is always one.               |
            +------------+--------------------+------------+-----------------------------------+
            |            | `version_number`   |   `string` |Set the version number             |
            +------------+--------------------+------------+-----------------------------------+
            |            | `iteration_id`     |  `string`  |Set the iteration ID               |
            +------------+--------------------+------------+-----------------------------------+
            |            | `iteration_name`   |  `string`  |Set the iteration name             |
            +------------+--------------------+------------+-----------------------------------+
            |            | `accuracy`         |  `string`  |Set the precision                  |
            +------------+--------------------+------------+-----------------------------------+
            |            | `latest_flg`       |  `string`  |Set the latest flag                |
            +------------+--------------------+------------+-----------------------------------+
            |            | `publish_latest    |  `string`  |Set the latest published flag      |
            |            |_flg`               |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `version_status`   |  `string`  |Set your status                    |
            |            |                    |            |                                   |
            |            |                    |            |'01': 'Before conversion'          |
            |            |                    |            |                                   |
            |            |                    |            |'02': 'Converting'                 |
            |            |                    |            |                                   |
            |            |                    |            |'03': 'Conversion failed'          |
            |            |                    |            |                                   |
            |            |                    |            |'04': 'Conversion complete'        |
            |            |                    |            |                                   |
            |            |                    |            |'05': 'Adding to configuration'    |
            |            |                    |            |                                   |
            |            |                    |            |'06': 'Add to configuration failed'|
            |            |                    |            |                                   |
            |            |                    |            |'07': 'Add to configuration        |
            |            |                    |            |complete                           |
            |            |                    |            |                                   |
            |            |                    |            |'11': 'Saving' Model saving        |
            |            |                    |            |status in Model Retrainer case     |
            +------------+--------------------+------------+-----------------------------------+
            |            | `org_file_name`    |  `string`  |Set the file name of the model     |
            |            |                    |            |before conversion                  |
            +------------+--------------------+------------+-----------------------------------+
            |            | `org_file_size`    | `integer`  |Set the publishing model file size |
            +------------+--------------------+------------+-----------------------------------+
            |            | `publish_file_     |  `string`  |Set the publishing model file name |
            |            |name`               |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `publish_file_     | `integer`  |Set the publishing model file size |
            |            |size`               |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_file_size`  | `integer`  |Set the model file size            |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_framework`  |  `string`  |Set up the model framework         |
            +------------+--------------------+------------+-----------------------------------+
            |            | `conv_id`          |  `string`  |Set the conversion request ID      |
            +------------+--------------------+------------+-----------------------------------+
            |            | `labels`           | `string[]` |Set the label array                |
            +------------+--------------------+------------+-----------------------------------+
            |            | `stage`            |  `string`  |Set the conversion stage           |
            +------------+--------------------+------------+-----------------------------------+
            |            | `result`           |  `string`  |Set the conversion result          |
            +------------+--------------------+------------+-----------------------------------+
            |            | `convert_start_    |  `string`  |Set the conversion start date and  |
            |            |date`               |            |time                               |
            +------------+--------------------+------------+-----------------------------------+
            |            | `convert_end_date` |  `string`  |Set the conversion end date and    |
            |            |                    |            |time                               |
            +------------+--------------------+------------+-----------------------------------+
            |            | `publish_start     |  `string`  |Set the publish start date and time|
            |            |_date`              |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `publish_end_date` |  `string`  |Set the publication end date and   |
            |            |                    |            |time                               |
            +------------+--------------------+------------+-----------------------------------+
            |            | `version_comment`  |  `string`  |Set the description                |
            +------------+--------------------+------------+-----------------------------------+
            |            | `version_ins_date` | `date`     |Set the version creation time      |
            +------------+--------------------+------------+-----------------------------------+
            |            | `version_upd_date` | `date`     |Set the version creation time      |
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
     *
     * @example
     * Below is the example of result format.
     * .. code-block:: typescript
     *    import { Client, Config } from 'consoleaccesslibrary'
     * 
     *    const consoleEndpoint: "__consoleEndpoint__";
     *    const portalAuthorizationEndpoint: "__portalAuthorizationEndpoint__";
     *    const clientId: '__clientId__';
     *    const clientSecret: '__clientSecret__';
     *    const config = new Config(consoleEndpoint,portalAuthorizationEndpoint, clientId, clientSecret);
     *  
     *    const client = await Client.createInstance(config);
     *    const modelId = '__modelId__';
     *    const comment = '__comment__';
     *    const projectName = '__projectName__';
     *    const modelPlatform = '__modelPlatform__';
     *    const projectType = '__projectType__';
     *    const deviceId = '__deviceId__';
     *    const latestType = '__latestType__';
     *    const response= await client.aiModel.getModels(modelId, comment, projectName, modelPlatform, projectType, deviceId, latestType);
     *
     */
    async getModels(
        modelId?: string,
        comment?: string,
        projectName?: string,
        modelPlatform?: string,
        projectType?: string,
        deviceId?: string,
        latestType?: string
    ) {
        Logger.info('getModels');
        let valid = true;
        try {
            const validate = ajv.compile(this.schema);
            valid = validate({
                modelId,
                comment,
                projectName,
                modelPlatform,
                projectType,
                deviceId,
                latestType,
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
            this.api = new TrainModelApi(apiConfig);

            const res = await this.api.getModels(
                modelId,
                comment,
                projectName,
                modelPlatform,
                projectType,
                deviceId,
                latestType
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
