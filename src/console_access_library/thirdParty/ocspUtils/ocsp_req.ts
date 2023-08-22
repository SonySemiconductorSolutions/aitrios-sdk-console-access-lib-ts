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
import { AsnProp } from '@peculiar/asn1-schema';
import { Signature } from './signature';
import { TBSRequest } from './tbs_req';

/**
 * ```
 * OCSPRequest     ::=     SEQUENCE {
 *   tbsRequest                  TBSRequest,
 *   optionalSignature   [0]     EXPLICIT Signature OPTIONAL }
 * ```
 */
export class OCSPRequest {
    @AsnProp({ type: TBSRequest })
    public tbsRequest = new TBSRequest();

    @AsnProp({ type: Signature, optional: true, context: 0 })
    public optionalSignature?: Signature;

    constructor(params: Partial<OCSPRequest> = {}) {
        Object.assign(this, params);
    }
}
