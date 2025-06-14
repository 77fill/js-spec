export default function partition(array, count) {
    const acc = array.reduce((acc, currentElement) => {
        acc.currentCount++

        acc.currentPartition.push(currentElement)

        if(acc.currentCount === count) {
            acc.partitions.push(acc.currentPartition)
            acc.currentPartition = []
        }

        return acc
    }, {
        currentCount: 0,
        partitions: [],
        currentPartition: [],
    })

    if(acc.currentPartition.length > 0)
        acc.partitions.push(acc.currentPartition)

    return acc.partitions
}