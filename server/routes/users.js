const express = require('express');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../config');
const usersController = require('../controllers/users');
const { DatosDeUsuarioYaEnUso, CredencialesIncorrectas } = require('./users.error');
const jwtAuthenticate = passport.authenticate('jwt', { session: false });
const User = require('../models/users');
const Message = require('../models/message');
 

const router = express.Router();

function transformarBodyALowercase(req, res, next) {
  req.body.username && (req.body.username = req.body.username.toLowerCase());
  req.body.email && (req.body.email = req.body.email.toLowerCase());
  next();
}

router.get(
  '/hi',((req, res) => {
    return usersController.obtainUsers().then(usuarios => {
      res.json(usuarios);
    });
  })
);

 

router.get('/whoami', [jwtAuthenticate], (async (req, res) => {
    res.json(esconderCamposSensibles(req.user));
  })
);

router.get(
  '/:username',
  [jwtAuthenticate],(async (req, res) => {
    const username = req.params.username;
    const user = await usersController.obtainUser(
      { username },
      req.user.id
    );

    if (!user) {
      let err = new Error(`Usuario con username [${username}] no existe.`);
      err.status = 404;
      throw err;
    }

    res.json(esconderCamposSensibles(user));
  })
);

router.post(
  '/signup',
  [  transformarBodyALowercase],
  (async(req, res) => {
    let newUser = req.body;

    return usersController
      .userExist(newUser.username, newUser.email)
      .then(userExist => {
        if (userExist) {
          console.log( 
            `Email [${newUser.email}] o username [${
              newUser.username
            }] ya existen en la base de datos`
          );
          throw new DatosDeUsuarioYaEnUso();
        }

        return bcrypt.hash(newUser.password, 10);
      })
      .then(hash => {
        return usersController
          .createUser(newUser, hash)
          .then(newUser => {
            res.status(201).json({
              token: crearToken(newUser._id),
              user: esconderCamposSensibles(newUser)
            });

            return newUser;
          })
          // .then(newUser => { 
          //   // El usuario creado se sigue a si mismo
          //   friendshipsController.createFriendship(newUser._id, newUser._id);
          // });
      });
  })
);

router.post(
  '/login',
  [ transformarBodyALowercase],
  (async (req, res) => {
    let userNotAuthenticated = req.body;  

    let userRegistered = await usersController.obtainUser({
      email: userNotAuthenticated.email
    });
    if (!userRegistered) {
      console.log(
        `Usuario con email [${
          userNotAuthenticated.email
        }] no existe. No pudo ser autenticado`
      );
      throw new CredencialesIncorrectas();
    }

    let contraseñaCorrecta = await bcrypt.compare(
      userNotAuthenticated.password,
      userRegistered.password
    );
    if (contraseñaCorrecta) {
      let token = crearToken(userRegistered.id);

      console.log(
        `Usuario con email ${
          userNotAuthenticated.email
        } completo autenticación exitosamente.`
      );

      const user = esconderCamposSensibles(userRegistered);

      res.status(200).json({ token, user });
    } else {
      console.log(
        `Usuario con email ${
          userNotAuthenticated.email
        } no completo autenticación. Contraseña incorrecta`
      );
      throw new CredencialesIncorrectas();
    }
  })
);



function crearToken(usuarioId) {
  return jwt.sign({ id: usuarioId }, config.jwt.secreto, {
    expiresIn: config.jwt.tiempoDeExpiración
  });
}

function esconderCamposSensibles(user) {
  return {
    _id: user._id || user.id,  
    email: user.email,
    username: user.username,
  };
}





























//endpoint to post Messages and store it in the backend
router.post("/messages", async (req, res) => {
  try {
    const { senderId, recepientId, messageType, messageText } = req.body;

    console.log("Datos recibidos:", req.body);


    const newMessage = new Message({
      senderId,
      recepientId,
      messageType,
      message: messageText,
      timestamp: new Date(),
      imageUrl: messageType === "image" ? req.file.path : null,
    });

  
    await newMessage.save();

    
    res.status(200).json({ message: "Message sent Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }  
});




///endpoint to get the userDetails to design the chat Room header
// router.get("/user/:_id", async (req, res) => {
//   try {
//     const { _id  } = req.params;

//     //fetch the user data from the user ID
//     const recepientId = await User.findById(_id);

//     res.json(recepientId);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // Cambiar _id a userId

    //fetch the user data from the user ID
    const recepientId = await User.findById(userId); // Cambiar _id a userId

    res.json(recepientId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//endpoint to fetch the messages between two users in the chatRoom
router.get("/messages/:senderId/:recepientId", async (req, res) => {
  try {
    const { senderId, recepientId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, recepientId: recepientId },
        { senderId: recepientId, recepientId: senderId },
      ],
    }).populate("senderId", "_id name");

    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//endpoint to delete the messages!
router.post("/deleteMessages", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "invalid req body!" });
    }

    await Message.deleteMany({ _id: { $in: messages } });

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server" });
  }
});








module.exports = router;
