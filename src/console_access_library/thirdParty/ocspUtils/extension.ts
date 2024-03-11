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
    AsnPropTypes,
    AsnArray,
    AsnType,
    AsnTypeTypes,
    OctetString,
} from '@peculiar/asn1-schema';

/**
 * ```
 * Extension  ::=  SEQUENCE  {
 *   extnID      OBJECT IDENTIFIER,
 *   critical    BOOLEAN DEFAULT FALSE,
 *   extnValue   OCTET STRING
 *               -- contains the DER encoding of an ASN.1 value
 *               -- corresponding to the extension type identified
 *               -- by extnID
 *   }
 * ```
 */
export class Extension {
    public static CRITICAL = false;

    @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
    public extnID = '';

    @AsnProp({
        type: AsnPropTypes.Boolean,
        defaultValue: Extension.CRITICAL,
    })
    public critical = Extension.CRITICAL;

    @AsnProp({ type: OctetString })
    public extnValue = new OctetString();

    constructor(params: Partial<Extension> = {}) {
        Object.assign(this, params);
    }
}

/**
 * ```
 * Extensions  ::=  SEQUENCE SIZE (1..MAX) OF Extension
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: Extension })
export class Extensions extends AsnArray<Extension> {
    constructor(items?: Extension[]) {
        super(items);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, Extensions.prototype);
    }
}
