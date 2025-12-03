// File: controllers/login.controller.js
'use strict';

angular.module('robotshop').controller('loginform', function($scope, $http, $location, currentUser) {

    // ---- UI STATE ----
    $scope.view = 'login';  // login | register
    $scope.message = '';
    $scope.rmessage = '';

    $scope.switch = function () {
        $scope.view = ($scope.view === 'login') ? 'register' : 'login';
        $scope.message = '';
        $scope.rmessage = '';
    };

    // ---- LOGIN MODEL ----
    $scope.loginData = {
        name: '',
        password: ''
    };

    // ---- REGISTER MODEL ----
    $scope.regData = {
        name: '',
        email: '',
        password: '',
        password2: ''
    };

    // ---- LOGIN ----
    $scope.login = function () {

        $scope.message = '';

        $http.post('/api/user/login', {
            name: $scope.loginData.name,
            password: $scope.loginData.password
        })
        .then(res => {

            const oldId = currentUser.state.uniqueid;

            currentUser.setUser(res.data);
            currentUser.state.uniqueid = res.data._id;

            // Move cart
            $http.get('/api/cart/rename/' + oldId + '/' + res.data._id)
                .catch(() => {});

            loadHistory(res.data.name);

            // Redirect after login
            $location.url('/');
        })
        .catch(err => {
            $scope.message = 'Invalid username or password';
        });
    };

    // ---- REGISTER ----
    $scope.register = function () {

        $scope.rmessage = '';

        if ($scope.regData.password !== $scope.regData.password2) {
            $scope.rmessage = "Passwords do not match!";
            return;
        }

        $http.post('/api/user/register', {
            name: $scope.regData.name.trim(),
            email: $scope.regData.email.trim(),
            password: $scope.regData.password.trim()
        })
        .then(() => {
            // After registration → switch back to login
            $scope.switch();
            $scope.message = "Registration successful! Please log in.";
        })
        .catch(err => {
            $scope.rmessage = "Registration failed.";
        });
    };

    // ---- LOAD ORDER HISTORY ----
    function loadHistory(name) {
        $http.get('/api/user/history/' + name)
            .then(res => { 
                $scope.orderHistory = res.data.history; 
            })
            .catch(() => {});
    }

});
