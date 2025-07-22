import Spec from "./spec";

/**
 * example data:
 * 
 * { legs: 4, arms: 200 }
 * 
 * 
 * subspec command factory:
 * 
 * beast_data => {
 *  subdata: beast_data.arms,
 *  subspec: toSpec( x => x < 3 )
 * }
 * 
 * 
 * another factory might output: (more complicated)
 * [{...command}, {...command}, {...command}]
 */

export function apply(data, ...subspecCommandFactories) {
    const commands = []

    for(const factory in subspecCommandFactories) {
        if(factory instanceof Spec)
            commands.push({subspec: factory, subdata: data})
        if(typeof factory === "function") {
            const newCommands = factory(data)
            commands.concat(newCommands)
        }
    }

    return commands
}