export default class Spec {
    #type
    #predicate
    #predicateStringTemplate
    #children
    #problemFinders
    #conform

    constructor(config) {
        this.#type = config.type
        this.#children = config.children
        this.#problemFinders = config.problemFinders

        if(config.conform)
            this.#conform = config.conform

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
        return this.#conform(data)
    }

    get children() {
        return this.#children
    }

    get type() {
        return this.#type
    }

    get name() {
        return this.predicateString
    }

    get predicate() {
        return this.#predicate
    }
}

