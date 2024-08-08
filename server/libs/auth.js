const passportJWT = require('passport-jwt');

const log = require('../utils/logger');
const config = require('../config');
const usersController = require('../controllers/users');


// Token debe ser especificado mediante el header "Authorization". Ejemplo:
// Authorization: bearer xxxx.yyyy.zzzz
let jwtOptions = {
  secretOrKey: config.jwt.secreto,
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = new passportJWT.Strategy(jwtOptions, (jwtPayload, next) => {
  usersController
    .obtainUser({ id: jwtPayload.id })
    .then(user => {
      if (!user) {
        log.info(
          `JWT token not valid. User with id ${jwtPayload.id} does not existe.`
        );
        next(null, false);
        return;
      }

      log.info(
        `User ${
          user.username
        } suministro un token valido. Autenticación completada.`
      );
      next(null, user);
    })
    .catch(err => {
      log.error('Error ocurrió al tratar de validar un token.', err);
      next(err);
    });
});
