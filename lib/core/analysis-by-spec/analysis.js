import {invalid_symbol} from "@/lib/core/misc/symbols.js";

export class Analysis {
    constructor({problems = [], conformedData = invalid_symbol}) {
        this.problems = problems
        this.conformedData = conformedData
    }

    /**
     * Fluent API for prepending / appending path segments to problem paths<br>
     *
     * e.g. specObj.analyse(data).allProblemPaths().forData().prepend('mapKeyName')
     *
     * Final methods in the chain return the Analysis object
     */
    allProblemPaths() {
        const theAnalysis = this

        return {
            forSpec() {
                return {
                    prepend(segment) {
                        theAnalysis.problems.forEach(problem => problem.specPath.prepend(segment))

                        return theAnalysis
                    },
                    append(segment) {
                        theAnalysis.problems.forEach(problem => problem.specPath.append(segment))

                        return theAnalysis
                    },
                }
            },

            forData() {
                return {
                    prepend(segment) {
                        theAnalysis.problems.forEach(problem => problem.dataPath.prepend(segment))

                        return theAnalysis
                    },
                    append(segment) {
                        theAnalysis.problems.forEach(problem => problem.dataPath.append(segment))

                        return theAnalysis
                    },
                }
            }
        }
    }
}

