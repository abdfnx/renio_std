// Copyright @abdfnx. All rights reserved. Apache 2.0 license.
// @generated by renio std builder
// It is not intended for manual editing.
import wasmBytes from "./crypto.wasm.js";
import * as wasm from "./wasm_crypto_bg.wasm";

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];

  heap[idx] = obj;
  return idx;
}

function getObject(idx) {
  return heap[idx];
}

function dropObject(idx) {
  if (idx < 36) return;
  heap[idx] = heap_next;
  heap_next = idx;
}

function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}

const lTextDecoder = typeof TextDecoder === "undefined"
  ? (0, module.require)("util").TextDecoder
  : TextDecoder;

let cachedTextDecoder = new lTextDecoder("utf-8", {
  ignoreBOM: true,
  fatal: true,
});

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
  if (
    cachegetUint8Memory0 === null ||
    cachegetUint8Memory0.buffer !== wasm.memory.buffer
  ) {
    cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === "undefined"
  ? (0, module.require)("util").TextEncoder
  : TextEncoder;

let cachedTextEncoder = new lTextEncoder("utf-8");

const encodeString =
  (typeof cachedTextEncoder.encodeInto === "function"
    ? function (arg, view) {
      return cachedTextEncoder.encodeInto(arg, view);
    }
    : function (arg, view) {
      const buf = cachedTextEncoder.encode(arg);
      view.set(buf);
      return {
        read: arg.length,
        written: buf.length,
      };
    });

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length);
    getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len);

  const mem = getUint8Memory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7F) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3);
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

function isLikeNone(x) {
  return x === undefined || x === null;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
  if (
    cachegetInt32Memory0 === null ||
    cachegetInt32Memory0.buffer !== wasm.memory.buffer
  ) {
    cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachegetInt32Memory0;
}

function getArrayU8FromWasm0(ptr, len) {
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
 * Returns the digest of the given `data` using the given hash `algorithm`.
 * @param {string} algorithm
 * @param {Uint8Array} data
 * @param {number | undefined} length
 * @returns {Uint8Array}
 */
export function digest(algorithm, data, length) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    var ptr0 = passStringToWasm0(
      algorithm,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    var len0 = WASM_VECTOR_LEN;
    wasm.digest(
      retptr,
      ptr0,
      len0,
      addHeapObject(data),
      !isLikeNone(length),
      isLikeNone(length) ? 0 : length,
    );
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var v1 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1);
    return v1;
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

const DigestContextFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_digestcontext_free(ptr)
);
/**
 * A context for incrementally computing a digest using a given hash algorithm.
 */
export class DigestContext {
  static __wrap(ptr) {
    const obj = Object.create(DigestContext.prototype);
    obj.ptr = ptr;
    DigestContextFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    DigestContextFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_digestcontext_free(ptr);
  }
  /**
   * Creates a new context incrementally computing a digest using the given
   * hash algorithm.
   *
   * An error will be thrown if `algorithm` is not a supported hash algorithm.
   * @param {string} algorithm
   */
  constructor(algorithm) {
    var ptr0 = passStringToWasm0(
      algorithm,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.digestcontext_new(ptr0, len0);
    return DigestContext.__wrap(ret);
  }
  /**
   * Update the digest's internal state with the additional input `data`.
   *
   * If the `data` array view is large, it will be split into subarrays (via
   * JavaScript bindings) which will be processed sequentially in order to
   * limit the amount of memory that needs to be allocated in the WASM heap.
   * @param {Uint8Array} data
   */
  update(data) {
    wasm.digestcontext_update(this.ptr, addHeapObject(data));
  }
  /**
   * Returns the digest of the input data so far. This may be called repeatedly
   * without side effects.
   *
   * `length` will usually be left `undefined` to use the default length for
   * the algorithm. For algorithms with variable-length output, it can be used
   * to specify a non-negative integer number of bytes.
   *
   * An error will be thrown if `algorithm` is not a supported hash algorithm or
   * `length` is not a supported length for the algorithm.
   * @param {number | undefined} length
   * @returns {Uint8Array}
   */
  digest(length) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.digestcontext_digest(
        retptr,
        this.ptr,
        !isLikeNone(length),
        isLikeNone(length) ? 0 : length,
      );
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Returns the digest of the input data so far, and resets this context to
   * its initial state, as though it has not yet been provided with any input
   * data. (It will still use the same algorithm.)
   *
   * `length` will usually be left `undefined` to use the default length for
   * the algorithm. For algorithms with variable-length output, it can be used
   * to specify a non-negative integer number of bytes.
   *
   * An error will be thrown if `algorithm` is not a supported hash algorithm or
   * `length` is not a supported length for the algorithm.
   * @param {number | undefined} length
   * @returns {Uint8Array}
   */
  digestAndReset(length) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.digestcontext_digestAndReset(
        retptr,
        this.ptr,
        !isLikeNone(length),
        isLikeNone(length) ? 0 : length,
      );
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Returns the digest of the input data so far, and then drops the context
   * from memory on the WASM side. This context must no longer be used, and any
   * further method calls will result in null pointer errors being thrown.
   * https://github.com/rustwasm/wasm-bindgen/blob/bf39cfd8/crates/backend/src/codegen.rs#L186
   *
   * `length` will usually be left `undefined` to use the default length for
   * the algorithm. For algorithms with variable-length output, it can be used
   * to specify a non-negative integer number of bytes.
   *
   * An error will be thrown if `algorithm` is not a supported hash algorithm or
   * `length` is not a supported length for the algorithm.
   * @param {number | undefined} length
   * @returns {Uint8Array}
   */
  digestAndDrop(length) {
    try {
      const ptr = this.__destroy_into_raw();
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.digestcontext_digestAndDrop(
        retptr,
        ptr,
        !isLikeNone(length),
        isLikeNone(length) ? 0 : length,
      );
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Resets this context to its initial state, as though it has not yet been
   * provided with any input data. (It will still use the same algorithm.)
   */
  reset() {
    wasm.digestcontext_reset(this.ptr);
  }
  /**
   * Returns a new `DigestContext` that is a copy of this one, i.e., using the
   * same algorithm and with a copy of the same internal state.
   *
   * This may be a more efficient option for computing multiple digests that
   * start with a common prefix.
   * @returns {DigestContext}
   */
  clone() {
    var ret = wasm.digestcontext_clone(this.ptr);
    return DigestContext.__wrap(ret);
  }
}

export function __wbg_length_1eb8fc608a0d4cdb(arg0) {
  var ret = getObject(arg0).length;
  return ret;
}

export function __wbindgen_memory() {
  var ret = wasm.memory;
  return addHeapObject(ret);
}

export function __wbg_buffer_397eaa4d72ee94dd(arg0) {
  var ret = getObject(arg0).buffer;
  return addHeapObject(ret);
}

export function __wbg_new_a7ce447f15ff496f(arg0) {
  var ret = new Uint8Array(getObject(arg0));
  return addHeapObject(ret);
}

export function __wbindgen_object_drop_ref(arg0) {
  takeObject(arg0);
}

export function __wbg_set_969ad0a60e51d320(arg0, arg1, arg2) {
  getObject(arg0).set(getObject(arg1), arg2 >>> 0);
}

export function __wbindgen_throw(arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1));
}

export function __wbindgen_rethrow(arg0) {
  throw takeObject(arg0);
}

export function __wbg_new_a4b61a0f54824cfd(arg0, arg1) {
  var ret = new TypeError(getStringFromWasm0(arg0, arg1));
  return addHeapObject(ret);
}

export function __wbg_byteLength_3e250b41a8915757(arg0) {
  var ret = getObject(arg0).byteLength;
  return ret;
}

export function __wbg_byteOffset_4204ecb24a6e5df9(arg0) {
  var ret = getObject(arg0).byteOffset;
  return ret;
}

export function __wbg_buffer_facf0398a281c85b(arg0) {
  var ret = getObject(arg0).buffer;
  return addHeapObject(ret);
}

export function __wbg_newwithbyteoffsetandlength_4b9b8c4e3f5adbff(
  arg0,
  arg1,
  arg2,
) {
  var ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
  return addHeapObject(ret);
}

const wasmModule = new WebAssembly.Module(wasmBytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
const wasm = wasmInstance.exports;

// for testing/debugging
export const _wasm = wasm;
export const _wasmModule = wasmModule;
export const _wasmInstance = wasmInstance;
export const _wasmBytes = wasmBytes;
