var lib4AllApp = angular.module('lib4AllApp', ['ngResource']);


lib4AllApp.controller('MainController', ['$scope', '$resource',
    function ($scope, $resource) {

        var resource = $resource("/books");
        $scope.books = resource.query();
        $scope.currentBooks = $scope.books;
        $scope.filter = "";
        $scope.coverPrefix = "https://books.libraryforall.org/assets/";

        $scope.downloadBook = function(id) {
        	var downloadResource = $resource("/download/" + id);
        	var res = downloadResource.get();
        	console.log("Just downloaded book with id of " + id);
        }

        $scope.filterBooks = function() {
        	$scope.currentBooks = $scope.books.filter(function(book) {
        		if(book.title.includes($scope.filter)) {
        			return true;
        		}
        		if(book.publisher.includes($scope.filter)) {
        			return true;
        		}
        		if(String(book.id).includes($scope.filter)) {
        			return true;
        		}
        		return false;
        	});
        }

    }]);
