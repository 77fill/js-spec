import registry from "./registry";
import {throwError} from "./util.js";
import spec from "./spec.js";

/**
 * Correct: "domain/name", "domain/secret/title", ...
 * Wrong: "name", "school", "age", "domain//age", ...
 * @type {RegExp}
 */
const reNamespacedKey = /^[\w-äöüß]+\/[\w-äöüß]+(\/[\w-äöüß]+)*$/

/**
 * @function
 * @template T
 * @param {T} keySpecs
 * @returns {{[Key in keyof T]: string}}
 */
export default function sdef(keySpecs) {
    const resultForReference = {}

    for(const [key, value] of Object.entries(keySpecs)) {
        validateKey(key)

        registry[key] = spec(value) ?? throwError(`${value} is not a valid spec`)

        resultForReference[key] = key
    }

    return resultForReference
}

function validateKey(key) {
    if(Object.hasOwn(registry, key))
        throw new Error(`registry[${key}] already exists. sdef only defines constants!`)

    if(!reNamespacedKey.test(key))
        throw new Error(`key [${key}] must be namespaced! E.g. 'namespace/keyname'`)
}