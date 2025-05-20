import registry from "./registry.js";
import Spec from "./spec.js";

/**
 * A 'spec-like' is something that is *seen* as a spec,<br>
 * but isn't necessarily an instance of Spec.<br>
 * E.g. Predicates can be *seen* as specs.
 *
 * @see @/lib/_info.md - what is 'nskey'?
 */
export default function toSpec(specLike) {
    if(typeof specLike === "string") {
        const maybeNsKey = specLike

        if(registry.contains(maybeNsKey))
            return registry.get(maybeNsKey);
        else
            throw new Error(`Spec ref "${maybeNsKey}" is a string, but not a valid & registered namespaced key.`);
    }

    if(typeof specLike === "function")
        return new Spec({
            type: "predicate",
            children: [],
            predicate: specLike,
            problemFinders: [(data,predicateSpec) => {
                if(predicateSpec.predicate(data))
                    return new ProblemTrace([])
                else
                    return new ProblemTrace([
                        new Problem(
                            data,
                            predicateSpec.predicateString,
                            [],
                            data,
                            predicateSpec
                        )
                    ])
            }]
        })
}