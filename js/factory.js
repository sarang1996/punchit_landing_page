var app = angular.module('punchit.factory',['ngCookies','angularFblogin']);



app.factory('UrlService',function(){
    return{
      SignUp : {"url":"/api/users",type:"POST",requiresAuth:false},
      check : {"url" : '/api/user_exist',type : "GET",requiresAuth:false},
      getposts : {"url" : '/getpostsforallcommunities', type : "GET", requiresAuth : false},
      getComments : {"url" : '/api/comments', type : 'GET', requiresAuth : false}
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
          if (urlObject.url == '/api/user_exist') {
              var url = HostName+urlObject.url+"?email="+params.email
          }
          else if (urlObject.url == '/api/comments') {
              var url = HostName+urlObject.url+"?id="+params.id
          }
          else {
            var url = HostName+urlObject.url
          }

          $http.get(url)
            .success(function(data){
              deferred.resolve(data)
            })
            .error(function(error){
              deferred.reject(error)
            })
      }
      return deferred.promise;
    }
  };
}]);


app.factory('authService',['PostMan','$cookies','$fblogin','$q',function(PostMan,$cookies,$fblogin,$q){
  return{
    authorize : function(){
      var deferred = $q.defer()
      $fblogin({
        fbId: '811805505603331',
        permissions: 'email,public_profile',
        fields : 'id,name,picture.type(large),gender,email',
        success: function (data) {
            var params = {}
            params['login_agent'] = "fb"
            params['name'] = data.name
            params['email'] = data.email
            var auth_data = {}
            auth_data["media"] = "Facebook"
            auth_data["token"] = data.accessToken
            params["auth_data"] = auth_data
            params["ProfilePicture"] = data.picture.data.url
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
                    $cookies.put('name',params.name)
                    $cookies.put('ProfilePicture',params.ProfilePicture)
                    $cookies.put('token',response.token)
                    $cookies.put('id',response.id)
                    deferred.resolve(response)
                  },
                  function(error){
                    console.log(error);
                    deferred.reject(error)
                  })
              },
              function(error){
                console.log(error);
                deferred.reject(error)
              })
        }
      });
      return deferred.promise()
    }
  }
}])

app.factory('Base64', function() {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
            'QRSTUVWXYZabcdef' +
            'ghijklmnopqrstuv' +
            'wxyz0123456789+/' +
            '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
});
