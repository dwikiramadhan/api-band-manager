const db = require('../config/db.js');
const BaseResponse = require('../utils/base_reponse')

const response = { ...BaseResponse }

module.exports = {
    get_player_by_id: async (player_id) => {
        const sql = `SELECT * FROM t_players WHERE id = ${player_id}`;
        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) {
                    response.errors = err.toString()
                    return resolve(response)
                }

                response.data = result.rows
                return resolve(response)
            })
        })
    },
}