import Spec from "../core-private/spec.js";
import toSpec from "../core-private/spec-like.js";
import { invalid_symbol } from "../core-private/symbols.js";
import ProblemTrace from "../core-private/problem-trace.js";
import zip from "../util/zip.js";
import partition from "../util/partition.js";

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

export function $cat(...defs) {
    return new Spec({
        type: "concatenation",
        children: 
            partition(defs, 2)
                .map(([key, specLike]) => [key, toSpec(specLike)]),
        conform: catConform,
        predicateStringTemplate: children => `cat[${children}]`,
        problemFinders: [
            checkIfArray,
            checkIfCorrectLength,
            checkIfCorrectSemanticsCat,
        ]
    })
}

function checkIfArray(data, tupleSpec) {
    if(Array.isArray(data))
        return new ProblemTrace([])
    else
        return new ProblemTrace({
            invalidValue: data,
            failedPredicate: `tuple?`,
            failedSpec: tupleSpec,
            specPath: [],
            dataPath: [],
        })
}

function checkIfCorrectLength(data, tupleSpec) {
    const correctLength = tupleSpec.children.length

    const tuple = conform(data)
    if(tuple === invalid_symbol)
        return new ProblemTrace([])

    if(tuple.length === correctLength)
        return new ProblemTrace([])
    else
        return new ProblemTrace({
            invalidValue: data,
            failedPredicate: `length(${tuple.length}) === ${correctLength}`,
            failedSpec: tupleSpec,
            specPath: [],
            dataPath: [],
        })
}

function checkIfCorrectSemantics(data, tupleSpec) {
    const tuple = conform(data)
    if(tuple === invalid_symbol)
        return new ProblemTrace([])

    if(tuple.length !== tupleSpec.children.length)
        return new ProblemTrace([])

    return zip(tuple, tupleSpec.children)
            .map(([val, spec], i) => [i, spec.getProblemTrace(val)])
            .map(([i, ptrace]) => [i, ptrace.withPrependedPathTag_dataPath(i)])
            .map(([i, ptrace]) => ptrace.withPrependedPathTag_specPath(i))
            .reduce(ProblemTrace.merge)
}

function checkIfCorrectSemanticsCat(data, catSpec) {
    const concat = conform(data)
    if(concat === invalid_symbol)
        return new ProblemTrace([])

    if(Object.values(concat).length !== tupleSpec.children.length)
        return new ProblemTrace([])

    const len = 
        Object
            .entries(concat)
            .filter(([key, value]) => value === invalid_symbol)
            .length
        
    if(len === 0)
        return new ProblemTrace([])
    else
        return new ProblemTrace({
            invalidValue: data,
            failedPredicate: `blabla`,
            failedSpec: catSpec,
            specPath: [],
            dataPath: [],})
}

function conform(data) {
    return Array.isArray(data) ? 
                data 
                : invalid_symbol
}

function catConform(data, catSpec) {
    if(!Array.isArray(data))
        return invalid_symbol

    const result = 
        zip(data, catSpec.children).reduce(
            (result, [element, [key, subspec]]) =>
                ({...result, [key]: subspec.conform(element)}),
            {}
        )
}