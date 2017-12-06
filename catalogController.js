lib4AllApp.controller('CatalogController', ['$scope', '$resource',
    function ($scope, $resource) {

        $scope.downloadBook = function(id) {
        	var downloadResource = $resource("/download/" + id);
            var res = downloadResource.get();
            
            $scope.allBooks.filter(function (book) {
                if (book.id == id) {
                    book.downloaded = true;
                }
            });

        	console.log("Just downloaded book with id of " + id);
        };

    }]);
