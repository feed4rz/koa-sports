/* Associations */
const Player = require('./player')
const Trainer = require('./trainer')

/* Dependencies */
const type = require('sequelize')

const Team = global.sq.define('team', {
  id: { autoIncrement: true, primaryKey: true, type: type.INTEGER },
  name: type.STRING
}, {
  defaultScope: {
    include: [{ all: true }]
  }
})

Team.belongsTo(Trainer, { foreignKey: 'trainer_id', as: 'trainer' })
Team.hasMany(Player, { foreignKey: 'team_id', as: 'players' })

module.exports = Team