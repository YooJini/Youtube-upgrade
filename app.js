const express = require('express')
const app = express()

app.listen(7777)

const userRouter = require('./routes/users')
const channelRouter = require('./routes/channels')

app.use("/", userRouter)
app.use("/channels", channelRouter) // 경로에 중복되는 값이 있다면 써준다. (공통 URL)
