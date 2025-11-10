import {reify} from "@/lib/core/spec/reify-spec-idea.js";
import {ComplexSpec} from "@/lib/core/spec/complex.js";
import PredicateAdvancedSpec, {success, fail} from "@/lib/core/spec/predicate-advanced.js";

export function $coll({spec, min, max, predicate}) {
    spec = reify(spec)

    return new ComplexSpec({
        name: "collection",
        subspecs: [
            reallyCollection(),
            validCount(min, max),
            validAccordingToPredicate(predicate),
        ],
    })
}

function reallyCollection() {
    return new PredicateAdvancedSpec(
        data => {
            if(Array.isArray(data))
                return success(data)
            else if(data instanceof Set)
                return success(Array.from(data))
            else
                return fail("collection?")
        }
    )
}

function validCount(min, max) {
    return new PredicateAdvancedSpec(
        data => {
            if((min === undefined || data.length >= min)
                && (max === undefined || data.length <= max)
            )
                return success(data)
            else if(data.length > max)
                return fail(`data.length(${data.length}) > collectionSpec.max(${max})`)
            else
                return fail(`data.length(${data.length}) < collectionSpec.min(${min})`)
        }
    )
}

function validAccordingToPredicate(predicate) {
    return new PredicateAdvancedSpec(
        data => {
            if(predicate === undefined || predicate(data))
                return success(data)
            else
                return fail("predicate")
        }
    )
}