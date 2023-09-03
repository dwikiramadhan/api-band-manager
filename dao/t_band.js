const db = require('../config/db.js');
const BaseResponse = require('../utils/base_reponse')

const response = { ...BaseResponse }

module.exports = {
    get_band_by_id: async (band_id) => {
        const sql = `SELECT * FROM t_bands WHERE id = ${band_id}`;
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

    get_detail_band_by_id: async (band_id) => {
        const sql = `SELECT
            M.band_id,
            (SELECT name FROM t_bands WHERE id = M.band_id) as band_name,
            M.player_id,
            P."name",
            P."position"
        FROM
            t_members
            M LEFT JOIN t_players P ON M.player_id = P.ID 
        WHERE
            band_id = ${band_id} 
            AND status = TRUE`;
        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) {
                    response.errors = err.toString()
                    return resolve(response)
                }

                if (result.rows.length > 0) {
                    
                    let members = []
                    result.rows.map(d => {
                        members.push({
                            name: d.name,
                            position: d.position
                        })
    
                    })
    
                    response.data = members
                }else{
                    response.data = result.rows
                }

                return resolve(response)
                
            })
        })
    },

    post_band: async () => {

    },

    get_list_band: async () => {
        const sql = `SELECT id, name, max_member FROM t_bands ORDER BY created_at DESC`;
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

    update_band: async (id, name, max_member) => {
        const sql = `UPDATE t_bands SET name = $1, max_member = $2, updated_at = $3 WHERE id = $4 RETURNING *`;
        const data = [name, max_member, new Date(), id];
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