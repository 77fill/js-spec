import registry from "../core-private/registry.js";
import {throwError} from "../util/throw-expression.js";
import spec from "../core-private/spec.js";
import toSpec from "../core-private/spec-like.js";

/*
    @see @/test/unit/define-keys.test.js
*/
const reNamespace = /^[\w-äöüß]+(\/[\w-äöüß]+)*$/
const rePartKey = /^[\w-äöüß]+$/

const nskey = (namespace, key) => `${namespace}/${key}`

/**
 * @function
 * @template T
 * @param {string} namespace
 * @param {T} keySpecs
 * @returns {{[Key in keyof T]: string}} object with: namespace[partkey] = nskey
 * 
 * @see "@/test/define-keys.test.js" - for examples
 */
export default function $def(namespace, keySpecs) {
    validateNamespace(namespace)
    const nsKeys = {}

    for(const [partkey, maybeSpec] of Object.entries(keySpecs)) {
        validateKey(namespace, partkey)

        registry.put(nskey(namespace,partkey), toSpec(maybeSpec))

        nsKeys[partkey] = nskey(namespace,partkey)
    }

    return nsKeys
}

function validateKey(namespace, partkey) {
    if( typeof partkey !== 'string'
        || !rePartKey.test(partkey) )
        throw new Error(`String "${partkey}" is not a valid 'partial' (=not namespaced) key!`)

    if(registry.contains(nskey(namespace,partkey)))
        throw new Error(`registry[${nskey(namespace,partkey)}] already exists. $def only defines constants!`)

}

function validateNamespace(namespace) {
    if( typeof namespace !== 'string'
        || !reNamespace.test(namespace) )
        throw new Error(`String "${namespace}" is not a valid namespace!`)
}