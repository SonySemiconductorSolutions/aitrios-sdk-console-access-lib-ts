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
import { AsnProp, AsnPropTypes } from '@peculiar/asn1-schema';
import { Extension } from './extension';
import { GeneralName } from './generalName';
import { Request } from './request';
import { Version } from './types';

/**
 * ```
 * TBSRequest      ::=     SEQUENCE {
 *   version             [0]     EXPLICIT Version DEFAULT v1,
 *   requestorName       [1]     EXPLICIT GeneralName OPTIONAL,
 *   requestList                 SEQUENCE OF Request,
 *   requestExtensions   [2]     EXPLICIT Extensions OPTIONAL }
 * ```
 */
export class TBSRequest {
    @AsnProp({
        type: AsnPropTypes.Integer,
        context: 0,
        defaultValue: Version.v1,
    })
    public version = Version.v1;

    @AsnProp({ type: GeneralName, context: 1, optional: true })
    public requestorName?: GeneralName;

    @AsnProp({ type: Request, repeated: 'sequence' })
    public requestList: Request[] = [];

    @AsnProp({
        type: Extension,
        context: 2,
        optional: true,
        repeated: 'sequence',
    })
    public requestExtensions?: Extension[];

    constructor(params: Partial<TBSRequest> = {}) {
        Object.assign(this, params);
    }
}
