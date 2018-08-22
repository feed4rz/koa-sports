/* Dependencies */
const type = require('sequelize')

const Player = global.sq.define('player', {
  id: { autoIncrement: true, primaryKey: true, type: type.INTEGER },
  name: type.STRING,
  team_id: type.INTEGER
})

module.exports = Player