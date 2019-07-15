require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const app = require('./app');

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`));
