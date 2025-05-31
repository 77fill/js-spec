import Spec from "../core-private/spec.js";
import {invalid_symbol} from "../core-private/symbols.js";
import registry from "../core-private/registry.js";
import ProblemTrace from "../core-private/problem-trace.js";
import Problem from "../core-private/problem.js";

export function $map(...maybeNsKeys) {
    const nskeys = registry.validate(...maybeNsKeys)

    return new Spec({
        type: "map",
        conform: mapConform,
        children: nskeys,
        predicateStringTemplate: children => `map[${children.join(",")}]`,
        problemFinders: [
            checkIfMap,
            checkIfHasAllKeys,
            checkIfKeysHaveValidSemantics,
        ]
    })
}

function mapConform(data) {
    if(data instanceof Map)
        return Object.fromEntries(data.entries())
    else if(typeof data === "object")
        return data
    else
        return invalid_symbol
}

function checkIfMap(data, mapSpec) {
    if(mapConform(data) === invalid_symbol)
        return new ProblemTrace([
            new Problem(data, "map?", [], null, mapSpec)
        ])
}

function checkIfHasAllKeys(data, mapSpec) {
    const map = mapConform(data)
    if(map === invalid_symbol)
        return new ProblemTrace([])

    const dataKeys = Object.keys(data)
    const missingKeys = mapSpec.children.filter(mustKey => !dataKeys.includes(mustKey))

    if(missingKeys.length === 0)
        return new ProblemTrace([])

    return new ProblemTrace([
        new Problem(data, mapSpec.predicate, [], null, mapSpec)
    ])
}

function checkIfKeysHaveValidSemantics(data, mapSpec) {
    const map = mapConform(data)
    if(map === invalid_symbol)
        return new ProblemTrace([])

    return Object.entries(map)
                .filter(([nskey, _]) => registry.contains(nskey))
                .map(([nskey,val]) => [nskey, registry.get(nskey).getProblemTrace(val)])
                .map(([nskey, ptrace]) => ptrace.withPrependedPathTag(nskey))
                .reduce(ProblemTrace.merge)
}