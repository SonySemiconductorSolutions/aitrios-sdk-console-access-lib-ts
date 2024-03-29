/* eslint-disable no-unused-vars */
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
    AsnType,
    AsnTypeTypes,
} from '@peculiar/asn1-schema';
import { id_ce } from './objectIdentifier';

/**
 * ```
 * id-ce-cRLReasons OBJECT IDENTIFIER ::= { id-ce 21 }
 * ```
 */
export const id_ce_cRLReasons = `${id_ce}.21`;

export enum CRLReasons {
    unspecified = 0,
    keyCompromise = 1,
    cACompromise = 2,
    affiliationChanged = 3,
    superseded = 4,
    cessationOfOperation = 5,
    certificateHold = 6,
    removeFromCRL = 8,
    privilegeWithdrawn = 9,
    aACompromise = 10,
}

/**
 * ```
 * CRLReason ::= ENUMERATED {
 *   unspecified             (0),
 *   keyCompromise           (1),
 *   cACompromise            (2),
 *   affiliationChanged      (3),
 *   superseded              (4),
 *   cessationOfOperation    (5),
 *   certificateHold         (6),
 *        -- value 7 is not used
 *   removeFromCRL           (8),
 *   privilegeWithdrawn      (9),
 *   aACompromise           (10) }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class CRLReason {
    @AsnProp({ type: AsnPropTypes.Enumerated })
    public reason: CRLReasons = CRLReasons.unspecified;

    constructor(reason: CRLReasons = CRLReasons.unspecified) {
        this.reason = reason;
    }

    public toJSON() {
        return CRLReasons[this.reason];
    }

    public toString() {
        return this.toJSON();
    }
}
