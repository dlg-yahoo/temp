/**
 * @license
 * Copyright 2014 Google Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Performance testing for various ECC operations.
 *
 * @author fy@google.com (Frank Yellin)
 */

goog.provide('e2e.ecc.eccTester');

goog.require('e2e.ecc.DomainParam');
goog.require('e2e.ecc.Ecdh');
goog.require('e2e.ecc.Ecdsa');
goog.require('e2e.ecc.Protocol');
goog.require('e2e.testing.Util');
goog.setTestOnly('eccTester');


/**
 * Benchmarks ECDSA and group operations for a given curve.
 * @param {!e2e.ecc.PrimeCurve.<string>} curve The curve
 * @return {!Object.<string,Object>} Performance stats (object is filled only
 *     when tests are run outside browser).
 */
e2e.ecc.eccTester.runEcdsaBenchmarkForCurve = function(curve) {
  var message = 'Whisky bueno: ¡excitad mi frágil pequeña vejez!';
  var params = e2e.ecc.DomainParam.fromCurve(curve);
  var keypair = e2e.ecc.Protocol.generateKeyPair(curve);
  var ecdsa = new e2e.ecc.Ecdsa(curve, keypair);
  var signature = ecdsa.sign(message);
  var tests = [];
  e2e.testing.Util.addBenchmark(tests,
      function() { params.g.multiply(params.n); },
      curve + ' Fast Multiply');
  e2e.testing.Util.addBenchmark(tests,
      function() { params.g.negate().multiply(params.n); },
      curve + ' Slow Multiply');
  e2e.testing.Util.addBenchmark(tests,
      function() { params.n.modInverse(params.curve.B.toBigNum()); },
      curve + ' Bignum modInverse');
  e2e.testing.Util.addBenchmark(tests,
      function() { ecdsa.sign(message); },
      curve + ' Sign');
  e2e.testing.Util.addBenchmark(tests,
      function() { ecdsa.verify(message, signature); },
      curve + ' Verify');
  return e2e.testing.Util.runPerfTests(tests, 20, 10000);
};


/**
 * Benchmarks ECDH on a given curve.
 * @param {!e2e.ecc.PrimeCurve.<string>} curveName The curve
 * @return {!Object.<string,Object>} Performance stats (object is filled only
 *     when tests are run outside browser).
 */
e2e.ecc.eccTester.runEcdhBenchmarkForCurve = function(curveName) {
  var message = 'Whisky bueno: ¡excitad mi frágil pequeña vejez!';

  var pubkey = e2e.ecc.Protocol.generateKeyPair(curveName)['pubKey'];
  var ecdh = new e2e.ecc.Ecdh(curveName);

  var tests = [];
  e2e.testing.Util.addBenchmark(tests,
      function() { e2e.ecc.Protocol.generateKeyPair(curveName); },
      curveName + ' Keygen');
  e2e.testing.Util.addBenchmark(tests,
      function() { ecdh.alice(pubkey); },
      curveName + ' ECDH');
  return e2e.testing.Util.runPerfTests(tests, 20, 10000);
};
