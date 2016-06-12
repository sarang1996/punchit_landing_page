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
      var HostName = "http://52.39.56.221"
      var deferred  = $q.defer();
      if(urlObject.type == "POST"){
        if(!urlObject.requiresAuth)
        {
          // post request auth
            $http.post(HostName + urlObject.url,JSON.stringify(params)).
            success(function(data){
              console.log(JSON.stringify(data));
              deferred.resolve(data);
            }).
            error(function(error){
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
      return deferred.promise;
    }
  };
}]);
