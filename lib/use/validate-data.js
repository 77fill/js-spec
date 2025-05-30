import registry from "../core-private/registry.js";

export default function $valid(obj) {
    for(const [maybeNsKey, value] in Object.entries(obj)) {
        if(registry.contains(maybeNsKey)) {
            const spec = registry.get(maybeNsKey);

            if(!spec.isValid(value))
                return false;
        }
    }

    return true;
}