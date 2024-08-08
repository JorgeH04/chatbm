require('dotenv').config();         
const express = require('express');  
         
const usersRouter = require('./routes/users');
    
const app = express();
 

const authJWT = require('./libs/auth');

const cors = require('cors');

const passport = require('passport');       
passport.use(authJWT);

require('./database');


const Message = require('./models/message');




app.set('port', process.env.PORT || 3000);

    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
app.use(cors());  

// Servir archivos estáticos que están en la carpeta public/
app.use(express.static('public'));
 
// Servir las imagenes que vienen de seedear la data
 
app.use(passport.initialize());



app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 4000;
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});    
 

 