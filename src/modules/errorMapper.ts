import { SourceMapConsumer } from 'source-map'

// Cache SourceMap
let consumer: SourceMapConsumer | null = null

// Create SourceMap on the first error
const getConsumer = function(): SourceMapConsumer {
  if (consumer == null) consumer = new SourceMapConsumer(require("main.js.map"))
  return consumer
}

// Cache mapping to improve performance
const cache: { [key: string]: string } = {}

/**
 * Generate a source-mapped stack trace and produce original symbols
 * Warning: The first call after global reset incurs high CPU cost (> 30 CPU)
 * Subsequent calls incur lower CPU cost (~ 0.1 CPU / call)
 *
 * @param {Error | string} error - Error or original stack trace
 * @returns {string} - Source code mapped stack trace
 */
const sourceMappedStackTrace = function (error: Error | string): string {
  const stack = error instanceof Error ? error.stack : error;
  if (stack === undefined) {
    // Handle the case when stack is undefined
    return "";
  }
  // Use the cache if available
  if (cache.hasOwnProperty(stack)) return cache[stack]

  const re = /^\s+at\s+(.+?\s+)?\(?([0-z._\-\\\/]+):(\d+):(\d+)\)?$/gm
  let match
  let outStack = error.toString()

  while ((match = re.exec(stack))) {
    // Parsing complete
    if (match[2] !== "main") break

    // Get source mapping
    const pos = getConsumer().originalPositionFor({
      column: parseInt(match[4], 10),
      line: parseInt(match[3], 10)
    })

    // Unable to locate
    if (!pos.line) break

    // Parse the stack trace
    if (pos.name) outStack += `\n    at ${pos.name} (${pos.source}:${pos.line}:${pos.column})`
    else {
      // If the corresponding file name is not found, use the original stack trace name
      if (match[1]) outStack += `\n    at ${match[1]} (${pos.source}:${pos.line}:${pos.column})`
      // If the corresponding file name is not found in the original stack trace as well, omit it
      else outStack += `\n    at ${pos.source}:${pos.line}:${pos.column}`
    }
  }

  cache[stack] = outStack
  return outStack
}

/**
 * Error tracking wrapper
 * Used to parse error information into the source code's error location via source-map
 * Different from wrapLoop, this function directly executes instead of returning a new function
 *
 * @param next - Player code
 */
export const errorMapper = function (next: () => void): (() => void) {
  return () => {
    try {
      // Execute player code
      next()
    } catch (e) {
      if (e instanceof Error) {
        // Render the error call stack, cannot use source-map in sandbox mode
        const errorMessage = Game.rooms.sim ?
          `Unable to use source-map in sandbox mode - displaying the original call stack<br>${_.escape(e.stack)}` :
          `${_.escape(sourceMappedStackTrace(e))}`

        console.log(`<text style="color:#ef9a9a">${errorMessage}</text>`)
      }
      // Cannot handle, rethrow the error
      else throw e
    }
  }
}
