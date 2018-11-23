const express = require('express')
  , app = express()

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/auth', require('./routes/authentication'))
app.use('/users', require('./routes/users'))
 
app.listen(5000, () => console.log(`Example app listening on port 5000!`))