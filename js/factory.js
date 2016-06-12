var app = angular.module('punchit.factory',[]);



app.factory('UrlService',function(){
    return{
      HostName : "http://52.39.56.221",
      SignUp : {"url":"/api/users",type:"POST",requiresAuth:false},
      check : {"url" : '/api/user_exist',type : "GET",requiresAuth:false}
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
            })
            .error(function(error){
              deferred.reject(error);
            });
        }
      }
      else {
          // get request
          var url = HostName+urlObject.url+"?email="+params.email
          $http.get(url)
            .success(function(data){
              deferred.resolve(data)
            })
            .error(function(data){
              deferred.reject(error)
            })
      }
      return deferred.promise;
    }
  };
}]);
