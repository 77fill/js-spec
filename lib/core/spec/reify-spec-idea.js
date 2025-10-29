import registry from "@/lib/core/registry-of-specs/registry.js";
import {isSpec} from "@/lib/core/spec/base.js";
import PredicateSpec from "@/lib/core/spec/predicate.js";

/**
 * A spec idea is (almost) a "definition" of a spec <br>
 * E.g. a predicate, a fixed value, ... <br>
 *
 * Most spec ideas are turned into predicates first
 *
 * @see @/lib/_info.md - to answer: what is 'nskey'?
 */
export function reify(specIdea) {
    switch(typeof specIdea) {
        case "boolean":
            return reify(val => val == specIdea)
        case "number":
        case "bigint":
        case "symbol":
            return reify(val => val === specIdea)

        case "function":
            return new PredicateSpec(specIdea)

        case "string":
            return fromNsKey(specIdea)

        case "object":
            if(Array.isArray(specIdea))
                return reify(val => specIdea.includes(val))
            else if(isSpec(specIdea))
                return specIdea
            else if(specIdea instanceof RegExp)
                return reify(val => specIdea.test(val))
            else if(isClass(specIdea))
                return reify(val => val instanceof specIdea)

        default:
            throw Error(`The value ${specIdea} is not a spec-idea; it could not be converted to a spec`)
    }
}


function fromNsKey(maybeNsKey) {
    if(registry.contains(maybeNsKey))
        return registry.get(maybeNsKey);
    else
        throw new Error(`Value "${maybeNsKey}" is a string, but not a valid & registered namespaced key.`);
}

function isClass(specLike) {
    return Object.hasOwn(specLike, "prototype")
        && Object.hasOwn(specLike.prototype, "constructor")
}