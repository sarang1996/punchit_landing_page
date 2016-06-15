var app = angular.module('punchit',['punchit.factory','ngCookies','angularFblogin'])

app.controller('postsController',['$scope','$cookies','PostMan','UrlService','authService','Base64','$http',function($scope, $cookies, PostMan, UrlService, authService,Base64,$http){

  $scope.click = function(){
    if ($cookies.get('isLoggedIn') == true) {
        console.log("yahh");
    }
    else {
      authService.authorize()
    }
  }

  $scope.showComments = function(id){
    var params = {}
    params['id'] = id
    $scope.id_of_post = id
    console.log(id);
    PostMan.makeRequest(UrlService.getComments,params)
      .then(function(response){
        console.log(response);
        $scope.comments = response.data
        $('#comment_modal').openModal();
      },
      function(error){
        console.log(error);
      })
  }

  $scope.taptap = function(post_id,which,index,category){
    if (!$cookies.get('isLoggedIn')) {
      authService.authorize()
        .then(function(response){
          console.log(response);
          vote(post_id,which,index,category)
        },function(error){
          console.log(error);
        })
    }
    else {
      vote(post_id,which,index,category)
    }
  }

  function vote(post_id,which,index,category){
    var params = {}
    var id = $cookies.get('id')
    var token = $cookies.get('token')
    if (category == 1) {
      var post = $scope.communityOne[index]
    }
    else if (category == 2) {
      var post = $scope.communityTwo[index]
    }
    else if (category == 3) {
      var post = $scope.communityThree[index]
    }
    else {
      var post = $scope.communityFour[index]
    }
    var punchers1 = post.Punchers1
    var punchers2 = post.Punchers2
    params["post"] = post_id
    params["which"] = which
    $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(token + ":" + "");
    $http.post(UrlService.HostName+"/api/vote",JSON.stringify(params))
      .success(function(response){
          console.log(response);
      })
      .error(function(error){
        console.log(error);
      })
    if (which == 'one') {
        if (punchers1.indexOf(id) == -1) {
          punchers1.push(id)
          if (punchers2.indexOf(id) != 1) {
            punchers2.splice(id)
          }
        }
    }
    else {
      if (punchers2.indexOf(id) == -1) {
        punchers2.push(id)
        if (punchers1.indexOf(id) !=1) {
          punchers1.splice(id)
        }
      }
    }
    if (category == 1) {
      post.Punchers1 = punchers1
      post.Punchers2 = punchers2
      $scope.communityOne[index] = post
    }
    else if (category == 2) {
      post.Punchers1 = punchers1
      post.Punchers2 = punchers2
      $scope.communityTwo[index] = post

    }
    else if(category == 3) {
      post.Punchers1 = punchers1
      post.Punchers2 = punchers2
      $scope.communityThree[index] = post

    }
    else {
      post.punchers1 = punchers1
      post.punchers2 = punchers2
      $scope.communityFour[index] = post
    }
  }

  $scope.do_comment = function(id){
    console.log($cookies.get('isLoggedIn'));
      if ($cookies.get('isLoggedIn')) {
        var params = {}
        var id = $scope.id_of_post
        var token = $cookies.get('token')
        var name = $cookies.get('name')
        var ProfilePicture = $cookies.get('ProfilePicture')
        $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(token + ":" + "");
        params["comment"] = $scope.commentBox
        params["post_objectId"] = id
        $http.post(UrlService.HostName+'/api/do_comment',JSON.stringify(params))
          .success(function(response){
            console.log(response);
            $scope.comments.push({"comment" : $scope.commentBox,"username":name,"ProfilePicture":ProfilePicture})
            Materialize.toast('comment add successfully',1000)
          })
          .error(function(error){
            console.log(error);
          })
      }
      else {
        authService.authorize().then(function(response){
          console.log(response);
          var id = $scope.id
          var token = $cookies.get('token')
          var name = $cookies.get('name')
          var ProfilePicture = $cookies.get('ProfilePicture')
          var params = {}
          $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(token + ":" + "");
          params["comment"] = $scope.commentBox
          params["post_objectId"] = id
          $http.post(UrlService.HostName+'/api/do_comment',JSON.stringify(params))
            .success(function(response){
              console.log(response);
              $scope.comments.push({"comment" : $scope.commentBox.trim(),"username":name,"ProfilePicture":ProfilePicture})
              $scope.commentBox = ""
              Materialize.toast('comment add successfully')
            })
            .error(function(error){
              console.log(error);
            })
        },
        function(error){
          console.log(error);
          Materialize.toast('oops something went wrong',1000)
        })
      }
  }

  PostMan.makeRequest(UrlService.getposts)
    .then(function(response){
      $scope.communityOne = []
      $scope.communityTwo = []
      $scope.communityThree = []
      $scope.communityFour = []
      console.log(response);
      response.data.map(function(post){
        console.log(post.id);
        if (post.community == "Hackathon Hackers") {
          $scope.communityOne.push(post)
        }
        else if(post.community == "Sarcasm"){
            $scope.communityTwo.push(post)
        }
        else if (post.community == "Punchit.io") {
          $scope.communityThree.push(post)
        }
        else if(post.community == "silicon valley"){
            $scope.communityFour.push(post)
        }
      })
    },
    function(error){
      console.log(error);
    })
}]);
