import {reify} from "@/lib/core/spec/reify-spec-idea.js";
import {ComplexSpec} from "@/lib/core/spec/complex.js";
import {defaultAnalysesAggregator} from "@/lib/core/analysis-by-spec/default-analyses-aggregator.js";
import Spec from "@/lib/core/spec/base.js";
import {Analysis} from "@/lib/core/analysis-by-spec/analysis.js";
import {Problem} from "@/lib/core/analysis-by-spec/problem.js";
import {ProblemPath} from "@/lib/core/analysis-by-spec/problem-path.js";

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

export function $not(specIdea) {
    const spec = reify(specIdea)

    return new Spec({
        name: "not",
        analyse: data => {
            const analysis = spec.analyse(data)

            const additionalProblems = []

            if(analysis.problems.length === 0)
                additionalProblems.push(new Problem({
                    invalidData: data,
                    failedSpec: 'not',
                    problemPath: new ProblemPath(),
                }))

            const newAnalysis = new Analysis({
                problems: [...analysis.oldProblems, ...additionalProblems],
                conformedData: analysis.conformedData,
                oldProblems: [...analysis.problems],
            })

            return newAnalysis.allProblemPaths().forSpec().prepend("not")
        }
    })
}