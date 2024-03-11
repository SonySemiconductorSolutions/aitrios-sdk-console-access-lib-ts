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
    AsnPropTypes,
} from '@peculiar/asn1-schema';
import { RevokedInfo } from './revokedInfo';

/**
 * ```
 * UnknownInfo ::= NULL
 * ```
 */
export type UnknownInfo = null;

/**
 * ```
 * CertStatus ::= CHOICE {
 *   good                [0]     IMPLICIT NULL,
 *   revoked             [1]     IMPLICIT RevokedInfo,
 *   unknown             [2]     IMPLICIT UnknownInfo }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class CertStatus {
    @AsnProp({ type: AsnPropTypes.Null, context: 0, implicit: true })
    public good?: null;

    @AsnProp({ type: RevokedInfo, context: 1, implicit: true })
    public revoked?: RevokedInfo;

    @AsnProp({ type: AsnPropTypes.Null, context: 2, implicit: true })
    public unknown?: UnknownInfo;

    constructor(params: Partial<CertStatus> = {}) {
        Object.assign(this, params);
    }
}
