import {ComplexSpec} from "@/lib/core/spec/complex.js";
import {reify} from "@/lib/core/spec/reify-spec-idea.js";
import Spec from "@/lib/core/spec/base.js";
import PredicateAdvancedSpec, {fail, success} from "@/lib/core/spec/predicate-advanced.js";

export function $seq(parts) {
    return new ComplexSpec({
        name: "sequence",
        subspecs: [
            reallySequence(),
            ...Object.entries(parts)
                .reduce(toSpecs, {specs:[],currentIndex:0})
                .specs
        ]
    })
}

function reallySequence() {
    return new PredicateAdvancedSpec(
        data => {
            if(Array.isArray(data))
                return success(data)
            else
                return fail("sequence?")
        }
    )
}

function toSpecs(acc, [name, specOrSpecial]) {
    // check for special

    const rawSpec = reify(specOrSpecial)

    const countElements = 1

    const spec = new PredicateAdvancedSpec(
        sequence => {
            const analysis = rawSpec.analyse(sequence[acc.currentIndex])

            if(analysis.problems.length > 0)
                return fail(rawSpec.name)
            else
                return success(sequence)
        }
    )

    return {
        currentIndex: acc.currentIndex + countElements,
        specs: [...acc.specs, spec]
    }
}

export function $many() {}
export function $group() {}
export function $class() {}