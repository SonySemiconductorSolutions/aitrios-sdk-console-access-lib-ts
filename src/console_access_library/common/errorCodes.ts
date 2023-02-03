/* eslint-disable no-unused-vars */
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

export enum ErrorCodes {
    SUCCESS = 0,
    ERROR = 'E001',
    GENERIC_ERROR = 'Generic Error',
    KEY_ERROR = 3,
    TYPE_ERROR = 4,
    ATTRIBUTE_ERROR = 5,
    VALUE_ERROR = 6,
}

export const genericErrorMessage = (message: string) => {
    return {
        result: 'ERROR',
        code: ErrorCodes.GENERIC_ERROR,
        message: `${ErrorCodes.GENERIC_ERROR} : ${message}`,
        datetime: new Date(),
    };
};

export const validationErrorMessage = (message: string) => {
    return {
        result: 'ERROR',
        code: ErrorCodes.ERROR,
        message: `${message}`,
        datetime: new Date(),
    };
};
