import registry from "../internal/registry.js";
import {throwError} from "../internal/util.js";
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
const rePartKey = /^[\w-äöüß]+$/

/**
 * namespaced key
 */
const nskey = (namespace, key) => `${namespace}/${key}`

/**
 * @function
 * @template T
 * @param {string} namespace
 * @param {T} keySpecs
 * @returns {{[Key in keyof T]: string}}
 */
export default function $def(namespace, keySpecs) {
    validateNamespace(namespace)
    const nsKeys = {}

    for(const [partkey, maybeSpec] of Object.entries(keySpecs)) {
        validateKey(namespace, partkey)

        registry.put(nskey(namespace,partkey), spec(maybeSpec) ?? throwError(`${maybeSpec} is not a valid spec`))

        nsKeys[partkey] = nskey(namespace,partkey)
    }

    return nsKeys
}

function validateKey(namespace, partkey) {
    if( typeof partkey !== 'string'
        || !rePartKey.test(partkey) )
        throw new Error(`String [${partkey}] is not a valid 'partial' (=not namespaced) key!`)

    if(registry.contains(nskey(namespace,partkey)))
        throw new Error(`registry[${nskey(namespace,partkey)}] already exists. $def only defines constants!`)

}

function validateNamespace(namespace) {
    if( typeof namespace !== 'string'
        || !reNamespace.test(namespace) )
        throw new Error(`String [${namespace}] is not a valid namespace!`)
}