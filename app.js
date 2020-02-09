const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const routers = require('./routers');


const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routers.rootRouter);
app.use('/user', routers.userRouter);
app.use('/tracker', routers.trackerRouter);
app.use('/tweet', routers.tweetRouter);
app.use('/lookup', routers.lookupRouter);
app.use('/webhook', routers.webhookRouter);

module.exports = app;
