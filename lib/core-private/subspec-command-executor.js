import { invalid_symbol } from "./symbols"

export function execute(...subspecCommands) {
    const bubbles = []

    for(const command in subspecCommands) {
        const bubble = command.subspec.makeConformationBubble(command.subdata)

        if(command.dataPathTag)
            bubble.prependDataPathTag(command.dataPathTag)
        if(command.specPathTag)
            bubble.prependSpecPathTag(command.specPathTag)

        if(bubble.conformedData === invalid_symbol)
            break;

        bubbles.push(bubble)
    }

    

    return bubbles
}