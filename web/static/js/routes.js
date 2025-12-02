'use strict';

angular.module('robotshop').config(['$routeProvider', '$locationProvider',
function($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'splash.html',
            controller: 'shopform'
        })
        .when('/search/:text?', {
            templateUrl: 'search.html',
            controller: 'searchform'
        })
        .when('/product/:sku', {
            templateUrl: 'product.html',
            controller: 'productform'
        })
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'loginform'
        })
        .when('/cart', {
            templateUrl: 'cart.html',
            controller: 'cartform'
        })
        .when('/shipping', {
            templateUrl: 'shipping.html',
            controller: 'shipform'
        })
        .when('/payment', {
            templateUrl: 'payment.html',
            controller: 'paymentform'
        })
        .otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode(false);
}]);