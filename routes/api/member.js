const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const members = require('../../Members');
const uuid = require('uuid');
const multer = require('multer');
const path = require('path');

//Load Machine Model
require('../../models/Machine');
const Machine = mongoose.model('machines');

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('myImage');

//Get all members
router.get('/', (req, res) => {
  // res.json(members);
  Machine.find({})
    .sort({ date: 'desc' })
    .then(machines => {
      res.render('index', {
        machines: machines
      });
    });
});

//Get single member
router.get('/:id', (req, res) => {
  const found = members.some(member => member.id === parseInt(req.params.id));
  if (found) {
    res.json(members.filter(member => member.id === parseInt(req.params.id)));
  } else {
    res.status(400).json({ msg: `No member witch the id of ${req.params.id}` });
  }
});

//Create Member
router.post('/', (req, res) => {
  const newMember = {
    // id: uuid.v4(),
    title: req.body.title,
    // photo_url: `uploads/${req.file}`,
    photo_url: req.body.photo_url,
    document_url: req.body.document_url,
    details: req.body.details
  };
  // if (!newMember.name || !newMember.email) {
  //   res.status(400).json({ msg: 'Please include a name or email' });
  // }

  // members.push(newMember);
  // res.json(members);
  new Machine(newMember).save().then(machines => {
    res.redirect('/');
  });
});

//Update single member
router.put('/:id', (req, res) => {
  const found = members.some(member => member.id === parseInt(req.params.id));
  if (found) {
    const updMember = req.body;
    members.forEach(member => {
      if (member.id === parseInt(req.params.id)) {
        (member.name = updMember.name ? updMember.name : member.name),
          (member.email = updMember.email ? updMember.email : member.email);

        res.json({ msg: 'Member updated', member });
      }
    });
  } else {
    res.status(400).json({ msg: `No member witch the id of ${req.params.id}` });
  }
});

//Delete single member
router.delete('/:id', (req, res) => {
  const found = members.some(member => member.id === parseInt(req.params.id));
  if (found) {
    res.json({
      msg: 'Member deleted',
      members: members.filter(member => member.id !== parseInt(req.params.id))
    });
  } else {
    res.status(400).json({ msg: `No member witch the id of ${req.params.id}` });
  }
});

module.exports = router;
