import Problem from "./problem"

/**
 * Constructor Argument: \ 
 * Either 'Problem[]' or 'ProblemConfig' \
 * (= several probs or one)
 */
export default class ProblemTrace {
    #problems
    #history

    /**
     * Reducer \
     * Usage: `problemTraceArray.reduce(ProblemTrace.merge) : ProblemTrace`
     */
    static merge(merged, nextProblemTrace) {
        let newMerged =
            merged.withProblems([
                ...merged.problems,
                ...nextProblemTrace.problems
            ])

        return newMerged.withHistory([
            ...merged.history,
            ...nextProblemTrace.history
        ])
    }

    constructor (problemsOrProblemConfig) {
        this.#history = []

        if(this.#isProblemArray(problemsOrProblemConfig)) 
            this.#problems = problemsOrProblemConfig
        else if(typeof problemsOrProblemConfig === "object")
            this.#problems = [new Problem(problemsOrProblemConfig)]
        else
            throw new Error(
                `Constructor argument needs to be either an array`
                + ` of problems or an object (problem config)!`
                + ` Given arg: "${problemsOrProblemConfig}"`)
    }

    #isProblemArray(data) {
        return Array.isArray(data) 
            && data.every(p => p instanceof Problem)
    }

    get problems () {
        return this.#problems
    }

    get history () {
        return this.#history
    }

    withProblems (problems) {
        const newProblemTrace = this.clone()
        newProblemTrace.#problems = problems
        return newProblemTrace
    }

    withHistory (history) {
        const newHistory = this.clone()
        newHistory.#history = history
        return newHistory
    }

    withPrependedPathTag_specPath(pathTag) {
        const newProblemTrace = this.clone()
        newProblemTrace.#problems = newProblemTrace.#problems.map(p => p.withPrependedPathTag_specPath(pathTag))
        newProblemTrace.#history = newProblemTrace.#history.map(p => p.withPrependedPathTag_specPath(pathTag))
        return newProblemTrace
    }

    withPrependedPathTag_dataPath(pathTag) {
        const newProblemTrace = this.clone()
        newProblemTrace.#problems = newProblemTrace.#problems.map(p => p.withPrependedPathTag_dataPath(pathTag))
        newProblemTrace.#history = newProblemTrace.#history.map(p => p.withPrependedPathTag_dataPath(pathTag))
        return newProblemTrace
    }

    withArchivedProblems() {        
        return this.withHistory([...this.history, ...this.problems])
                    .withProblems([])
    }

    historical() {
        return new ProblemTrace([...this.history])
    }

    addProblem(problemConfig) {
        return this.withProblems([...this.problems, new Problem(problemConfig)])
    }

    clone() {
        const newProblemTrace = new ProblemTrace([...this.#problems])
        newProblemTrace.#history = [...this.#history]
        return newProblemTrace
    }
}