const BlogsModel = require("../models/blogsModel")
const AuthorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

//for validation of blog schema
function isValid(value) {
    if (typeof (value) == "undefined" || typeof (value) == null) return false
    if (typeof (value) == String && value.trim().length == 0) return false
    return true
}

//for validation of req.body
function isValidRequestBody(requestBody) {
    return Object.keys(requestBody).length > 0
}

// for validation of authorId
function isValidObjectId(authorId) {
    return mongoose.Types.ObjectId.isValid(authorId)
}

// handler to create new blogs after author login
const createBlogs = async function (req, res) {
    try {
        let blogData = req.body
        let jwtToken = req.headers["x-api-key"]
        let secretKey = "myprivatekeycontains123!@#"

        // various validation for edge cases
        if (!isValidRequestBody(blogData)) return res.status(400).send({ status: false, msg: "Please provide input" })
        if (!isValid(blogData.title)) return res.status(400).send({ status: false, msg: "Title is required" })
        if (!isValid(blogData.body)) return res.status(400).send({ status: false, msg: "Blog Body is required" })
        if (!isValid(blogData.tags)) return res.status(400).send({ status: false, msg: "Tags is required" })
        if (!isValidObjectId(blogData.authorId)) return res.status(400).send({ status: false, msg: "AuthorId is required" })
        if (!isValid(blogData.category)) return res.status(400).send({ status: false, msg: "Category is required" })
        if (!isValid(blogData.subcategory)) return res.status(400).send({ status: false, msg: "Sub category is required" })

        // mark published date and time while publishing
        if (blogData.isPublished == true) {
            req.body.publishedAt == Date.now()
        }

        let author = await AuthorModel.findById(blogData.authorId)

        // check if given author id is exists in DB or not
        if (!author) return res.status(404).send({ status: false, msg: "Please provide valid author ID" })
        // if available, then create new blog by that author

        // authorization of author by authorId given in blog
        let verifiedToken = jwt.verify(jwtToken, secretKey)

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}


