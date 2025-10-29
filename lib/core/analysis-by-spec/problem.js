export class Problem {
    constructor({problemPath, invalidData, failedSpec}) {
        this.problemPath = problemPath
        this.invalidData = invalidData
        this.failedSpec = failedSpec
    }
}