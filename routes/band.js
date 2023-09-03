'use strict';

var express = require('express');
const { body, param, validationResult } = require('express-validator');
var router = express.Router();

const BaseResponse = require('../utils/base_reponse');
const { response } = require('../app');
const daoTBand = require('../dao/t_band');
const daoVBand = require('../dao/v_band');
const daoTPlayer = require('../dao/t_player');
const daoTMember = require('../dao/t_member');

module.exports = function (db) {
    /**
        * @swagger
        * /api/band:
        *   post:
        *     tags: [Bands]
        *     description: Create a new band
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             type: object
        *             properties:
        *               name:
        *                 type: string
        *               max_member:
        *                 type: int
        *             example:
        *               name: Queen
        *               max_member: 4
        *     responses:
        *       201:
        *         description: Band created successfully
        *       400:
        *         description: Invalid request data
    */
    router.post('/', [
        body('name').notEmpty().isString(),
        body('max_member').notEmpty().isInt().withMessage("Maximum member must be an Integer")
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
            max_member
        } = req.body;


        var sql = `INSERT INTO t_bands (name, max_member, created_at) VALUES ($1, $2, $3) RETURNING *`;
        const data = [name, max_member, new Date()];
        
        db.query(sql, data, (err, result) => {
            if (err) {
                response.status = 500
                response.message = err
                return res.status(500).json(response);
            } else {
                response.status = 201
                response.message = 'Band created successfully'
                response.data = result.rows[0]
                return res.status(201).json(response);
            }
        })
    });

    /**
     * @swagger
     * /api/band/{band_id}:
     *   get:
     *     tags: [Bands]
     *     description: Get a details of band
     *     parameters:
     *       - in: path
     *         name: band_id
     *         required: true
     *         description: ID of the band
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Success
     */
    router.get('/:band_id', [
        param('band_id').notEmpty(),
    ], async (req, res, next) => {
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
            band_id
        } = req.params

        let resp_data = {
            name: '',
            members: []
        }

        //Checking what band already exist
        let get_band_by_id = await daoTBand.get_band_by_id(band_id);

        if (get_band_by_id.errors) {
            response.status = 500
            response.message = get_band_by_id.errors
            return res.status(500).json(response);
        }

        if (get_band_by_id.data.length <= 0) {
            response.status = 200
            response.message = "Band not exist"
            return res.status(200).json(response);
        }

        resp_data.name = get_band_by_id.data[0].name

        // get detail band
        let get_detail_band_by_id = await daoTBand.get_detail_band_by_id(band_id);

        if (get_detail_band_by_id.errors) {
            response.status = 500
            response.message = get_detail_band_by_id.errors
            return res.status(500).json(response);
        }

        resp_data.members = get_detail_band_by_id.data

        response.status = 200
        response.message = "Success"
        response.data = resp_data
        return res.status(200).json(response);
    });

    /**
     * @swagger
     * /api/band:
     *   get:
     *     tags: [Bands]
     *     description: Get a list of bands
     *     responses:
     *       200:
     *         description: Success
     */
    router.get('/', async (req, res, next) => {
        const response = { ...BaseResponse }
        //Checking what band already exist
        let get_list_band = await daoTBand.get_list_band();

        if (get_list_band.errors) {
            response.status = 500
            response.message = get_list_band.errors
            return res.status(500).json(response);
        }

        response.status = 200
        response.message = "Success"
        response.data = get_list_band.data
        return res.status(200).json(response);
    });

    /**
        * @swagger
        * /api/band/{band_id}:
        *   put:
        *     tags: [Bands]
        *     description: Update an existing band
        *     parameters:
        *       - in: path
        *         name: band_id
        *         required: true
        *         description: ID of the band to update
        *         schema:
        *           type: integer
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             type: object
        *             properties:
        *               name:
        *                 type: string
        *               max_member:
        *                 type: int
        *             example:
        *               name: Queen
        *               max_member: 4
        *     responses:
        *       201:
        *         description: Band update successfully
        *       400:
        *         description: Invalid request data
    */
    router.put('/:band_id', [
        param('band_id').notEmpty(),
        body('name').isString(),
        body('max_member').isInt().withMessage("Maximum member must be an Integer")
    ], async (req, res, next) => {
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
            band_id
        } = req.params

        const {
            name,
            max_member
        } = req.body;


        //Checking what band already exist
        let get_v_band_by_id = await daoTBand.get_band_by_id(band_id);
        if (get_v_band_by_id.errors) {
            response.status = 500
            response.message = get_v_band_by_id.errors
            return res.status(500).json(response);
        }

        if (get_v_band_by_id.data.length <= 0) {
            response.status = 200
            response.message = "Band not exist"
            return res.status(200).json(response);
        }

        //Update band
        let update_band = await daoTBand.update_band(band_id, name, max_member);
        if (update_band.errors) {
            response.status = 500
            response.message = update_band.errors
            return res.status(500).json(response);
        }

        response.status = 201
        response.message = "Band update successfully"
        response.data = update_band.data
        return res.status(201).json(response);
    });

    /**
        * @swagger
        * /api/band/member:
        *   post:
        *     tags: [Bands]
        *     description: Add a new member into band
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             type: object
        *             properties:
        *               band_id:
        *                 type: int
        *               player_id:
        *                 type: int
        *             example:
        *               band_id: 0
        *               player_id: 0
        *     responses:
        *       201:
        *         description: Add member into the band successfully
        *       400:
        *         description: Invalid request data
    */
    router.post('/member', [
        body('band_id').notEmpty().isInt().withMessage("Band ID must be an Integer"),
        body('player_id').notEmpty().isInt().withMessage("Player ID must be an Integer")
    ], async (req, res) => {
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
            band_id,
            player_id
        } = req.body;

        // //Checking what band already exist
        // let get_band_by_id = await daoTBand.get_band_by_id(band_id);
        // if (get_band_by_id.errors) {
        //     response.status = 500
        //     response.message = get_band_by_id.errors
        //     return res.status(500).json(response);
        // }

        // if (get_band_by_id.data.length <= 0) {
        //     response.status = 200
        //     response.message = "Band not exist"
        //     return res.status(200).json(response);
        // }

        //Checking what band already exist
        let get_v_band_by_id = await daoVBand.get_v_band_by_id(band_id);
        if (get_v_band_by_id.errors) {
            response.status = 500
            response.message = get_v_band_by_id.errors
            return res.status(500).json(response);
        }

        if (get_v_band_by_id.data.length > 0) {
            if (!get_v_band_by_id.data.length) {
                response.status = 200
                response.message = "Band not exist"
                return res.status(200).json(response);
            }

            if (get_v_band_by_id.data[0].max_member <= parseInt(get_v_band_by_id.data[0].total_members)) {
                response.status = 400
                response.message = "Members is already fully"
                return res.status(400).json(response);
            }
        }

        //Checking what player already exist
        let get_player_by_id = await daoTPlayer.get_player_by_id(player_id);
        if (get_player_by_id.errors) {
            response.status = 500
            response.message = get_player_by_id.errors
            return res.status(500).json(response);
        }

        if (get_player_by_id.data.length <= 0) {
            response.status = 200
            response.message = "Player not exist"
            return res.status(200).json(response);
        } else {
            //Update status player to false or non-active
            let update_status_member = await daoTMember.update_status_member(player_id, false);
            if (update_status_member.errors) {
                response.status = 500
                response.message = update_status_member.errors
                return res.status(500).json(response);
            }
        }

        //Post member into the band
        let post_member = await daoTMember.post_member(band_id, player_id);
        if (post_member.errors) {
            response.status = 500
            response.message = post_member.errors
            return res.status(500).json(response);
        }

        response.status = 201
        response.message = "Add member into the band successfully"
        response.data = post_member.data
        return res.status(201).json(response);
    });
  
    return router;
}