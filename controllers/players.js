let router = require('koa-joi-router')
const { Joi } = router
router = router()

const Player = require('../models/player')

router.route({
  method: 'get',
  path: '/',
  validate: {
    failure: 400,
    continueOnError: true,
    output: {
      200: {
        body: {
          success: true,
          response: Joi.object().keys({
            players: Joi.array().items(Joi.object().keys({
              id: Joi.number().integer().min(1),
              name: Joi.string(),
              team_id: Joi.number().integer().min(1),
              createdAt: Joi.date(),
              updatedAt: Joi.date()
            }))
          })
        }
      },
      '400,404': {
        body: {
          success: false,
          message: Joi.string()
        }
      }
    }
  },
  handler: async ctx => {
    if(ctx.invalid) {
      ctx.status = 400

      let message = null
      for(let key in ctx.invalid) {
        if(ctx.invalid[key].msg) {
          message = ctx.invalid[key].msg
          break
        }
      }

      return ctx.body = { success: false, message }
    }

    try {
      const players = await Player.findAll()

      ctx.body = { success: true, response: { players } }
    } catch(err) {
      const { message } = err
      ctx.status = 400
      ctx.body = { success: false, message }
    }
  }
})

router.route({
  method: 'get',
  path: '/:id',
  validate: {
    failure: 400,
    continueOnError: true,
    params: {
      id: Joi.number().integer().min(1).required()
    },
    output: {
      200: {
        body: {
          success: true,
          response: Joi.object().keys({
            player: Joi.object().keys({
              id: Joi.number().integer().min(1),
              name: Joi.string(),
              team_id: Joi.number().integer().min(1),
              createdAt: Joi.date(),
              updatedAt: Joi.date()
            })
          })
        }
      },
      '400,404': {
        body: {
          success: false,
          message: Joi.string()
        }
      }
    }
  },
  handler: async ctx => {
    if(ctx.invalid) {
      ctx.status = 400

      let message = null
      for(let key in ctx.invalid) {
        if(ctx.invalid[key].msg) {
          message = ctx.invalid[key].msg
          break
        }
      }

      return ctx.body = { success: false, message }
    }

    try {
      const { id } = ctx.request.params
      const player = await Player.findOne({ where: { id } })

      if(!player) {
        ctx.status = 404
        return ctx.body = { success: false, message: 'Not found' }
      }

      ctx.body = { success: true, response: { player } }
    } catch(err) {
      const { message } = err
      ctx.status = 400
      ctx.body = { success: false, message }
    }
  }
})

router.route({
  method: 'post',
  path: '/',
  validate: {
    failure: 400,
    continueOnError: true,
    body: {
      name: Joi.string().min(3).required()
    },
    type: 'json',
    output: {
      200: {
        body: {
          success: true,
          response: Joi.object().keys({
            player: Joi.object().keys({
              id: Joi.number().integer().min(1),
              name: Joi.string(),
              team_id: Joi.number().integer().min(1),
              createdAt: Joi.date(),
              updatedAt: Joi.date()
            })
          })
        }
      },
      '400,404': {
        body: {
          success: false,
          message: Joi.string()
        }
      }
    }
  },
  handler: async ctx => {
  	if(ctx.invalid) {
      ctx.status = 400

      let message = null
      for(let key in ctx.invalid) {
        if(ctx.invalid[key].msg) {
          message = ctx.invalid[key].msg
          break
        }
      }

      return ctx.body = { success: false, message }
    }

    try {
      let player = await Player.create(ctx.request.body)

      player = player.dataValues

      ctx.body = { success: true, response: { player } }
    } catch(err) {
      const { message } = err
      ctx.status = 400
      ctx.body = { success: false, message }
    }
  }
})

router.route({
  method: 'put',
  path: '/:id',
  validate: {
    failure: 400,
    continueOnError: true,
    body: {
      name: Joi.string().min(3),
      team_id: Joi.number().integer().min(1)
    },
    params: {
      id: Joi.number().integer().min(1).required()
    },
    type: 'json',
    output: {
      200: {
        body: {
          success: true,
          response: Joi.object().keys({
            player: Joi.object().keys({
              id: Joi.number().integer().min(1),
              name: Joi.string(),
              team_id: Joi.number().integer().min(1),
              createdAt: Joi.date(),
              updatedAt: Joi.date()
            })
          })
        }
      },
      '400,404': {
        body: {
          success: false,
          message: Joi.string()
        }
      }
    }
  },
  handler: async ctx => {
    if(ctx.invalid) return

    try {
      const { id } = ctx.request.params
      let player = await Player.update(ctx.request.body, { where: { id }, returning: true })

      if(!player[1].length) {
        ctx.status = 404
        return ctx.body = { success: false, message: 'Not found' }
      }

      player = player[1][0]

      ctx.body = { success: true, response: { player } }
    } catch(err) {
      const { message } = err
      ctx.status = 400
      ctx.body = { success: false, message }
    }
  }
})

router.route({
  method: 'delete',
  path: '/:id',
  validate: {
    failure: 400,
    continueOnError: true,
    params: {
      id: Joi.number().integer().min(1).required()
    },
    output: {
      200: {
        body: {
          success: true,
          response: Joi.object().keys({
            rows: Joi.number().integer()
          })
        }
      },
      '400,404': {
        body: {
          success: false,
          message: Joi.string()
        }
      }
    }
  },
  handler: async ctx => {
    if(ctx.invalid) {
      ctx.status = 400

      let message = null
      for(let key in ctx.invalid) {
        if(ctx.invalid[key].msg) {
          message = ctx.invalid[key].msg
          break
        }
      }

      return ctx.body = { success: false, message }
    }

    try {
      const { id } = ctx.request.params
      const rows = await Player.destroy({ where: { id } })

      ctx.body = { success: true, response: { rows } }
    } catch(err) {
      const { message } = err
      ctx.status = 400
      ctx.body = { success: false, message }
    }
  }
})

module.exports = router