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
import { AlgorithmIdentifier } from './algoIdentifier';
import {
    AsnProp,
    AsnPropTypes,
    AsnIntegerArrayBufferConverter,
    OctetString,
} from '@peculiar/asn1-schema';

/**
 * ```
 * CertID          ::=     SEQUENCE {
 *   hashAlgorithm       AlgorithmIdentifier,
 *   issuerNameHash      OCTET STRING, -- Hash of issuer's DN
 *   issuerKeyHash       OCTET STRING, -- Hash of issuer's public key
 *   serialNumber        CertificateSerialNumber }
 * ```
 */
export class CertID {
    @AsnProp({ type: AlgorithmIdentifier })
    public hashAlgorithm = new AlgorithmIdentifier();

    @AsnProp({ type: OctetString })
    public issuerNameHash = new OctetString();

    @AsnProp({ type: OctetString })
    public issuerKeyHash = new OctetString();

    @AsnProp({
        type: AsnPropTypes.Integer,
        converter: AsnIntegerArrayBufferConverter,
    })
    public serialNumber = new ArrayBuffer(0);

    constructor(params: Partial<CertID> = {}) {
        Object.assign(this, params);
    }
}
