import $explain from "@/lib/use/explain-invalid-data"

export default function instrumentedFunctionFactory(fnspec, func) {
    return (...args) => {
        const argsExplanation = $explain(fnspec.args, args)

        if(argsExplanation.problems)
            throw new Error()

        const returnValue = func(...args)

        const retExplanation = $explain(fnspec.ret, returnValue)

        if(retExplanation.problems)
            throw new Error()

        const conformedArgs = fnspec.args.makeConformationBubble(args)
        const conformedReturnValue = fnspec.ret.makeConformationBubble(returnValue)

        functionExplanation = $explain(fnspec.function, {ret: conformedReturnValue, args: conformedArgs})

        if(functionExplanation.problems)
            throw new Error()

        return returnValue
    }
}