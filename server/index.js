
const http     = require('http'),
      express  = require('express'),
      port     = 8080,
      app      = express(),
      Server   = http.createServer(app)

app.use(express.static('../public'))


Server.listen(port, () => console.log(`Server is running on port: ${port}`))
