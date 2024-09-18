/**
 * Stringify the object value.
 * @param object - The object to stringify.
 * @returns The stringified object.
 */
export function stringifyObjectValue(object: object): object {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      return [key, JSON.stringify(value)]
    }
    return [key, value]
  }))
}

/**
 * Parse the object value.
 * @param object - The object to parse.
 * @returns The parsed object.
 */
export function parseObjectValue(object: object): object {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => {
    if (typeof value === 'string') {
      return [key, parseJsonSafely(value)]
    }
    return [key, value]
  }))
}

/**
 * Parse the JSON string safely.
 * @param json - The JSON string to parse.
 * @returns The parsed object or the original string if parsing fails.
 */
export function parseJsonSafely(json: string): object | string {
  try {
    return JSON.parse(json)
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (e) {
    return json
  }
}
