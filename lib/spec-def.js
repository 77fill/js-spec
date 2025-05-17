import registry from "./registry";
import {throwError} from "./util.js";
import spec from "./spec.js";

/**
 * Correct: "domain", "domain/secret/blob", ...
 * Wrong: "", "name/", "/school", "age//", "domain//age", ...
 * @type {RegExp}
 */
const reNamespace = /^[\w-äöüß]+(\/[\w-äöüß]+)*$/

/**
 * Correct: "name", "age", "color", ...
 * Wrong: "domain/name", "color/red", ...
 * @type {RegExp}
 */
const reNotNamespacedKey = /^[\w-äöüß]+$/

/**
 * namespaced key
 */
const nkey = (namespace, key) => `${namespace}/${key}`

/**
 * @function
 * @template T
 * @param {string} namespace
 * @param {T} keySpecs
 * @returns {{[Key in keyof T]: string}}
 */
export default function $def(namespace, keySpecs) {
    validateNamespace(namespace)
    const namespacedKeys = {}

    for(const [key, value] of Object.entries(keySpecs)) {
        validateKey(namespace, key)

        registry.put(nkey(namespace,key), spec(value) ?? throwError(`${value} is not a valid spec`))

        namespacedKeys[key] = nkey(namespace,key)
    }

    return namespacedKeys
}

function validateKey(namespace, key) {
    if( typeof key !== 'string'
        || !reNotNamespacedKey.test(key) )
        throw new Error(`String [${key}] is not a valid 'not namespaced' key!`)

    if(registry.contains(nkey(namespace,key)))
        throw new Error(`registry[${nkey(namespace,key)}] already exists. $def only defines constants!`)

}

function validateNamespace(namespace) {
    if( typeof namespace !== 'string'
        || !reNamespace.test(namespace) )
        throw new Error(`String [${namespace}] is not a valid namespace!`)
}