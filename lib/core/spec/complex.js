import {defaultAnalysesAggregator} from "@/lib/core/analysis-by-spec/default-analyses-aggregator.js";
import Spec, {isSpec} from "@/lib/core/spec/base.js";
import {reify} from "@/lib/core/spec/reify-spec-idea.js";
import {invalid_symbol} from "@/lib/core/misc/symbols.js";

/**
 * Consists of subordinate specs<br>
 * The aggregator combines their Analysis objects into one
 */
export class ComplexSpec extends Spec {
    constructor({name, subspecs, aggregateAnalyses = defaultAnalysesAggregator}) {
        super({
            name,
            analyse: data => {

                const properSpecs = subspecs.map(reify)

                const analyses = properSpecs.reduce(
                    specPipeline,
                    {
                        conformedData: data,
                        analyses: []
                    }
                ).analyses

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

function specPipeline(acc, spec) {
    if(acc.conformedData === invalid_symbol)
        return acc

    const analysis = spec.analyse(acc.conformedData)

    return {
        conformedData: analysis.conformedData,
        analyses: [...acc.analyses, analysis]
    }
}