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

const spec = (obj) => {
    if(obj instanceof Spec)
        return obj;

    if(typeof obj === 'function')
        return new Spec(obj)

    if(typeof obj === 'object' && Array.isArray(obj))
        return new Spec((value) => obj.includes(value))

    if(typeof obj === 'string') {
        if(registry.contains(obj))
            return registry.get(obj)
        else
            throw new Error(`String [${obj}] is not a valid spec'ed namespaced key!`)
    }

    throw new Error(`Object ${obj} cannot be converted to a spec`)
}

export default spec

export function and(...maybeSpecs) {
    const specs = maybeSpecs.map(maybe => spec(maybe))

    return spec(val => specs.every(spec => spec.isValid(val)))
}

export function or(...maybeSpecs) {
    const specs = maybeSpecs.map(maybe => spec(maybe))

    return spec(val => specs.some(spec => spec.isValid(val)))
}

export function not(maybeSpec) {
    const properSpec = spec(maybeSpec)

    return spec(val => !properSpec.isValid(val))
}