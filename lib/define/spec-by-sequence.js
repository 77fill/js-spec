import {Spec} from "../core-private/spec.js";
import toSpec from "../core-private/spec-like.js";
import registry from "../core-private/registry.js";
import { invalid_symbol } from "../core-private/symbols.js";
import ProblemTrace from "../core-private/problem-trace.js";
import Problem from "../core-private/problem.js";
import zip from "../util/zip.js";

export function $tuple(...components) {
    return new Spec({
        type: "tuple",
        children: components.map(specLike => toSpec(specLike)),
        conform,
        predicateStringTemplate: 
            children => `tuple[${children.join(",")}]`,

        problemFinders: [
            checkIfArray,
            checkIfCorrectLength,
            checkIfCorrectSemantics,
        ]
    })
}

function checkIfArray(data, tupleSpec) {
    if(Array.isArray(data))
        return new ProblemTrace([])
    else
        return new ProblemTrace([
            new Problem(data, "tuple?", [], null, tupleSpec)
        ])
}

function checkIfCorrectLength(data, tupleSpec) {
    const correctLength = tupleSpec.children.length

    const tuple = conform(data)
    if(tuple === invalid_symbol)
        return new ProblemTrace([])

    if(tuple.length === correctLength)
        return new ProblemTrace([])
    else
        return new ProblemTrace([
            new Problem(data, `length(${correctLength})?`, [], null, tupleSpec)
        ])
}

function checkIfCorrectSemantics(data, tupleSpec) {
    const tuple = conform(data)

    if(data.length !== tupleSpec.children.length)
        return new ProblemTrace([])

    return zip(data, tupleSpec.children)
            .map(([val, spec], i) => [i, spec.getProblemTrace(val)])
            .map(([i, ptrace]) => ptrace.withPrependedPathTag(i))
            .reduce(ProblemTrace.merge)
}

function conform(data) {
    return Array.isArray(data) ? 
                data 
                : invalid_symbol
}