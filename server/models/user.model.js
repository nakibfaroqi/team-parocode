const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: 'First Name can not be empty'
    },
    lastName: {
        type: String,
        required: 'Last Name can not be empty'
    },
    email: {
        type: String,
        required: 'Email can not be empty', 
        unique: true
    },
    password: {
        type: String,
        required: 'Password can\'t be empty',
        minlength : [4, 'Password must be atleast 4 characters long']
    },
    saltSecret: String
});

//Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid E-Mail.');

// Events
userSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});

mongoose.model('User', userSchema);