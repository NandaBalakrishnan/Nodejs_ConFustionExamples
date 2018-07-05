var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var User=require('./models/users');

var JwtStrategy=require('passport-jwt').Strategy;
var ExtractJwt=require('passport-jwt').ExtractJwt;
var jwt=require('jsonwebtoken');

var config=require('./config');




exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken=function(user)
{
	return jwt.sign(user,config.secretKey,{expiresIn:3600});
};

var opts={}
opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey=config.secretKey;


exports.jwtPassport=passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{
	console.log('JWT payload' + jwt_payload);
	User.findOne({_id:jwt_payload._id},(err,user)=>{
		if(err)
		{
			return done(err,false);
		}
		else if(user)
		{
			return done(null,user);
		}
		else
		{
			return done(null,false);
		}
	});

}));

// exports.verifyOrdinaryUser =  (req, res, next) => {
//     var token = req.headers["authorization"];
    
//     if (token) {
//         token = token.split(" ")[1]
//         jwt.verify(token, config.secretKey, function (err, decoded) {
//             if (err) {
//                 var err = new Error('You are not authenticated!');
//                 err.status = 401;
//                 return next(err);
//             } else {
//                 req.user = decoded;
//                 next();
//             }
//         });
//     } else {
//         var err = new Error('No token provided!');
//         err.status = 403;
//         return next(err);
//     }
// };



exports.verifyAdmin=function(req,res,next)
{
	if(req.user.admin)
	{
		next();
	}
	else
	{
		 var err = new Error('You are not authorized to perform this operation!');
    	err.status = 403;
    	next(err);
	}
	
};


exports.verifyUser=passport.authenticate('jwt',{session:false});