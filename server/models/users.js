const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: 1,
      required: [true, 'Usuario debe tener un username']    
    },
    password: {
      type: String,
      minlength: 1,
      required: [true, 'Usuario debe tener una contraseña']
    },
    email: {
      type: String,
      minlength: 1,
      required: [true, 'Usuario debe tener un email']
    },
 
 
  },
  {
    timestamps: { createdAt: 'fecha_creado', updatedAt: 'fecha_actualizado' },
    toJSON: { virtuals: true }
  }
);


module.exports = mongoose.model('user', userSchema);

