import registry from "./registry";

export function isValid(obj) {
    for(const [key, value] in Object.entries(obj)) {
        if(registry.contains(key)) {
            const spec = registry.get(key);

            if(!spec.isValid(value))
                return false;
        }
    }

    return true;
}