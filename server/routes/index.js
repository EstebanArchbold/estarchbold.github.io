"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const contact_1 = __importDefault(require("../models/contact"));
const passport_1 = __importDefault(require("passport"));
const user_1 = __importDefault(require("../models/user"));
const index_1 = require("../utils/index");
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Home', page: 'home', displayName: (0, index_1.UserDisplayName)(req) });
});
router.get('/home', function (req, res, next) {
    res.render('index', { title: 'Home', page: 'home', displayName: (0, index_1.UserDisplayName)(req) });
});
router.get('/about', function (req, res, next) {
    res.render('index', { title: 'About US', page: 'about', displayName: (0, index_1.UserDisplayName)(req) });
});
router.get('/contact', function (req, res, next) {
    res.render('index', { title: 'Contact US', page: 'contact', displayName: (0, index_1.UserDisplayName)(req) });
});
router.get('/products', function (req, res, next) {
    res.render('index', { title: 'Our Product', page: 'products', displayName: (0, index_1.UserDisplayName)(req) });
});
router.get('/services', function (req, res, next) {
    res.render('index', { title: 'Our Services', page: 'services', displayName: (0, index_1.UserDisplayName)(req) });
});
router.get('/api', function (req, res, next) {
    res.render('index', { title: 'api', page: 'api', displayName: (0, index_1.UserDisplayName)(req) });
});
router.get('/eventplanning', function (req, res, next) {
    res.render('index', { title: 'Event Planning', page: 'eventplanning', displayName: (0, index_1.UserDisplayName)(req) });
});
router.get('/blog', function (req, res, next) {
    res.render('index', { title: 'Blog', page: 'blog', displayName: (0, index_1.UserDisplayName)(req) });
});
router.get('/statistics', function (req, res, next) {
    res.render('index', { title: 'Statistics', page: 'statistics', displayName: (0, index_1.UserDisplayName)(req) });
});
router.get('/login', function (req, res, next) {
    if (!req.user) {
        res.render('index', { title: 'Login', page: 'login',
            messages: req.flash('loginMessage'), displayName: (0, index_1.UserDisplayName)(req) });
    }
    return res.redirect('/contact-list');
});
router.post('/login', function (req, res, next) {
    passport_1.default.authenticate('local', function (err, user, info) {
        if (err) {
            console.error(err);
            res.end();
        }
        if (!user) {
            req.flash('loginMessage', 'Authentication Error');
            return res.redirect('/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                console.error(err);
                res.end();
            }
            res.redirect('/contact-list');
        });
    })(req, res, next);
});
router.get('/register', function (req, res, next) {
    if (!req.user) {
        res.render('index', { title: 'Register', page: 'register',
            messages: req.flash('registerMessage'), displayName: (0, index_1.UserDisplayName)(req) });
    }
    return res.redirect('/contact-list');
});
router.post('/register', function (req, res, next) {
    let newUser = new user_1.default({
        username: req.body.username,
        EmailAddress: req.body.emailAdress,
        DisplayName: req.body.firstName + " " + req.body.lastName
    });
    console.log("username: " + req.body.username);
    console.log("email:" + req.body.emailAddress);
    console.log("password:" + req.body.password);
    user_1.default.register(newUser, req.body.password, function (err) {
        if (err) {
            let errorMessage = "Server Error";
            if (err.name == 'UserExistsAlready') {
                console.error("Error: User Exists Already");
                errorMessage = "Registration Error";
            }
            req.flash('registerMessage', errorMessage);
            res.redirect('/register');
        }
        return passport_1.default.authenticate('local')(req, res, function () {
            return res.redirect('/contact-list');
        });
    });
});
router.get('/logout', function (req, res, next) {
    req.logOut(function (err) {
        if (err) {
            console.error(err);
            res.end();
        }
        res.redirect('/login');
    });
});
router.get('/contact-list', index_1.AuthGuard, function (req, res, next) {
    contact_1.default.find().then(function (data) {
        res.render('index', { title: 'Contact List', page: 'contact-list', contacts: data, displayName: (0, index_1.UserDisplayName)(req) });
    }).catch(function (err) {
        console.error("Encounters error reading from the database" + err);
        res.end();
    });
});
router.get('/edit/:id', index_1.AuthGuard, function (req, res, next) {
    let id = req.params.id;
    contact_1.default.findById(id).then(function (contactToEdit) {
        res.render('index', { title: 'Edit Contact', page: 'edit',
            contact: contactToEdit, displayName: (0, index_1.UserDisplayName)(req) });
    }).catch(function (err) {
        console.error(err);
        res.end();
    });
});
router.get('/add', index_1.AuthGuard, function (req, res, next) {
    res.render('index', { title: 'Add Contact', page: 'edit',
        contact: '', displayName: (0, index_1.UserDisplayName)(req) });
});
router.get('/delete/:id', index_1.AuthGuard, function (req, res, next) {
    let id = req.params.id;
    contact_1.default.deleteOne({ _id: id }).then(function () {
        res.redirect('/contact-list');
    }).catch(function (err) {
        console.error(err);
        res.end();
    });
});
router.post('/edit/:id', index_1.AuthGuard, function (req, res, next) {
    let id = req.params.id;
    let updatedContact = new contact_1.default({
        "_id": id,
        "FullName": req.body.fullName,
        "ContactNumber": req.body.contactNumber,
        "EmailAddress": req.body.emailAddress,
    });
    contact_1.default.updateOne({ _id: id }, updatedContact).then(function () {
        res.redirect('/contact-list');
    }).catch(function (err) {
        console.error(err);
        res.end();
    });
});
router.post('/add', index_1.AuthGuard, function (req, res, next) {
    let newContact = new contact_1.default({
        "FullName": req.body.fullName,
        "ContactNumber": req.body.contactNumber,
        "EmailAddress": req.body.emailAddress,
    });
    contact_1.default.create(newContact).then(function () {
        res.redirect('/contact-list');
    }).catch(function (err) {
        console.error(err);
        res.end();
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map