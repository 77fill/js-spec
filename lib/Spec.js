export default class Spec {
    #predicate

    constructor(predicate) {
        this.#predicate = predicate
    }

    isValid(value) {
        return this.predicateProxy(value)
    }

    predicateProxy = (value) => {
        const result = this.#predicate(value)

        return !!result;
    }
}