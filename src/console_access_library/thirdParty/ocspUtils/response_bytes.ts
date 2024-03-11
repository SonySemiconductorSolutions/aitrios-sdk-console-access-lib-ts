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
import { AsnProp, AsnPropTypes, OctetString } from '@peculiar/asn1-schema';

/**
 * ```
 * ResponseBytes ::= SEQUENCE {
 *   responseType            OBJECT IDENTIFIER,
 *   response                OCTET STRING }
 * ```
 */
export class ResponseBytes {
    @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
    public responseType = '';

    @AsnProp({ type: OctetString })
    public response = new OctetString();

    constructor(params: Partial<ResponseBytes> = {}) {
        Object.assign(this, params);
    }
}
