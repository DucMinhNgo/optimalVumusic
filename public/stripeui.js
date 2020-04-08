if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}
function purchaseClicked () {
    stripe.createToken(card).then(function(result) {
        if (result.error) {
          // Inform the user if there was an error.
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          // Send the token to your server.
          stripeTokenHandler(result.token);
          console.log('result.Token: ', result.token);
        //   console.log("stripeTokenHandler: ", stripeTokenHandler(result.token));
          fetch('https://viws.ddns.net/predictor/admin/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                stripeTokenId: result.token.id,
                price: 20,
                userId: '5e609a8a908d5945dec73265'
            })
        }).then(function(res) {
            return res.json()
        }).then(function(data) {
            if (data.status == true) {
                // location.replace(data.receipt_url);
                alert('success');
            } else {
                alert(data.msg);
            }
        }).catch(function(error) {
            console.error(error);
            alert('error');
        })
        }
      });
}
/*
* ADD TO TEST
*/


// Create a Stripe client.
var stripe = Stripe('pk_test_VRH2Owf2I9CNsPUflPNy7HdS001XX0gyxV');

// Create an instance of Elements.
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
  base: {
    color: '#32325d',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

// Create an instance of the card Element.
var card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission.
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server.
      stripeTokenHandler(result.token);
      console.log('result.Token: ', result.token);
    //   console.log("stripeTokenHandler: ", stripeTokenHandler(result.token));
      fetch('https://viws.ddns.net/predictor/admin/purchase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            stripeTokenId: result.token.id,
            price: 20
            // userId: '5e609a8a908d5945dec73265'
        })
    }).then(function(res) {
        return res.json()
    }).then(function(data) {
        if (data.status == true) {
            location.replace(data.receipt_url);
        } else {
            alert(data.msg);
        }
    }).catch(function(error) {
        console.error(error);
        alert('error');
    })
    }
  });
});

// Submit the form with the token ID.
function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('payment-form');
  var hiddenInput = document.createElement('input');
  console.log('form: ', form);
  console.log('hiddenInput: ', hiddenInput);
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  // Submit the form
//   form.submit();
}