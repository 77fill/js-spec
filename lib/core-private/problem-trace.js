export default class ProblemTrace {
    #problems
    #history

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

    constructor (problems) {
        this.#problems = problems
        this.#history = []
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

    withPrependedPathTag(pathTag) {
        const newProblemTrace = this.clone()
        newProblemTrace.#problems = newProblemTrace.#problems.map(p => p.withPrependedPathTag(pathTag))
        newProblemTrace.#history = newProblemTrace.#history.map(p => p.withPrependedPathTag(pathTag))
        return newProblemTrace
    }

    clone() {
        const newProblemTrace = new ProblemTrace(this.#problems)
        newProblemTrace.#history = this.#history
        return newProblemTrace
    }
}