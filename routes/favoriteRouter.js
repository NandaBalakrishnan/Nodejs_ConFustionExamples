const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose')
const cors=require('./cors');

const Favorites=require('../models/favorite');


const favoriteRouter=express.Router();
favoriteRouter.use(bodyParser.json());
var authenticate=require('../authenticate')


favoriteRouter.route("/")
    .get(authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
        .populate("user")
        .populate("dishes")
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorites) => {
                if (favorites == null) {
                    favorites = new Favorites({
                        user: req.user._id
                    });
                    favorites.save()
                        .then((favorites) => {
                            res.statusCode = 200;
                        }, (err) => next(err));
                }

                req.body.forEach(element => {
                    if (favorites.dishes.indexOf(element._id) === -1) {
                        favorites.dishes.push(element);
                    }
                });
                favorites.save()
                    .then((favorites) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorites);
                    }, (err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /faviortes');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Favorites.findOneAndRemove({ user: req.user._id })
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favoriteRouter.route("/:dishId")
    .get(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /faviortes' + req.params.dishId);
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorites) => {
                if (favorites == null) {
                    favorites = new Favorites({
                        user: req.user._id
                    });
                    favorites.save()
                        .then((favorites) => {
                            res.statusCode = 200;
                        }, (err) => next(err));
                }

                if (favorites.dishes.indexOf(req.params.dishId) === -1) {
                    favorites.dishes.push({ _id: req.params.dishId });
                }
                else {
                    var err = new Error("Dish already exist");
                    err.status = 403;
                    next(err);
                }
                favorites.save()
                    .then((favorites) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorites);
                    }, (err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /faviortes' + req.params.dishId);
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorite) => {
                console.log(favorite);
                if (favorite != null && favorite.dishes.indexOf(req.params.dishId) != -1) {
                    favorite.dishes.splice(favorite.dishes.indexOf(req.params.dishId), 1);
                    favorite.save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                        }, (err) => next(err));
                }
                else if (favorite == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Dish ' + req.params.dishId + ' not exist');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = favoriteRouter;