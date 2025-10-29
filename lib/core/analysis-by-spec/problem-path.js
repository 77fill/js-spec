/**
 * In place change!
 *
 *      path.forData().giveString() === "remaining_path"
 *
 *      path.forData().prepend('mapKey')
 *          .forData().giveString() === "mapKey.remaining_path"
 */
export class ProblemPath {
    specPathSegments = []
    dataPathSegments = []

    forSpec() {
        const theProblemPath = this

        return {
            prepend(segment) {
                theProblemPath.specPathSegments.unshift(segment)

                return theProblemPath
            },
            append(segment) {
                theProblemPath.specPathSegments.push(segment)

                return theProblemPath
            },
            giveString() {
                return theProblemPath.specPathSegments.join('.')
            }
        }
    }

    forData() {
        const theProblemPath = this

        return {
            prepend(segment) {
                theProblemPath.dataPathSegments.unshift(segment)

                return theProblemPath
            },
            append(segment) {
                theProblemPath.dataPathSegments.push(segment)

                return theProblemPath
            },
            giveString() {
                return theProblemPath.dataPathSegments.join('.')
            }
        }
    }
}