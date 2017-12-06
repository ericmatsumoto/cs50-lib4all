var lib4AllApp = angular.module('lib4AllApp', ['ngRoute', 'ngResource']);

lib4AllApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/catalog', {
                templateUrl: 'catalog.html',
                controller: 'CatalogController'
            }).
            when('/library', {
                templateUrl: 'library.html',
                controller: 'LibraryController'
            }).
            otherwise({
                redirectTo: '/library'
            });
    }]);


lib4AllApp.controller('MainController', ['$scope', '$resource', '$location',
    function ($scope, $resource, $location) {

        var allBooksResource = $resource("/books");
        $scope.allBooks = allBooksResource.query();

        $scope.showCovers = true;
        $scope.buttonTitle2 = "List View";

        $scope.downloadBook = function(id) {
        	var downloadResource = $resource("/download/" + id);
        	var res = downloadResource.get();

            var getBookResource = $resource("/books/" + id);
            var book = getBookResource.get();

        	console.log("Just downloaded book with id of " + id);
        }

        $scope.filter = "";
        $scope.coverPrefix = "https://books.libraryforall.org/assets/";
        var showingAllBooks = false;
        $scope.buttonTitle = "Full Catalog";

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
            if(showingAllBooks) {
                showingAllBooks = false;
                $scope.buttonTitle = "Full Catalog";
                $location.path('/library');
            } else {
                showingAllBooks = true;
                $scope.buttonTitle = "My Downloaded Books";
                $location.path('/catalog');
            }
        }

        $scope.changeLayout = function() {
            console.log("something")
            if($scope.showCovers) {
              $scope.showCovers = false;
              $scope.buttonTitle2  = "Covers View";
            } else {
              $scope.showCovers = true;
              $scope.buttonTitle2  = "List View";
            }
        }
    }]);
