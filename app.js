const express = require('express');
const path = require('path');
const app = express();

const publicURL = `${__dirname}/public`; 
const buildURL = path.join(__dirname, 'node_modules/three/build');
const jsmULR = path.join(__dirname, 'node_modules/three/examples/jsm');

app.use(express.static(publicURL));
app.use('/build/', express.static(buildURL));
app.use('/jsm/', express.static(jsmULR));

app.listen(3000, function() {
  console.log('Aplicación ejemplo, escuchando el puerto 3000!');
});