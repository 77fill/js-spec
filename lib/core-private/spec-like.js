import { includes } from "../util/arrays.js";
import ProblemTrace from "./problem-trace.js";
import registry from "./registry.js";
import Spec from "./spec.js";

/**
 * A 'spec-like' is something that is *seen* as a spec,<br>
 * but isn't necessarily an instance of Spec.<br>
 * E.g. Predicates can be *seen* as specs.
 *
 * @see @/lib/_info.md - to answer: what is 'nskey'?
 */
export default function toSpec(specLike) {
    switch(typeof specLike) {
        case "boolean": 
            return toSpec(val => val == specLike)
        case "number":
        case "bigint":
        case "symbol":
            return toSpec(val => val === specLike)

        case "function":
            return fromPredicate(specLike)

        case "string":
            return fromNsKey(specLike)

        case "object":
            if(Array.isArray(specLike))
                return toSpec(val => specLike.includes(val))
            else if(specLike instanceof Spec)
                return specLike
            else
                ;
        case "undefined":
        default:
            throw Error(`The value ${specLike} is not a spec-like; it could not be converted to a spec`)
    }

}

function fromPredicate(func) {
    return new Spec({
            type: "predicate",
            children: [],
            predicate: func,
            problemFinders: [(data, predicateSpec) => {
                if(predicateSpec.predicate(data))
                    return new ProblemTrace([])
                else
                    return new ProblemTrace({
                        invalidValue: data,
                        failedPredicate: predicateSpec.predicateString,
                        failedSpec: predicateSpec,
                        dataPath: [],
                        specPath: [],
                    })
            }]
        })
}

function fromNsKey(maybeNsKey) {
    if(registry.contains(maybeNsKey))
        return registry.get(maybeNsKey);
    else
        throw new Error(`Value "${maybeNsKey}" is a string, but not a valid & registered namespaced key.`);
}
