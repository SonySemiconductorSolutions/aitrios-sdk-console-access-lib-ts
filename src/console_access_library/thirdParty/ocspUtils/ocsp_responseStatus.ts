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

/* eslint-disable no-unused-vars */
/**
 * ```
 * OCSPResponseStatus ::= ENUMERATED {
 *   successful          (0),  -- Response has valid confirmations
 *   malformedRequest    (1),  -- Illegal confirmation request
 *   internalError       (2),  -- Internal error in issuer
 *   tryLater            (3),  -- Try again later
 *                             -- (4) is not used
 *   sigRequired         (5),  -- Must sign the request
 *   unauthorized        (6)   -- Request unauthorized
 * }
 * ```
 */
export enum OCSPResponseStatus {
    /**
     * Response has valid confirmations
     */
    successful = 0,
    /**
     * Illegal confirmation request
     */
    malformedRequest = 1,
    /**
     * Internal error in issuer
     */
    internalError = 2,
    /**
     * Try again later
     */
    tryLater = 3,
    /**
     * Must sign the request
     */
    sigRequired = 5,
    /**
     * Request unauthorized
     */
    unauthorized = 6,
}
