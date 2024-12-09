const express = require('express')
const router = express.Router()
const conn = require('../mariadb')

router.use(express.json())

router
    .route('/users')
    .get((req, res) => {
        const {email} = req.body

        let sql = 'SELECT * FROM users WHERE email = ?'
        conn.query(sql, email,
            function (err, result) {
                if (result)
                    res.status(200).json(result);
                else {
                    res.status(404).json({ message: '해당 id를 가진 데이터는 존재하지 않습니다.' })
                }
            }
        )
    })
    .delete((req, res) => {
        const {email} = req.body

        let sql = 'DELETE FROM users WHERE email = ?'
        conn.query(sql, [email],
            function(err, results){
                res.status(200).json(results)
            }
        )
    })

// 로그인
router.post('/login', (req, res) => {
    const { email, password } = req.body

    let sql = 'SELECT * FROM users WHERE email = ?'
    conn.query(sql, email,
        function (err, results) {
            let loginUser = results[0]
            if (loginUser && loginUser.password === password){
                res.status(200).json({ message: `${loginUser.name}님 환영합니다.` })
            } else {
                res.status(404).json({ message: '이메일 또는 비밀번호를 확인해주세요.' })
            }
        }
    )
})

// 회원 가입
router.post('/join', (req, res) => {
    if (req.body == {}) {
        return res.status(400).json({ message: '입력값을 확인해주세요.' })
    }

    const { email, name, password, contact } = req.body

    let sql = 'SELECT COUNT(*) AS email_count FROM users WHERE email = ?'
    conn.query(sql, [email],
        function (err, results, fields) {
            if (results[0].email_count > 0) {
                return res.status(409).json({ message: '이미 가입된 이메일 주소입니다.' })
            }

            sql = 'INSERT INTO users (email, name, password, contact) VALUES (?, ?, ?, ?)'
            let value = [email, name, password, contact]
            conn.query(sql, value,
                function (err, results, fields) {
                    return res.status(201).json({ message: `${name}님 회원이 되신 것을 축하합니다.` })
                }
            )
        }
    )
})

module.exports = router