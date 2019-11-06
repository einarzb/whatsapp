const express = require('express');
const fetch = require('node-fetch');
const redis = require('redis');

const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const PORT = process.env.PORT || 9000;

//connect to redis on default port
const REDIS_PORT = process.env.PORT || 6379;
const client = redis.createClient(REDIS_PORT);

//GO! 
const app = express();

//cache middleware 
function cache(req,res,next) {
  const {username} = req.params;
  
  client.get(username, (err, data) => {
    if (err) throw err;

    if(data !== null) {
      res.send(setResponse(username, data));
    } else {
      next(); //move on
    }
  })
}

async function getRepos (req, res, next) {
  try {
    console.log('fetching data.....');
    const {username} = req.params;
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();
    const repos = data.public_repos;

    //redis
    client.setex(username, 3600, repos); // key, time, data

   // res.send(data); -- default res
    res.send(setResponse(username, repos));

  } catch (error) {
    console.log(error);
    res.status(500)    
  }
}

function setResponse (username, repos) {
  return `<h2>${username} has ${repos} repos </h2>`;
}

// fetch data from github api 
app.get('/repos/:username', cache, getRepos);

// fetch data from photos api
app.get('/photos', (req, res) => {
  
  // key to store results in Redis store
  const photosRedisKey = 'user:photos';

  // Try fetching the result from Redis first in case we have it cached
  return client.get(photosRedisKey, (err, photos) => {
      // If that key exists in Redis store
      if (photos) {
        return res.json({source:'cache', data:JSON.parse(photos)})
      } else {
          // Fetch directly from remote api
          fetch('https://jsonplaceholder.typicode.com/photos')
          .then(response => response.json())
          .then(photos => {
              // Save the  API response in Redis store,  data expire time in 3600 seconds, it means one hour
              client.setex(photosRedisKey, 3600, JSON.stringify(photos))
              // Send JSON response to client
              return res.json({source:'api', data:photos})
          })
          .catch(error => {
            console.log(error);
            return res.json(error.toString())
          })
       }
  })
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//echo redis errors
client.on('error', (err) => {
  console.log("Error " + err)
});

app.listen(PORT,()=>{
  console.log(`Is anyone listening? ${PORT}` );
})

module.exports = app;
