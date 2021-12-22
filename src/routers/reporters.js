const express = require('express')
const router = express.Router()
const Reporters = require('../model/reporters')
const auth = require('../middleware/auth')
const multer = require('multer')
// const controllers = require('../controllers/user')

///////SignUp///////////
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

/////////Login////////
router.post('/login', async (req, res) => {
    try {
        const reporters = await Reporters.specificFind(req.body.email, req.body.password)
        const token = await reporters.generatToken()
        res.status(200).send([{
            reporters,
            token
        }])
    } catch (error) {
        res.status(400).send(error.message)
    }
})

//////////profile///////////
router.get('/profile', auth, async (req, res) => {
    res.send(req.reporter)
})

/////////LogOut////////
router.delete('/logout', auth, async (req, res) => {
    try {
        req.reporter.tokens = req.reporter.tokens.filter((el) => {
            return el !== req.token
        })
        await req.reporter.save()
        res.status(200).send('Logout successfully')

    } catch (error) {
        res.status(500).send(error.message)
    }
})

////////// Reset From All Devices //////////
router.delete('/reset', auth, async (req, res) => {
    try {
        req.reporter.tokens = []
        await req.reporter.save()
        res.status(200).send('Logout Successfully From All Devices')

    } catch (error) {
        res.status(500).send(error.message)
    }
})

/////getAll///////
router.get("/reporters", auth, async (req, res) => {
    try {
        const data = await Reporters.find({})
        res.status(200).send(data)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

///////////////get By Id/////////////////
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

///////////////update/////////////////
router.patch("/update/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdateds = ["name", "age", "password"]
    let isValid = updates.every((el) => allowedUpdateds.includes(el))
    if (!isValid) {
        return res.status(400).send("Cannot Update")
    }

    try {
        const _id = req.params.id
        const reporter = await Reporters.findById(_id)
        if (!reporter) {
            return res.status(404).send("Unable To Find Data")
        }

        updates.forEach((el) => (reporter[el] = req.body[el]))
        await reporter.save()
        res.status(200).send(reporter)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

/////////delete/////////
router.delete("/reporters/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id
        const reporter = await Reporters.findByIdAndDelete(_id)
        if (!reporter) {
            return res.status(404).send("Reporter Not Found")
        }
        res.status(200).send(reporter)

    } catch (error) {
        res.status(500).send(error.message)
    }
})

////////////Profile Photo////////////////
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
            cb(new Error('Plz Uplode Img'))
        }
        cb(null, true)
    }
})


router.post('/profile/avatar', auth, upload.single('avatar'), async (req, res) => {
    try {
        req.reporter.avatar = req.file.buffer
        await req.reporter.save()
        res.status(200).send("Upload Done")

    } catch (error) {
        res.status(400).send(error.message)
    }
})


module.exports = router