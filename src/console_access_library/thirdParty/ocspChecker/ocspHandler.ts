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

/**
 * This singleton class to maintain the OCSP status of already verified host name
 */
export class OCSPHandler {
    private static _instance: OCSPHandler = new OCSPHandler();
    // _statusMap will hold the key value data 
    private _statusMap = new Map<string, string>();

    constructor() {
        if (OCSPHandler._instance) {
            throw new Error(
                'Error: Instantiation failed: Use OCSPHandler.getInstance() instead of new.'
            );
        }
        OCSPHandler._instance = this;
    }

    /**
     * @returns The instance of OCSPHandler
     */
    public static getInstance(): OCSPHandler {
        return OCSPHandler._instance;
    }

    /**
     * setStatus: update the status with host name as key
     * @param host (string): host will use as a key name
     * @param value (string): value of OCSP status
     */
    public setStatus(host: string, value: string): void {
        this._statusMap.set(host, value);
    }

    /**
     * getStatus: will return the OCSP status for host name as argument 
     * @param host (string): host will use as a key name
     * @returns value (string): OCSP status value for particaular host name
     */
    public getStatus(host: string): string {
        return this._statusMap.get(host);
    }
}
