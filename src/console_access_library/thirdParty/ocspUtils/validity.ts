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

import { AsnProp } from '@peculiar/asn1-schema';
import { Time } from './time';

export interface IValidityParams {
    notBefore: Date;
    notAfter: Date;
}
/**
 * ```
 * Validity ::= SEQUENCE {
 *   notBefore      Time,
 *   notAfter       Time  }
 * ```
 */
export class Validity {
    @AsnProp({ type: Time })
    public notBefore = new Time(new Date());

    @AsnProp({ type: Time })
    public notAfter = new Time(new Date());

    constructor(params?: IValidityParams) {
        if (params) {
            this.notBefore = new Time(params.notBefore);
            this.notAfter = new Time(params.notAfter);
        }
    }
}
