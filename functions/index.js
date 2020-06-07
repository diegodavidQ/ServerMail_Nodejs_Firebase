const functions = require('firebase-functions');
const express = require('express');

//#########################################
const cors = require("cors"); //firebase
const bodyParser = require("body-parser"); //firebase
const nodemailer = require("nodemailer"); //requeria instalar en functions/
require('dotenv').config(); //requeria instalar npm i dotenv --save

// create a new Express application instance 
const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());


//respuesta del servidor en la raiz
app.get("/", (req, res) => {
    res.send(
      "<h1 style='text-align: center'>Bienvenido al servidor<br><br>😃😃😃😃</h1>"
    );
  });
  


  app.get("/hola", (req, res) => {
    res.send(
      "<h1 style='text-align: center'>Bienvenido al servidor de Diego <br><br>😃😃😃😃</h1>"
    );
  });

  //definir un sendmail endpoint, which will send emails and response with the corresponding status
  app.post("/sendmail", (req, res) => {
    console.log("llegada de la solicitud");
    let userData = req.body;

    sendMail(userData, info => { //ejecuta la función sendMail
        /*(err, info) => {
    if (err) {*/ /* ${info.messageId}`*/
      console.log(`El mail ha sido enviado 😃`);
      res.send(info);
    });
  });


//funcion para enviar el mensaje
async function sendMail(userData, callback) {

    //variable que enviaremos por mail obtenida de userData
    contentHTML = `
        <h1>Información de contacto</h1>
        <ul>
            <li>Nombre: ${userData.name}</li>
            <li>Asunto: ${userData.asunto}</li>
            <li>Email: ${userData.email}</li>            
        </ul>
        <p>Mensaje: ${userData.mensaje}</p>
    `;
    

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
        user: functions.config().service.apimail_user,
        pass: functions.config().service.apimail_pass
        }
    });


    let mailOptions = {
        from: '"Servicio correo diego"<example.gmail.com>', 
        to: '<MAIL-DESTINO>',
        bcc: '<MAIL-DESTINO-BCC>',//copia oculta        
        subject: userData.asunto, 
        //text: "Esto esta trabajando"
        html: contentHTML
    };


    /*enviar email */   
    let info = await transporter.sendMail(mailOptions, (err, data) => {
        var resp = (err) ? 'Error occurs'+ err :  'Email sent!!!';
        console.log("respuesta: "+resp);
        return resp;
    });

    
    callback(info); //enviar email

} //find de sendMail async


exports.app = functions.https.onRequest(app);

