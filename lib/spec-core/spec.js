export default class Spec {
    #type
    #predicate
    #predicateStringTemplate
    #children
    #problemFinders

    constructor(type, children, problemFinders, predicateType, predicate_orPredicateStringTemplate_orUndefined) {
        this.#type = type
        this.#children = children
        this.#problemFinders = problemFinders

        if(predicateType === "predicate")
            this.#predicate = predicate_orPredicateStringTemplate_orUndefined
        else if(predicateType === "predicateStringTemplate")
            this.#predicateStringTemplate = predicate_orPredicateStringTemplate_orUndefined

    }

    get predicateString() {
        if(this.#predicate)
            return this.#predicate.toString();
        else if(this.#predicateStringTemplate)
            return this.#predicateStringTemplate(this.#children);
        else
            throw new Error(`Tried to get predicate string from spec of type '${this.#type}'.`)
    }

    findProblems(data) {
        return this.#problemFinders.flatMap(finder => finder(data, this))
    }

    get children() {
        return this.#children
    }

    get type() {
        return this.#type
    }
}

