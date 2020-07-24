const router = require('express').Router();
const authModel = require('./authModel')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')


//JWT Function for making the token 4 register
function makeJwt(user) {
  const payload = {
      subject: user.id,
      username: user.username
  };

  const secret =  "is it secret, is it safe?";

  const options = {
      expiresIn: "1h",
  };

  return jwt.sign(payload, secret, options);
}

router.post('/register', (req, res) => {
  const credentials = req.body
  // console.log(credentials)

//if (isValid(credentials))
  if (credentials) {
      //hash and slash that password
      const hash = bcryptjs.hashSync(credentials.password, 8)
      credentials.password = hash

      //save user to DB
      authModel.register(credentials)
          .then(user => {
              const token = makeJwt(user)

              res.status(201).json({ data: user, token })
          })
          .catch(err => {
              console.log(err)
              res.status(500).json({ errMessage: err.message })
          })

  } else {
      res.status(400).json({
          errMessage:
              'please provide username and password - the password shoud be alphanumeric'
      })
  }
})


router.post('/login', (req, res) => {
  const { username, password } = req.body

    if(req.body) {
      authModel.login({username: username})
      .then(([user]) => {
        console.log("user", user)
         // compare the password the hash stored in the database
         if (user && bcryptjs.compareSync(password, user.password)) {
          const token = makeJwt(user);

          res.status(200).json({ message: "Welcome to our API", user: user.username, token });
      } else {
          res.status(401).json({ message: "Invalid credentials" });
      }
  })
  .catch(error => {
      res.status(500).json({ message: error.message });
  });
} else {
res.status(400).json({
  message: "please provide username and password and the password shoud be alphanumeric",
});
}
});

router.get('/users', (req, res) => {
  authModel.findAllUsers()
  .then( result => {
    res.status(200).json(result)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({errMessage: err.message})
  })
})

module.exports = router;
