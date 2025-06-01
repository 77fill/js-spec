import Spec from "../core-private/spec.js";
import {invalid_symbol} from "../core-private/symbols.js";
import registry from "../core-private/registry.js";
import ProblemTrace from "../core-private/problem-trace.js";
import Problem from "../core-private/problem.js";
import toSpec from "../core-private/spec-like.js";

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

export function $coll({spec, count, minCount, maxCount, distinct, kind, into}) {
    const spec = toSpec(spec)

    return new Spec({
        type: "collection",
        conform: collConform(into),
        children: {count, minCount, maxCount, distinct, kind},
        predicateStringTemplate: children => `collection[${spec}]`,
        problemFinders: [
            checkIfCollection,
            checkIfCorrectCount,
            checkIfCorrectDistinct,
            checkIfCorrectKind,
            checkIfCorrectSemantics,
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

function collConform(into) {
    return data => {
        if(into === undefined || into === null)
            into = []

        const dataArray = toArray(data)

        if(into === Array)
            return dataArray
        else if(into === Set)
            return new Set(dataArray)
        else
            throw new Error(`"into" argument of value "${into}" is not supported!`)
    }
}

function checkIfMap(data, mapSpec) {
    if(mapConform(data) === invalid_symbol)
        return new ProblemTrace([
            new Problem(data, "map?", [], null, mapSpec)
        ])
}

function checkIfCollection(data, collSpec) {
    const collection = collConform(data)

    if(collection === invalid_symbol)
        return new ProblemTrace([
            new Problem(data, 'coll?', [], null, collSpec)
        ])
    else
        return new ProblemTrace([])
}

function checkIfCorrectCount(data, collSpec) {
    const collection = collConform(data)
    const {count, maxCount, minCount} = collSpec.children

    if(collection === invalid_symbol)
        return new ProblemTrace([])

    const problems = []

    if(maxCount && collection.length > maxCount)
        problems.push(new Problem(collection, `count <= ${maxCount}`, [], null, collSpec))
    if(minCount && collection.length < minCount)
        problems.push(new Problem(collection, `count >= ${minCount}`, [], null, collSpec))
    if(count && collection.length !== count)
        problems.push(new Problem(collection, `count === ${count}`, [], null, collSpec))

    return new ProblemTrace(problems)
}

function checkIfCorrectDistinct(data, collSpec) {
    const collection = collConform(data)
    const distinct = collSpec.children.distinct

    if(collection === invalid_symbol)
        return new ProblemTrace([])

    if(!distinct)
        return new ProblemTrace([])

    if(data instanceof Set)
        return new ProblemTrace([])

    if(new Set(data).size() === data.length)
        return new ProblemTrace([])

    return new ProblemTrace([
        new Problem(data, 'distinct?', [], null, collSpec)
    ])
}

function checkIfCorrectKind(data, collSpec) {
    if(collSpec.children.kind(data))
        return new ProblemTrace([])
    else
        return new ProblemTrace([
            new Problem(data, collSpec.children.kind.toString(), [], null, collSpec)
        ])
}

function checkIfCorrectSemantics(data, collSpec) {
    const array = toArray(data)

    return array
            .map(elem => collSpec.children.spec.getProblemTrace(elem))
            .reduce(ProblemTrace.merge)
}

function toArray(coll) {
    if(Array.isArray(coll))
        return coll
    if(coll instanceof Set)
        return [...coll.values()]
    else
        throw new Error(`Data "${coll}" could not be interpreted as a collection; could not be turned into an array`)
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