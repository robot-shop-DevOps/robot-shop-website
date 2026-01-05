'use strict';

angular.module('robotshop').controller('paymentform', function($scope, $http, $location, currentUser) {

    // Require login
    if (!currentUser.isLoggedIn()) {
        $location.url('/login');
        return;
    }

    $scope.data = {
        message: '',
        buttonDisabled: false,
        cont: false,
        username: currentUser.state.username,
        loggedIn: currentUser.isLoggedIn(),
        cart: currentUser.state.cart
    };

    /* -----------------------------------
       Complete Payment
    ----------------------------------- */
    $scope.pay = function() {

        $scope.data.buttonDisabled = true;

        const username = $scope.data.username;

        $http.post('/api/payment/pay/' + username,
            $scope.data.cart,
            { headers: currentUser.getAuthHeader() }
        )
        .then(res => {

            $scope.data.message = 'Order placed ' + res.data.orderid;

            // Clear cart after payment
            const emptyCart = { total: 0, items: [] };
            $scope.data.cart = emptyCart;
            currentUser.state.cart = emptyCart;

            $scope.data.cont = true;
        })
        .catch(e => {
            console.log('ERROR', e);
            $scope.data.message = 'ERROR placing order';
            $scope.data.buttonDisabled = false;
        });
    };

});