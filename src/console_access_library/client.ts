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

import { DeviceManagement } from "./deviceManagement/deviceManagement";
import { Insight } from "./insight/insight";
import { Config } from "./common/config";
import { ErrorCodes } from "./common/errorCodes";

/**
 * Client class is the interface that provides access for the functionality of Console Access Library
 */
export class Client {

    private _deviceManagement;

    private _insight;

    get deviceManagement(): DeviceManagement {
        return this._deviceManagement;
    }

    get insight(): Insight {
        return this._insight;
    }

    /**
     * Initialize Console Api Client required for invoking API’s exposed from Cloud SDK
     * 
     * @returns
     *  Console Client
     */
    static async createInstance(settingsFilePath){
        // this.validate(endPoint, credentials, configuration);
        const config = new Config(settingsFilePath);
        const result = await config.readSettingsFile();
        if(result === ErrorCodes.SUCCESS){
            const client = new Client();
            client._deviceManagement = new DeviceManagement(config);
            client._insight = new Insight(config);
            return client; 
        }
    }
}