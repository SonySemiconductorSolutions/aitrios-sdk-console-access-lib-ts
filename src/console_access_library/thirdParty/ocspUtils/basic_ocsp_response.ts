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
import { AsnProp, AsnPropTypes } from '@peculiar/asn1-schema';
import { AlgorithmIdentifier } from './algoIdentifier';
import { Certificate } from './certificate';
import { ResponseData } from './responseData';

// basicResponse RESPONSE ::=
//  { BasicOCSPResponse IDENTIFIED BY id-pkix-ocsp-basic }

/**
 * ```
 * BasicOCSPResponse ::= SEQUENCE {
 *   tbsResponseData          ResponseData,
 *   signatureAlgorithm       AlgorithmIdentifier,
 *   signature                BIT STRING,
 *   certs                [0] EXPLICIT SEQUENCE OF Certificate OPTIONAL }
 * ```
 */
export class BasicOCSPResponse {
  @AsnProp({ type: ResponseData })
    public tbsResponseData = new ResponseData();

  @AsnProp({ type: AlgorithmIdentifier })
  public signatureAlgorithm = new AlgorithmIdentifier();

  @AsnProp({ type: AsnPropTypes.BitString })
  public signature = new ArrayBuffer(0);

  @AsnProp({
      type: Certificate,
      repeated: 'sequence',
      optional: true,
      context: 0
  })
  public certs?: Certificate[];

  constructor(params: Partial<BasicOCSPResponse> = {}) {
      Object.assign(this, params);
  }
}
