const express = require('express');
const path = require('path');
const logger = require('./middleware/logger');
const app = express();
const exphbs = require('express-handlebars');
const members = require('./Members');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Init Middleware
//app.use(logger);

//Load Machine Model
require('./models/Machine');
const Machine = mongoose.model('machines');

// Connect to mongoose
mongoose
  .connect('mongodb://localhost/machines-dev', { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

//Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Home page url
// app.get('/', (req, res) => {
//   res.render('index', {
//     title: 'Member App',
//     members
//   });
// });
app.get('/', (req, res) => {
  // res.json(members);
  Machine.find({})
    .sort({ date: 'desc' })
    .then(machines => {
      res.render('index', {
        machines: machines
      });
    });
});

//Set Static
// app.use(express.static(path.join(__dirname, 'public')));

//Members API Routes
app.use('/api/members', require('./routes/api/member'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
