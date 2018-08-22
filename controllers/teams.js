/* Dependencies */
let router = require('koa-joi-router')
const { Joi } = router
router = router()

/* Team model */
const Team = require('../models/team')

/*
  GET Teams
*/
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
            teams: Joi.array()
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
      const teams = await Team.findAll()

      ctx.body = { success: true, response: { teams } }
    } catch(err) {
      const { message } = err
      ctx.status = 400
      ctx.body = { success: false, message }
    }
  }
})

/*
  GET Team
*/
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
            team: Joi.object()
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
      const team = await Team.findOne({ where: { id } })

      if(!team) {
        ctx.status = 404
        return ctx.body = { success: false, message: 'Not found' }
      }

      console.log(JSON.stringify(team, null, 2))

      ctx.body = { success: true, response: { team } }
    } catch(err) {
      const { message } = err
      ctx.status = 400
      ctx.body = { success: false, message }
    }
  }
})

/*
  POST Team
*/
router.route({
  method: 'post',
  path: '/',
  validate: {
    failure: 400,
    continueOnError: true,
    body: {
      name: Joi.string().min(3).required(),
      trainer_id: Joi.number().integer().min(1)
    },
    type: 'json',
    output: {
      200: {
        body: {
          success: true,
          response: Joi.object().keys({
            team: Joi.object()
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
      const team = await Team.create(ctx.request.body)

      ctx.body = { success: true, response: { team } }
    } catch(err) {
      const { message } = err
      ctx.status = 400
      ctx.body = { success: false, message }
    }
  }
})

/*
  PUT Team
*/
router.route({
  method: 'put',
  path: '/:id',
  validate: {
    failure: 400,
    continueOnError: true,
    body: {
      name: Joi.string().min(3),
      trainer_id: Joi.number().integer().min(1)
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
            team: Joi.object()
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
      let team = await Team.update(ctx.request.body, { where: { id }, returning: true })

      if(!team[1].length) {
        ctx.status = 404
        return ctx.body = { success: false, message: 'Not found' }
      }

      team = team[1][0]

      ctx.body = { success: true, response: { team } }
    } catch(err) {
      const { message } = err
      ctx.status = 400
      ctx.body = { success: false, message }
    }
  }
})

/*
  DELETE Team
*/
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
      const rows = await Team.destroy({ where: { id } })

      ctx.body = { success: true, response: { rows } }
    } catch(err) {
      const { message } = err
      ctx.status = 400
      ctx.body = { success: false, message }
    }
  }
})

module.exports = router