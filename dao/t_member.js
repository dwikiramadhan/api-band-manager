const db = require('../config/db.js');
const BaseResponse = require('../utils/base_reponse')

const response = { ...BaseResponse }

module.exports = {
    post_member: async (band_id, player_id) => {
        const sql = `INSERT INTO t_members (player_id, band_id, status, created_at) VALUES ($1, $2, $3, $4) RETURNING *`;
        const data = [player_id, band_id, 1, new Date()];
        return new Promise((resolve, reject) => {
            db.query(sql, data, (err, result) => {
                if (err) {
                    response.errors = err.toString()
                    return resolve(response)
                }

                response.data = result.rows[0]
                return resolve(response)
            })
        })
    },

    update_status_member: async (player_id, status) => {
        const sql = `UPDATE t_members SET status = $1 WHERE player_id = $2 RETURNING *`;
        const data = [status, player_id];
        return new Promise((resolve, reject) => {
            db.query(sql, data, (err, result) => {
                if (err) {
                    response.errors = err.toString()
                    return resolve(response)
                }

                response.data = result.rows[0]
                return resolve(response)
            })
        })
    },
}