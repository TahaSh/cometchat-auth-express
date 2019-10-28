const app = require('express')()
const fetch = require('node-fetch')
const cors = require('cors')
const port = 3000

const userInDB = {
  id: 'test-user-id',
  email: 'user@example.com',
  password: 'password'
}

function authenticate (email, password) {
  return email === userInDB.email && password === userInDB.password
    ? userInDB
    : false
}

app.use(cors())

app.get('/login', async (req, res) => {
  let user = authenticate(req.query.email, req.query.password)
  if (user) {
    const response = await fetch(`https://api-eu.cometchat.io/v2.0/users/${user.id}/auth_tokens`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'apikey': 'f992951255b815be8068341a31b900e1f0edf573',
        'appid': '1018338326945ed'
      }
    })
    const result = await response.json()
    res
      .status(200)
      .json({
        id: user.id,
        email: user.email,
        cometchatAuthToken: result.data.authToken
      })
  } else {
    res
      .status(401)
      .json({
        message: 'Your email or password is wrong!'
      })
  }
})

app.listen(port, () =>
  console.log(`Your server is running on port ${port}`)
)
