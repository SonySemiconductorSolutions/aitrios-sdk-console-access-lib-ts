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
    AsnIntegerArrayBufferConverter,
} from '@peculiar/asn1-schema';
import { AlgorithmIdentifier } from './algoIdentifier';
import { Name } from './name';
import { SubjectPublicKeyInfo } from './subjectPublicKeyInfo';
import { Validity } from './validity';
import { Extensions } from './extension';
import {
    CertificateSerialNumber,
    UniqueIdentifier,
    Version,
} from './typesfortbscertificate';

/**
 * ```
 * TBSCertificate  ::=  SEQUENCE  {
 *   version         [0]  Version DEFAULT v1,
 *   serialNumber         CertificateSerialNumber,
 *   signature            AlgorithmIdentifier,
 *   issuer               Name,
 *   validity             Validity,
 *   subject              Name,
 *   subjectPublicKeyInfo SubjectPublicKeyInfo,
 *   issuerUniqueID  [1]  IMPLICIT UniqueIdentifier OPTIONAL,
 *                        -- If present, version MUST be v2 or v3
 *   subjectUniqueID [2]  IMPLICIT UniqueIdentifier OPTIONAL,
 *                        -- If present, version MUST be v2 or v3
 *   extensions      [3]  Extensions OPTIONAL
 *                        -- If present, version MUST be v3 --  }
 * ```
 */
export class TBSCertificate {
    @AsnProp({
        type: AsnPropTypes.Integer,
        context: 0,
        defaultValue: Version.v1,
    })
    public version = Version.v1;

    @AsnProp({
        type: AsnPropTypes.Integer,
        converter: AsnIntegerArrayBufferConverter,
    })
    public serialNumber: CertificateSerialNumber = new ArrayBuffer(0);

    @AsnProp({ type: AlgorithmIdentifier })
    public signature = new AlgorithmIdentifier();

    @AsnProp({ type: Name })
    public issuer = new Name();

    @AsnProp({ type: Validity })
    public validity = new Validity();

    @AsnProp({ type: Name })
    public subject = new Name();

    @AsnProp({ type: SubjectPublicKeyInfo })
    public subjectPublicKeyInfo = new SubjectPublicKeyInfo();

    @AsnProp({
        type: AsnPropTypes.BitString,
        context: 1,
        implicit: true,
        optional: true,
    })
    public issuerUniqueID?: UniqueIdentifier;

    @AsnProp({
        type: AsnPropTypes.BitString,
        context: 2,
        implicit: true,
        optional: true,
    })
    public subjectUniqueID?: UniqueIdentifier;

    @AsnProp({ type: Extensions, context: 3, optional: true })
    public extensions?: Extensions;

    constructor(params: Partial<TBSCertificate> = {}) {
        Object.assign(this, params);
    }
}
