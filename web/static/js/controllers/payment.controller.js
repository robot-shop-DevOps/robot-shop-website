'use strict';

angular.module('robotshop').controller('paymentform', function($scope, $http, currentUser) {
    $scope.data = {
        message: ' ',
        buttonDisabled: false,
        cont: false,
        uniqueid: currentUser.uniqueid,
        cart: currentUser.cart
    };

    $scope.pay = function() {
        $scope.data.buttonDisabled = true;

        $http.post('/api/payment/pay/' + $scope.data.uniqueid, $scope.data.cart)
            .then(res => {
                $scope.data.message = 'Order placed ' + res.data.orderid;

                $scope.data.cart = { total: 0, items: [] };
                currentUser.cart = $scope.data.cart;

                $scope.data.cont = true;
            })
            .catch(e => {
                console.log('ERROR', e);
                $scope.data.message = 'ERROR placing order';
                $scope.data.buttonDisabled = false;
            });
    };
});
