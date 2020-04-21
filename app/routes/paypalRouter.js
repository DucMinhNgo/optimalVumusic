const paypal = require('paypal-rest-sdk');
var url = require('url');
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
    app.post('/pay', function (req, res) {
        var d = new Date(Date.now() + 1*60*1000);
        d.setSeconds(d.getSeconds() + 4);
        var isDate = d.toISOString();
        var isoDate = isDate.slice(0, 19) + 'Z';
    
        var billingPlanAttributes = {
            "description": "Payment using triple",
            "merchant_preferences": {
                "auto_bill_amount": "yes",
                "cancel_url": "https://viws.ddns.net/predictor/admin/paypal/cancel",
                "initial_fail_amount_action": "continue",
                "max_fail_attempts": "2",
                "return_url": "https://viws.ddns.net/predictor/admin/paypal/success",
                "setup_fee": {
                    "currency": "USD",
                    "value": "1.00"
                }
            },
            "name": "Plan with Regular and Trial Payment Definitions",
            "description": "Plan with regular and trial payment definitions.",
            "type": "FIXED",
            "payment_definitions": [
                {
                    "name": "TRIAL Regular payment definition",
                    "type": "TRIAL",
                    "frequency": "DAY",
                    "amount": {
                    "value": "5.99",
                    "currency": "USD"
                    },
                    "cycles": "1",
                    "charge_models": [
                        {
                          "type": "TAX",
                          "amount": {
                            "value": "0.29",
                            "currency": "USD"
                          }
                        },
                        {
                          "type": "SHIPPING",
                          "amount": {
                            "value": "0.20",
                            "currency": "USD"
                          }
                        }
                      ],
                      "frequency_interval": "1"
                    },
                {
                    "name": "Regular payment definition",
                    "type": "REGULAR",
                    "frequency": "DAY",
                    "amount": {
                    "value": "5.99",
                    "currency": "USD"
                    },
                    "cycles": "10",
                    "charge_models": [
                        {
                          "type": "TAX",
                          "amount": {
                            "value": "0.29",
                            "currency": "USD"
                          }
                        },
                        {
                          "type": "SHIPPING",
                          "amount": {
                            "value": "0.20",
                            "currency": "USD"
                          }
                        }
                      ],
                      "frequency_interval": "1"
                    }
            ]
        };
    
        var billingPlanUpdateAttributes = [
            {
                "op": "replace",
                "path": "/",
                "value": {
                    "state": "ACTIVE"
                }
            }
        ];
    
        var billingAgreementAttributes = {
            "name": "Fast Speed Agreement",
            "description": "Agreement for Fast Speed Plan",
            "start_date": isoDate,
            "plan": {
                "id": "P-0NJ10521L3680291SOAQIVTQ"
            },
            "payer": {
                "payment_method": "paypal"
            },
            "shipping_address": {
                "line1": "StayBr111idge Suites",
                "line2": "Cro12ok Street",
                "city": "San Jose",
                "state": "CA",
                "postal_code": "95112",
                "country_code": "US"
            }
        };
    
    // Create the billing plan
        paypal.billingPlan.create(billingPlanAttributes, function (error, billingPlan) {
            if (error) {
                console.log(error);
                throw error;
            } else {
                console.log("Create Billing Plan Response");
                console.log(billingPlan);
                // paypal.billingPlan.update(billingPlan.id, )
                
                paypal.billingPlan.update(billingPlan.id, billingPlanUpdateAttributes, function (error, response) {
                    if (error) {
                        console.log(error);
                        throw error;
                    } else {
                        console.log("Billing Plan state changed to " + billingPlan.state);
                        billingAgreementAttributes.plan.id = billingPlan.id;
                        paypal.billingAgreement.create(billingAgreementAttributes, function (error, billingAgreement) {
                            if (error) {
                                console.log(error);
                                throw error;
                            } else {
                                console.log("Create Billing Agreement Response");
                                for (var index = 0; index < billingAgreement.links.length; index++) {
                                    if (billingAgreement.links[index].rel === 'approval_url') {
                                        var approval_url = billingAgreement.links[index].href;
                                        console.log("For approving subscription via Paypal, first redirect user to");
                                        console.log(approval_url);
                                        res.redirect(approval_url);
    
                                        console.log("Payment token is");
                                        console.log(url.parse(approval_url, true).query.token);
                                    }
                                }
                            }
                        });
                    }
                });
            }
        });
    });
    app.get('/paypal/success', function (req, res) {
        var token = req.query.token;
        console.log(token,'tokentoken');
        paypal.billingAgreement.execute(token, {}, function (error, billingAgreement) {
            if (error) {
                console.error(error);
                throw error;
            } else {
                console.log(JSON.stringify(billingAgreement));
                res.send({message:'Billing Agreement Created Successfully',data:JSON.stringify(billingAgreement)});
            }
        });
    });

    app.get('/indexpaypal', function(req, res){
        res.render('paypalui');
    }); 

    // ############################### old code #################################################

    // app.post('/pay', (req, res) => {
    //     const {price} = req.body;
    //     console.log('price: ', price);
    //     const billingPlanAttributes = {
    //         "intent" : "sale",
    //         "payer" : {
    //             "payment_method": "paypal"
    //         },
    //         "redirect_urls": {
    //             "return_url": "https://viws.ddns.net/predictor/admin/paypal/success",
    //             "cancel_url": "https://viws.ddns.net/predictor/admin/paypal/cancel"
    //         },
    //         "transactions": [{
    //             "item_list": {
    //                 "items": [{
    //                     "name": "Dustin",
    //                     "sku": "001",
    //                     "price": "25.00",
    //                     "currency": "USD",
    //                     "quantity": 1
    //                 }]
    //             },
    //             "amount": {
    //                 "currency": "USD",
    //                 "total": "25.00"
    //             },
    //             "description": "Dustin Dustin"
    //         }]
    //     }
    //     paypal.payment.create(billingPlanAttributes, function(error, payment) {
    //         if (error) {
    //             throw error;
    //         } else {
    //             for (let i=0; i< payment.links.length; i++){
    //                 if(payment.links[i].rel === "approval_url"){
    //                     res.redirect(payment.links[i].href);
    //                 }
    //             }
    //         }
    //     })
    // });


    // app.get('/paypal/success', (req, res) => {
    //     const payerId = req.query.PayerID;
    //     const paymentId = req.query.paymentId;
    //     const execute_payment_json = {
    //         "payer_id": payerId,
    //         "transactions": [{
    //             "amount": {
    //                 "currency": "USD",
    //                 "total": "25.00"
    //             }
    //         }]
    //       };
    //       paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    //         if (error) {
    //             console.log(error.response);
    //             throw error;
    //         } else {
    //             console.log(JSON.stringify(payment));
    //             res.send('Success');
    //         }
    //     });
    // });
    // ############################## end ########################################################
    app.get('/paypal/cancel', (req, res) => res.send('Cancelled'));
}