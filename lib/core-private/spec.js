import ProblemTrace from "./problem-trace"

export default class Spec {
    #type
    #children
    #problemFinders
    #conform

    // Mutually Exclusive:
    #predicate
    #predicateStringTemplate // children => `bla ${children}`

    constructor(config) {
        this.#type = config.type
        this.#children = config.children
        this.#problemFinders = config.problemFinders

        if(config.conform)
            this.#conform = config.conform
        else
            this.#conform = data => data

        if(config.predicate)
            this.#predicate = config.predicate
        else if(config.predicateStringTemplate)
            this.#predicateStringTemplate = config.predicateStringTemplate

    }

    get predicateString() {
        if(this.#predicate)
            return this.#predicate.toString();
        else if(this.#predicateStringTemplate)
            return this.#predicateStringTemplate(this.#children);
        else
            throw new Error(`Tried to get predicate string from spec of type '${this.#type}'.`)
    }

    getProblemTrace(data) {
        return this.#problemFinders
            .map(finder => finder(data, this))
            .reduce(ProblemTrace.merge)
    }

    conform(data) {
        return this.#conform(data, this)
    }

    valid(data) {
        const problems = this.getProblemTrace(data).problems
    
        if(problems.length !== 0)
            ;//console.log("spec problems", problems)

        return problems.length === 0
    }

    get children() {
        return this.#children
    }

    get type() {
        return this.#type
    }

    get predicate() {
        return this.#predicate
    }
}

