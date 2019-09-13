const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const graphqlHttp = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

(async() => {
  await start();
})()

async function start() {
  const app = express();
  app.use(bodyParser.json()); // application/json

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  app.use('/graphql', graphqlHttp({
      schema: graphqlSchema,
      rootValue: graphqlResolver,
      graphiql: true,
      formatError(err){
          if(!err.originalError)
              return err;

          const { code, data } = err.originalError;
          const message = err.message || 'An error occurred!';

          return { status: code || 500, data, message };
      }
  }));

  app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message, data });
  });
  try {
      await mongoose.connect('mongodb://anthv:test123@ds119795.mlab.com:19795/graphqlav', { useNewUrlParser: true })
      app.listen(8080);
      console.log('Online');
  } catch (err) {
      console.log(err);
  }
}
