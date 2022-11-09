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

import { GetDevices } from "./getDevices";
import { GetCommandParameterFile } from "./getCommandParameterFile";
import { StartUploadInferenceResult } from "./startUploadInferenceResult";
import { StopUploadInferenceResult } from "./stopUploadInferenceResult";


/**
 * This class provides access of all methods related to Device Management 
 */
export class DeviceManagement {
    getDevicesObj: GetDevices;
    getCommandParameterFileObj: GetCommandParameterFile;
    startUploadInferenceResultObj: StartUploadInferenceResult;
    stopUploadInferenceResultObj: StopUploadInferenceResult;





    constructor(config) {
        this.getDevicesObj = new GetDevices(config);
        this.getCommandParameterFileObj = new GetCommandParameterFile(config);
        this.startUploadInferenceResultObj = new StartUploadInferenceResult(config);
        this.stopUploadInferenceResultObj = new StopUploadInferenceResult(config);
    }


    /**
     * 
     * Abstract function call to `getDevices` API
     * @param (dict, optional): Dictionary of parameters to be passed. Defaults to null.
     * queryParams (dict, optional): Dictionary of parameters to be passed. Defaults to None
     * @returns 
     * Dictionary object returned by `getDevices` API
     */
    getDevices(queryParams) {
        const response = this.getDevicesObj.getDevices(queryParams);
        return response;
    }


    
    /**
     * 
     * Abstract function call to `getCommandParameterFile` API
     * @returns 
     * Dictionary object returned by 'getCommandParameterFile' API
     */
    getCommandParameterFile() {
        const response = this.getCommandParameterFileObj.getCommandParameterFile();
        return response;
    }

    /**
     * 
     * Abstract function call to startUploadInferenceResult API
     * @param (dict, optional): Dictionary of parameters to be passed.
     * - device_id (str, required) : The Device ID: No more than 100 characters
     * @returns 
     * Dictionary object returned by 'startUploadInferenceResult' API
     */
    startUploadInferenceResult(deviceId:string) {
        const response = this.startUploadInferenceResultObj.startUploadInferenceResult(deviceId);
        return response;
    }

    /**
     * 
     * Abstract function call to `stopUploadInferenceResult` API
     * @param (dict, optional): Dictionary of parameters to be passed.
     * - device_id (str, required) : The Device ID: No more than 100 characters
     * @returns 
     * Dictionary object returned by 'stopUploadInferenceResult' API
     */
    stopUploadInferenceResult(deviceId:string) {
        const response = this.stopUploadInferenceResultObj.stopUploadInferenceResult(deviceId);
        return response;
    }

}