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
        var auth_data = {}
        auth_data["media"] = "Facebook"
        auth_data["token"] = data.accessToken
        params["auth_data"] = auth_data

        PostMan.makeRequest(UrlService.check,{"email" : data.email})
          .then(function(response){
            console.log(response);
            if (response.response == "yes") {
              params['ninja_name'] = response.ninja_name
            }
            else {
              var ninja_name = prompt("Please choose your unique ninja_name");
              params['ninja_name'] = ninja_name
            }
            PostMan.makeRequest(UrlService.SignUp,params)
              .then(function(response){
                console.log(response);
                $cookies.put('isLoggedIn',true)
                $cookies.put('email',params.email)
                $cookies.put('token',response.token)
                $cookies.put('id',response.id)
              },
              function(error){
                console.log(error);
              })
          },
          function(error){
            console.log(error);
          })
    }
  });
}
}]);
