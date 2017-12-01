var lib4AllApp = angular.module('lib4AllApp', ['ngResource']);


lib4AllApp.controller('MainController', ['$scope', '$resource',
    function ($scope, $resource) {

        var downloadedBooksResource = $resource('/downloaded_books')
        $scope.downloadedBooks = downloadedBooksResource.query()


        var resource = $resource("/books");
        $scope.allBooks = resource.query();
        $scope.currentBooks = $scope.allBooks;
        $scope.filter = "";
        $scope.coverPrefix = "https://books.libraryforall.org/assets/";
        var showingAllBooks = true;
        $scope.buttonTitle = "My Downloaded Books";

        $scope.downloadBook = function(id) {
        	var downloadResource = $resource("/download/" + id);
        	var res = downloadResource.get();

            var getBookResource = $resource("/books/" + id);
            var book = getBookResource.get()
            $scope.downloadedBooks.push(book);


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

        $scope.changeView = function() {
            console.log("switched views supposedly")
            if(showingAllBooks) {
                $scope.currentBooks = $scope.downloadedBooks
                showingAllBooks = false;
                $scope.buttonTitle = "Full Catalog";
            } else {
                $scope.currentBooks = $scope.allBooks
                showingAllBooks = true;
                $scope.buttonTitle = "My Downloaded Books";
            }

        }

    }]);
