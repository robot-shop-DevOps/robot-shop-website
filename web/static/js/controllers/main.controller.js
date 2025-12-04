'use strict';

angular.module('robotshop').controller('mainController', function($scope, $location, currentUser) {
    
    $scope.data = {
        searchText: '',
        cart: currentUser.state.cart,
        username: currentUser.state.username,
        loggedIn: currentUser.isLoggedIn()
    };

    /* -----------------------------------
       Search
    ----------------------------------- */
    $scope.search = function() {
        if ($scope.data.searchText.trim()) {
            $location.url('/search/' + $scope.data.searchText.trim());
            $scope.data.searchText = '';
        }
    };

    /* -----------------------------------
       Logout
    ----------------------------------- */
    $scope.logout = function () {
        currentUser.clearUser();
        $scope.data.loggedIn = false;
        $scope.data.username = null;
        $location.url('/login');
    };

    /* -----------------------------------
       Watch Cart Total Updates
    ----------------------------------- */
    $scope.$watch(
        () => currentUser.state.cart.total,
        () => {
            $scope.data.cart = currentUser.state.cart;
        }
    );

    /* -----------------------------------
       Watch Login State (username)
    ----------------------------------- */
    $scope.$watch(
        () => currentUser.state.username,
        (val) => {
            $scope.data.username = val;
            $scope.data.loggedIn = currentUser.isLoggedIn();
        }
    );

});