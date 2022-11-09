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

import { Client } from 'consoleaccesslibrary';
import { ConsoleAccessLibrarySettings, DemoConfiguration } from './config';
import axios from 'axios';

/**
 * Class for Execute Console Access Library API
 */
export class APIExecutor {

    constructor() {
    }

    async excecute() {
        var client = await Client.createInstance(ConsoleAccessLibrarySettings);

        // Read the Configurations
        const {
            deviceId,
            numberOfImages,
            skip,
            subDirectoryName,
            numberOfInferenceresults,
            filter,
            raw,
            time,
            getImagesOrderBy
        } = DemoConfiguration

        let response;

        try {
            const queryParams = {
            };
            //response= await this.getAccessToken();
            response = await client?.deviceManagement?.getDevices(queryParams);
            console.log('************************************************************************');
            console.log('************************************************************************');
            console.log("GetDevices response: ", JSON.stringify(response.data));
        } catch (e) {
            console.log("GetDevices Exception: ", e);
        }

        try {
            response = await client?.deviceManagement?.startUploadInferenceResult(deviceId);
            console.log('************************************************************************');
            console.log('************************************************************************');
            console.log("StartUploadInferenceResult response: ", JSON.stringify(response.data));
        } catch (e) {
            console.log("StartUploadInferenceResult Exception: ", e);
        }

        try {
            response = await client?.deviceManagement?.stopUploadInferenceResult(deviceId);
            console.log('************************************************************************');
            console.log('************************************************************************');
            console.log("StopUploadInferenceResult response: ", JSON.stringify(response.data));
        } catch (e) {
            console.log("StopUploadInferenceResult Exception: ", e);
        }

        try {
            response = await client?.deviceManagement?.getCommandParameterFile();
            console.log('************************************************************************');
            console.log('************************************************************************');
            console.log("GetCommandParameterFile response: ", JSON.stringify(response.data));
        } catch (e) {
            console.log("GetCommandParameterFile Exception: ", e);
        }

        try {
            response = await client?.insight?.getImageDirectories(deviceId);
            console.log('************************************************************************');
            console.log('************************************************************************');
            console.log("GetImageDirectories response: ", JSON.stringify(response.data));
        } catch (e) {
            console.log("GetImageDirectories Exception: ", e);
        }

        try {
            response = await client?.insight?.getImages(deviceId, subDirectoryName);
            console.log('************************************************************************');
            console.log('************************************************************************');
            console.log("GetImages response: ", JSON.stringify(response.data));
        } catch (e) {
            console.log("GetImages Exception: ", e);
        }

        try {
            response = await client?.insight?.getInferenceresults(deviceId);
            console.log('************************************************************************');
            console.log('************************************************************************');
            console.log("GetInferenceresults response: ", JSON.stringify(response.data));
        } catch (e) {
            console.log("GetInferenceresults Exception: ", e);
        }

        return "All API's executions completed!!!";
    }


    async getAccessToken() {
        try {
            const { data } = await axios.post(
                ConsoleAccessLibrarySettings.tokenUrl,
                {
                    grant_type: "client_credentials",
                    client_secret: ConsoleAccessLibrarySettings.clientSecret,
                    scope: "system",
                    client_id: ConsoleAccessLibrarySettings.clientId,
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                },
            );

            const { access_token } = data || {};
            return access_token;
        }
        catch (error) {
            console.log("Access token ex: ", error)
            return "";
        }
    }

}
