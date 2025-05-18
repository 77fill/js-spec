import spec from "../core-private/spec.js";

export function $and(...maybeSpecs) {
    const specs = maybeSpecs.map(maybe => spec(maybe))

    return spec(val => specs.every(spec => spec.isValid(val)))
}

export function $or(...maybeSpecs) {
    const specs = maybeSpecs.map(maybe => spec(maybe))

    return spec(val => specs.some(spec => spec.isValid(val)))
}

export function $not(maybeSpec) {
    const properSpec = spec(maybeSpec)

    return spec(val => !properSpec.isValid(val))
}