lib4AllApp.controller('LibraryController', ['$scope', '$resource',
    function ($scope, $resource) {

        var downloadedBooksResource = $resource('/downloaded_books');
        $scope.downloadedBooks = downloadedBooksResource.query();



        $scope.deleteBook = function (book_id) {
            var result = confirm("Are you sure you want to delete this book?");
            if (result) {
                $resource('/downloaded_books/:id').delete({id: book_id}, function (res) {
                    $scope.downloadedBooks = $scope.downloadedBooks.filter(function (book) {
                        return book.id !== book_id;
                    });
                    $scope.allBooks.filter(function (book) {
                        if (book.id === book_id) {
                            book.downloaded = false;
                        }
                    });
                }, function (res) {
                    console.error(err);
                });
            }
        };

    }]);
