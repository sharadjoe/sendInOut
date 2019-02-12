var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var RequestSchema = mongoose.Schema({
	fromUsername :{
		type : String
	},
	amount:{
		type: String
	},
	date:{
		type: Date, default: Date.now
	},
	transactionStatus:{
		type: Boolean
	}
});

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true,
		unique: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	daiAddr :{
		type: String
	},
	privateKey:{
		type: Buffer
	},
	createdRequests: RequestSchema
});



var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByEmail = function(email, callback){
	var query = {email: email};
	User.findOne(query, callback);
}

module.exports.getUserByPassword = function(hash, callback){
	var query = {password: hash};
	User.findOne(query, callback);
}


module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

