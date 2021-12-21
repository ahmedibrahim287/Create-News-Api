const express = require('express')
const router = express.Router()
const Reporters = require('../model/reporters')

router.post('/reporters', async (req, res) => {
    try {
        const reporters = new Reporters(req.body)
        const token = await reporters.generatToken()
        res.status(200).send({
            reporters,
            token
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
})


router.get("/reporters", async (req, res) => {
    try {
        const data = await Reporters.find({})
        res.status(200).send(data)
    } catch (error) {
        res.status(500).send(error.message)
    }
})


////////////////////////////////
router.get("/reporters/:id", async (req, res) => {
    try {
        let _id = req.params.id
        const reporter = await Reporters.findById(_id)
        if (!reporter) {
            return res.status(404).send("unable to find data")
        }
        res.status(200).send(reporter)
    } catch (error) {
        res.status(500).send(error)
    }
})
////////////////////////////////
router.patch("/reporters/:id", async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdateds = ["name", "age", "password"]
    let isValid = updates.every((el) => allowedUpdateds.includes(el))
    if (!isValid) {
        return res.status(400).send("cannot update")
    }

    try {
        const _id = req.params.id
        const reporter = await Reporters.findByIdAndUpdate(_id, req.body, {
            new: true,
            runValidators: true
        })
        if (!reporter) {
            return res.status(404).send("unable to find data")
        }
        res.status(200).send(reporter)

    } catch (error) {
        res.status(500).send(error.message)
    }
})
//////////////////
router.delete("/reporters/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const reporter = await Reporters.findByIdAndDelete(_id)
        if (!reporter) {
            return res.status(404).send("reporter not fount")
        }
        res.status(200).send(reporter)

    } catch (error) {
        res.status(500).send(error.message)
    }
})


module.exports = router