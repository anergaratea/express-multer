const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', '/public/uploads');
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error('Only PNG and JPG files are allowed'));
        }

        // Check file size (2MB limit)
        if (file.size > 2 * 1024 * 1024) {
            return cb(new Error('File size must be less than 2MB'));
        }

        cb(null, true);
    },
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
    },
});

router.get('/', function(req, res, next) {
  res.redirect('form.html');
});
router.post('/upload', upload.single('avatar'), (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }

        const username = req.body.username;
        console.log('Username:', username);
        console.log('File:', req.file);

        // Additional processing logic here

        res.send('Izena: ' + username + ' Fitxategia: ' + "http://localhost:3000/uploads/"+req.file.filename);
    } catch (error) {
        console.error(error.message);
        res.status(400).send('Error: ' + error.message);
    }
});

module.exports = router;
