define(['app'], function (app)
{
    
    app.controller('aboutController',
    [
        '$scope',
        function($scope)
        {
            $scope.page =
            {
                title: 'About Us'
            };
        }
    ]);
});