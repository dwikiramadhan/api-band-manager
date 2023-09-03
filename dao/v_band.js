const db = require('../config/db.js');
const BaseResponse = require('../utils/base_reponse')

module.exports = {
    get_v_band_by_id: async (band_id) => {
        const response = { ...BaseResponse }
        const sql = `SELECT * FROM v_bands WHERE id = ${band_id}`;
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
    }
}