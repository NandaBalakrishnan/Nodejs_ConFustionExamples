const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose')
const cors=require('./cors');
const authenticate=require('../authenticate');

const Promotions=require('../models/promotions');

const promoRouter=express.Router();
promoRouter.use(bodyParser.json());


promoRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    Promotions.find({})
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promotions.create(req.body)
    .then((promo) => {
        console.log('Promotion Created ', promo);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promotions.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

promoRouter.route('/:promoId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, { new: true })
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});





module.exports=promoRouter;





// const express=require('express');
// const bodyParser=require('body-parser');

// const promoRouter=express.Router();
// promoRouter.use(bodyParser.json());
// promoRouter.route('/')
// .all((req,res,next)=>
// {
// 	res.statusCode = 200;
//   	res.setHeader('Content-Type', 'text/plain');
//   	next();
// })

// .get((req,res,next) => {
//     res.end('Will send all the promotions to you!');
// })

// .post((req, res, next) => {
//  res.end('Will add the promotions: ' + req.body.name + ' with details: ' + req.body.description);
// })

// .put((req, res, next) => {
//   res.statusCode = 403;
//   res.end('PUT operation not supported on /promotions');
// })
 
// .delete((req, res, next) => {
//     res.end('Deleting all promotions');
// })

// promoRouter.route('/:promoId')
// .get((req,res,next) => {
//     res.end('Will send details of the promo: ' + req.params.promoId +' to you!');
// })

// .post((req, res, next) => {
//   res.statusCode = 403;
//   res.end('POST operation not supported on /promotions/'+ req.params.promoId);
// })

// .put((req, res, next) => {
//   res.write('Updating the promo: ' + req.params.promoId + '\n');
//   res.end('Will update the promoRouter: ' + req.body.name + 
//         ' with details: ' + req.body.description);
// })

// .delete((req, res, next) => {
//     res.end('Deleting promo: ' + req.params.promoId);
// })


// module.exports=promoRouter;