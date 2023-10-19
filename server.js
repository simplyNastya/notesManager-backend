const express = require('express')
const app = express()
const path = require('path')
const { logger } = require('./middlewares/logger')
const { PORT = 3500 } = process.env

app.use(logger);

app.use(express.json())

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) })

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', 'pageNotFound.html'))
    } else if (req.accepts('json')) {
        res.json({message: '404 Not Found'})
    } else {
        res.type('txt').send('404 Not Found')
    }
})

module.exports = app