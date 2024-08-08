const express = require('express');
const uuid  = require('uuid/v4');
const passport = require('passport');
const cloudinary = require('cloudinary');
const multer = require('multer');
const path = require('path');
const { validarMetadataDePost } = require('./posts.validate');
const {
  obtenerPosts,
  obtenerPost,
  crearPost,
  obtenerPostsParaUsuario,
  obtenerFeed,
  eliminarPost
} = require('../controllers/posts');
const { Post } = require('../models/posts');

const jwtAuthenticate = passport.authenticate('jwt', { session: false });
const router = express.Router();


cloudinary.config({
  cloud_name:'dke05dvj0',
  api_key:'264876337319563',
  api_secret:'VUFfQNR5e608eJChBfUfwiv9Yjs'
});



const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/img/uploads'),
  filename: (req, file, cb) => {
    cb(null, uuid() + path.extname(file.originalname));
  },
});   


const uploadImages = multer({ storage: storage }).array('files', 2);



router.get(
  '/',((req, res) => {
    return obtenerPosts().then(posts => {
      res.json(posts);
    });
  })
);

router.get(
  '/explore',((req, res) => {
    return obtenerPosts().then(posts => {
      res.json(posts);
    });
  })
);

router.get(
  '/feed',
  [jwtAuthenticate],((req, res) => {
    const buscarAntesDeFecha = req.query.fecha || new Date();
  
    console.log(`Buscando posts para el feed antes de la fecha [${buscarAntesDeFecha}]`);

    return obtenerFeed(req.user.id, buscarAntesDeFecha).then(posts => {
      res.json(posts);
    });
  })
);

router.get(
  '/usuario/:id',
  [jwtAuthenticate],
  ((req, res) => {
    let id = req.params.id;
    return obtenerPostsParaUsuario(id).then(posts => {
      res.json(posts);
    });
  })
);


router.delete('/posts/:id', (req, res) => {
  const postId = req.params.id;

  return eliminarPost(postId)
    .then(() => res.status(200).json({ message: 'Post eliminado correctamente' }))
    .catch(error => res.status(500).json({ error: error.message }));
});


router.get(
  '/:id',
  [jwtAuthenticate],
  ((req, res) => {
    let id = req.params.id;
    return obtenerPost(id, req.user.id).then(post => {
      if (!post) {
        let err = new Error(`Post con id [${id}] no existe.`);
        err.status = 404;
        throw err;
      }
      res.json(post);
    });
  })
);

router.post(
  '/',
  [jwtAuthenticate, validarMetadataDePost],
  ((req, res) => {
    return crearPost(req.body, req.user.id).then(post => {
      console.log('Post agregada a la colección de posts', post);
      res.status(201).json(post);
    });
  })
);


router.delete('/posts/:id', (req, res) => {
  const postId = req.params.id;

  return eliminarPost(postId)
    .then(() => res.status(200).json({ message: 'Post eliminado correctamente' }))
    .catch(error => res.status(500).json({ error: error.message }));
});



router.post('/newupload', uploadImages, [jwtAuthenticate], async (req, res) => {
  const { caption } = req.body;

  try {
    const uploadedFiles = req.files;

    if (uploadedFiles.length === 0) {
      return res.status(400).json({ error: "Debe subir al menos una imagen." });
    }

    const usuario = req.user.id; 

    let firstImage = "";
    if (uploadedFiles[0]) {
      console.log("Información del primer archivo:", uploadedFiles[0]);

      const resp = await cloudinary.v2.uploader.upload(uploadedFiles[0].path);
      firstImage = resp.url;
    }

    let secondImage = "";
    if (uploadedFiles[1]) {
      const respdos = await cloudinary.v2.uploader.upload(uploadedFiles[1].path);
      secondImage = respdos.url;
    }

    const newNote = new Post({
      firstImage,
      secondImage,
      caption,
      usuario, // Asocia el usuario al nuevo Post
    });

    await newNote.save();

    res.status(200).json({ message: "Imagen subida exitosamente." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al subir la imagen." });
  }
});




module.exports = router;
