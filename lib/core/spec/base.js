/**
 * Does not consist of other specs<br>
 * A simple function creates an Analysis from the data
 */
export default class Spec extends Function {
    constructor({name, analyse}) {
        super()
        function callableSpec(data) {return callableSpec.valid(data)}

        callableSpec.specName = name
        callableSpec.analysisFunction = analyse

        return Object.setPrototypeOf(callableSpec, new.target.prototype)
    }

    /**
     * @returns Analysis
     */
    analyse(data) {
        return this.analysisFunction(data)
    }

    valid(data) {
        return this.analyse(data).problems.length === 0
    }
}

export function isSpec(thing) {
    return thing instanceof Spec
}