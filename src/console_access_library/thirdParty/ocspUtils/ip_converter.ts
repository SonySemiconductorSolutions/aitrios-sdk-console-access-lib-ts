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
import * as ip from 'ipaddr.js';
import { Convert } from 'pvtsutils';

export class IpConverter {
    private static decodeIP(value: string) {
        if (value.length === 64 && parseInt(value, 16) === 0) {
            return '::/0';
        }

        if (value.length !== 16) {
            return value;
        }

        const mask = parseInt(value.slice(8), 16)
            .toString(2)
            .split('')
            .reduce((a, k) => a + +k, 0);
        let ipVal = value
            .slice(0, 8)
            .replace(/(.{2})/g, (match) => `${parseInt(match, 16)}.`);

        ipVal = ipVal.slice(0, -1);

        return `${ipVal}/${mask}`;
    }

    public static toString(buf: ArrayBuffer) {
        if (buf.byteLength === 4 || buf.byteLength === 16) {
            const uint8 = new Uint8Array(buf);
            const addr = ip.fromByteArray(Array.from(uint8));
            return addr.toString();
        }
        return this.decodeIP(Convert.ToHex(buf));
    }

    public static fromString(text: string): ArrayBuffer {
        const addr = ip.parse(text) as any;
        return new Uint8Array(addr.toByteArray()).buffer;
    }
}
