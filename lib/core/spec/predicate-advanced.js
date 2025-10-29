import Spec from "@/lib/core/spec/base.js";
import {Analysis} from "@/lib/core/analysis-by-spec/analysis.js";
import {Problem} from "@/lib/core/analysis-by-spec/problem.js";
import {ProblemPath} from "@/lib/core/analysis-by-spec/problem-path.js";

export default class PredicateAdvancedSpec extends Spec {
    constructor(predicate) {
        super({
            name: "predicate",
            analyse: data => {
                const outcome = predicate(data)

                if (outcome.success)
                    return new Analysis({
                        conformedData: outcome.success,
                    })
                else
                    return new Analysis({
                        problems: [
                            new Problem({
                                invalidData: data,
                                failedSpec: outcome.fail,
                                problemPath: new ProblemPath(),
                            })
                        ],
                    })
            }
        })
    }
}

export function success(data) {
    return {
        success: data,
    }
}

export function fail(name) {
    return {
        fail: name,
    }
}