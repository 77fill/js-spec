/**
 * Does not consist of other specs<br>
 * A simple function creates an Analysis from the data
 */
export class BaseSpec {
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
}