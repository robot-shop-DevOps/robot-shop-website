'use strict';

angular.module('robotshop').factory('currentUser', function() {
    return {
        uniqueid: '',
        user: {},
        cart: {
            total: 0
        }
    };
});
