const chai = require('chai')
const sinon = require('sinon')
const chaiHttp = require('chai-http')
const requireInject = require('require-inject')

const { nanoid } = require('nanoid')

const mongo = cleanRequire('../src/dao/database')

const expect = chai.expect
chai.use(chaiHttp)

const uri = `localhost:27017/${nanoid()}`

let config;

describe('/conf', function () {

  var app;

  before(async function () {
    config = requireInject('../src/config')
    config.load()

    config.set('database-uri', uri)
    config.set('database-collection', nanoid())
    config.set('zipkin', nanoid())

    try {
      require('../src/utils/zipkin').initialise(config, { logSpan: sinon.spy() })
    } catch (e) { }

    await mongo.connect(config)
  })

  beforeEach(function () {
    app = require('../src/app')(config)
  })

  after(async function () {
    await mongo.close()
  });

  describe('/', function () {
    describe('valid body', function () {
      it('should create a valid config', async function () {
        const res = await chai.request(app).post('/conf').send({
          players: {
            'NICKNAME': {
              name: 'Nicholas Name'
            }
          },
          meta: {
            max: 500
          }
        })

        expect(res).to.be.status(201)

        let data = res.body.data
        expect(data.players).to.be.deep.equal({
          'NICKNAME': {
            name: 'Nicholas Name'
          }
        })
      });
    });

    describe('empty body', function () {
      it('should create a valid config', async function () {
        const res = await chai.request(app).post('/conf').send({})
        expect(res).to.be.status(400)
      });
    });

    describe('invalid body', function () {
      it('should create a valid config', async function () {
        const res = await chai.request(app).post('/conf').send({
          players: {
            'NICKNAME': {
              note: 'Nicholas Name'
            }
          }
        })

        expect(res).to.be.status(422)
      });
    });
  });

  describe('/:id', function () {

    let data;

    before(async () => {
      data = require('./utils/data/example.conf.json')

      await mongo.insert(data)
    })

    it('should get with id', async function () {
      const res = await chai.request(app).get(`/conf/${data._id}`)
      expect(res).to.be.status(200)

      let body = res.body
      // Need to convert the id to a string
      expect(body.data).to.be.deep.eq({...data, _id: data._id.toString()})
    });

    it('should update the the data', async function () {
      const res = await chai.request(app).patch(`/conf/${data._id}`).send([
        {
          "op": "replace",
          "path": "/players/SK/name",
          "value": "Ste"
        }
      ])

      expect(res).to.be.status(200)

      // Add the new data for the test
      data.players['SK'] = {
        name: 'Ste'
      }

      let body = res.body
      // Need to convert the id to a string
      expect(body.data).to.be.deep.eq({ ...data, _id: data._id.toString()})
    });

  });
})

function cleanRequire (path) {
  delete require.cache[require.resolve(path)]
  return require(path)
}
