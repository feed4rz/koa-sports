let router = require('koa-joi-router')
const { Joi } = router
router = router()

const up_since = new Date()

router.prefix('/api')

router.use('/players', require('./players'))

router.route({
  method: 'get',
  path: '/',
  validate: {
    output: {
      200: {
        body: {
          success: Joi.boolean(),
          response: Joi.object().keys({
            up_since: Joi.date()
          })
        }
      }
    }
  },
  handler: async ctx => {
    ctx.body = { success: true, response: { up_since } }
  }
})

module.exports = router