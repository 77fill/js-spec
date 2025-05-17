import Spec from "./Spec";

export function toSpec(obj) {
    if(obj instanceof Spec)
        return obj;

    if(typeof obj === 'function')
        return new Spec(obj)

    if(typeof obj === 'object' && Array.isArray(obj))
        return new Spec((value) => obj.includes(value))
}