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
/**
 * ```
 * Time ::= CHOICE {
 *   utcTime        UTCTime,
 *   generalTime    GeneralizedTime }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class Time {
    @AsnProp({
        type: AsnPropTypes.UTCTime,
    })
    public utcTime?: Date;

    @AsnProp({
        type: AsnPropTypes.GeneralizedTime,
    })
    public generalTime?: Date;

    constructor(time?: Date | string | number | Partial<Time>) {
        if (time) {
            if (typeof time === 'string' || typeof time === 'number') {
                this.utcTime = new Date(time);
            } else if (time instanceof Date) {
                this.utcTime = time;
            } else {
                Object.assign(this, time);
            }
        }
    }

    public getTime() {
        const time = this.utcTime || this.generalTime;
        if (!time) {
            throw new Error('Cannot get time from CHOICE object');
        }
        return time;
    }
}
