module.exports = (router) => {
  require('./routes/internal')(router)
  require('./routes/conf')(router)
}
