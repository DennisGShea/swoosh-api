const functions = require("firebase-functions");

const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const { getItem, postItem, patchItem, deleteItem} = require('./src/swoosh-api')

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/route', getItem)
app.post('/addroute', postItem)
app.delete('/name/:itemId', deleteItem)
app.patch('/name/:itemId', patchItem)

exports.app = functions.https.onRequest(app)
