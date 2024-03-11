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

import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import { Configuration, TrainModelApi } from 'js-client';
import * as Logger from '../common/logger/logger';
import { getMessage } from '../common/logger/getMessage';
import { ErrorCodes, genericErrorMessage, validationErrorMessage } from '../common/errorCodes';
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
 * This class provide method to retrieves status of specified base model information.
 */
export class GetBaseModelStatus {
    config: Config;
    ajv = new Ajv();
    api: TrainModelApi;

    constructor(config: Config) {
        this.config = config;
    }

    /**
    * Schema for API to retrieves the specified base model information.

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
            latestType: {
                type: 'string',
                default: '1',
                errorMessage: {
                    type: 'Invalid string for latestType'
                },
            },
        },
        required: ['modelId'],
        additionalProperties: false,
        errorMessage: {
            required: {
                modelId: 'modelId is required',
            },
        },
    };

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
            |            |``model_            |``object`` |Set the the performance            |
            |            |performances``      |           |information of the model.          |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``latest_flg``      |``string`` |Set the latest flag                |
            +------------+--------------------+-----------+-----------------------------------+
            |            |``publish_latest_   |``string`` |Set the latest published flag      |
            |            |flg``               |           |                                   |
            +------------+--------------------+-----------+-----------------------------------+
            |            | ``version_status`` | ``string`` |Set your status                   |
            |            |                    |            |                                  |
            |            |                    |            |'01': 'Before conversion'         |
            |            |                    |            |                                  |
            |            |                    |            |'02': 'Converting'                |
            |            |                    |            |                                  |
            |            |                    |            |'03': 'Conversion failed'         |
            |            |                    |            |                                  |
            |            |                    |            |'04': 'Conversion complete'       |
            |            |                    |            |                                  |
            |            |                    |            |'05': 'Adding to configuration'   |
            |            |                    |            |                                  |
            |            |                    |            |'06': 'Add to configuration       |
            |            |                    |            |failed'                           |
            |            |                    |            |                                  |
            |            |                    |            |'07': 'Add to configuration       |
            |            |                    |            |complete'                         |
            |            |                    |            |                                  |
            |            |                    |            |'11': 'Saving' Model saving       |
            |            |                    |            |status in Model Retrainer case    |
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
     *    const applicationId: '__applicationId__';
     *    const config = new Config(consoleEndpoint,portalAuthorizationEndpoint,
     *                              clientId, clientSecret, applicationId);
     *
     *    const client = await Client.createInstance(config);
     *    const modelId: '__modelId__';
     *    const latestType: '__latestType__';
     *    const response= await client.aiModel.getBaseModelStatus(modelId, latestType);
     *
     */
    async getBaseModelStatus(modelId: string, latestType?: string) {
        Logger.info('getBaseModelStatus');
        let valid = true;
        try {
            const validate = ajv.compile(this.schema);
            valid = validate({ modelId, latestType });
            if (!valid) {
                Logger.error(`${validate.errors}`);
                throw validate.errors;
            }
            const accessToken = await this.config.getAccessToken();
            const baseOptions = await this.config.setOption();

            const apiConfig = new Configuration({
                basePath: this.config.consoleEndpoint,
                accessToken,
                baseOptions
            });
            this.api = new TrainModelApi(apiConfig);

            let res;
            if (this.config.applicationId) {
                res = await this.api.getBaseModelStatus(modelId, 'client_credentials', latestType);
            } else {
                res = await this.api.getBaseModelStatus(modelId, undefined, latestType);
            }
            return res;
        } catch (error) {
            if (!valid) {
                Logger.error(getMessage(ErrorCodes.ERROR, error[0].message));
                return validationErrorMessage(getMessage(ErrorCodes.ERROR, error[0].message));
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
