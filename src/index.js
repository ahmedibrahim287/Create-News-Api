const express = require('express')
const newsRouter = require('./routers/reporters')
const reportersRouter = require('./routers/news')
require('./db/mongoos')

const app = express()

app.use(express.json())

const port = process.env.PORT || 3000

app.use(newsRouter)
app.use(reportersRouter)


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})