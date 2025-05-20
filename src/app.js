const express = require("express")
const cors = require("cors")
const dbConnect = require('./config/mongo')

//require('dotenv').config();
require('dotenv').config();

const app = express()


const swaggerUi = require("swagger-ui-express")
const { specs } = require('./docs/swagger')

const morganBody = require("morgan-body")

const { loggerStream } = require("./utils/handleLogger")


morganBody(app, {
    noColors: true,
    skip: function(req, res) {
    return res.statusCode < 400
    },
    stream: loggerStream
   })

//Le decimos a la app de express() que use cors para evitar el error Cross-Domain (XD)
app.use(cors())

app.use(express.json())


app.use("/api", require("./routes")) //Lee routes/index.js por defecto

app.use("/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
   )

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log("Servidor escuchando en el puerto " + port + "\nhttp://localhost:" + port)
    dbConnect();
})

module.exports = app
