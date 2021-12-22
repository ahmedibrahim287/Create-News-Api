const express = require('express')
require('dotenv').config()
const newsRouter = require('./routers/reporters')
const reportersRouter = require('./routers/news')
const Reporters = require('./model/reporters')
require('./db/mongoos')

const app = express()

app.use(express.json())

const port = process.env.PORT

app.use(newsRouter)
app.use(reportersRouter)



// const main = async () => {
//     const reporter = await Reporters.findById('61c33c6779ab6cb6178487a9')
//     await reporter.populate('news')
// }
// main()

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})