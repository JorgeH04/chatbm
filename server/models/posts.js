const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = new mongoose.Schema(
  {
    firstImage: {
      type: String,
    },
    
    secondImage: {
      type: String,
    },
    usuario: {
      type: ObjectId,
      required: [true, 'Post debe estar asociada a un usuario'],
      ref: 'user',
      index: true
    },
    caption: {
      type: String,
      maxlength: 180
    },
    numLikes: {
      type: Number,
      min: 0,
      default: 0
    },
    numComentarios: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  {
    timestamps: { createdAt: 'fecha_creado', updatedAt: 'fecha_actualizado' },
    toJSON: { virtuals: true }
  }
);



postSchema
  .virtual('estaLike')
  .get(function() {
    if (this._estaLike == null) {
      return false;
    }

    return this._estaLike;
  })
  .set(function(v) {
    this._estaLike = v;
  });

const Post = mongoose.model('post', postSchema);

module.exports = {
  Post
};
