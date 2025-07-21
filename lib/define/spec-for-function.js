import registry from "@/lib/core-private/registry"
import FunctionSpec from "../core-private/function-spec"

export function $fn({namespace, name, args, ret, function: func}) {
    const nskey = `${namespace}/${name}`

    registry.validate(nskey)

    registry.put(nskey, new FunctionSpec({name, args, ret, function: func}))
}