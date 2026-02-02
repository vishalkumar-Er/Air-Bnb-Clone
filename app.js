if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// ================= TRUST PROXY (RENDER FIX) =================
app.set("trust proxy", 1);

// ================= ROUTES =================
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// ================= DATABASE =================
const dbUrl = process.env.ATLASDB_URL;
if (!dbUrl) throw new Error("❌ ATLASDB_URL missing");

// ================= APP CONFIG =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ============================================================
// 🔥 DB CONNECT → SESSION → PASSPORT → ROUTES → SERVER
// ============================================================

async function startServer() {
    try {
        // 1️⃣ Connect MongoDB
        await mongoose.connect(dbUrl);
        console.log("✅ Connected to MongoDB");

        // 2️⃣ SIMPLE SESSION (NO connect-mongo)
        app.use(
            session({
                secret: process.env.SECRET,
                resave: false,
                saveUninitialized: false,
                cookie: {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                },
            })
        );

        app.use(flash());

        // 3️⃣ Passport
        app.use(passport.initialize());
        app.use(passport.session());
        passport.use(new LocalStrategy(User.authenticate()));
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());

        // 4️⃣ Locals
        app.use((req, res, next) => {
            res.locals.success = req.flash("success");
            res.locals.error = req.flash("error");
            res.locals.currUser = req.user;
            next();
        });

        // 5️⃣ Routes
        app.use("/listings", listingRouter);
        app.use("/listings/:id/reviews", reviewRouter);
        app.use("/", userRouter);

        // 6️⃣ 404
        app.use((req, res, next) => {
            next(new ExpressError(404, "Page Not Found"));
        });

        // 7️⃣ Error handler
        app.use((err, req, res, next) => {
            const statusCode = err.statusCode || 500;
            const message = err.message || "Something went wrong!";
            res.status(statusCode).render("error.ejs", { message });
        });

        // 8️⃣ Start server
        const port = process.env.PORT || 8080;
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });

    } catch (err) {
        console.error("❌ FATAL STARTUP ERROR:", err);
        process.exit(1);
    }
}

startServer();
