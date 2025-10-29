import registry from "@/lib/core/registry-of-specs/registry.js"
import FunctionSpec from "@/lib/core/function-spec"

export function $fn({namespace, name, args, ret, function: func}) {
    const nskey = `${namespace}/${name}`

    registry.validate(nskey)

    registry.put(nskey, new FunctionSpec({name, args, ret, function: func}))
}