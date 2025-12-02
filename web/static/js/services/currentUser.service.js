'use strict';

angular.module('robotshop').factory('currentUser', function() {
    
    let state = {
        uniqueid: '',
        user: null,    // null when logged out
        cart: { total: 0 }
    };

    return {
        state: state,

        setUser(user) {
            state.user = user;
        },

        clearUser() {
            state.user = null;
        },

        isLoggedIn() {
            return !!state.user;
        }
    };
});