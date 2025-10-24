import registry from "@/lib/core-private/registry.js";
import {isSpec} from "@/lib/core-private/spec/is-spec.js";
import {Spec} from "@/lib/core-private/spec/decorator.js";
import {BaseSpec} from "@/lib/core-private/spec/base.js";

/**
 * A 'spec-like' is something that is *seen* as a spec,<br>
 * but isn't necessarily an instance of Spec.<br>
 * E.g. Predicates can be *seen* as specs.
 *
 * @see @/lib/_info.md - to answer: what is 'nskey'?
 */
export function makeSpec(specLike) {
    switch(typeof specLike) {
        case "boolean":
            return makeSpec(val => val == specLike)
        case "number":
        case "bigint":
        case "symbol":
            return makeSpec(val => val === specLike)

        case "function":
            return fromPredicate(specLike)

        case "string":
            return fromNsKey(specLike)

        case "object":
            if(Array.isArray(specLike))
                return makeSpec(val => specLike.includes(val))
            else if(isSpec(specLike))
                return specLike
            else if(specLike instanceof RegExp)
                return makeSpec(val => specLike.test(val))
            else if(isClass(specLike))
                return val => val instanceof specLike

        default:
            throw Error(`The value ${specLike} is not a spec-like; it could not be converted to a spec`)
    }
}

function fromPredicate(func) {
    return new Spec(new BaseSpec({
        name: "predicate",
        analyse: data => {
            if(func(data))
                return {valid: true}
            else
                return {valid: false, problems: [{
                    invalidValue: data,
                    failedPredicate: func.toString(),
                    failedSpec: func,
                }]}
        }
    }))
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