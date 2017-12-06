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

        $scope.filter = "";
        $scope.coverPrefix = "https://books.libraryforall.org/assets/";
        var showingAllBooks = true;
        $scope.buttonTitle = "My Downloaded Books";

        $scope.showBook = function (book) {
            var filter = $scope.filter.toLowerCase();
            if(book.title.toLowerCase().includes(filter)
                || book.publisher.toLowerCase().includes(filter)
                || String(book.id).includes(filter)) {
                return true;
            }  
            return false;
        };

        $scope.changeView = function() {
            console.log("switched views supposedly")
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

    }]);
