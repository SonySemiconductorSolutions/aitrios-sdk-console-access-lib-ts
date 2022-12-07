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

import { APIExecutor } from "./apiexecutor";

export class APIHandler{

    constructor(){

    }

    async handleRequest(data: { apiEnum?: any; apiParams?: any; apiRequestBody?: any; }, callbackListener: { (response: any): void; (arg0: { response: string; }): void; }) {
        console.log("inside the handle request with data: ", data)
        // for console based demo app all input parameters will pick form config file to execute the apis
       new APIExecutor().excecute().then((rs)=> {
        const responseData= rs;
        console.log("handledata received response:: ", responseData)
        callbackListener(responseData);
      
        })
    }

}
