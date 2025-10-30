import Spec from "@/lib/core/spec/base.js";
import {Analysis} from "@/lib/core/analysis-by-spec/analysis.js";
import {Problem} from "@/lib/core/analysis-by-spec/problem.js";
import {ProblemPath} from "@/lib/core/analysis-by-spec/problem-path.js";

export default class PredicateSpec extends Spec {
    constructor(predicate) {
        super({
            name: "predicate",
            analyse: data => {
                if (predicate(data))
                    return new Analysis({
                        conformedData: data
                    })
                else
                    return new Analysis({
                        problems: [
                            new Problem({
                                invalidData: data,
                                failedSpec: predicate.toString(),
                                problemPath: new ProblemPath(),
                            })
                        ],
                    })
            }
        })
    }
}