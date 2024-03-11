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

import { EOL } from 'os';

type logLevels = 'debug' | 'info' | 'warning' | 'error' | 'off';

const levelMap = new Map<logLevels, number>([
    ['debug', 0],
    ['info', 1],
    ['warning', 2],
    ['error', 3],
    ['off', 4],
]);

let logLevel = 4;

const packageName = 'ConsoleAccessLibrary';

export function setLogLevel(level: logLevels): void {
    const _val = levelMap.get(level);
    if (_val === undefined) {
        process.stderr.write(`${error} ${EOL}`);
    } else {
        logLevel = _val;
    }
}

export function getLogLevel() {
    const keys = [...levelMap.keys()];
    return keys[logLevel];
}

export function debug(msg: string): void {
    const value = levelMap.get('debug') as number;
    if (logLevel >= value) {
        self.outputLog('DEBUG', msg);
    }
}

export function info(msg: string): void {
    const value = levelMap.get('info') || 1;
    if (logLevel >= value) {
        self.outputLog('INFO', msg);
    }
}

export function warning(msg: string): void {
    const value = levelMap.get('warning') as number;
    if (logLevel >= value) {
        self.outputLog('WARNING', msg);
    }
}

export function error(msg: string): void {
    const value = levelMap.get('error') as number;
    if (logLevel >= value) {
        self.outputLog('ERROR', msg);
    }
}

const self = {
    outputLog(level: string, msg: string): void {
        const time = self.toISOStringWithTimezone(new Date());
        process.stderr.write(`${time} ${level} ${packageName} ${msg} ${EOL}`);
    },

    toISOStringWithTimezone(date: Date): string {
        const padding = function (str: string): string {
            return ('0' + str).slice(-2); 
        };
        const year = date.getFullYear().toString();
        const month = padding((date.getMonth() + 1).toString());
        const day = padding(date.getDate().toString());
        const hour = padding(date.getHours().toString());
        const min = padding(date.getMinutes().toString());
        const sec = padding(date.getSeconds().toString());
        const msec = ('00' + date.getMilliseconds().toString()).slice(-3);
        const timezone = -date.getTimezoneOffset();
        if (timezone === 0) {
            return `${year}-${month}-${day}T${hour}:${min}:${sec}.${msec}Z`;
        } else {
            const sign = timezone >= 0 ? '+' : '-';
            const timezoneHour = padding((timezone / 60).toString());
            const timezoneMin = padding((timezone % 60).toString());
            return `${year}-${month}-${day}T${hour}:${min}:${sec}.${msec}${sign}${timezoneHour}${timezoneMin}`;
        }
    },
};
