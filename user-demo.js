const express = require('express')
const app = express()
app.listen(1234)

let db = new Map()

app.use(express.json())

app
    .route('/users/:id')
    .get((req, res) => {
        let {id} = req.params

        const user = db.get(id)
        if (user){
            res.json(user)
        } else {
            res.status(404).json({message: '해당 id를 가진 데이터는 존재하지 않습니다.'})
        }
    })
    .delete((req, res) => {
        let {id} = req.params
    
        const user = db.get(id)
        if(user){
            db.delete(id)
            res.json({message: `${user.nickName}님 회원 탈퇴 처리가 완료되었습니다.`})
        } else {
            res.status(404).json({message: '해당 id를 가진 데이터는 존재하지 않습니다.'})
        }
    })
    
// 로그인
app.post('/login', (req, res)=>{
    let {id, pwd} = req.body

    let user = db.get(id)
    if (user){
        if (user.pwd === pwd){
            res.json({message: `${user.nickName}님 환영합니다.`})
        } else {
            // 비번 틀림
            res.status(401).json({message: '비밀번호를 다시 입력해주세요.'})
        }
    } else {
        res.status(404).json({message: '해당 id를 가진 데이터는 존재하지 않습니다.'})
    }
})

// 회원 가입
app.post('/join', (req, res) => {
    let {id, pwd, nickName} = req.body

    if (id && pwd && nickName){
        if (db.get(id)){
            res.status(409).json({message: '이미 존재하는 아이디입니다.'})
        }else{
            db.set(id, req.body)
            res.status(201).json({message: `${nickName}님 회원이 되신 것을 축하합니다.`})
            console.log(db)
        }
    } else {
        res.status(400).json({message: '입력값을 확인해주세요.'})
    }
})

// // 회원 정보 개별 조회
// app.get('/users/:id', (req, res) => {
//     let {id} = req.params

//     const user = db.get(id)
//     if (user){
//         res.json(user)
//     } else {
//         res.status(404).json({message: '해당 id를 가진 데이터는 존재하지 않습니다.'})
//     }
// })

// // 회원 개별 탈퇴
// app.delete('/users/:id', (req, res) => {
//     let {id} = req.params

//     const user = db.get(id)
//     if(user){
//         db.delete(id)
//         res.json({message: `${user.nickName}님 회원 탈퇴 처리가 완료되었습니다.`})
//     } else {
//         res.status(404).json({message: '해당 id를 가진 데이터는 존재하지 않습니다.'})
//     }
// })