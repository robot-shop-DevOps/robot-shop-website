'use strict';

angular.module('robotshop').factory('currentUser', function() {

    let state = {
        token: localStorage.getItem("token") || null,
        username: localStorage.getItem("username") || null,
        cart: { total: 0 }
    };

    return {

        state: state,

        setLoginData(token, username) {
            state.token = token;
            state.username = username;

            // persist across page reloads
            localStorage.setItem("token", token);
            localStorage.setItem("username", username);
        },

        clearUser() {
            state.token = null;
            state.username = null;

            localStorage.removeItem("token");
            localStorage.removeItem("username");
        },

        isLoggedIn() {
            return !!state.token;   // user considered logged in if token exists
        },

        getAuthHeader() {
            if (!state.token) return {};
            return { Authorization: "Bearer " + state.token };
        }
    };
});