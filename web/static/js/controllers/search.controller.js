'use strict';

angular.module('robotshop').controller('searchform', function($scope, $http, $routeParams) {

    $scope.data = {
        searchResults: []
    };

    function search(text) {
        $http.get('/api/catalogue/search/' + text)
            .then(res => { $scope.data.searchResults = res.data; })
            .catch(e => console.log('ERROR', e));
    }

    var text = $routeParams.text;

    if (!text) {
        // no search text → load ALL products
        $http.get('/api/catalogue/search')
            .then(res => { $scope.data.searchResults = res.data; })
            .catch(e => console.log('ERROR', e));
    } else {
        // normal search
        search(text);
    }
});
