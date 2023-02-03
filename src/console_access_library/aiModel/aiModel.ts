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

import { Config } from '../common/config';
import { DeleteModel } from './deleteModel';
import { GetBaseModelStatus } from './getBaseModelStatus';
import { GetModels } from './getModels';
import { ImportBaseModel } from './importBaseModel';
import { PublishModel } from './publishModel';
import { PublishModelWaitResponse } from './publishModelWaitResponse';

/**
 * This class implements all abstract API of AI Model.
 */
export class AiModel {
    /**
     * @ignorea
     */
    config: Config;
    deleteModelObj: DeleteModel;
    getBaseModelStatusObj: GetBaseModelStatus;
    getModelsObj: GetModels;
    importBaseModelObj: ImportBaseModel;
    publishModelObj: PublishModel;
    publishModelWaitResponseObj: PublishModelWaitResponse;

    constructor(config: Config) {
        this.config = config;
        this.deleteModelObj = new DeleteModel(this.config);
        this.getBaseModelStatusObj = new GetBaseModelStatus(this.config);
        this.getModelsObj = new GetModels(this.config);
        this.importBaseModelObj = new ImportBaseModel(this.config);
        this.publishModelObj = new PublishModel(this.config);
        this.publishModelWaitResponseObj = new PublishModelWaitResponse(
            this.config
        );
    }

    /**
     * deleteModel - "Deletes the specified model and associated projects
     * @params
     * - modelId (str, required) - The model Id.
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
     *
     */
    deleteModel(modelId: string) {
        const response = this.deleteModelObj.deleteModel(modelId);
        return response;
    }

    /**
     * getBaseModelStatus - Retrieves the specified base model information.
     * @params
     * - modelId(str, required) - The model Id.
     * - latestType (str, optional) - Latest version type. \
                - 0: latest published version \
                - 1: Latest version (latest including model version in process of \
                conversion/publishing) \
                Exact search, 1 if not specified.

     * @returns 
     * - Object: table:: Success Response

            +-----------------+----------------------+------------+-----------------------+
            |  Level1         |  Level2              |  Type      |  Description          |
            +-----------------+----------------------+------------+-----------------------+
            | `model_id`      |                      |  `string`  | Set the model ID      |
            +-----------------+----------------------+------------+-----------------------+
            | `device_type`   |                      |  `string`  | Set the model type    |
            +-----------------+----------------------+------------+-----------------------+
            | `functionality` |                      |  `string`  | Set the feature       |
            |                 |                      |            | description           |
            +-----------------+----------------------+------------+-----------------------+
            | `vendor_name`   |                      |  `string`  | Set the vendor name   |
            +-----------------+----------------------+------------+-----------------------+
            | `model_comment` |                      |  `string`  | Set the description   |
            +-----------------+----------------------+------------+-----------------------+
            | `network_type`  |                      |  `string`  | 0: Custom Vision(Third|
            |                 |                      |            | party trademark)      |
            |                 |                      |            | 1: NonCustomVision    |
            +-----------------+----------------------+------------+-----------------------+
            | `projects`      |                      |  `array`   |                       |
            +-----------------+----------------------+------------+-----------------------+
            |                 | `model_project_name` |  `string`  | Set the model project |
            |                 |                      |            | name                  |
            +-----------------+----------------------+------------+-----------------------+
            |                 | `model_project_id`   |  `string`  | Set the model project |
            |                 |                      |            | ID                    |
            +-----------------+----------------------+------------+-----------------------+
            |                 | `model_platform`     |  `string`  | Set up the model      |
            |                 |                      |            | platform              |
            +-----------------+----------------------+------------+-----------------------+
            |                 | `model_type`         |  `string`  | Set the model type    |
            +-----------------+----------------------+------------+-----------------------+
            |                 | `project_type`       |  `string`  | Set the project type  |
            +-----------------+----------------------+------------+-----------------------+
            |                 | `device_id`          |  `string`  | Set the device ID     |
            +-----------------+----------------------+------------+-----------------------+
            |                 | `version`            | `array`    | Refer:                |
            |                 |                      |            | Table : 1.0           |
            |                 |                      |            | for more details      |
            +-----------------+----------------------+------------+-----------------------+

        @Table : 1.0 - Versions schema details

            +------------+--------------------+------------+-----------------------------------+
            |  Level1    |  Level2            |  Type      |  Description                      |
            +------------+--------------------+------------+-----------------------------------+
            | `versions` |                    |  `array`   |Although it is a subordinate       |
            |            |                    |            |element, in the case of this       |
            |            |                    |            |API, there is always one.          |
            +------------+--------------------+------------+-----------------------------------+
            |            | `version_number`   |   `string` |Set the version number             |
            +------------+--------------------+------------+-----------------------------------+
            |            | `iteration_id`     |  `string`  |Set the iteration ID               |
            +------------+--------------------+------------+-----------------------------------+
            |            | `iteration_name`   |  `string`  |Set the iteration name             |
            +------------+--------------------+------------+-----------------------------------+
            |            | `accuracy`         |  `string`  |Set the precision                  |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_            |  `string`  |Refer Table : 1.1                  |
            |            |performance`        |            |for more details                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `latest_flg`       |  `string`  |Set the latest flag                |
            +------------+--------------------+------------+-----------------------------------+
            |            | `publish_latest_   |  `string`  |Set the latest published flag      |
            |            |flg`                |            |                                   |
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
            |            | `model_file_size`  | `integer`  |Deployment model file size         |
            |            |                    |            |* However, TBD is set as the       |
            |            |                    |            |calculation method                 |
            +------------+--------------------+------------+-----------------------------------+
            |            | `model_framework`  |  `string`  |Set up the model framework         |
            +------------+--------------------+------------+-----------------------------------+
            |            | `conv_id`          |  `string`  |Set the conversion request ID      |
            +------------+--------------------+------------+-----------------------------------+
            |            | `labels`           |  `string`  |Set the label array                |
            +------------+--------------------+------------+-----------------------------------+
            |            | `stage`            |  `string`  |Set the conversion stage           |
            +------------+--------------------+------------+-----------------------------------+
            |            | `result`           |  `string`  |Set the conversion result          |
            +------------+--------------------+------------+-----------------------------------+
            |            | `kpi`              |  `string`  |Refer Table : 1.2                  |
            |            |                    |            |for more details                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `convert_start_    |  `string`  |Set the conversion start date and  |
            |            |date`               |            |time                               |
            +------------+--------------------+------------+-----------------------------------+
            |            | `convert_end_date` |  `string`  |Set the conversion end date and    |
            |            |                    |            |time                               |
            +------------+--------------------+------------+-----------------------------------+
            |            | `publish_start_    |  `string`  |Set the publish start date and time|
            |            |date`               |            |                                   |
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
           
        @Table : 1.1 - model_performance schema details
           
            +------------+--------------------+------------+-----------------------------------+
            |  Level1    |  Level2            |  Type      |  Description                      |
            +------------+--------------------+------------+-----------------------------------+
            | `model_p   |                    |   `string` |Set model performance              |
            |erformance` |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `perTag            |  `string`  |Refer Table : 1.3                  |
            |            |performance`        |            |for more details                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `precision`        |  `string`  |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `precisionStd      |  `string`  |                                   |
            |            |Deviation`          |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `recall`           |  `string`  |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `recallStd         |  `string`  |                                   |
            |            |Deviation`          |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `averagePrecision` |  `string`  |                                   |
            +------------+--------------------+------------+-----------------------------------+
 
        @Table : 1.2 - kpi schema details
 
            +------------+--------------------+------------+-----------------------------------+
            |  Level1    |  Level2            |  Type      |  Description                      |
            +------------+--------------------+------------+-----------------------------------+
            | `kpi`      |                    |   `string` |Set KPIs                           |
            +------------+--------------------+------------+-----------------------------------+
            |            | `Memory Report`    |  `string`  |Refer :Table : 1.4                 |
            |            |                    |            |for more details                   |
            +------------+--------------------+------------+-----------------------------------+
        
        @Table : 1.3 - perTagPerformance schema details

            +------------+--------------------+------------+-----------------------------------+
            |  Level1    |  Level2            |  Type      |  Description                      |
            +------------+--------------------+------------+-----------------------------------+
            | `perTagP   |                    |   `string` |                                   |
            |erformance` |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `id`               |  `string`  |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `name`             |  `string`  |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `precision`        |  `string`  |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `precisionStd      |  `string`  |                                   |
            |            |Deviation`          |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `recallStd         |  `string`  |                                   |
            |            |Deviation`          |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `averagePrecision` |  `string`  |                                   |
            +------------+--------------------+------------+-----------------------------------+

        @Table : 1.4 - Memory Report schema details

            +------------+--------------------+------------+-----------------------------------+
            |  Level1    |  Level2            |  Type      |  Description                      |
            +------------+--------------------+------------+-----------------------------------+
            | `Memory    |                    |   `string` |                                   |
            |Report`     |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `name`             |  `string`  |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `Runtime Memory    |  `string`  |                                   |
            |            |Physical size`      |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `Model Memory      |  `string`  |                                   |
            |            |Physical size`      |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `Reserved Memory`  |  `string`  |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `Memory Usage`     |  `string`  |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `Total Memory      |  `string`  |                                   |
            |            |Available On Chip`  |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `Memory            |  `string`  |                                   |
            |            |Utilization`        |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `Fit In Chip`      |  `string`  |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `Input Persistent` |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `Networks`         |            |Refer :Table : 1.5                 |
            |            |                    |            |for more details                   |
            +------------+--------------------+------------+-----------------------------------+
 
        @Table : 1.5 - Networks schema details
 
            +------------+--------------------+------------+-----------------------------------+
            |  Level1    |  Level2            |  Type      |  Description                      |
            +------------+--------------------+------------+-----------------------------------+
            | `Networks` |                    |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `Hash`             |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `name`             |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `Runtime Memory    |            |                                   |
            |            |Physical size`      |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `Model Memory      |            |                                   |
            |            |Physical size`      |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            | `Input Persistence |            |                                   |
            |            |Cost`               |            |                                   |
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
    getBaseModelStatus(modelId: string, latestType?: string) {
        const response = this.getBaseModelStatusObj.getBaseModelStatus(
            modelId,
            latestType
        );
        return response;
    }

    /**
     * getModels -  Get model information list
     * @params
     * - modelId (str, optional) -  Model ID. Partial search \
                If not specified, all model_id searches.
     * - comment (str, optional) - Model Description. Partial search \
                If not specified, search all comments.
     * - projectName (str, optional) - Project Name. Partial search \
                Search all project_name if not specified.
     * - modelPlatform (str, optional) - Model platform \
                - 0 : Custom Vision(Third party trademark) \
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
            |            |  `network_type`   |   `string` | 0: Custom Vision(Third party  |
            |            |                   |            |  trademark)                   |
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
     */
    getModels(
        modelId?: string,
        comment?: string,
        projectName?: string,
        modelPlatform?: string,
        projectType?: string,
        deviceId?: string,
        latestType?: string
    ) {
        const response = this.getModelsObj.getModels(
            modelId,
            comment,
            projectName,
            modelPlatform,
            projectType,
            deviceId,
            latestType
        );
        return response;
    }

    /**
     * importBaseModel - For a new model ID, save it as a new one. \
        If a model ID already registered in the system is specified, the version is upgraded. \
        Note that it is not possible to create a device model based on the base model \
        imported with this API.
     * @params
     * - modelId (str, required) - Model ID. \
                The model ID to be saved or upgraded. 100 characters or less \
                The following characters are allowed \
                Alphanumeric characters \
                -hyphen \
                _ Underscore \
                () Small parentheses \
                . dot
     * - model (str, required) - Model file SAS URI
     * - converted (bool, optional) -  Convert flag. \
                True: Converted Model \
                False: Unconverted Model \
                False if not specified
     * - vendorName (str, optional) -  Vendor Name.  (specified when saving as new) \
                Up to 100 characters. Not specified for version upgrade. \
                No vendor name if not specified.
     * - comment (str, optional) - Explanation about the model to be entered when \
                registering a new model. When newly saved, it is set as \
                a description of the model and version. \
                When the version is upgraded, it is set as the \
                description of the version. Within 100 characters If not specified, there is no \
                explanation about the model to be entered when registering a new model.
     * - inputFormatParam (str, optional) - input format param file (json format) URI \
                Evaluate Azure: SAS URI+ AWS: Presigned URIs Usage: Packager conversion \
                information (image format information). Illegal characters except for SAS URI \
                format json format is an array of objects (each object contains the following \
                values). Example ordinal: Order of DNN input to converter (value range: 0-2) \
                format: format ("RGB" or "BGR") If not specified, do not evaluate.
     * - networkConfig (str, optional) - URI of network config file (json format) \
                Evaluate Azure: SAS URI+ AWS: Presigned URIs In case of pre-conversion \
                model, specify. (=Ignored for post-conversion model) Usage: Conversion parameter \
                information of model converter. Illegal characters except for SAS URI format \
                If not specified, do not evaluate.
     * - networkType (str, optional) - The Network Type. (Valid only for \
                new model registration). \
                - 0: Custom Vision(Third party trademark) \
                - 1: Non-CustomVision+ \
                1 if not specified.
     * - labels (Array<str>, optional) - Label Name. Example: ["label01","label02","label03"]
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
    importBaseModel(
        modelId: string,
        model: string,
        converted?: boolean,
        vendorName?: string,
        comment?: string,
        inputFormatParam?: string,
        networkConfig?: string,
        networkType?: string,
        labels?: Array<string>
    ) {
        const response = this.importBaseModelObj.importBaseModel(
            modelId,
            model,
            converted,
            vendorName,
            comment,
            inputFormatParam,
            networkConfig,
            networkType,
            labels
        );
        return response;
    }

    /**
     * publishModel - Provide the ability to publish transformation models. \
        Since model import takes time, asynchronous execution is performed.
     * @params
     * - modelId (str, required) - The model Id.
     * - deviceId (str, optional) - Device ID Specify when the device model is eligible.\
                Not specified if the base model is the target. Case-sensitive.
     * @returns
     * - Object: table:: Success Response
                
            +----------------+------------+-------------------------------+
            |  Level1        |  Type      |  Description                  |
            +----------------+------------+-------------------------------+
            |  `result`      |  `string`  | Set "SUCCESS" pinning         |
            +----------------+------------+-------------------------------+
            |  `import_id`   |  `string`  | Set the import_id of          |
            |                |            | Model Import Rest API         |
            |                |            | (model-import) response       |
            +----------------+------------+-------------------------------+

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
     *   if any input string parameter found empty OR.
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
    publishModel(modelId: string, deviceId?: string) {
        const response = this.publishModelObj.publishModel(modelId, deviceId);
        return response;
    }

    /**
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
     */
    publishModelWaitResponse(
        modelId: string,
        deviceId?: string,
        // eslint-disable-next-line @typescript-eslint/ban-types
        callback?: Function
    ) {
        const response =
            this.publishModelWaitResponseObj.publishModelWaitResponse(
                modelId,
                deviceId,
                callback
            );
        return response;
    }
}
