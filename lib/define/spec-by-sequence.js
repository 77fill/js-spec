import {Spec} from "../core-private/spec.js";
import toSpec from "../core-private/spec-like.js";
import registry from "../core-private/registry.js";

export const $map = (...maybeNsKeys) => {
    const nskeys = registry.validate(maybeNsKeys)
    const pTemplate = new Problem()

    return new Spec({
        namePrefix: "Map",
        updateProblems: [
            (problems, data) => isObject(data) ? problems : [...problems, ]
        ]
    })
}

export const $tuple = (...specLikes) => {
    const specs = specLikes.map(toSpec)

    return new Spec({
        namePrefix: "Tuple",
        subSpecs: specs,
        traverse: "data",
    })
}