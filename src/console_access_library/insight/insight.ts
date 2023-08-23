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
        this.getLastInferenceAndImageDataObj = new GetLastInferenceAndImageData(
            this.config
        );
        this.getLastInferenceDataObj = new GetLastInferenceData(this.config);
        this.exportImagesObj = new ExportImages(this.config);
    }

    /**
     * getImages- Get a (saved) images of the specified device.
     *  @params
     * - deviceId (str, required) - Device ID. Case-sensitive
     * - subDirectoryName (str, required) - Image storage subdirectory. \
                The subdirectory is the directory notified by the response of \
                start_upload_inference_result or the directory obtained by \
                get_image_directories. 
     * - numberOfImages (int, optional) - Number of images acquired. \
                0-256. If not specified: 50.
     * - skip (int, optional) - Number of images to skip fetching. \
                If not specified: 0.
     * - orderBy (str, optional) - Sort Order: Sort order by date and time the \
                image was created. DESC, ASC, desc, asc. \
                If not specified: ASC. 
     * @returns 
     * - Object: table:: Success Response
    
            +-----------------------+------------+------------+---------------------------+
            |  Level1               |  Level2    |  Type      |  Description              |
            +-----------------------+------------+------------+---------------------------+
            |  `total_image_count`  |            |   `int`    | Set the total number of   |
            |                       |            |            | images                    |
            +-----------------------+------------+------------+---------------------------+
            | `images`              |            |  `array`   | Image file name array     |
            |                       |            |            | The descendant elements   |
            |                       |            |            | are listed in ascending   |
            |                       |            |            | order by image file name. |
            +-----------------------+------------+------------+---------------------------+
            |                       |  `name`    |  `string`  | Set the image file name.  |
            +-----------------------+------------+------------+---------------------------+
            |                       | `contents` |  `string`  | Image file contents       |
            |                       |            |            | \*Base64 encoding         |
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
     *   if any input integer parameter found negative OR \
     *   if any input non integer parameter found.
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
     * getImageDirectories- Abstract function call to `getImageDirectories` API
     * For each device group, a list of image storage directories for each device is acquired.     
     * 
     *  @params 
     * - deviceId (str, optional):  Device ID \
                If specified, the image directory list associated with the specified \
                device ID is returned. Case-sensitive 
     * @returns 
     * - Object: table:: Success Response

            +------------------+------------+------------+-------------------------------+
            |  Level1          |  Level2    |  Type      |  Description                  |
            +------------------+------------+------------+-------------------------------+
            |  `No_item_name`  |            |            | Device Affiliation Group Array|
            +------------------+------------+------------+-------------------------------+
            |                  | `group_id` |   `string` | Set the device group ID.      |
            +------------------+------------+------------+-------------------------------+
            |                  |  `devices` |  `array`   | Refer : Table : 1.0           |
            |                  |            |            | for more details              |
            +------------------+------------+------------+-------------------------------+
            
        @Table : 1.0 - devices schema details

            +-------------------+--------------------+------------+--------------------------+
            |  Level1           |  Level2            |  Type      |  Description             |
            +-------------------+--------------------+------------+--------------------------+
            |  `devices`        |   `array`          |            | Device Array.            |
            |                   |                    |            | The subordinate          |
            |                   |                    |            | elements are listed      |
            |                   |                    |            | in ascending order       |
            |                   |                    |            | by device ID             |   
            +-------------------+--------------------+------------+--------------------------+
            |                   | `device_id`        |   `string` | Device ID.               |
            +-------------------+--------------------+------------+--------------------------+
            |                   | `device_name`      |   `string` | Device name at the time  |
            |                   |                    |            | of registration          | 
            +-------------------+--------------------+------------+--------------------------+
            |                   | `Image`            |  `array`   | The descendant elements  |
            |                   |                    |            | are listed in ascending  | 
            |                   |                    |            | order by directory name. | 
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
        const response =
            this.getImageDirectoriesObj.getImageDirectories(deviceId);
        return response;
    }

    /**
     * getInferenceResults- Abstract function call to 'getInferenceResults' API
     *  @params
     *  - deviceId (str, required) : Device ID. Case-sensitive.
     *  - filter (str, optional: The Filter. Search filter (same specifications as Cosmos DB UI\
     *                                on Azure portal except for the following) \
     *                                   - No need to prepend where string \
     *                                   - It is not necessary to add a deviceID. \
     *                           Filter Samples: \
     *                           - ModelID: string  match filter \
                                        eg. "c.ModelID=\"0300000001590100\"" \
     *                           - Image: boolean  match filter \
                                        eg. "c.Image=true" \
     *                           - T: string  match or more filter \
                                        eg. "c.Inferences[0].T>=\"20230412140050618\"" \
     *                           - T: string  range filter \
                                        eg. "EXISTS(SELECT VALUE i FROM i IN c.Inferences \
                                            WHERE i.T >= \"20230412140023098\" AND \
                                            i.T <= \"20230412140029728\")" \
     *                           - _ts: number  match filter \
                                        eg. "c._ts=1681308028"
     * - numberOfInferenceResults (int, optional): Number of acquisitions. If not specified: 20
     * - raw (int, optional) : The Raw. Data format of inference results. \
     *                               - 1:Append records stored in Cosmos DB. \
     *                               - 0:Not granted. \
     *                                   If not specified: 1
     * - time (str, optional) : The Time. Inference result data stored in Cosmos DB.\
     *                              yyyyMMddHHmmssfff \
     *                               - yyyy: 4-digit year string \
     *                               - MM: 2-digit month string \
     *                               - dd: 2-digit day string \
     *                               - HH: 2-digit hour string \
     *                               - mm: 2-digit minute string \
     *                               - ss: 2-digit seconds string \
     *                               - fff: 3-digit millisecond string
     * @returns
     * - Object: table:: Success Response
    - when time parameter is not specified

            +------------------+-------------+-----------+------------------------------------+
            |  Level1          |  Level2     |  Type     |  Description                       |
            +------------------+-------------+-----------+------------------------------------+
            |  `No_item_name`  |             |           | The subordinate elements are       |
            |                  |             |           | listed in descending order         |
            |                  |             |           | by system registration date        |
            |                  |             |           | and time.                          |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `id`        |  `string` | The ID of the inference            |
            |                  |             |           | result metadata.                   |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `device_id` |  `string` | Device ID.                         |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `model_id`  |  `string` | Model ID.                          |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `model      | `string`  | Dnn Model Version                  |
            |                  |_version_id` |           |                                    |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `model      | `string`  | Model type                         |
            |                  |_type`       |           |                                    |
            |                  |             |           | 00: Image classification           |
            |                  |             |           |                                    |
            |                  |             |           | 01: Object detection               |
            |                  |             |           |                                    |
            |                  |             |           | * In the case of imported          |
            |                  |             |           | models, 01 is fixed at the         |
            |                  |             |           | current level.                     |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `training   | `string`  | Name of the training_kit           |
            |                  |_kit_name`   |           |                                    |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `_ts`       | `string`  | Timestamp. = System                |
            |                  |             |           | registration date and time         |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `inference  | `string`  |Refer :  Table : 1.0                |
            |                  |_result`     |           |for more details                    |
            +------------------+-------------+-----------+------------------------------------+

        @Table : 1.0 - inference_result schema details

            +--------------------+--------------+------------+-------------------------------+
            |  Level1            |  Level2      |  Type      |  Description                  |
            +--------------------+--------------+------------+-------------------------------+
            | `inference_result` |              |  `array`   |Raw data for inference result  |
            |                    |              |            |in ascending order of project  |
            |                    |              |            |type and model project name.   |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `device_id`  |  `string`  |Device ID                      |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `model_id`   | `string`   |DnnModelVersion                |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `image`      | `boolean`  |Is it synchronized with        |
            |                    |              |            |the output of InputTensor?     |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `inferences` | `array`    |Refer : Table : 1.1            |
            |                    |              |            |for more details               |
            +--------------------+--------------+------------+-------------------------------+

        @Table : 1.1 - inferences schema details

            +--------------------+--------------+------------+-------------------------------+
            |  Level1            |  Level2      |  Type      |  Description                  |
            +--------------------+--------------+------------+-------------------------------+
            | `inferences`       |              |  `array`   |Inference result Array         |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `T`          |  `string`  |The time at which the data     |
            |                    |              |            |was acquired from the sensor.  |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `O`          | `string`   |Outputtensor output without    |
            |                    |              |            |going through PPL              |
            +--------------------+--------------+------------+-------------------------------+

    - when time parameter is specified


            +------------------+--------------+-----------+--------------------------------+
            |  Level1          |  Level2      |  Type     |  Description                   |
            +------------------+--------------+-----------+--------------------------------+
            |  `No_item_name`  |              |           | The subordinate elements are   |
            |                  |              |           | listed in descending order     |
            |                  |              |           | by system registration date    |
            |                  |              |           | and time.                      |
            +------------------+--------------+-----------+--------------------------------+
            |                  | `id`         |  `string` | The ID of the inference result |
            |                  |              |           | metadata. = GUID automatically |
            |                  |              |           | fired by CosmosDB              |
            +------------------+--------------+-----------+--------------------------------+
            |                  | `device_id`  |  `string` | Device ID.                     |
            +------------------+--------------+-----------+--------------------------------+
            |                  | `model_id`   |  `string` | Model ID.                      |
            +------------------+--------------+-----------+--------------------------------+
            |                  | `_ts`        | `string`  | Timestamp. = System            |
            |                  |              |           | registration date and time     |
            +------------------+--------------+-----------+--------------------------------+
            |                  | `inferences` | `array`   |Refer :  Table : 1.1            |
            |                  |              |           |for more details                |
            +------------------+--------------+-----------+--------------------------------+
            
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
     *   if any input integer parameter found negative OR \
     *   if any input non integer parameter found. OR \
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
     * - deviceId (str, required) : Device ID. Case-sensitive
     * - subDirectoryName(str, required) : The Sub Directory is the directory \
     *           notified by the response of startUploadInferenceResult or the directory obtained \
     *           by getImageDirectories  
     * - numberOfImages (int, optional)  - The Number Of Images. 0-256. If not specified: 50
     * - skip (int, optional)- Number of images to skip fetching. If not specified: 0.
     * - orderBy (str, optional)- Sort Order: Sort order by date and time the image was \
     *           created |DESC, ASC, desc, asc. If not specified: ASC.
     * @returns 
     * - Object: table:: Success Response
     
            +-----------------------+------------+------------+---------------------------+
            |  Level1               |  Level2    |  Type      |  Description              |
            +-----------------------+------------+------------+---------------------------+
            |  `total_image_count`  |            |   `int`    | Set the total number of   |
            |                       |            |            | images                    |
            +-----------------------+------------+------------+---------------------------+
            | `images`              |            |  `array`   | Image file name array     |
            |                       |            |            | The descendant elements   |
            |                       |            |            | are listed in ascending   |
            |                       |            |            | order by image file name. |
            +-----------------------+------------+------------+---------------------------+
            |                       |  `name`    |  `string`  | Set the image file name.  |
            +-----------------------+------------+------------+---------------------------+
            |                       | `contents` |  `string`  | Image file contents       |
            |                       |            |            | \*Base64 encoding         |
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
     *   if any input integer parameter found negative OR \
     *   if any input non integer parameter found.
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
     * - deviceId (str, required) - The Device Id
     * - subDirectoryName (str, required) - The Sub Directory Name. \
                The subdirectory will be the directory notified in the response \
                of startUploadInferenceResult.
     * @returns
     * - Object: table:: Success Response
    - when time parameter is not specified
         
            +--------------------+------------+------------------------------------+
            |  Level1            |  Type      |  Description                       |
            +--------------------+------------+------------------------------------+
            |  `image_data`      | `array`    | Refer :ref: Table : 1.0            |
            |                    |            | for more details                   |
            +--------------------+------------+------------------------------------+
            | `inference_data`   | `array`    | Refer :  Table : 1.1               |
            |                    |            | for more details                   |
            +--------------------+------------+------------------------------------+

        @Table : 1.0 - image_data schema details

            +----------------+----------------------+------------+---------------------------+
            |  Level1        |  Level2              |  Type      |  Description              |
            +----------------+----------------------+------------+---------------------------+
            |  `image_data`  |                      |  `array`   | image data                |
            |                |                      |            |                           |
            +----------------+----------------------+------------+---------------------------+
            |                |  `total_image_count` |   `int`    | Set the total number of   |
            |                |                      |            | images                    |
            +----------------+----------------------+------------+---------------------------+
            |                |  `images`            |  `array`   | Refer : Table : 1.2       |
            |                |                      |            | for more details          |
            +----------------+----------------------+------------+---------------------------+

        @Table : 1.1 - inference_data schema details

            +------------------+-------------+-----------+------------------------------------+
            |  Level1          |  Level2     |  Type     |  Description                       |
            +------------------+-------------+-----------+------------------------------------+
            | `inference_data` |             | `array`   | inference_data                     |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `id`        |  `string` | The ID of the inference            |
            |                  |             |           | result metadata.                   |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `device_id` |  `string` | Device ID.                         |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `model_id`  |  `string` | Model ID.                          |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `model      | `string`  | Dnn Model Version                  |
            |                  |_version_id` |           |                                    |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `model      | `string`  |Model type.                         |
            |                  |_type`       |           |                                    |
            |                  |             |           |00: Image classification            |
            |                  |             |           |                                    |
            |                  |             |           |01: Object detection                |
            |                  |             |           |                                    |
            |                  |             |           |* In the case of imported           |
            |                  |             |           |models, 01 is fixed at the          |
            |                  |             |           |current level.                      |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `training   | `string`  |Name of the training_kit            |
            |                  |_kit_name`   |           |                                    |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `_ts`       | `string`  |Timestamp. = System                 |
            |                  |             |           |registration date and time          |
            +------------------+-------------+-----------+------------------------------------+
            |                  | `inference  | `string`  |Refer :  Table : 1.3                |
            |                  |_result`     |           |for more details                    |
            +------------------+-------------+-----------+------------------------------------+

        @Table : 1.2 - images schema details

            +-----------------------+------------+------------+---------------------------+
            |  Level1               |  Level2    |  Type      |  Description              |
            +-----------------------+------------+------------+---------------------------+
            | `images`              |            |  `array`   | Image file name array     |
            |                       |            |            | The descendant elements   |
            |                       |            |            | are listed in ascending   |
            |                       |            |            | order by image file name. |
            +-----------------------+------------+------------+---------------------------+
            |                       | `name`     |  `string`  | Set the image file name.  |
            +-----------------------+------------+------------+---------------------------+
            |                       | `contents` |  `string`  | Image file contents       |
            |                       |            |            | * Base64 encoding         |
            +-----------------------+------------+------------+---------------------------+

        @Table : 1.3 - inference_result schema details

            +--------------------+--------------+------------+-------------------------------+
            |  Level1            |  Level2      |  Type      |  Description                  |
            +--------------------+--------------+------------+-------------------------------+
            | `inference_result` |              |  `array`   |Raw data for inference result  |
            |                    |              |            |in ascending order of project  |
            |                    |              |            |type and model project name.   |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `device_id`  |  `string`  |Device ID                      |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `model_id`   | `string`   |DnnModelVersion                |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `image`      | `boolean`  |Is it synchronized with        |
            |                    |              |            |the output of InputTensor?     |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `inferences` | `array`    |Refer : Table : 1.4            |
            |                    |              |            |for more details               |
            +--------------------+--------------+------------+-------------------------------+

        @Table : 1.4 - inferences schema details

            +--------------------+--------------+------------+-------------------------------+
            |  Level1            |  Level2      |  Type      |  Description                  |
            +--------------------+--------------+------------+-------------------------------+
            | `inferences`       |              |  `array`   |Inference result Array         |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `T`          |  `string`  |The time at which the data     |
            |                    |              |            |was acquired from the sensor.  |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `O`          | `string`   |Outputtensor output without    |
            |                    |              |            |going through PPL              |
            +--------------------+--------------+------------+-------------------------------+
            
    - when time parameter is specified

            +--------------------+------------+------------------------------------+
            |  Level1            |  Type      |  Description                       |
            +--------------------+------------+------------------------------------+
            |  `image_data`      | `array`    | Refer : Table : 1.5                |
            |                    |            | for more details                   |
            +--------------------+------------+------------------------------------+
            | `inference_data`   | `array`    | Refer : Table : 1.6                |
            |                    |            | for more details                   |
            +--------------------+------------+------------------------------------+

        @Table : 1.5 - image_data schema details

            +----------------+----------------------+------------+---------------------------+
            |  Level1        |  Level2              |  Type      |  Description              |
            +----------------+----------------------+------------+---------------------------+
            |  `image_data`  |                      |  `array`   | image data                |
            |                |                      |            |                           |
            +----------------+----------------------+------------+---------------------------+
            |                |  `total_image_count `|   `int`    | Set the total number of   |
            |                |                      |            | images                    |
            +----------------+----------------------+------------+---------------------------+
            |                |  `images`            |  `array`   | Refer : Table : 1.7     ` |
            |                |                      |            | for more details          |
            +----------------+----------------------+------------+---------------------------+

        @Table : 1.6 - inference_data schema details

            +------------------+--------------+-----------+--------------------------------+
            |  Level1          |  Level2      |  Type     |  Description                   |
            +------------------+--------------+-----------+--------------------------------+
            | `inference_data` |              | `array`   | inference_data                 |
            +------------------+--------------+-----------+--------------------------------+
            |                  | `id`         |  `string` | The ID of the inference result |
            |                  |              |           | metadata. = GUID automatically |
            |                  |              |           | fired by CosmosDB              |
            +------------------+--------------+-----------+--------------------------------+
            |                  | `device_id`  |  `string` | Device ID.                     |
            +------------------+--------------+-----------+--------------------------------+
            |                  | `model_id`   |  `string` | Model ID.                      |
            +------------------+--------------+-----------+--------------------------------+
            |                  | `_ts`        | `string`  | Timestamp. = System            |
            |                  |              |           | registration date and time     |
            +------------------+--------------+-----------+--------------------------------+
            |                  | `inferences` | `array`   |Refer : Table : 1.4             |
            |                  |              |           |for more details                |
            +------------------+--------------+-----------+--------------------------------+

        @Table : 1.7 - images schema details

            +-----------------------+------------+------------+---------------------------+
            |  Level1               |  Level2    |  Type      |  Description              |
            +-----------------------+------------+------------+---------------------------+
            | `images`              |            |  `array`   | Image file name array     |
            |                       |            |            | The descendant elements   |
            |                       |            |            | are listed in ascending   |
            |                       |            |            | order by image file name. |
            +-----------------------+------------+------------+---------------------------+
            |                       |  `name`    |  `string`  | Set the image file name.  |
            +-----------------------+------------+------------+---------------------------+
            |                       | `contents` |  `string`  | Image file contents       |
            |                       |            |            | * Base64 encoding         |
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
            this.getLastInferenceAndImageDataObj.getLastInferenceAndImageData(
                deviceId,
                subDirectoryName
            );
        return response;
    }

    /**
     * getLastInferenceData- Retrieves the latest inference result metadata list information for a specified device.
     *  @params
     * - deviceId (str, required) - The Device Id
     * @returns
     * - Object: table:: Success Response
    - when time parameter is not specified
         
            +-------------+-----------+------------------------------------+
            |  Level1     |    Type   |  Description                       |
            +-------------+-----------+------------------------------------+
            | `id`        |  `string` | The ID of the inference            |
            |             |           | result metadata.                   |
            +-------------+-----------+------------------------------------+
            | `device_id` |  `string` | Device ID.                         |
            +-------------+-----------+------------------------------------+
            | `model_id`  |  `string` | Model ID.                          |
            +-------------+-----------+------------------------------------+
            | `model      | `string`  | Dnn Model Version                  |
            |_version_id` |           |                                    |
            +-------------+-----------+------------------------------------+
            | `model      | `string`  | Model  Type  .                     |
            |_type`       |           |                                    |
            |             |           | 00: Image classification           |
            |             |           |                                    |
            |             |           | 01: Object detection               |
            |             |           |                                    |
            |             |           | * In the case of imported          |
            |             |           | models, 01 is fixed at the         |
            |             |           | current level.                     |
            +-------------+-----------+------------------------------------+
            | `training   | `string`  | Name of the training_kit           |
            |_kit_name`   |           |                                    |
            +-------------+-----------+------------------------------------+
            | `_ts`       | `string`  | Timestamp. = System                |
            |             |           | registration date and time         |
            +-------------+-----------+------------------------------------+
            | `inference  | `string`  |Refer : Table : 1.0                 |
            |_result`     |           |for more details                    |
            +-------------+-----------+------------------------------------+
            
    - when time parameter is specified
            
            +--------------+-----------+--------------------------------+
            |  Level1      |    Type   |  Description                   |
            +--------------+-----------+--------------------------------+
            | `id`         |  `string` | The ID of the inference result |
            |              |           | metadata. = GUID automatically |
            |              |           | fired by CosmosDB              |
            +--------------+-----------+--------------------------------+
            | `device_id`  |  `string` | Device ID.                     |
            +--------------+-----------+--------------------------------+
            | `model_id`   |  `string` | Model ID.                      |
            +--------------+-----------+--------------------------------+
            | `_ts`        | `string`  | Timestamp. = System            |
            |              |           | registration date and time     |
            +--------------+-----------+--------------------------------+
            | `inferences `| `array`   |Refer : Table : 1.1             |
            |              |           |for more details                |
            +--------------+-----------+--------------------------------+

        @Table : 1.0 - inference_result schema details

            +--------------------+--------------+------------+-------------------------------+
            |  Level1            |  Level2      |    Type    |  Description                  |
            +--------------------+--------------+------------+-------------------------------+
            | `inference_result` |              |  `array`   |Raw data for inference result  |
            |                    |              |            |in ascending order of project  |
            |                    |              |            |Type and model project name.   |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `device_id`  |  `string`  |Device ID                      |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `model_id`   | `string`   |DnnModelVersion                |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `image`      | `boolean`  |Is it synchronized with        |
            |                    |              |            |the output of InputTensor?     |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `inferences` | `array`    |Refer : Table : 1.1            |
            |                    |              |            |for more details               |
            +--------------------+--------------+------------+-------------------------------+

           
        @Table : 1.1 - inferences schema details

            +--------------------+--------------+------------+-------------------------------+
            |  Level1            |  Level2      |    Type    |  Description                  |
            +--------------------+--------------+------------+-------------------------------+
            | `inferences`       |              |  `array`   |Inference result Array         |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `T`          |  `string`  |The time at which the data     |
            |                    |              |            |was acquired from the sensor.  |
            +--------------------+--------------+------------+-------------------------------+
            |                    | `O`          | `string`   |Outputtensor output without    |
            |                    |              |            |going through PPL              |
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
        const response =
            this.getLastInferenceDataObj.getLastInferenceData(deviceId);
        return response;
    }

    /**
     * exportImages- Get the URL to export the image with the specified conditions in zip file format.\
       Pre-encrypted, for learning images in other environments
     *
     *  @params
     * - key (str, required) : The public key. \
                Base64-encoded format of the entire contents of the public key PEM file
     * - fromDatetime (str, optional) : Date and time (From). Form: yyyyMMddhhmm
     * - toDatetime (str, optional) : Date and time (To). Form: yyyyMMddhhmm
     * - deviceId (str, optional) : The Device ID.
     * - fileFormat (str, optional) : Image file format. \
                If not specified, no filtering. \
                Value definition
                - JPG
                - BMP
                - RAW
     * @returns
     * - Object: table:: Success Response
    
            +-------------+------------+---------------------------+
            |  Level1     |  Type      |  Description              |
            +-------------+------------+---------------------------+
            |  `key`      |  `string`  | A common key for image    |
            |             |            | decryption encrypted with |
            |             |            | a public key.             |
            +-------------+------------+---------------------------+
            |  `url`      | `string`   | SUS URI for download      |
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
