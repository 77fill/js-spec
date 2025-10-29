import registry from "@/lib/core/registry-of-specs/registry.js";
import toSpec from "@/lib/core/spec-like.js";

/**
 * Dispatch function 
 */
export default function $valid(...args) {
    if(args.length === 0)
        throw new Error("$valid must have at least one argument!")

    if(Array.isArray(args[0])) {
        if(args.every(arg => Array.isArray(arg)))
            return severalValues(args)
        else
            throw new Error("args(first, second, ...) -> if 'first' is array, then all args must be arrays!")
    }

    else if(args.length === 1) {
        if(typeof args[0] === "object") 
            return mapEntity(args[0])
        else
            throw new Error("$valid(oneArg) -> 'oneArg' must be an object!")
    }

    else if(args.length === 2) {
        return specAndValue(args[0], args[1])
    }
    
    else {
        throw new Error("Arguments of $valid are invalid!")
    }
}

function mapEntity(map) {
    for(const [maybeNsKey, value] of Object.entries(map)) {
        if(registry.contains(maybeNsKey)) {
            const spec = registry.get(maybeNsKey);

            if(!spec.valid(value))
                return false;
        }
    }

    return true;
}

function specAndValue(specLike, value) {
    const spec = toSpec(specLike)

    return spec.valid(value)
}

function severalValues(pairs) {
    return pairs.every(([specLike, value]) => specAndValue(specLike, value))
}