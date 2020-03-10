const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const graphQlSchema = require('./graphql/schema/index');
const graphQlresolvers = require('./graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());


app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlresolvers,
    graphiql: true
}));

mongoose.connect('mongodb://localhost:4444/prattle-auth', { useNewUrlParser: true, useUnifiedTopology: true })
.then( () => {
    app.listen(4000, () => {
        console.log('[Prattle-Auth] running on port 4000');
    })
})
.catch( error => {
    throw new Error('Cannot connect to DB');
})


app.get('/', (req, res) => {
    res.send('Que pedo prrillo, esta es la app buena');
})