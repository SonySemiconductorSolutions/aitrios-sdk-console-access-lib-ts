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
        this.publishModelWaitResponseObj = new PublishModelWaitResponse(this.config);
    }

    /**
     * deleteModel - Deletes the base model, device model, and project associated with
     * the specified model ID.
     * @params
     * - modelId (str, required) - Model Id.
     * @returns 
     * - Object: table:: Success Response

            +------------+------------+-------------------------------+
            | *Level1*   | *Type*     | *Description*                 |
            +============+============+===============================+
            | ``result`` | ``string`` | Set "SUCCESS" fixing.         |
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
     *   If incorrect API input parameters OR
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
     * getBaseModelStatus - Get the specified base model information.
     * @params
     * - modelId(str, required) - Model ID.
     * - latestType (str, optional) - Latest version type \
            - Value definition \
              0: Latest published version \
              1: Latest version (latest including model version being converted/published) \
            Default: '1'

     * @returns 
     * - Object: table:: Success Response

            +-----------------+----------+----------+-----------------------------------------+
            | *Level1*        | *Level2* | *Type*   |*Description*                            |
            +=================+==========+==========+=========================================+
            |``model_id``     |          |``string``|Set the model ID                         |
            +-----------------+----------+----------+-----------------------------------------+
            |``model_type``   |          |``string``|Set the model type                       |
            +-----------------+----------+----------+-----------------------------------------+
            |``functionality``|          |``string``|Set the function                         |
            |                 |          |          |descriptions                             |
            +-----------------+----------+----------+-----------------------------------------+
            |``vendor_name``  |          |``string``|Set the vendor name                      |
            +-----------------+----------+----------+-----------------------------------------+
            |``model_comment``|          |``string``|Set the description                      |
            +-----------------+----------+----------+-----------------------------------------+
            |``network_type`` |          |``string``|Set the network type.                    |
            +-----------------+----------+----------+-----------------------------------------+
            |``create_by``    |          |``string``| Set the create_by.                      |
            |                 |          |          | - Value definition                      |
            |                 |          |          | Self: Self-training models              |
            |                 |          |          | Marketplace: Marketplace purchasing     |
            |                 |          |          | model                                   |
            +-----------------+----------+----------+-----------------------------------------+
            |``package_id``   |          |``string``|Set the marketplace package ID.          |
            +-----------------+----------+----------+-----------------------------------------+
            |``product_id``   |          |``string``|Set the marketplace product ID.          |
            +-----------------+----------+----------+-----------------------------------------+
            |``metadata_format|          |``string``|Set the metadata_format_id               |
            |_id``            |          |          |                                         |
            +-----------------+----------+----------+-----------------------------------------+
            |``projects``     |          |``array`` |                                         |
            +-----------------+----------+----------+-----------------------------------------+
            |                 |``model_  |``string``|Set the model project name               |
            |                 |project_  |          |                                         |
            |                 |name``    |          |                                         |
            +-----------------+----------+----------+-----------------------------------------+
            |                 |``model_  |``string``|Set the model project                    |
            |                 |project_  |          |ID                                       |
            |                 |id``      |          |                                         |
            +-----------------+----------+----------+-----------------------------------------+
            |                 |``model_  |``string``|Set up the model platform                |
            |                 |platform``|          |                                         |
            +-----------------+----------+----------+-----------------------------------------+
            |                 |``model_  |``string``|Set the model type                       |
            |                 |type``    |          |                                         |
            |                 |          |          |                                         |
            +-----------------+----------+----------+-----------------------------------------+
            |                 |``project_|``string``|Set the project type                     |
            |                 |type``    |          |                                         |
            +-----------------+----------+----------+-----------------------------------------+
            |                 |``device_ |``string``|Set the device ID                        |
            |                 |id``      |          |                                         |
            +-----------------+----------+----------+-----------------------------------------+
            |                 |``versi   |``array`` |Refer : Table : 1.0                      |
            |                 |ons``     |          |for more details                         |
            +-----------------+----------+----------+-----------------------------------------+

            @Table : 1.0 - versions schema details

            +------------+--------------------+-----------+-----------------------------------+
            | *Level1*   | *Level2*           | *Type*    | *Description*                     |
            +============+====================+===========+===================================+
            |``versions``|                    | ``array`` |There must be one subordinate      |
            |            |                    |           |element for this API.              |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``version_number``  | ``string``|Set the version number             |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``iteration_id``    |``string`` |Set the iteration ID               |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``iteration_name``  |``string`` |Set the iteration name             |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``accuracy``        |``string`` |Set the accuracy                   |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``model_            |``object`` |Set the the performance information|
            |            |performances``      |           |of the model.                      |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``latest_flg``      |``string`` |Set the latest flag                |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``publish_latest_   |``string`` |Set the latest published flag      |
            |            |flg``               |           |                                   |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``version_status``  |``string`` |Set the status                     |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``org_file_name``   |``string`` |Set the preconversion model        |
            |            |                    |           |filename.                          |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``org_file_size``   |``number`` |Set the publish model file size    |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``publish_file_     |``string`` |Set the publish model file name    |
            |            |name``              |           |                                   |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``publish_file_     |``number`` |Set the publish model file size    |
            |            |size``              |           |                                   |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``model_file_size`` |``number`` |Set the model file size.           |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``model_framework`` |``string`` |Set up the model framework         |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``conv_id``         |``string`` |Set the conversion request ID      |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``labels``          |``array``  |Set the label array                |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``stage``           |``string`` |Set the conversion stage           |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``result``          |``string`` |Set the conversion result          |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``kpi``             |``object`` |                                   |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``converter_log``   |``array``  |converter log.                     |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``convert_start_    |``string`` |Set the conversion start date      |
            |            |date``              |           |                                   |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``convert_end_date``|``string`` |Set the conversion end date        |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``publish_start_    |``string`` |Set the publish start date         |
            |            |date``              |           |                                   |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``publish_end_date``|``string`` |Set the publish end date           |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``version_comment`` |``string`` |Set the description                |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``version_ins_date``|``string`` |Set the created time of the        |
            |            |                    |           |version.                           |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``version_upd_date``|``string`` |Set the created time of the        |
            |            |                    |           |version.                           |
            +------------+--------------------+-----------+-----------------------------------+

     * - 'Generic Error Response' :
     *   If Any generic error returned from the Low Level SDK.
     *   Object with below key and value pairs.
     *      - 'result' (str) : "ERROR"
     *      - 'message' (str) : error message returned from the Low Level SDK API
     *      - 'code' (str) : "Generic Error"
     *      - 'datetime' (str) : Time
     * 
     * - 'Validation Error Response' :
     *   If incorrect API input parameters OR
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
        const response = this.getBaseModelStatusObj.getBaseModelStatus(modelId, latestType);
        return response;
    }

    /**
     * getModels -  Get the model list information.
     * @params
     * - modelId (str, optional) -  Model ID. *Partial match search
     * - comment (str, optional) - Model description. *Partial match search
     * - projectName (str, optional) - Project name. *Partial match search
     * - modelPlatform (str, optional) - Model Platform. \
            - Value definition \
              0 : Custom Vision \
              1 : Non Custom Vision
     * - projectType (str, optional) - Project Type. \
            - Value definition \
              0 : Base model \
              1 : Device model
     * - deviceId (str, optional)- Device Id.
     * - latestType (str, optional) - Latest version type \
            - Value definition \
              0: Latest published version \
              1: Latest version (latest including model version being converted/published) \
            Default: '1'
     * @returns 
     * - Object: table:: Success Response

            +------------+-------------------+------------+-------------------------------+
            | *Level1*   | *Level2*          | *Type*     | *Description*                 |
            +============+===================+============+===============================+
            | ``models`` |                   | ``array``  |                               |
            +------------+-------------------+------------+-------------------------------+
            |            | ``model_id``      | ``string`` | Set the model ID              |
            +------------+-------------------+------------+-------------------------------+
            |            | ``model_type``    | ``string`` | Set the model type            |
            +------------+-------------------+------------+-------------------------------+
            |            | ``functionality`` | ``string`` | Set the feature descriptions  |
            +------------+-------------------+------------+-------------------------------+
            |            | ``vendor_name``   | ``string`` | Set the vendor name           |
            +------------+-------------------+------------+-------------------------------+
            |            | ``model_comment`` | ``string`` | Set the description           |
            +------------+-------------------+------------+-------------------------------+
            |            | ``network_type``  | ``string`` | Set the network type.         |
            +------------+-------------------+------------+-------------------------------+
            |            | ``create_by``     | ``string`` | Set the create_by.            |
            |            |                   |            | - Value definition            |
            |            |                   |            | Self: Self-training models    |
            |            |                   |            | Marketplace: Marketplace      |
            |            |                   |            | purchacing model              |
            +------------+-------------------+------------+-------------------------------+
            |            | ``package_id``    | ``string`` | Set the marketplace package ID|
            +------------+-------------------+------------+-------------------------------+
            |            | ``product_id``    | ``string`` | Set the marketplace product ID|
            +------------+-------------------+------------+-------------------------------+
            |            |``metadata_format_ | ``string`` | Set the metadata_format_id.   |
            |            |id``               |            |                               |
            +------------+-------------------+------------+-------------------------------+
            |            | ``projects``      | ``array``  | Refer : Table : 1.0           |
            |            |                   |            | for more details              |
            +------------+-------------------+------------+-------------------------------+

            @Table : 1.0 - projects schema details

            +------------+--------------------+------------+-----------------------------------+
            | *Level1*   | *Level2*           | *Type*     | *Description*                     |
            +============+====================+============+===================================+
            |``projects``|                    | ``array``  |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``model_project_    | ``string`` |Set the model project name         |
            |            |name``              |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``model_project_    | ``string`` |Set the model project id           |
            |            |id``                |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``model_platform``  |``string``  |Set the model platform             |
            +------------+--------------------+------------+-----------------------------------+
            |            |``model_type``      |``string``  |Set the model type                 |
            +------------+--------------------+------------+-----------------------------------+
            |            |``project_type``    |``string``  |Set the project type               |
            +------------+--------------------+------------+-----------------------------------+
            |            |``device_id``       |``string``  |Set the device ID                  |
            +------------+--------------------+------------+-----------------------------------+
            |            |``versions``        |``array``   |Refer : Table : 1.1                |
            |            |                    |            |for more details                   |
            +------------+--------------------+------------+-----------------------------------+

            @Table : 1.1 - versions schema details

            +------------+--------------------+------------+-----------------------------------+
            | *Level1*   | *Level2*           | *Type*     | *Description*                     |
            +============+====================+============+===================================+
            |``versions``|                    | ``array``  |There must be one subordinate      |
            |            |                    |            |element for this API.              |
            +------------+--------------------+------------+-----------------------------------+
            |            |``version_number``  | ``string`` |Set the version number             |
            +------------+--------------------+------------+-----------------------------------+
            |            |``iteration_id``    |``string``  |Set the iteration ID               |
            +------------+--------------------+------------+-----------------------------------+
            |            |``iteration_name``  |``string``  |Set the iteration name             |
            +------------+--------------------+------------+-----------------------------------+
            |            |``accuracy``        |``string``  |Set the accuracy                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``model_performan   |``object``  |Set the performance information    |
            |            |ces``               |            |of the model.                      |
            +------------+--------------------+------------+-----------------------------------+
            |            |``latest_flg``      |``string``  |Set the latest flag                |
            +------------+--------------------+------------+-----------------------------------+
            |            |``publish_latest    |``string``  |Set the latest published flag      |
            |            |_flg``              |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``version_status``  |``string``  |Set the status                     |
            +------------+--------------------+------------+-----------------------------------+
            |            |``org_file_name``   |``string``  |Set the preconversion model        |
            |            |                    |            |filename.                          |
            +------------+--------------------+------------+-----------------------------------+
            |            |``org_file_size``   |``number``  |Set the publish model file size    |
            +------------+--------------------+------------+-----------------------------------+
            |            |``publish_file_     |``string``  |Set the publish model filename     |
            |            |name``              |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``publish_file_     |``number``  |Set the publish model file size    |
            |            |size``              |            |                                   |
            +------------+--------------------+------------+-----------------------------------+
            |            |``model_file_size`` |``number``  |Set the model file size            |
            +------------+--------------------+------------+-----------------------------------+
            |            |``model_framework`` |``string``  |Set the model framework            |
            +------------+--------------------+------------+-----------------------------------+
            |            |``conv_id``         |``string``  |Set the conversion request ID      |
            +------------+--------------------+------------+-----------------------------------+
            |            |``labels``          |``string[]``|Set the label array                |
            +------------+--------------------+------------+-----------------------------------+
            |            |``stage``           |``string``  |Set the conversion stage           |
            +------------+--------------------+------------+-----------------------------------+
            |            |``kpi``             |``array``   |                                   |
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
     *   If incorrect API input parameters OR
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
     * importBaseModel - Import the base model. In addition, in the case of a new model \
        ID, it is newly saved. If you specify a model ID that has already been registered \
        in the system, the version will be upgraded.
     * @params
     * - modelId (str, required) - Model ID for new registration or version upgrade. \
                                   Max. 100 characters. \
                                   The following characters are allowed \
                                   Alphanumeric characters \
                                   -hyphen \
                                   _ Underscore \
                                   () Small parentheses \
                                   . dot
                                   
     * - model (str, required) - SAS URI or Presigned URI of the model file.
     * - converted (bool, optional) - Specify whether to convert the specified model file.
     * - vendorName (str, optional) -  Vendor Name. Max. 100 characters. \
            *Specify only when registering a new base model.
     * - comment (str, optional) - Description. Max. 100 characters. \
            *When saving new, it is set as a description of the model and version. \
            *When saving version-up, it is set as a description of the version.
     * - inputFormatParam (str, optional) - SAS URI or Presigned URI of the input format
     *           param file. \
                 - Usage: Packager conversion information (image format information). \
                 - The json format is an array of objects. Each object contains the \
                   following values. \
                     - ordinal: Order of DNN input to converter (value range: 0 to 2) \
                     - format: Format ("RGB" or "BGR")
     * - networkConfig (str, optional) - SAS URI or Presigned URI of the network config file. \
                - Usage: Conversion parameter information of modelconverter. \
                Therefore, it is not necessary to specify when specifying the model 
                before conversion.
     *          - Example: 
     * ```ts
     *           {
     *               "Postprocessor": {
     *                   "params": {
     *                       "background": false,
     *                       "scale_factors": [ 10.0, 10.0, 5.0, 5.0 ],
     *                       "score_thresh": 0.01,
     *                       "max_size_per_class": 64,
     *                       "max_total_size": 64,
     *                       "clip_window": [ 0, 0, 1, 1 ],
     *                       "iou_threshold": 0.45
     *                   }
     *               }
     *           }
     * ```
     * - networkType (str, optional) - Specify whether or not application is required for the \
                model. \
            - Value definition \
              0 : Model required application \
              1 : Model do not required application
     * - metadataFormatId (str, optional) - Metadata Format ID. Max. 100 characters.
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
     *   If incorrect API input parameters OR
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
        metadataFormatId?: string
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
            metadataFormatId
        );
        return response;
    }

    /**
     * publishModel - Provide a function to publish a conversion model. \
        As model publishing takes time, this is performed asynchronously. \
        *Check the processing status in the result of the GetBaseModelStatus API \
        or GetDeviceModelStatus API response. If the result is 'Import completed', \
        the process is completed.
     * @params
     * - modelId (str, required) - Model ID.
     * - deviceId (str, optional) - Device ID \
            *Specify this when the device model is the target. \
            Do not specify this when the base model is the target.
     * @returns
     * - Object: table:: Success Response
                
            +----------------+------------+-------------------------------+
            | *Level1*       | *Type*     | *Description*                 |
            +================+============+===============================+
            | ``result``     | ``string`` | Set "SUCCESS" fixing          |
            +----------------+------------+-------------------------------+
            | ``import_id``  | ``string`` | Set the conv id               |
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
     *   If incorrect API input parameters OR
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
     * - modelId (str, required) : Model Id.
     * - deviceId (str, optional) : Device ID \
            *Specify this when the device model is the target. \
            Do not specify this when the base model is the target.
     * - callback (function, optional) : A function handle of the form - \
                `publishCallback(status)`, where `status` is the notified publish status. \
                Callback Function to check the publishing status with `getBaseModelStatus`, \
                and if not completed, call the callback function to notify the publishing status.\
                If not specified, no callback notification.
     * @returns
     * - Object: table:: Success Response

            +-------------------+------------+-------------------------------+
            |  Level1           |  Type      |  Description                  |
            +===================+============+===============================+
            | ``result``        | ``string`` | "SUCCESS"                     |
            +-------------------+------------+-------------------------------+
            | ``process time``  | ``string`` | Processing Time               |
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
     *   If incorrect API input parameters OR
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
