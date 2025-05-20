import {$map} from "../define/spec-by-sequence.js";
import toSpec from "../core-private/spec-like.js";

/**
 * dispatch function
 */
export default function $explain(one, two) {
    if(two)
        return $explainFull(one, two)
    else
        return $explainOnlyData(one)
}

function $explainOnlyData(data) {
    return $explainFull($map(), data)
}

function $explainFull(specLike, data) {
    const spec = toSpec(specLike)

    return spec.getProblemTrace(data).problems
}

