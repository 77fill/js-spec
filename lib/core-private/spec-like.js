import registry from "./registry.js";

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
        return 2
}