import registry from "./registry.js";

export class Spec {
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

const spec = (maybeSpec) => {
    if(maybeSpec instanceof Spec)
        return maybeSpec;

    if(typeof maybeSpec === 'function')
        return new Spec(maybeSpec)

    if(typeof maybeSpec === 'object' && Array.isArray(maybeSpec))
        return new Spec(
            (value) =>
                Array.isArray(value)
                && value.length === maybeSpec.length
                && value.every((field, i) => maybeSpec[i].isValid(field))
        )

    if(typeof maybeSpec === 'string') {
        if(registry.contains(maybeSpec))
            return registry.get(maybeSpec)
        else
            throw new Error(`String [${maybeSpec}] is not a valid spec'ed namespaced key!`)
    }

    throw new Error(`Object ${maybeSpec} cannot be converted to a spec`)
}

export default spec

