var app = angular.module('punchit',['punchit.factory','ngCookies','angularFblogin'])

app.controller('postsController',['$scope','$cookies','PostMan','UrlService','$fblogin',function($scope, $cookies, PostMan, UrlService, $fblogin){

      $scope.click = function(){
        // $fblogin({
        //   fbId: '811805505603331',
        //   permissions: 'email,public_profile',
        //   fields: 'id,name,email,gender'
        // }).then({
        //     onSuccess : function(response){
        //       console.log(response);
        //     },
        //     onError : function(error){
        //       console.log(error);
        //     },
        //     onProgress : function(progress){
        //       console.log(progress);
        //     }
        // });
  $fblogin({
    fbId: '811805505603331',
    permissions: 'email,public_profile',
    success: function (data) {
        console.log(JSON.stringify(data));
    }
  });
}
}]);
