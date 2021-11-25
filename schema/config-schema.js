const players = {
  type: 'object',
  properties: {
    name: { type: 'string' }
  },
  additionalProperties: false
}

const fines = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    cost: { type: 'number' }
  },
  additionalProperties: false
}

const base = {
  type: 'object',
  properties: {
    players: {
      type: 'object',
      patternProperties: {
        '^.*$': players
      },
      additionalProperties: true
    },
    fines: {
      type: 'object',
      patternProperties: {
        '^.*$': fines
      },
      additionalProperties: true
    },
    meta: {
      type: 'object',
      properties: {
        max: { type: 'integer' },
        personalBests: { type: 'integer' }
      }
    }
  }
}

module.exports = {
  base, players, fines
}
