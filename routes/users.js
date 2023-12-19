// Importa el módulo 'express' para crear un enrutador de Express
const express = require("express");
const router = express.Router();
// Importa el módulo 'mongojs' para interactuar con la base de datos MongoDB
const mongojs = require("mongojs");
// Conecta a la base de datos 'users' y utiliza la colección 'users'
const db = mongojs("usersfoto", ["usersfoto"]);

const multer = require("multer");
const path = require("path");
const fs = require("fs");
// // Declara un array para almacenar temporalmente los usuarios
// let users = [];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "..", "/public/uploads");
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error("Only PNG and JPG files are allowed"));
    }

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      return cb(new Error("File size must be less than 2MB"));
    }

    cb(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
});

// Maneja solicitudes GET en la ruta '/'
router.get("/", async (req, res, next) => {
  try {
    // Consulta todos los usuarios en la base de datos
    db.usersfoto.find(function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        // Almacena los usuarios en la variable 'users'
        // users = docs;
        // Renderiza la plantilla 'users.ejs' con los usuarios y un título
        res.render("users", {
          title: "Bezeroak",
          users: docs,
        });
      }
    });
  } catch (error) {
    next(error);
  }
});

// Maneja solicitudes GET en la ruta '/list'
router.get("/list", async (req, res, next) => {
  try {
    // Consulta todos los usuarios en la base de datos y responde con una representación JSON de los usuarios
    db.usersfoto.find(function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        //users = docs;
        res.json(docs);
      }
    });
  } catch (error) {
    next(error);
  }
});

// Maneja solicitudes POST en la ruta '/new'
router.post("/new", upload.single("avatar"), (req, res) => {
  try {
    console.log(req.file, req.body)
    let img = ""
    if (!req.file) {
      img = "default.png";
    } else{
      img =req.file.filename;
    }

    // Crea un nuevo objeto de usuario con los datos del cuerpo de la solicitud
    const bezeroBerria = {
      izena: req.body.izena,
      abizena: req.body.abizena,
      email: req.body.email,
      file: img,
    };
    // Agrega el nuevo usuario al array 'users'
    //users.push(bezeroBerria);
    // Inserta el nuevo usuario en la base de datos
    db.usersfoto.insert(bezeroBerria, function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        console.log("Bezeroa gehitu da");
        // Responde con el documento insertado en formato JSON
        res.json(doc);
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).send("Error: " + error.message);
  }
});

// Maneja solicitudes DELETE en la ruta '/delete/:id'
router.delete("/delete/:id", async (req, res, next) => {
  // Filtra el usuario con el ID proporcionado y actualiza la variable 'users'
  //users = users.filter(bezeroa => bezeroa._id.toString() !== req.params.id.toString());
  // Elimina el usuario de la base de datos utilizando el ID
  db.usersfoto.remove({ _id: mongojs.ObjectId(req.params.id) }, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error deleting user" });
    }
    console.log("${doc} bezeroa ezabatu da");
    // Responde con el documento eliminado en formato JSON
    res.json(doc);
  });
});

// Maneja solicitudes PUT en la ruta '/update/:id'
router.put("/update/:id", upload.single('avatar'), async (req, res, next) => {
  try {
      let img = ""
      if (!req.file) {
        img = "default.png";
      } else{
        img =req.file.filename;
      }
  
    // Utiliza el método 'update' de mongojs para actualizar el usuario en la base de datos
    db.usersfoto.update(
      { _id: mongojs.ObjectId(req.params.id) },
      {
        $set: {
          izena: req.body.izena,
          abizena: req.body.abizena,
          email: req.body.email,
          file: img,
        },
      },
      function (err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log("Bezeroa aldatu da");
          // Responde con el documento actualizado en formato JSON
          res.json(doc);
        }
      }
    );
  } catch (error) {
    console.log("bezeroa ez da aldatu");
    next(error);
  }
});

// Exporta el enrutador para ser utilizado en otros archivos
module.exports = router;
