const paypal = require('paypal-rest-sdk');
require("dotenv").config();
var clientPayPal = process.env.PAYPAL_CLIENT_ID;
var secretPayPal = process.env.PAYPAL_SECRET;
/*
* CONFIGURE PAYPAL PAYMENT
*/
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AbNN3We11ZUJxwYW97-rxNHZuXMdJ73sZoj8xt_6yjdcPlKSBDUcmAJiYLjMnJjMPeKzt-Xn9Gcy-VJQ',
    'client_secret': 'EIzXkimVptB2PD6kP6ZJ47_kPQdAHNKQ5EJr6ygN0kdu1rLNoR6K2XQNSj8nJ6y-LOr10Y8sgSBihwIR'
  });
/*
* END CONFIGURE
*/

module.exports = app => {
    app.get('/indexpaypal', function(req, res){
        res.render('paypalui');
    });

    app.post('/pay', (req, res) => {
        const {price} = req.body;
        console.log('price: ', price);
        const create_payment_json = {
            "intent" : "sale",
            "payer" : {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "https://viws.ddns.net/predictor/admin/paypal/success",
                "cancel_url": "https://viws.ddns.net/predictor/admin/paypal/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Dustin",
                        "sku": "001",
                        "price": "25.00",
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": "25.00"
                },
                "description": "Dustin Dustin"
            }]
        }
        paypal.payment.create(create_payment_json, function(error, payment) {
            if (error) {
                throw error;
            } else {
                for (let i=0; i< payment.links.length; i++){
                    if(payment.links[i].rel === "approval_url"){
                        res.redirect(payment.links[i].href);
                    }
                }
            }
        })
    });


    app.get('/paypal/success', (req, res) => {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": "25.00"
                }
            }]
          };
          paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                console.log(JSON.stringify(payment));
                res.send('Success');
            }
        });
    });
    app.get('/paypal/cancel', (req, res) => res.send('Cancelled'));
}