const express = require('express')
const router = express.Router()
const conn = require('../mariadb')
const { body, param, validationResult } = require('express-validator')

router.use(express.json())

// 모듈화
const validate = (req, res) => {
    const err = validationResult(req)

    if (!err.isEmpty()) {
        return res.status(400).json(err.array())
    }
}

router
    .route('/')
    .get(
        [
            body('userId').notEmpty().isInt().withMessage('숫자를 입력해주세요.'),
            validate
        ]
        , (req, res) => {
            const { userId } = req.body

            let sql = 'SELECT * FROM channels WHERE user_id = ?'
            conn.query(sql, userId,
                function (err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }

                    if (results.length) {
                        res.status(200).json(results)
                    } else {
                        notFoundChannel(res)
                    }
                }
            )
        })
    .post(
        [body('userId').notEmpty().isInt().withMessage('숫자를 입력하세요.'),
        body('name').notEmpty().isString().withMessage('문자를 입력해주세요.')]
        , (req, res) => {
            const err = validationResult(req)

            if (!err.isEmpty()) {
                console.log(err.array())
                return res.status(400).json(err.array())
            }

            const { name, userId } = req.body
            let sql = 'INSERT INTO channels (name, user_id) VALUES (?, ?)'
            let values = [name, userId]
            conn.query(sql, values,
                function (err, results) {
                    if (err)
                        return res.status(400).end()

                    res.status(201).json(results)
                }
            )
        })

router
    .route('/:id')
    .get(
        param('id').notEmpty().withMessage('채널 id가 없음')
        , (req, res) => {
            const err = validationResult(req)
            if (!err.isEmpty()) {
                return res.status(400).json(err.array())
            }

            let { id } = req.params
            id = parseInt(id)

            let sql = 'SELECT * FROM channels WHERE id = ?'
            conn.query(sql, id,
                function (err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }

                    if (results.length) {
                        res.status(200).json(results)
                    } else {
                        notFoundChannel(res)
                    }
                }
            )
        })
    // 채널 개별 수정
    .put(
        [param('id').notEmpty().withMessage('채널 id가 없음'),
        body('name').notEmpty().isString().withMessage('문자를 입력하세요.')]
        , (req, res) => {
            const err = validationResult(req)
            if (!err.isEmpty()) {
                return res.status(400).json(err.array())
            }

            let { id } = req.params
            id = parseInt(id)
            let { name } = req.body

            let sql = 'UPDATE channels SET name = ? WHERE id = ?'
            let values = [name, id]
            conn.query(sql, values,
                function (err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }

                    if (results.affectedRows === 0) {
                        return res.status(400).end()
                    } else {
                        res.status(200).json(results)
                    }
                }
            )
        })
    // 채널 개별 삭제
    .delete(param('id').notEmpty().isInt().withMessage('숫자로된 id값 필요')
        , (req, res) => {
            const err = validationResult(req)
            if (!err.isEmpty()) {
                return res.status(400).json(err.array())
            }

            let { id } = req.params
            id = parseInt(id)

            let sql = 'DELETE FROM channels WHERE id = ?'
            conn.query(sql, id,
                function (err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }

                    if (results.affectedRows === 0) {
                        return res.status(400).end()
                    } else {
                        res.status(200).json(results)
                    }
                }
            )
        })

function notFoundChannel(res) {
    res.status(404).json({
        message: '채널 정보를 찾을 수 없습니다.'
    })
}

module.exports = router