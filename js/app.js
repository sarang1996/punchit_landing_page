var app = angular.module('punchit',['punchit.factory','ngCookies','angularFblogin'])

app.controller('postsController',['$scope','$cookies','PostMan','UrlService','$fblogin',function($scope, $cookies, PostMan, UrlService, $fblogin){

      $scope.click = function(){
  $fblogin({
    fbId: '811805505603331',
    permissions: 'email,public_profile',

    fields : 'id,name,picture,gender,email',
    success: function (data) {
        var params = {}
        params['login_agent'] = "fb"
        params['name'] = data.name
        params['email'] = data.email
        var ninja_name = prompt("Please choose your unique ninja_name");
        params['ninja_name'] = ninja_name
        var auth_data = {}
        auth_data["media"] = "Facebook"
        auth_data["token"] = data.accessToken
        params["auth_data"] = auth_data
        console.log(params);

        PostMan.makeRequest(UrlService.check,{"email" : data.email})
          .then(function(response){
            console.log(response);
            
          },
          function(error){
            console.log(error);
          })
    }
  });
}
}]);
