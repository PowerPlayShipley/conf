const controller = require('../controller/conf.ctrl')
const validation = require('../../middleware/validation')

module.exports = (router) => {
  router.post('/conf', validation.configuration, controller.createConfig)

  router.get('/conf/:id', controller.getConfigWithId)

  router.patch('/conf/:id', validation.patch, controller.updateConfig)
}
