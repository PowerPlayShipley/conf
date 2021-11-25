const {
  base, fines, players
} = require('../../../schema/config-schema')

const {
  patch
} = require('../../../schema/json-patch')

const ajv = require('./ajv')()

const log = require('../log')

module.exports = new class ConfigValidator {
  constructor () {
    // Cache the schema to save compiling later
    ajv.addSchema(base, 'base')
    ajv.addSchema(fines, 'fines')
    ajv.addSchema(players, 'players')
    ajv.addSchema(patch, 'patch')

    log.info('conf', { schemas: ['base', 'fines', 'players'] }, 'Adding schemas')
  }

  /**
   * Validate the configuration
   *
   * @note this may add more details validation
   *
   * @param {Object} config
   * @throws
   * */
  validate (config) {
    this.validateConfig(config)
  }

  /**
   * Validate a JSON patch request
   *
   * @note this may add more details validation
   *
   * @param {Object} patch
   * @throws
   * */
  validatePatch (patch) {
    const schema = ajv.getSchema('patch')

    if (!schema(patch)) {
      throw new Error(
        `JSON Patch is invalid:\n${this.formatErrors(
          schema.errors
        )}`
      )
    }
  }

  /**
   * Validate the base configuration
   *
   * @param {Object} config
   * @throws
   *
   * @private
   * */
  validateConfig (config) {
    const schema = ajv.getSchema('base')

    if (!schema(config)) {
      throw new Error(
        `@ppf/conf configuration is invalid:\n${this.formatErrors(
          schema.errors
        )}`
      )
    }
  }

  /**
   * Formats an array of schema validation errors.
   *
   * @param {Array} errors An array of error messages to format.
   *
   * @returns {string} Formatted error message
   * @private
   */
  formatErrors (errors) {
    return errors
      .map((error) => {
        if (error.keyword === 'additionalProperties') {
          const formattedPropertyPath = error.dataPath.length
            ? `${error.dataPath.slice(1)}.${error.params.additionalProperty}`
            : error.params.additionalProperty

          return `Unexpected top-level property "${formattedPropertyPath}"`
        }
        if (error.keyword === 'type') {
          const formattedField = error.dataPath.slice(1)
          const formattedExpectedType = Array.isArray(error.schema)
            ? error.schema.join('/')
            : error.schema
          const formattedValue = JSON.stringify(error.data)

          return `Property "${formattedField}" is the wrong type (expected ${formattedExpectedType} but got \`${formattedValue}\`)`
        }

        const field =
          error.dataPath[0] === '.' ? error.dataPath.slice(1) : error.dataPath

        return `"${field}" ${error.message}. Value: ${JSON.stringify(
          error.data
        )}`
      })
      .map((message) => `\t- ${message}.\n`)
      .join('')
  }
}()
