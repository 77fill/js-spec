import {defaultAnalysesAggregator} from "@/lib/core/analysis-by-spec/default-analyses-aggregator.js";
import Spec, {isSpec} from "@/lib/core/spec/base.js";
import {reify} from "@/lib/core/spec/reify-spec-idea.js";

/**
 * Consists of subordinate specs<br>
 * The aggregator combines their Analysis objects into one
 */
export class ComplexSpec extends Spec {
    /**
     * @param subspecs array of: spec OR Array<spec>
     */
    constructor({name, subspecs, aggregateAnalyses = defaultAnalysesAggregator}) {
        super({
            name,
            analyse: data => {
                const noEmbeddedArrays = [
                    ...subspecs.filter(notArray),
                    ...flatten( ...subspecs.filter(isArray) ),
                ]

                const properSpecs = noEmbeddedArrays.map(reify)

                const analyses = properSpecs.map(spec => spec.analyse(data))

                return aggregateAnalyses(analyses)
            }
        })
    }

}

function isArray(obj) {
    return Array.isArray(obj)
}

function notArray(obj) {
    return !isArray(obj)
}

function flatten(arrays) {
    return [].concat(...arrays)
}