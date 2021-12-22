const express = require('express')
const router = express.Router()
const News = require('../model/news')
const auth = require('../middleware/auth')


router.post('/news', auth, async (req, res) => {
    try {
        const news = new News({
            ...req.body,
            owner: req.reporter._id
        })
        await news.save()
        res.status(201).send(news)
    } catch (error) {
        res.status(400).send(error.message)
    }
})


///////////////////////////////////////////////
router.get('/news', auth, async (req, res) => {
    try {
        await req.reporter.populate("news")
        res.send(req.reporter.news)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
////////////////////////////////////////////////////////
router.get('/news/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const news = await News.findOne({
            _id,
            owner: req.reporter._id
        })
        if (!news) {
            return res.status(404).send("unable to find data")
        }
        res.status(200).send(news)
    } catch (error) {
        res.status(500).send(error.message)
    }
})
//////////////////////////////////////////////////////
router.patch("/news/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdateds = ["title", "description", "date"]
    let isValid = updates.every((el) => allowedUpdateds.includes(el))
    if (!isValid) {
        return res.status(400).send("cannot update")
    }

    try {
        const _id = req.params.id
        const news = await News.findOne({
            _id,
            owner: req.reporter._id
        })
        if (!news) {
            return res.status(404).send("unable to find data")
        }
        updates.forEach((update) => news[update] = req.body[update])
        await news.save()
        res.status(200).send(news)
    } catch (error) {
        res.status(500).send(error.message)
    }
})
///////////////////////////////////////////////////////
router.delete("/news/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id
        const news = await News.findOneAndDelete({
            _id,
            owner: req.reporter._id
        })
        if (!news) {
            return res.status(404).send("reporter not found")
        }
        res.status(200).send(news)

    } catch (error) {
        res.status(500).send(error.message)
    }
})
module.exports = router