export function defaultAnalysesAggregator(analyses) {
    return {
        problems: analyses.flatMap(analysis => analysis.problems),
        conformedData: analyses[analyses.length - 1].conformedData,
    }
}