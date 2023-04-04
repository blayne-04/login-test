const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const helpers = require('./utils/helpers')
const sequelize = require('./config/connection')
const { User } = require('./models')
const withAuth = require('./utils/auth')

const SequelizeStore = require('connect-session-sequelize')(session.Store);
const app = express()
const PORT = process.env.PORT || 3001

const hbs = exphbs.create({helpers})

const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize
    })
};

app.use(session(sess));
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

sequelize.sync({ force: false}).then(() => {
    app.listen(PORT, () => console.log( `Listening at http://localhost:${PORT}/`))
})

app.get('/', withAuth, async (req, res) => {
  res.render('home', {
    logged_in: req.session.logged_in,
  })
})

app.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

app.post('/api/users/login', async (req, res) => {
  try {
      const userData = await User.findOne({ where: {email: req.body.email }})
      if (!userData || !(await userData.checkPassword(req.body.password))){
          res.status(400).json({message: 'Invalid Login Details, Try Again'})
          return;
      }

      req.session.save(() => {
          req.session.user_id = userData.id
          req.session.logged_in = true
          res.status(200).json({ user: userData, message: 'Logged in successfully'})
      })
  } catch(err) {
      res.status(400).json('')
  }
})

app.post('api/users/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});