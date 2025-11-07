import {reify} from "@/lib/core/spec/reify-spec-idea.js";
import {ComplexSpec} from "@/lib/core/spec/complex.js";
import {defaultAnalysesAggregator} from "@/lib/core/analysis-by-spec/default-analyses-aggregator.js";

export function $and(...specIdeas) {
    const specs = specIdeas.map(reify)

    return new ComplexSpec({
        name: "and",
        subspecs: specs,
        aggregateAnalyses: analyses => {
            const newAnalyses = analyses.map(
                (analysis, i) =>
                    analysis
                        .allProblemPaths()
                        .forSpec()
                        .prepend("and "+i)
            )

            return defaultAnalysesAggregator(newAnalyses)
        }
    })
}