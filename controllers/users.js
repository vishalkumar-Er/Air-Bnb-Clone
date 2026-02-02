const User = require("../models/user");
const passport = require("passport");

// ================= SIGNUP FORM =================
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// ================= SIGNUP =================
module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        // auto login after signup
        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "Welcome to Wanderlust!");
            return res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
};

// ================= LOGIN FORM =================
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// ================= LOGIN =================
module.exports.login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);

        if (!user) {
            req.flash("error", "Invalid username or password");
            return res.redirect("/login");
        }

        req.logIn(user, (err) => {
            if (err) return next(err);

            req.flash("success", "Welcome back to Wanderlust!");
            const redirectUrl = res.locals.redirectUrl || "/listings";
            return res.redirect(redirectUrl);
        });
    })(req, res, next);
};

// ================= LOGOUT =================
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.flash("success", "You are logged out!");
        return res.redirect("/listings");
    });
};
































































































// const User = require("../models/user");


// module.exports.renderSignupForm = (req,res) => {
//     res.render("users/signup.ejs");
// };


// module.exports.signup = async(req,res) =>{
//     try{
//     let {username,email,password} = req.body;
//     const NewUser = new User({email, username});
//     const registeredUser = await User.register(NewUser, password);
//     console.log(registeredUser);
//     req.login(registeredUser, (err) =>{
//         if(err){
//             return next(err);
//         }
//         req.flash("success", "Welcome to Wanderlust ! ");
//         res.redirect("/listings");
//     });
    
//     } catch(e){
//         req.flash("error",e.message);
//         res.redirect("/signup");
//     }
// };

// module.exports.renderLoginForm = (req,res) => {
//     res.render("users/login.ejs");
// };

// module.exports.login = async(req, res) =>{
// req.flash("success","Welcome back to Wanderlust!");
// let redirectUrl = res.locals.redirectUrl || "/listings";
// res.redirect(redirectUrl);
// };

// module.exports.logout = (req,res,next) => {
//     req.logout((err) =>{
//         if(err){
//         return next(err);
//     }
//     req.flash("success","you are logged out!");
//     res.redirect("/listings");
// });
// };