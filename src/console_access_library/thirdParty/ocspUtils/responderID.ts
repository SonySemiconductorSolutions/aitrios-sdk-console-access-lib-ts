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
import {
    AsnProp,
    AsnType,
    AsnTypeTypes,
    OctetString,
} from '@peculiar/asn1-schema';
import { Name } from './name';

/**
 * ```
 * KeyHash ::= OCTET STRING -- SHA-1 hash of responder's public key
 *   -- (excluding the tag and length fields)
 * ```
 */
export class KeyHash extends OctetString {}

/**
 * ```
 * ResponderID ::= CHOICE {
 *   byName   [1] Name,
 *   byKey    [2] KeyHash }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class ResponderID {
    @AsnProp({ type: Name, context: 1 })
    public byName?: Name;

    /**
     * SHA-1 hash of responder's public key
     */
    @AsnProp({ type: KeyHash, context: 2 })
    public byKey?: KeyHash;

    constructor(params: Partial<ResponderID> = {}) {
        Object.assign(this, params);
    }
}
