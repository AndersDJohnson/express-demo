import express from 'express'

const app = express()

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.listen(3000, (err) => {
    if (err) {
        console.error('Error starting server:', err)
    } else {
        console.log('Server is running on http://localhost:3000')
    }
})
