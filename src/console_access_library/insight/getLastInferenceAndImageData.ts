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
import { InsightApi, Configuration } from 'js-client';
import { Config } from '../common/config';
import * as Logger from '../common/logger/logger';
import { getMessage } from '../common/logger/getMessage';
import { ErrorCodes, genericErrorMessage, validationErrorMessage } from '../common/errorCodes';

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
 * This class implements API to get the latest data of saved inference result and image.
 */
export class GetLastInferenceAndImageData {
    config: Config;
    api: InsightApi;

    /**
     * Constructor Method for the class GetLastInferenceAndImageData
     * @param config Object of Config Class
     */
    constructor(config: Config) {
        this.config = config;
    }

    /**
    * Schema for API to retrieve (saved) inference result metadata list information for a specified device.

    Args:
        Schema (object): Ajv JSON schema Validator
    */

    schema = {
        type: 'object',
        properties: {
            deviceId: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for deviceId',
                    isNotEmpty: 'deviceId required or can\'t be empty string',
                },
            },
            subDirectoryName: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: {
                    type: 'Invalid string for subDirectoryName',
                    isNotEmpty:
                        'subDirectoryName required or can\'t be empty string',
                },
            },
        },
        required: ['deviceId', 'subDirectoryName'],
        additionalProperties: false,
        errorMessage: {
            required: {
                deviceId: 'deviceId is required',
                subDirectoryName: 'subDirectoryName is required'
            },
        },
    };

    /**
     * getLastInferenceAndImageData- Get the latest data of saved inference result and image.
     *  @params
     * - deviceId (str, required) - Device ID.
     * - subDirectoryName (str, required) - Directory name.
     * @returns
     * - Object: table:: Success Response
         
            +--------------------+------------+------------------------------------+
            | *Level1*           | *Type*     | *Description*                      |
            +====================+============+====================================+
            | ``image_data``     |``array``   | Refer : Table : 1.0                |
            |                    |            | for more details                   |
            +--------------------+------------+------------------------------------+
            |``inference_data``  |``array``   | Refer : Table : 1.1                |
            |                    |            | for more details                   |
            +--------------------+------------+------------------------------------+

            @Table : 1.0 - image_data schema details

            +----------------+----------------------+------------+---------------------------+
            | *Level1*       | *Level2*             | *Type*     | *Description*             |
            +================+======================+============+===========================+
            | ``image_data`` |                      | ``array``  | image data                |
            |                |                      |            |                           |
            +----------------+----------------------+------------+---------------------------+
            |                | ``total_image_count``|``number``  | Set the total number of   |
            |                |                      |            | images                    |
            +----------------+----------------------+------------+---------------------------+
            |                | ``images``           | ``array``  | Refer : Table : 1.2       |
            |                |                      |            | for more details          |
            +----------------+----------------------+------------+---------------------------+

            @Table : 1.2 - images schema details

            +-----------------------+------------+------------+---------------------------+
            | *Level1*              | *Level2*   | *Type*     | *Description*             |
            +=======================+============+============+===========================+
            |``images``             |            | ``array``  |                           |
            +-----------------------+------------+------------+---------------------------+
            |                       | ``name``   | ``string`` | Set the image filename.   |
            +-----------------------+------------+------------+---------------------------+
            |                       |``contents``| ``string`` | Images file contents      |
            |                       |            |            | (BASE64 encoding)         |
            +-----------------------+------------+------------+---------------------------+

            @Table : 1.1 - inference_data schema details

            +------------------+-------------+-----------+------------------------------------+
            | *Level1*         | *Level2*    | *Type*    | *Description*                      |
            +==================+=============+===========+====================================+
            |``inference_data``|             |``array``  | inference_data                     |
            +------------------+-------------+-----------+------------------------------------+
            |                  |``id``       | ``string``| Inference result metadata ID.      |
            |                  |             |           | =GUID generated automatically by   |
            |                  |             |           | CosmosDB                           |
            +------------------+-------------+-----------+------------------------------------+
            |                  |``device_id``| ``string``| Device ID.                         |
            +------------------+-------------+-----------+------------------------------------+
            |                  |``model_id`` | ``string``| Model ID.                          |
            +------------------+-------------+-----------+------------------------------------+
            |                  |``version    | ``string``| Version number.                    |
            |                  |_number``    |           |                                    |
            +------------------+-------------+-----------+------------------------------------+
            |                  |``model      |``string`` | Model version ID.                  |
            |                  |_version_id``|           |                                    |
            +------------------+-------------+-----------+------------------------------------+
            |                  |``model      |``string`` | Model type                         |
            |                  |_type``      |           |                                    |
            |                  |             |           | 00: Image category                 |
            |                  |             |           |                                    |
            |                  |             |           | 01: Object detection               |
            +------------------+-------------+-----------+------------------------------------+
            |                  |``training   |``string`` |                                    |
            |                  |_kit_name``  |           |                                    |
            +------------------+-------------+-----------+------------------------------------+
            |                  |``_ts``      |``number`` | Timestamp.                         |
            |                  |             |           | =_ts of CosmosDB                   |
            +------------------+-------------+-----------+------------------------------------+
            |                  |``inference  |``string`` |Refer : Table : 1.3                 |
            |                  |_result``    |           |for more details                    |
            +------------------+-------------+-----------+------------------------------------+
            |                  |``inferenc   |``array``  |Refer : Table : 1.4                 |
            |                  |es``         |           |for more details                    |
            +------------------+-------------+-----------+------------------------------------+

            @Table : 1.3 - inference_result schema details

            +--------------------+--------------+------------+-------------------------------+
            | *Level1*           | *Level2*     | *Type*     | *Description*                 |
            +====================+==============+============+===============================+
            |``inference_result``|              | ``array``  |                               |
            +--------------------+--------------+------------+-------------------------------+
            |                    |``DeviceID``  | ``string`` |Device ID                      |
            +--------------------+--------------+------------+-------------------------------+
            |                    |``ModelID``   |``string``  |DnnModelVersion                |
            +--------------------+--------------+------------+-------------------------------+
            |                    |``Image``     |``boolean`` |Synchronized to the            |
            |                    |              |            |InputTensor output.            |
            +--------------------+--------------+------------+-------------------------------+
            |                    |``Inferences``|``array``   |Refer : Table : 1.4            |
            |                    |              |            |for more details               |
            +--------------------+--------------+------------+-------------------------------+
            |                    |``id``        |``string``  |                               |
            +--------------------+--------------+------------+-------------------------------+
            |                    |``ttl``       |``number``  |                               |
            +--------------------+--------------+------------+-------------------------------+
            |                    |``_rid``      |``string``  |                               |
            +--------------------+--------------+------------+-------------------------------+
            |                    |``_self``     |``string``  |                               |
            +--------------------+--------------+------------+-------------------------------+
            |                    |``_etag``     |``string``  |                               |
            +--------------------+--------------+------------+-------------------------------+
            |                    |``_attachm    |``string``  |                               |
            |                    |ents``        |            |                               |
            +--------------------+--------------+------------+-------------------------------+
            |                    |``_ts``       |``number``  |                               |
            +--------------------+--------------+------------+-------------------------------+

            @Table : 1.4 - inferences schema details

            +--------------------+--------------+------------+-------------------------------+
            | *Level1*           | *Level2*     | *Type*     | *Description*                 |
            +====================+==============+============+===============================+
            |``inferences``      |              | ``array``  |                               |
            +--------------------+--------------+------------+-------------------------------+
            |                    |``T``         | ``string`` |Time when retrieving           |
            |                    |              |            |data from the sensor.          |
            +--------------------+--------------+------------+-------------------------------+
            |                    |``O``         |``string``  |Output tensor (Encoding format)|
            +--------------------+--------------+------------+-------------------------------+

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
     *    const deviceId = '__deviceId__';
     *    const subDirectoryName = '__subDirectoryName__';
     *    const response= await client.insight.getLastInferenceAndImageData(deviceId, subDirectoryName);
    */

    async getLastInferenceAndImageData(
        deviceId: string,
        subDirectoryName: string
    ) {
        Logger.info('getLastInferenceAndImageData');
        let valid = true;
        try {
            const validate = ajv.compile(this.schema);
            valid = validate({ deviceId, subDirectoryName });
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
            this.api = new InsightApi(apiConfig);
            let latestImageTS = '';

            const numberOfImages = 1;
            const skip = 0;
            const orderBy = 'DESC';

            let imgRes;
            if (this.config.applicationId) {
                imgRes = await this.api.getImages(
                    deviceId,
                    subDirectoryName,
                    'client_credentials',
                    orderBy,
                    numberOfImages,
                    skip
                );
            } else {
                imgRes = await this.api.getImages(
                    deviceId,
                    subDirectoryName,
                    undefined,
                    orderBy,
                    numberOfImages,
                    skip
                );

            }

            if (imgRes && imgRes.data['images'] && imgRes.data['images'][0]) {
                latestImageTS = imgRes.data['images'][0]['name'].replace('.jpg', '');
            }

            const numberOfInferenceResult = 1;
            const filter = undefined;
            const raw = 1;
            const time = latestImageTS;

            let inferenceRes;
            if (this.config.applicationId) {
                inferenceRes = await this.api.getInferenceResults(
                    deviceId,
                    'client_credentials',
                    numberOfInferenceResult,
                    filter,
                    raw,
                    time
                );
            } else {
                inferenceRes = await this.api.getInferenceResults(
                    deviceId,
                    undefined,
                    numberOfInferenceResult,
                    filter,
                    raw,
                    time
                );
            }
            return {
                image_data: imgRes?.data,
                inference_data: inferenceRes?.data[0],
            };
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
