const express = require('express');
const app = express();
const path = require('path');
const expressEjsLayouts = require('express-ejs-layouts');
const db = require('./configs/mongoose')


app.use(express.urlencoded({ extended: true }));
app.use(expressEjsLayouts)
app.set('view engine', 'ejs')
app.set('views', './views')
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use('/', require('./routes/index.js'));

app.listen(8000, (error) => {
    if(error) {console.log("error in server",error)}
    console.log("Server running on port 8000")
})
