import {ComplexSpec} from "@/lib/core/spec/complex.js";
import {reify} from "@/lib/core/spec/reify-spec-idea.js";
import PredicateAdvancedSpec, {fail, success} from "@/lib/core/spec/predicate-advanced.js";
import {defaultAnalysesAggregator} from "@/lib/core/analysis-by-spec/default-analyses-aggregator.js";
import Spec from "@/lib/core/spec/base.js";

export function $tuple(...specIdeas) {
    const specs = specIdeas.map(reify)

    return new ComplexSpec({
        name: "tuple",
        subspecs: [
            reallyTuple(),
            correctAmount(specs.length),
            validComponents(specs),
        ]
    })
}

function reallyTuple() {
    return data => Array.isArray(data)
}

function correctAmount(amount) {
    return new PredicateAdvancedSpec(
        data => {
            if(data.length === amount)
                return success(data)
            else if(data.length > amount)
                return fail(`data.length(${data.length}) > tupleSpec.length(${amount})`)
            else
                return fail(`data.length(${data.length}) < tupleSpec.length(${amount})`)
        }
    )
}

function validComponents(specs) {
    return new Spec({
        name: "validComponents of tuple",
        analyse: data => {
            const analyses = specs.map((spec, i) => spec.analyse(data[i]))

            const newAnalyses = analyses.map((analysis, i) => analysis.allProblemPaths().forData().prepend(i))

            return defaultAnalysesAggregator(newAnalyses)
        }
    })
}