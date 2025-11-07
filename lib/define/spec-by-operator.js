import {reify} from "@/lib/core/spec/reify-spec-idea.js";
import {ComplexSpec} from "@/lib/core/spec/complex.js";
import {defaultAnalysesAggregator} from "@/lib/core/analysis-by-spec/default-analyses-aggregator.js";
import {Analysis} from "@/lib/core/analysis-by-spec/analysis.js";

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

export function $or(...specIdeas) {
    const specs = specIdeas.map(reify)

    return new ComplexSpec({
        name: "or",
        subspecs: specs,
        aggregateAnalyses: analyses => {
            const passedAnalysis = analyses.find(analysis => analysis.problems.length === 0)

            if(passedAnalysis)
                return passedAnalysis

            const newAnalyses = analyses.map(
                (analysis, i) =>
                    analysis
                        .allProblemPaths()
                        .forSpec()
                        .prepend("or "+i)
            )

            return defaultAnalysesAggregator(newAnalyses)

        }
    })
}