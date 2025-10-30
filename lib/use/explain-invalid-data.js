import {$map} from "../define/spec-for-map";
import {reify} from "@/lib/core/spec/reify-spec-idea.js";

/**
 * dispatch function
 */
export default function $explain(one, two) {
    if(one && two)
        return $forSpecAndEntity(one, two)
    else if(one)
        return $forMapEntity(one)
    else
        throw new Error(
            `$explain needs either a spec-like and`
            +` an entity (2 args) or a map entity (1 arg)`
            +` as arguments!`
        )
}

function $forMapEntity(entity) {
    return $forSpecAndEntity($map(), entity)
}

function $forSpecAndEntity(specLike, entity) {
    const spec = reify(specLike)

    return spec.getProblemTrace(entity).problems
}

