const express = require('express')
const router = express.Router()
const News = require('../model/news')


router.post('/news', async (req, res) => {
    try {
        const news = await News(req.body)
        news.save()
        res.status(200).send(news)
    } catch (error) {
        res.status(400).send(error.message)
    }
})


///////////////////////////////////////////////
router.get('/news', async (req, res) => {
    try {
        const news = await News.find({})
        res.status(200).send(news)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
////////////////////////////////////////////////////////
router.get('/news/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const news = await News.findById(_id)
        if (!news) {
            return res.status(404).send("unable to find data")
        }
        res.status(200).send(news)
    } catch (error) {
        res.status(500).send(error.message)
    }
})
//////////////////////////////////////////////////////
router.patch("/news/:id", async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdateds = ["title", "description", "date"]
    let isValid = updates.every((el) => allowedUpdateds.includes(el))
    if (!isValid) {
        return res.status(400).send("cannot update")
    }

    try {
        const _id = req.params.id
        const news = await News.findByIdAndUpdate(_id, req.body, {
            new: true,
        })
        if (!news) {
            return res.status(404).send("unable to find data")
        }
        res.status(200).send(news)

    } catch (error) {
        res.status(500).send(error.message)
    }
})
///////////////////////////////////////////////////////
router.delete("/news/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const news = await News.findByIdAndDelete(_id)
        if (!news) {
            return res.status(404).send("reporter not found")
        }
        res.status(200).send(news)

    } catch (error) {
        res.status(500).send(error.message)
    }
})
module.exports = router