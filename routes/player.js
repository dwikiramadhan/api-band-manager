'use strict';

var express = require('express');
const { body, validationResult } = require('express-validator');
var router = express.Router();

const BaseResponse = require('../utils/base_reponse')

module.exports = function (db) {
    /**
        * @swagger
        * /api/player:
        *   post:
        *     tags: [Players]
        *     description: Create a new player
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             type: object
        *             properties:
        *               name:
        *                 type: string
        *               position:
        *                 type: string
        *             example:
        *               name: Freddy Mercury
        *               position: Vocalist
        *     responses:
        *       201:
        *         description: Player created successfully
        *       400:
        *         description: Invalid request data
    */
    router.post('/', [
        body('name').notEmpty().isString(),
        body('position').isString()
    ], (req, res) => {
        const response = { ...BaseResponse }
        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            response.status = 400
            response.message = "Error validation"
            response.errors = errors.array()
            return res.status(400).json(response);
        }

        const {
            name,
            position
        } = req.body;


        var sql = `INSERT INTO t_players (name, position, created_at) VALUES ($1, $2, $3) RETURNING *`;
        const data = [name, position, new Date()];
        
        db.query(sql, data, (err, result) => {
            if (err) {
                response.status = 500
                response.message = err
                return res.status(500).json(response);
            } else {
                response.status = 201
                response.message = 'Player created successfully'
                response.data = result.rows[0]
                return res.status(201).json(response);
            }
        })
    });
  
    return router;
}