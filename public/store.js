if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}
// require("dotenv").config();
const stripePublicKey = 'pk_test_VRH2Owf2I9CNsPUflPNy7HdS001XX0gyxV';
var stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: 'en',
    // token: function (token) {
    //     console.log(token);
    // }
    token: function(token) {
        console.log('token: ', token);
        fetch('https://viws.ddns.net/predictor/admin/purchase', {
        // fetch('/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                stripeTokenId: token.id,
                price: price,
                userId: '5e609a8a908d5945dec73265'
            })
        }).then(function(res) {
            return res.json()
        }).then(function(data) {
            if (data.status == true) {
                // location.replace(data.receipt_url);
                alert('successfully');
            } else {
                alert(data.msg);
            }
        }).catch(function(error) {
            console.error(error);
            alert('error');
        })
    }
});

function purchaseClicked() {
    console.log(price);
    stripeHandler.open({
        amount: price*100
    });
}