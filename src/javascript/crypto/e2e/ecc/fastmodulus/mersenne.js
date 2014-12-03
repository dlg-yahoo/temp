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
 * @fileoverview
 *
 * Fast modulus implementions for the two NIST primes P_256 and P_384 that take
 * advantage of special properties of those numbers.
 *
 * @author fy@google.com (Frank Yellin)
 */

goog.provide('e2e.ecc.fastModulus.Mersenne');
goog.provide('e2e.ecc.fastModulus.Mersenne.M521');

goog.require('e2e.BigNum');
goog.require('e2e.FastModulus');
goog.require('goog.asserts');



/**
 * An abstract implementation of FastModulus that handles the common code
 * for reduction modulo a Mersenne prime.
 *
 * @constructor
 * @implements {e2e.FastModulus}
 * @param {!number} n The exponent n of the Mersenne prime 2^n-1
 */
e2e.ecc.fastModulus.Mersenne = function(n) {
  /**
   * The exponent.
   * @private {!number}
   */
  this.n_ = n | 0;
  /**
   * The modulus.
   * @private {!e2e.BigPrimeNum }
   */
  this.modulus_ = e2e.BigPrimeNum(
      e2e.BigNum.fromInteger(1).shiftLeft(this.n_).subtract(e2e.BigNum.ONE));
};


/** @override */
e2e.ecc.fastModulus.Mersenne.prototype.useForMultiplication = true;


/** @override */
e2e.ecc.fastModulus.Mersenne.prototype.residue = function(value) {
  var size = this.modulus_.getSize();
  var high = value.shiftRight(this.e_).setSize(size);
  var low = value.and(this.modulus_).setSize(size);
  var result = high.add(low);
  high = result.shiftRight(this.e_).setSize(size);
  low = result.and(this.modulus_).setSize(size);
  result = high.add(low);
  return result.setSize(size);
};



/**
 * A concrete subclass of FastModulus to handle M521.
 *
 * @constructor
 * @extends {e2e.ecc.fastModulus.Mersenne}
 * @param {!e2e.BigPrimeNum} modulus The large prime number for which
 *     we are building a fast modulus function.
 */
e2e.ecc.fastModulus.Mersenne.M521 = e2e.ecc.Mersenne(521);
goog.inherits(e2e.ecc.fastModulus.Mersenne.M521,
    e2e.ecc.fastModulus.Mersenne);
