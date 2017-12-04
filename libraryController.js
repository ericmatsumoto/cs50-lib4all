lib4AllApp.controller('LibraryController', ['$scope', '$resource',
    function ($scope, $resource) {

        var downloadedBooksResource = $resource('/downloaded_books');
        $scope.downloadedBooks = downloadedBooksResource.query();

    }]);
