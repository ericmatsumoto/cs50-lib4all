lib4AllApp.controller('LibraryController', ['$scope', '$resource',
    function ($scope, $resource) {

        var downloadedBooksResource = $resource('/downloaded_books');
        $scope.downloadedBooks = downloadedBooksResource.query();

        $scope.deleteBook = function (book_id) {
            var result = confirm("Are you sure you want to delete this book?");
            if (result) {
                // TODO: need to implement deleting books in backend and post
                // The following is just a facade.
                $scope.downloadedBooks = $scope.downloadedBooks.filter(function(book) {
                    return book.id !== book_id;
                });
            }
        };

    }]);
