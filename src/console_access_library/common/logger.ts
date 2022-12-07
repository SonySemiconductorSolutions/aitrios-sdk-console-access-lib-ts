/*
 * Copyright 2022 Sony Semiconductor Solutions Corp. All rights reserved.
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

import { createLogger, format, transports } from 'winston';

/**
 * Error Level
 * error: 0,
 * warn: 1,
 * info: 2,
 * http: 3,
 * verbose: 4,
 * debug: 5,
 * silly: 6
 */

const config = {
    LOG_LEVEL: "info"
}

export const Logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json(),
    ),
    defaultMeta: {
        service: 'Console-Access-Library-JS',
        logger: 'winston',
    },
    transports: [new transports.Console()],
});

if (config.LOG_LEVEL === 'info') {
    Logger.level = 'info';
} else if (config.LOG_LEVEL === 'debug') {
    Logger.level = 'debug';
}