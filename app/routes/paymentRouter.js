var User = require('../models/user');
module.exports = function (app) {
  require("dotenv").config();
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  // const stripeSecretKey = 'sk_test_TGrmykQznH6nhTik2fyBX4SK00d3fbaG4D';
  // const stripePublicKey = 'pk_test_VRH2Owf2I9CNsPUflPNy7HdS001XX0gyxV';
  const stripe = require('stripe')(stripeSecretKey);
  /*
  * REDESIGN PAYMENT
  */
  app.get("/indexstripe", (req, res) => {
    res.render('stripeui.ejs');
  });

  // // Fetch the Checkout Session to display the JSON result on the success page
  // app.get("/checkout-session", async (req, res) => {
  //   const { sessionId } = req.query;
  //   const session = await stripe.checkout.sessions.retrieve(sessionId);
  //   res.send(session);
  // });

  // //  
  // app.post("/create-checkout-session", async (req, res) => {
  //   const planId = process.env.PLANID;
  //   const domainURL = process.env.DOMAIN;
  //   let session;
  //   const { isBuyingSticker } = req.body;
  //   if (isBuyingSticker) {
  //     // Customer is signing up for a subscription and purchasing the extra e-book
  //     session = await stripe.checkout.session.create({
  //       payment_method_types: ["card"],
  //       line_items: [
  //         {
  //           name: "Pasha e-book",
  //           quantity: 1,
  //           currency: "usd",
  //           amount: 300
  //         }
  //       ],
  //       subscription_data: {
  //         items: [
  //           {
  //             plan: planId
  //           }
  //         ]
  //       },
  //       success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
  //       cancel_url: `${domainURL}/cancel.html`
  //     });
  //   } else {
  //     // Customer is only signing up for a subscription
  //     session = await stripe.checkout.sessions.create({
  //       payment_method_types: ["card"],
  //       subscription_data: {
  //         items: [
  //           {
  //             plan: planId
  //           }
  //         ]
  //       },
  //       success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
  //       cancel_url: `${domainURL}/cancel.html`
  //     });
  //   }
  //   res.send({
  //     checkoutSessionId: session.id
  //   });
  // });
  // app.get("/public-key", (req, res) => {
  //   res.send({
  //     publicKey: process.env.STRIPE_PUBLIC_KEY
  //   });
  // });

  // // Webhook handler for asynchronous events.
  // app.post("/webhook", async (req, res) => {
  //   let data;
  //   let eventType;
  //   // Check if webhook signing is configured.
  //   if (process.env.STRIPE_WEBHOOK_SECRET) {
  //     // Retrieve the event by verifying the signature using the raw body and secret.
  //     let event;
  //     let signature = req.headers["stripe-signature"];

  //     try {
  //       event = stripe.webhooks.constructEvent(
  //         req.rawBody,
  //         signature,
  //         process.env.STRIPE_WEBHOOK_SECRET
  //       );
  //     } catch (err) {
  //       console.log(`⚠️  Webhook signature verification failed.`);
  //       return res.sendStatus(400);
  //     }
  //     // Extract the object from the event.
  //     data = event.data;
  //     eventType = event.type;
  //   }

  //   if (eventType === "checkout.session.completed") {
  //     const items = data.object.display_items;
  //     const customer = await stripe.customers.retrieve(data.object.customer);
  //     if (
  //       items.length &&
  //       items[0].custom &&
  //       items[0].custom.name === "Pasha e-book"
  //     ) {
  //       console.log(
  //         `🔔  Customer is subscribed and bought an e-book! Send the e-book to ${customer.email}.`
  //       );
  //     } else {
  //       console.log(`🔔  Customer is subscribed but did not buy an e-book.`);
  //     }

  //   }
  //   res.sendStatus(200);
  // });


  /*
  * END REDeSING PAYMENT
  */
  app.get('/wallet', function (req, res) {
    var id = req.cookies['idUser'];
    if (id) {
      // return res.send({
      // 	token: token,
      // 	idUser: idUser
      // });
      console.log("id: ", id);
    } else {
      console.log("id not found")
    }
    // id = "5e68828e1a301f125fb94c50"
    // id = '5e609a8a908d5945dec73265';
    User.findOne({ _id: id }, function (err, doc) {
      let wallet = [];
      if (doc) {
        for (let index in doc.listPayment) {
          if (wallet.length == 0) {
            wallet.push({
              createDate: new Date(doc.listPayment[index].payment.created),
              brand: doc.listPayment[index].payment.source.brand,
              last4: doc.listPayment[index].payment.payment_method_details.card.last4
            });
          } else {
            for (let index_wallet in wallet) {
              // console.log(wallet[index_wallet].createDate);
              if (doc.listPayment[index].payment.source.brand != wallet[index_wallet].brand && wallet[index_wallet].last4 != doc.listPayment[index].payment.payment_method_details.card.last4) {
                wallet.push({
                  createDate: new Date(doc.listPayment[index].payment.created),
                  brand: doc.listPayment[index].payment.source.brand,
                  last4: doc.listPayment[index].payment.payment_method_details.card.last4
                });
              }
            }
          }
          // console.log('created: ', doc.listPayment[index].payment.created);
          // console.log('brand: ', doc.listPayment[index].payment.source.brand);
          // console.log('last4: ', doc.listPayment[index].payment.payment_method_details.card.last4);
        }
        res.json({
          status: true,
          result: wallet
        });
      } else {
        res.json({
          status: false,
          result: 'id is not found'
        });
      }
    });

  });
  app.get('/indexstripe', (req, res) => {
    res.render('teststripe');
  })
  app.get('/payment', function (req, res) {
    console.log('price: ', req.query.price);
    res.render('store.ejs', {
      price: Number(req.query.price),
      role: req.query.role
    })
  });

  app.post('/purchase', function (req, res) {
    let total = Number(req.body.price) * 100;
    // const {userId} = req.body;
    let billing_details = {
      address: {
        city: "HCM",
        country: "VN",
        line1: "line1",
        line2: "line2",
        postal_code: "70000",
        state: "state"
      },
      email: "vungocphuonguyen@gmail.com",
      name: "dustinbackend",
      phone: "0589157723"
    }
    var id = req.cookies['idUser'];
    if (id) {
      // return res.send({
      // 	token: token,
      // 	idUser: idUser
      // });
      console.log("id: ", id);
    } else {
      console.log("id not found")
    }
    id = "5e707ddd177e1f1985c7591a"
    User.findOne({ _id: id }, function (err, user) {
      if (user) {
        stripe.charges.create({
          // billing_detail: billing_detail,
          amount: total,
          source: req.body.stripeTokenId,
          currency: 'usd'
        }).then(function (data) {
          console.log('Charge Successful');
          console.log(data);
          console.log(data.receipt_url);
          // add external information of user
          data.billing_details = billing_details;
          user.listPayment.push({
            role: 'basic',
            payment: data,
            price: total
          });
          user.save();
          res.json({
            receipt_url: data.receipt_url,
            status: true,
            msg: 'Successfully purchased items'
          });
        }).catch(function () {
          console.log('Charge Fail')
          res.status(500).end()
        })
      } else {
        res.json({
          status: false,
          msg: 'User is not found, please login your account'
        })
      }
    });
  })
}