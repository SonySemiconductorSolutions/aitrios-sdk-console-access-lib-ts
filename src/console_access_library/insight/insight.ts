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

import { GetImages } from './getImages';
import { GetImageDirectories } from './getImageDirectories';
import { GetInferenceResults } from './getInferenceResults';
import { GetImageData } from './getImageData';
import { ExportImages } from './exportImages';
import { GetLastInferenceAndImageData } from './getLastInferenceAndImageData';
import { GetLastInferenceData } from './getLastInferenceData';
import { Config } from '../common/config';

/**
 * Abstract class to access Console Access Library Insight component APIs from Insight component
 */
export class Insight {
    /**
     * @ignorea
     */
    config: Config;
    getImagesObj: GetImages;
    getImageDirectoriesObj: GetImageDirectories;
    getInferenceResultsObj: GetInferenceResults;
    getImageDataObj: GetImageData;
    getLastInferenceAndImageDataObj: GetLastInferenceAndImageData;
    getLastInferenceDataObj: GetLastInferenceData;
    exportImagesObj: ExportImages;

    /**
     * Constructor Method for Insight Abstract class
     * @param config Object of Config class
     */
    constructor(config: Config) {
        this.config = config;
        this.getImagesObj = new GetImages(this.config);
        this.getImageDirectoriesObj = new GetImageDirectories(this.config);
        this.getInferenceResultsObj = new GetInferenceResults(this.config);
        this.getImageDataObj = new GetImageData(this.config);
        this.getLastInferenceAndImageDataObj = new GetLastInferenceAndImageData(this.config);
        this.getLastInferenceDataObj = new GetLastInferenceData(this.config);
        this.exportImagesObj = new ExportImages(this.config);
    }

    /**
     * getImages- Get the (saved) images for a specified device. \
        *Application: Use to display an image in a UI
     *  @params
     * - deviceId (str, required) - Device ID.
     * - subDirectoryName (str, required) - Directory name.
     * - numberOfImages (number, optional) - Number of images to fetch. \
            Value range: 0 to 256 \
            Default: 50.
     * - skip (number, optional) - Number of images to skip fetching. \
                Default: 0.
     * - orderBy (str, optional) - Sort order: Sorted by date image was created.
            Value range: DESC, ASC \
            Default: ASC. 
     * @returns 
     * - Object: table:: Success Response

            +-----------------------+------------+------------+---------------------------+
            | *Level1*              | *Level2*   | *Type*     | *Description*             |
            +=======================+============+============+===========================+
            | ``total_image_count`` |            | ``number`` | Set the total number of   |
            |                       |            |            | images                    |
            +-----------------------+------------+------------+---------------------------+
            |``images``             |            | ``array``  |                           |
            +-----------------------+------------+------------+---------------------------+
            |                       | ``name``   | ``string`` | Set the image filename.   |
            +-----------------------+------------+------------+---------------------------+
            |                       |``contents``| ``string`` | Images file contents      |
            |                       |            |            | (BASE64 encoding)         |
            +-----------------------+------------+------------+---------------------------+

     * - 'Generic Error Response' :
     *   If Any generic error returned from the Low Level SDK. Object with below key and value pairs.
     *      - 'result' (str) : "ERROR"
     *      - 'message' (str) : error message returned from the Low Level SDK API
     *      - 'code' (str) : "Generic Error"
     *      - 'datetime' (str) : Time
     *
     * - 'Validation Error Response' :
     *   if any input string parameter found empty OR \
     *   if any input number parameter found negative OR \
     *   if any input non number parameter found.
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
    getImages(
        deviceId: string,
        subDirectoryName: string,
        numberOfImages?: number,
        skip?: number,
        orderBy?: string
    ) {
        const response = this.getImagesObj.getImages(
            deviceId,
            subDirectoryName,
            numberOfImages,
            skip,
            orderBy
        );
        return response;
    }

    /**
     * getImageDirectories- Get the image save directory list of the devices for each device \
        group.
     * 
     *  @params 
     * - deviceId (str, optional):  Device ID. \
            If this is specified, return an image directory list linked to the specified device ID.
     * @returns 
     * - Object: table:: Success Response

            +------------------+------------+------------+-------------------------------+
            | *Level1*         | *Level2*   | *Type*     | *Description*                 |
            +==================+============+============+===============================+
            | ``No_item_name`` |            | ``array``  |                               |
            +------------------+------------+------------+-------------------------------+
            |                  |``group_id``| ``string`` | Set the device group ID.      |
            +------------------+------------+------------+-------------------------------+
            |                  | ``devices``| ``array``  | Refer : Table : 1.0           |
            |                  |            |            | for more details              |
            +------------------+------------+------------+-------------------------------+

            @Table : 1.0 - devices schema details

            +-------------------+--------------------+------------+--------------------------+
            | *Level1*          | *Level2*           | *Type*     | *Description*            |
            +===================+====================+============+==========================+
            | ``devices``       |  ``array``         |            |                          |
            +-------------------+--------------------+------------+--------------------------+
            |                   |``device_id``       | ``string`` | Set the device ID.       |
            +-------------------+--------------------+------------+--------------------------+
            |                   |``device_name``     | ``string`` | Set the device name.     |
            +-------------------+--------------------+------------+--------------------------+
            |                   |``Image``           | ``array``  | Refer : Table : 1.1      |
            |                   |                    |            | for more details         |
            +-------------------+--------------------+------------+--------------------------+

            @Table : 1.1 - Image schema details

            +-------------------+--------------------+------------+--------------------------+
            | *Level1*          | *Level2*           | *Type*     | *Description*            |
            +===================+====================+============+==========================+
            | ``Image``         |  ``array``         |            |                          |
            +-------------------+--------------------+------------+--------------------------+
            |                   |  ``No_item_name``  | ``string`` | Set the directory name.  |
            +-------------------+--------------------+------------+--------------------------+

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
    getImageDirectories(deviceId?: string) {
        const response = this.getImageDirectoriesObj.getImageDirectories(deviceId);
        return response;
    }

    /**
     * getInferenceResults- Get the (saved) inference result metadata list information for \
        a specified device.
     *  @params
     *  - deviceId (str, required)  : Device ID.
     *  - filter (str, optional) : Search filter \
            *The specifications are the same except for those of Cosmos DB UI of the Azure portal \
            and those listed below. \
            - A where string does not need to be added to the heading. \
            - deviceID does not need to be added. \

            Example: \
            - Filter by model ID \
              c.ModelID = "0201020001790103" \
            - Filter by Cosmos time stamp \
              c._ts > 1606897951 \
            Samples: \
     *      - ModelID: string  match filter \
            eg. "c.ModelID=\"0300000001590100\"" \
     *      - Image: boolean  match filter \
            eg. "c.Image=true" \
     *      - T: string  match or more filter \
            eg. "c.Inferences[0].T>=\"20230412140050618\"" \
     *      - T: string  range filter \
            eg. "EXISTS(SELECT VALUE i FROM i IN c.Inferences \
            WHERE i.T >= \"20230412140023098\" AND \
            i.T <= \"20230412140029728\")" \
     *      - _ts: number  match filter \
            eg. "c._ts=1681308028"
            Default: ""
     * - numberOfInferenceResults (number, optional): Number of cases to get.
     *                            Return the latest record of the specified number of cases. \
     *                            *Maximum value: 10000 \
     *                            Default: 20
     * - raw (number, optional) : If 1 is specified, add a record stored to Cosmos DB and return it. \
                                - Value definition \
                                    0: Do not add \
                                    1: Add
                                Default: 1
     * - time (str, optional) : When this value is specified, extract the inference result \
                                metadata within the following range. \
            - Extraction range \
              (time - threshold) <= T  
              Time in inference result metadata < (time + threshold) \

            - Value definition \
              yyyy: 4-digit year string \
              MM: 2-digit month string \
              dd: 2-digit day string \
              HH: 2-digit hour string \
              mm: 2-digit minute string \
              ss: 2-digit second string \
              fff: 3-digit millisecond string \

            Default: ""
     * @returns
     * - Object: table:: Success Response

            +------------------+-------------+-----------+------------------------------------+
            | *Level1*         | *Level2*    | *Type*    | *Description*                      |
            +==================+============+============+====================================+
            | ``No_item_name`` |             |           |                                    |
            +------------------+-------------+-----------+------------------------------------+
            |                  |``id``       | ``string``| Inference result metadata ID.      |
            |                  |             |           | =GUID generated automatically by   |
            |                  |             |           | Cosmos DB                          |
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
            |                  |             |           | =_ts of Cosmos DB                  |
            +------------------+-------------+-----------+------------------------------------+
            |                  |``inference  |``string`` |Refer : Table : 1.0                 |
            |                  |_result``    |           |for more details                    |
            +------------------+-------------+-----------+------------------------------------+
            |                  |``inferenc   |``array``  |Refer : Table : 1.1                 |
            |                  |es``         |           |for more details                    |
            +------------------+-------------+-----------+------------------------------------+

            @Table : 1.0 - inference_result schema details

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
            |                    |``Inferences``|``array``   |Refer : Table : 1.1            |
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

            @Table : 1.1 - inferences schema details

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
     *   if any input string parameter found empty OR \
     *   if any input number parameter found negative OR \
     *   if any input non number parameter found. OR \
     *   if any input time format is invalid.
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

    getInferenceResults(
        deviceId: string,
        filter?: string,
        numberOfInferenceResults?: number,
        raw?: number,
        time?: string
    ) {
        const response = this.getInferenceResultsObj.getInferenceResults(
            deviceId,
            filter,
            numberOfInferenceResults,
            raw,
            time
        );
        return response;
    }

    /**
     * getImageData- abstract function to get a (saved) image of the specified device.
     *  @params
     * - deviceId (str, required) : Device ID
     * - subDirectoryName(str, required) : Directory name
     * - numberOfImages (number, optional)  - Number of images to fetch. Value range: 0 to 256. \
                                           Default: 50.
     * - skip (number, optional)- Number of images to skip fetching. \
                               Default: 0.                                          
     * - orderBy (str, optional)- Sort order: Sorted by date image was created. \
                                  Value range: DESC, ASC \
                                  Default: ASC.
     * @returns 
     * - Object: table:: Success Response

            +-----------------------+------------+------------+---------------------------+
            | *Level1*              | *Level2*   | *Type*     | *Description*             |
            +=======================+============+============+===========================+
            | ``total_image_count`` |            | ``number`` | Set the total number of   |
            |                       |            |            | images                    |
            +-----------------------+------------+------------+---------------------------+
            |``images``             |            | ``array``  |                           |
            +-----------------------+------------+------------+---------------------------+
            |                       | ``name``   | ``string`` | Set the image filename.   |
            +-----------------------+------------+------------+---------------------------+
            |                       |``contents``| ``string`` | Images file contents      |
            |                       |            |            | (BASE64 encoding)         |
            +-----------------------+------------+------------+---------------------------+

     * - 'Generic Error Response' :
     *   If Any generic error returned from the Low Level SDK. Object with below key and value pairs.
     *      - 'result' (str) : "ERROR"
     *      - 'message' (str) : error message returned from the Low Level SDK API
     *      - 'code' (str) : "Generic Error"
     *      - 'datetime' (str) : Time
     *
     * - 'Validation Error Response' :
     *   If incorrect API input parameters OR \
     *   if any input string parameter found empty OR \
     *   if any input number parameter found negative OR \
     *   if any input non number parameter found.
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

    getImageData(
        deviceId: string,
        subDirectoryName: string,
        numberOfImages?: number,
        skip?: number,
        orderBy?: string
    ) {
        const response = this.getImageDataObj.getImageData(
            deviceId,
            subDirectoryName,
            numberOfImages,
            skip,
            orderBy
        );
        return response;
    }

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
            |                | ``total_image_count``| ``number`` | Set the total number of   |
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
            |                  |             |           | Cosmos DB                          |
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
            |                  |             |           | =_ts of Cosmos DB                  |
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
            |                    |``DeviceID``  | ``string``  |Device ID                     |
            +--------------------+--------------+------------+-------------------------------+
            |                    |``ModelID``   |``string``   |DnnModelVersion               |
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
     *   if any input string parameter found empty. \
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

    getLastInferenceAndImageData(deviceId: string, subDirectoryName: string) {
        const response =
            this.getLastInferenceAndImageDataObj.getLastInferenceAndImageData(deviceId, subDirectoryName);
        return response;
    }

    /**
     * getLastInferenceData- Retrieves the latest inference result metadata list information for a specified device.
     *  @params
     * - deviceId (str, required) - The Device Id
     * @returns
     * - Object: table:: Success Response

            +------------------+-------------+-----------+------------------------------------+
            | *Level1*         | *Level2*    | *Type*    | *Description*                      |
            +==================+============+============+====================================+
            | ``No_item_name`` |             |           |                                    |
            +------------------+-------------+-----------+------------------------------------+
            |                  |``id``       | ``string``| Inference result metadata ID.      |
            |                  |             |           | =GUID generated automatically by   |
            |                  |             |           | Cosmos DB                          |
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
            |                  |             |           | =_ts of Cosmos DB                  |
            +------------------+-------------+-----------+------------------------------------+
            |                  |``inference  |``string`` |Refer : Table : 1.0                 |
            |                  |_result``    |           |for more details                    |
            +------------------+-------------+-----------+------------------------------------+
            |                  |``inferenc   |``array``  |Refer : Table : 1.1                 |
            |                  |es``         |           |for more details                    |
            +------------------+-------------+-----------+------------------------------------+

            @Table : 1.0 - inference_result schema details

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
            |                    |``Inferences``|``array``   |Refer : Table : 1.1            |
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

            @Table : 1.1 - inferences schema details

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
     */

    getLastInferenceData(deviceId: string) {
        const response = this.getLastInferenceDataObj.getLastInferenceData(deviceId);
        return response;
    }

    /**
     * exportImages- Get the URL to export the images of specified conditions in zip file format. \
        *For encrypted images for learning in other environments

        [Prerequisites]
        - The encryption method is public key cryptography.
        - A zip file containing the target images can be downloaded by accessing a URL. \
          Each image is encoded using the method described hereafter.
        - The key used for encryption is a shared key of 32 characters issued 
          randomly by the API each time.
        - The image encryption method is AES128, MODE_CBC
        - The iv (initial vector, 16 digits) and encrypted data are stored in a zip file.

        [Generating a Key]
        - Private keys are issued by Sier itself.
        - Public and private keys are issued with a length of 1024 or 2048.
        - The public key (key) specified to the parameter of this API passes \
          the pem file content of the public key in a base64 encoded format.

          Example: Base64 encode the entire string as follows:

          -----BEGIN PUBLIC KEY-----

          MIGfMA0GCSqGSIb3DQEBAQUAA4GNADC

          ...

          -----END PUBLIC KEY-----
     *  @params
     * - key (str, required) : Public key. \
            *Base64-encoded format of the entire pem file contents of the public key
     * - fromDatetime (str, optional) : Date and time (From). \
            - Format: yyyyMMddhhmm \
            Default: ""
     * - toDatetime (str, optional) : Date/Time (To). \
            - Format: yyyyMMddhhmm \
            Default: ""
     * - deviceId (str, optional) : Device ID. \
            Default: ""
     * - fileFormat (str, optional) : Image file format. \
            If this is not specified, there is no filtering. \
            - Value definition \
                JPG \
                BMP \
            Default: ""
     * @returns
     * - Object: table:: Success Response

            +-------------+------------+---------------------------+
            | *Level1*    | *Type*     | *Description*             |
            +=============+============+===========================+
            | ``key``     | ``string`` | Shared key for decrypting |
            |             |            | images encrypted by       |
            |             |            | a public key.             |
            +-------------+------------+---------------------------+
            | ``url``     | ``string`` | SUS URI for downloading   |
            +-------------+------------+---------------------------+   

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

    exportImages(
        key: string,
        fromDatetime?: string,
        toDatetime?: string,
        deviceId?: string,
        fileFormat?: string
    ) {
        const response = this.exportImagesObj.exportImages(
            key,
            fromDatetime,
            toDatetime,
            deviceId,
            fileFormat
        );

        return response;
    }
}
