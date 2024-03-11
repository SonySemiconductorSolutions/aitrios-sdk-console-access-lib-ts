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

import { DeviceManagement } from './deviceManagement/deviceManagement';
import { Insight } from './insight/insight';
import { Deployment } from './deployment';
import { AiModel } from './aiModel';
import { Config } from './common/config';

/**
 * Client class is the interface that provides access for the functionality of Console Access Library
 */
export class Client {
    static config: Config;

    private _deviceManagement: DeviceManagement;

    private _insight: Insight;

    private _deployment: Deployment;

    private _aiModel: AiModel;

    get deviceManagement(): DeviceManagement {
        return this._deviceManagement;
    }

    get insight(): Insight {
        return this._insight;
    }

    get deployment(): Deployment {
        return this._deployment;
    }

    get aiModel(): AiModel {
        return this._aiModel;
    }

    /**
     * Initialize Console Api Client required for invoking API’s exposed from Cloud SDK
     * @param configuration Object of Config Class
     * @returns
     *  Console Client
     */
   
    static async createInstance(configuration: Config){
        this.config = configuration;
        const client = new Client();
        client._deviceManagement = new DeviceManagement(this.config);
        client._insight = new Insight(this.config);
        client._deployment = new Deployment(this.config);
        client._aiModel = new AiModel(this.config);
        return client;
    }
}
