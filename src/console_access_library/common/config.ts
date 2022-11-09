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

import axios from 'axios';
import Ajv from "ajv";
import { Logger } from './logger';
import ValidationError from 'ajv/dist/runtime/validation_error';
import { Configuration } from 'js-client';
import { ErrorCodes } from './errorCodes';
import ajvErrors from 'ajv-errors';

const ajv = new Ajv({allErrors: true});
ajvErrors(ajv);

export interface SettingFileSchema {
    baseUrl: string;
    tokenUrl: string;
    clientSecret: string;
    clientId: string;
}

export class Config {
    baseUrl: string;
    configuration: Configuration;
    tokenUrl: string;
    clientSecret: string;
    clientId: string;
    settingsFilePath: any;
    constructor(settingsFilePath:any){
        this.baseUrl = '';
        this.configuration = new Configuration();
        this.tokenUrl = '';
        this.clientSecret = '';
        this.clientId = '';
        this.settingsFilePath = settingsFilePath;
    }

    schema = {
        type: "object",
        properties: {
            baseUrl: {
                type: "string",
                nullable: true,
                errorMessage: {
                    type: 'Invalid string for baseUrl',
                }
            },
            tokenUrl: {
                type: "string",
                nullable: true,
                errorMessage: {
                    type: 'Invalid string for tokenUrl',
                }
            },
            clientSecret: {
                type: "string",
                nullable: true,
                errorMessage: {
                    type: 'Invalid string for clientSecret',
                }
            },
            clientId: {
                type: "string",
                nullable: true,
                errorMessage: {
                    type: 'Invalid string for clientId',
                }
            }
        },
        required: ['baseUrl', 'tokenUrl', 'clientSecret', 'clientId'],
        additionalProperties: false,
        errorMessage: {
            required: {
                baseUrl: 'baseUrl is required',
                tokenUrl: 'tokenUrl is required',
                clientSecret: 'clientSecret is required',
                clientId: 'clientId is required'
            }
        }
    };

    async readSettingsFile() {
        try {
            const data:SettingFileSchema = this.settingsFilePath;
            const validate = ajv.compile(this.schema);
            const valid = validate(data);
            if (!valid){
                Logger.error(validate.errors);
                throw validate.errors;
            }
            this.baseUrl = data['baseUrl'];
            this.tokenUrl = data['tokenUrl'];
            this.clientSecret = data['clientSecret'];
            this.clientId = data['clientId'];
            this.configuration.basePath = this.baseUrl;
            return ErrorCodes.SUCCESS; 
        }
        catch(error){
            if(error instanceof ValidationError){
                Logger.error(error.message);
                Logger.error("Configuration not loaded!!")
                return ErrorCodes.GENERIC_ERROR;
            }
            return error;
        }
    }

    
    async getAccessToken(){
        try {
            const { data } = await axios.post(
                this.tokenUrl,
                {
                    grant_type: "client_credentials",
                    client_secret: this.clientSecret,
                    scope: "system",
                    client_id: this.clientId,
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
        catch(error){
            Logger.error(error.message);
            return "error in get token"+ error.message;
        }
    
    }
}