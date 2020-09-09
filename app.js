var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const formusers = require('./models/userSchema');
var usersRouter = require('./routes/users');



mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
var gfs;
mongoose.connection
  .once("open", () => {
    console.log("connection established:", mongoose.connection.readyState);
    // for uploading images to database we use gridfsbucket
    gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'resume' });


  })
  .on("error", (error) => {
    console.log("connection error:", error);
  });


var storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      // crypto creates 16 random numbers 
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        // the random numbers are converted to string and stored with the image original file extension like jpg,png..etc
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          // filename consists of new filename
          filename: filename,
          bucketName: 'resume'
        };
        resolve(fileInfo);
      });
    });
  }
});
// using multer for handling multipart/form-data
var upload = multer({ storage });
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);


app.post("/form", upload.single("resume"), (req, res) => {
  const new_user = new formusers({
    name: req.body.name,
    dob: req.body.dob,
    resume: req.file.filename,
    country: req.body.country,
    date: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  })
  new_user.save(err => {
    console.log(err)
  })
  return res.send("saved successfully")

})

app.get("/pdf/:filename", function (req, res) {
  gfs.find({ filename: req.params.filename }).toArray((err, file) => {
    // if the filename exist in database
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'no files exist'
      });
    }

    // creating stream to read the image which is stored in chunks 
    const readStream = gfs.openDownloadStreamByName(file[0].filename);
    // const readStream = gfs.openDownloadStream(file[0].filename);

    // this is will display the image directly
    readStream.pipe(res);
  })

})

app.post('/delete/:id', (req, res) => {

  formusers.findOne(req.params.id, (err, data) => {
    console.log(data)
    if (err) return console.error(err);
    // find the specific id 
    gfs.find({ filename: data.resume }).toArray((err, file) => {
      // check for the imagefile
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'no files exist'
        });
      }

      else {
        // if found delete it
        gfs.delete(file[0]._id, (err, complete) => {
          if (err) {
            return console.error(err);

          }

        })
      }
    })
  })

  // later delete the post 
  formusers.findByIdAndDelete(req.params.id, function (err) {
    if (err) return console.log(err);
    else {

      res.send("deleted");
    }
  })



})



// heroku build production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
