var app = angular.module('punchit.factory',[]);



app.factory('UrlService',function(){
    return{
      HostName : "http://52.39.56.221",
      SignUp : {"url":"/api/users",type:"POST",requiresAuth:false},
    };
});

app.factory('PostMan',['$http','$q',function($http,$q){
  return{
    makeRequest : function(urlObject,params) {
      var deferred  = $q.deffer();
      if(urlObject.type == "POST"){
        if(urlObject.requiresAuth)
        {
          // post request auth
          $http.post(urlObject.url,params).
            success(function(data){
              console.log(JSON.stringify(data));
              deferred.resolve(data);
            }).
            error(function(error){
              console.log(error);
              deferred.reject(error);
            });
        }
      }
      else {
          // get request
          $http.get(urlObject.url,params)
            .success(function(data){
              console.log(JSON.stringify(data));
              deferred.resolve(data)
            })
            .error(function(data){
              console.log(error);
            })
      }
    }
  };
}]);
