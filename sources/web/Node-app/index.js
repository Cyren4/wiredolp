const express = require("express");
const path = require("path");
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const fs = require("fs");
const { spawn } = require('child_process');


const app = express();
app.use(express.json());
app.use(fileUpload({
    createParentPath: true
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(express.static('public'));

// Selection du port
const port = "3000";

// Comportement lors de requete entrantes utilisant la methode POST a l'url '/fichier'
app.post('/fichier', (request,response) =>{
    var logfile = request.files.fichierTrace;
    console.log(logfile);
    var buffer = logfile.data;
    console.log(buffer.toString('utf8'))
    fs.writeFileSync(path.join(__dirname,'pythonScript/trace.txt'),buffer.toString('utf8'));
    
})

// Comportement lors de requete entrantes utilisant la methode GET a l'url '/fichier'
app.get('/fichier',(request,response) =>{

    var outputData = [];
    const python = spawn('python',['./pythonScript/main.py']);
    // Execution du script python
    python.stdout.on('data',function(data){
        console.log('On lance le programme python ...');
        outputData.push(data);
        console.log(outputData);
    });
    // Lorsque le script python est termine on est sur que tout est bon
    python.on('close',(code) => {
        console.log(`child process close all stdio with code ${code}`);
        console.log(outputData.toString());
        var resRaw = fs.readFileSync('./output.json')
        const res = JSON.parse(resRaw)
        console.log(res);
        response.send(res);
    });
});

// On ecoute au port selectionne
app.listen(port);
// Affichage de l'adresse
console.log("Serveur started at http://localhost:" + port); 