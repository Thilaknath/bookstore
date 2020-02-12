const express = require('express')
const path = require('path')
const bookRouter = require('./routes/book')
const queries = require('./db/models/book')
const port = process.env.PORT || 3000

const app = express()
const job = require('./scripts/scheduled-tasks').job

app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'ejs')

app.use(express.json())
app.use('/api/books', bookRouter)

app.get('/', async (req, res) => {  
    const books = await queries.getAll()  
    res.render('index', { books });
})

// All other routes
app.use(function(req, res, next) {  
    var err = new Error('Not Found')      
    err.status = 404
    next(err)
})

// Handle Errors
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.message = err.message
    res.error = err

    res.json({
        message: err.message,
        error: req.get('env') === 'development' ? err : {}
    })
})



app.listen(port, () => {
    job.start()
    console.log('Server is up on port ' +port)
})

module.exports = app

