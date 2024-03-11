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
import { ResponderID } from './responderID';
import { SingleResponse } from './singleResponse';
import { Version } from './types';

/**
 * ```
 * ResponseData ::= SEQUENCE {
 *   version             [0] EXPLICIT Version DEFAULT v1,
 *   responderID             ResponderID,
 *   producedAt              GeneralizedTime,
 *   responses               SEQUENCE OF SingleResponse,
 *   responseExtensions  [1] EXPLICIT Extensions OPTIONAL }
 * ```
 */
export class ResponseData {
    @AsnProp({
        type: AsnPropTypes.Integer,
        context: 0,
        defaultValue: Version.v1,
    })
    public version = Version.v1;

    @AsnProp({ type: ResponderID })
    public responderID = new ResponderID();

    @AsnProp({ type: AsnPropTypes.GeneralizedTime })
    public producedAt = new Date();

    @AsnProp({ type: SingleResponse, repeated: 'sequence' })
    public responses: SingleResponse[] = [];

    @AsnProp({
        type: Extension,
        repeated: 'sequence',
        context: 1,
        optional: true,
    })
    public responseExtensions?: Extension[];

    constructor(params: Partial<ResponseData> = {}) {
        Object.assign(this, params);
    }
}
