'use strict';

angular.module('robotshop').controller('searchform', function($scope, $http, $routeParams) {
    $scope.data = {
        searchResults: []
    };

    function search(text) {
        if (text) {
            $http.get('/api/catalogue/search/' + text)
                .then(res => { $scope.data.searchResults = res.data; })
                .catch(e => console.log('ERROR', e));
        }
    }

    var text = $routeParams.text;
    search(text);
});