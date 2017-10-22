var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,

    trim: true
  },
  username: {
    type: String,
    unique: true,

    trim: true
  },
  password: {
    type: String,

  },
  passwordConf: {
    type: String,

  },
  note: {
    type: String
  }
});
/*var UserSchema2 = new mongoose.Schema({
  email2: {
    type: String,
    unique: true,
    trim: true
  },
  user_note: {
    type: String,
  }
});*/


UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

/*UserSchema2.pre('save', function (next) {
  next();

});*/

var User = mongoose.model('User', UserSchema);
module.exports = User;
