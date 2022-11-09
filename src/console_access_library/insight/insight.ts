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

import { GetImages } from "./getImages";
import { GetImageDirectories } from "./getImagesDirectories";
import { GetInferenceresults } from "./getInferenceresults";

/**
 * This class provides access of all methods related to Insight
 */
export class Insight {

    /**
     * @ignorea
     */    
    config: any;
    getImagesObj: GetImages;
    getImageDirectoriesObj: GetImageDirectories;
    getInferenceresultsObj: GetInferenceresults;


    constructor(config) {
        this.config = config;
        this.getImagesObj = new GetImages(this.config);
        this.getImageDirectoriesObj = new GetImageDirectories(this.config);
        this.getInferenceresultsObj = new GetInferenceresults(this.config);


    }


    /**
     * 
     * Get a (saved) image of the specified device.     * 
     * 
     * @param (dict, optional): Dictionary of parameters to be passed.
     * deviceId (str, required) : The Device ID.
     * subDirectorNname (str, required) : The Sub Directory Name.
       The subdirectory will be the directory notified in the response
       of startUploadInferenceResult.
     * numberOfImages (int, optional) : The Number Of Images. 0-256. If not specified: 50
     * skip (int, optional) : The Skip. If not specified: 0
     * orderBy (str, optional) : The Order By. DESC, ASC, desc, asc. If not specified:ASC     * 
     * @returns 
     * Dictionary object returned by `getImages` API
     */
    getImages(deviceId:string, subDirectoryName:string,  orderBy?:string, numberOfImages?:number, skip?:number):any {
        const res= this.getImagesObj.getImages(deviceId, subDirectoryName, orderBy, numberOfImages, skip);
        return res;
    }


    /**
     * 
     * For each device group, a list of image storage directories for each device is acquired.     * 
     * @param (dict, optional): Dictionary of parameters to be passed.
       deviceId (str, required): Device ID(No more than 100 characters). If specified, returns a list of image
            directories linked to the specified device ID. 
     * @returns 
     * Dictionary object returned by `getImageDirectories` API
     */
    getImageDirectories(deviceId:string):any {
        const res= this.getImageDirectoriesObj.getImageDirectories(deviceId);
        return res;
    }

    /**
     * Retrieves (saved) inference result metadata list information for a specified device.     * 
     * @param (dict, optional): Dictionary of parameters to be passed
     * deviceId (str, required) : The Device ID.
       filter (str, optional) : The Filter. Search filter (same specifications as Cosmos DB UI
                                   on Azure portal except for the following)
                                   - No need to prepend where string
                                   - It is not necessary to add a deviceID.
       numberOfInferenceResults (int, optional) :Number of acquisitions.
                                                       If not specified: 20
       raw (int, optional) : The Raw. Data format of inference results.
                               - 1:Append records stored in Cosmos DB.
                               - 0:Not granted.
                                   If not specified: 0
       time (str, optional) : The Time. Inference result data stored in Cosmos DB.
                                   yyyyMMddHHmmssfff
                                    - yyyy: 4-digit year string
                                    - MM: 2-digit month string
                                    - dd: 2-digit day string
                                    - HH: 2-digit hour string
                                    - mm: 2-digit minute string
                                    - ss: 2-digit seconds string
                                    - fff: 3-digit millisecond string
     * @returns 
     * Dictionary object returned by `getInferenceresults` API
     */

    getInferenceresults(deviceId:string, numberOfInferenceresults?:number, filter?:string, raw?:number, time?:string):any {
        const res= this.getInferenceresultsObj.getInferenceresults(deviceId, numberOfInferenceresults, filter, raw, time);
        return res;
    }

}