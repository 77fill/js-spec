/**
 * Does not consist of other specs<br>
 * A simple function creates an Analysis from the data
 */
export default class Spec {
    constructor({name, analyse}) {
        this.name = name
        this.analysisFunction = analyse
    }

    /**
     * @returns Analysis
     */
    analyse(data) {
        return this.analysisFunction(data)
    }

    valid(data) {
        return !! this.analyse(data).problems
    }
}

export function isSpec(thing) {
    return thing instanceof Spec
}