/* Dependencies */
let router = require('koa-joi-router')
const { Joi } = router
router = router()

/* Trainer model */
const Trainer = require('../models/trainer')

/*
	GET Trainers
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
            trainers: Joi.array()
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
      const trainers = await Trainer.findAll()

      ctx.body = { success: true, response: { trainers } }
    } catch(err) {
      const { message } = err
      ctx.status = 400
      ctx.body = { success: false, message }
    }
  }
})

/*
	GET Trainer
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
            trainer: Joi.object()
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
      const trainer = await Trainer.findOne({ where: { id } })

      if(!trainer) {
        ctx.status = 404
        return ctx.body = { success: false, message: 'Not found' }
      }

      ctx.body = { success: true, response: { trainer } }
    } catch(err) {
      const { message } = err
      ctx.status = 400
      ctx.body = { success: false, message }
    }
  }
})

/*
	POST Trainer
*/
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
            trainer: Joi.object()
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
      const trainer = await Trainer.create(ctx.request.body)

      ctx.body = { success: true, response: { trainer } }
    } catch(err) {
      const { message } = err
      ctx.status = 400
      ctx.body = { success: false, message }
    }
  }
})

/*
	PUT Trainer
*/
router.route({
  method: 'put',
  path: '/:id',
  validate: {
    failure: 400,
    continueOnError: true,
    body: {
      name: Joi.string().min(3)
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
            trainer: Joi.object()
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
      let trainer = await Trainer.update(ctx.request.body, { where: { id }, returning: true })

      if(!trainer[1].length) {
        ctx.status = 404
        return ctx.body = { success: false, message: 'Not found' }
      }

      trainer = trainer[1][0]

      ctx.body = { success: true, response: { trainer } }
    } catch(err) {
      const { message } = err
      ctx.status = 400
      ctx.body = { success: false, message }
    }
  }
})

/*
	DELETE Trainer
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
      const rows = await Trainer.destroy({ where: { id } })

      ctx.body = { success: true, response: { rows } }
    } catch(err) {
      const { message } = err
      ctx.status = 400
      ctx.body = { success: false, message }
    }
  }
})

module.exports = router