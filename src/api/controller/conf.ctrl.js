const toMongodb = require('jsonpatch-to-mongodb')

const datastore = require('../../dao/database')

module.exports = Object.assign({}, {
  createConfig: async (req, res, next) => {
    const body = req.body

    let response
    try {
      response = await datastore.insert(body)
    } catch (err) {
      return next(err)
    }

    return res.status(201).json({
      meta: {
        status: 201,
        id: response._id.toString(),
        requestId: req.id
      },
      data: response
    })
  },
  getConfigWithId: async (req, res, next) => {
    const { id } = req.params

    let response
    try {
      response = await datastore.findOneWithId(id)
    } catch (err) {
      return next(err)
    }

    return res.status(200).json({
      meta: {
        status: 200,
        id: req.params.id,
        requestId: req.id
      },
      data: response
    })
  },
  updateConfig: async (req, res, next) => {
    const { id } = req.params

    const data = req.body

    let response
    try {
      const patches = toMongodb(Array.isArray(data) ? data : [data])

      response = await datastore.findOneAndUpdateWithId(id, patches)
    } catch (err) {
      return next(err)
    }

    return res.status(200).json({
      meta: {
        status: 200,
        id: req.params.id,
        requestId: req.id
      },
      data: response
    })
  }
})
