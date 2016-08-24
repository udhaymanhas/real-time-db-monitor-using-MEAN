angular.module('monitor', ['ngRoute'])
    .controller('dashboardController',['$scope','$http','socket',function($scope, $http, socket){
        $scope.loggedIn = false;
        $scope.notifications = []; //all database change notifications are pushed into this

        //Panel Controls ------------
        $scope.tab = 1;
        $scope.setTab = function(setTab){
            $scope.tab = setTab;
        };
        $scope.currentTab = function(checkTab){
            return $scope.tab == checkTab;
        };

        //Socket Controls ----------

        $scope.login = function(user){
            $http.post('/loginUser',{username:user.username, password:user.password})
                .success(function(data){
                    if(typeof(data.user.username) != 'undefined'){
                        $scope.loggedIn = true;
                        $scope.uid = data.user._id;
                        socket.emit('uid',$scope.uid); //on login sends the user id to server, so that server loads the subscribers subscription details and process op-log accordingly.
                    }
                });
        };

        //when a new database change occurs, server sends the notification to client
        socket.on('notification',function(data){
                $scope.notifications.unshift(data); //pushing the latest notification on the top
        });

    }])
    .controller('settingsController',['$scope','$http','socket', function($scope, $http, socket){
        $scope.settings='';
        $scope.subscription='';
        $scope.subscribeFormData = {};

        $http.get('/settings')
            .success(function(data){
                //fetches details of available collections and their fields for subscription
                $scope.tmpSettings = data;
                $http.post('/settings/subscription',{"uid":$scope.uid})
                    //fetches details of clients subscription of collections and their fields
                    .success(function(data){
                        $scope.subscription = {
                            "database": {
                                "name":data.database.name,
                                "collection":data.database.collection
                            }
                        };
                        $scope.settings = $scope.tmpSettings.settings;
                    })
                    .error(function(err){
                        alert(err);
                    });
            })
            .error(function(err){
                alert(err);
            });

        $scope.ifSubscribed = function(collection,field){
            //to populate the setting panel accurately showing subscribed and unsubscribed collections and fields
            var flag=0;
            $scope.subscription.database.collection.forEach(function(col,ind){
                //go through each subscribed collection
                if(col.name == collection){ //find matching collection
                    if(typeof(field)=='undefined'){
                        flag++;
                    }
                    else
                    for(var subfield in col.fields){
                        if(col.fields[subfield] == field){ //find if field already subscribed
                            flag++;
                        }
                    }
                }
            });

            if(flag>0){
                return true;
            }
            else{
                return false;
            }
        };

        $scope.subscribe = function(collection){
            //this method pushes new subscriptions, updates existing ones and tells server to update its setting according to updated subscription, so that the moment client subscribes, he/she starts getting the notifications right then
            if(typeof($scope.subscribeFormData[collection])!= 'undefined'){
                var fields = {};
                var typeUpdate = 'collection';
                var incrementField = 0;
                $scope.subscription.database.collection.forEach(function(col,ind){
                    if(col.name == collection){
                        typeUpdate = 'field';
                        incrementField = Object.keys(col.fields).length;
                        Object.keys(col.fields).forEach(function(key,index){
                            fields[key]=col.fields[key];
                        });
                    }
                });

                Object.keys($scope.subscribeFormData[collection]).forEach(function(key,index){
                    if($scope.subscribeFormData[collection][key]){
                        fields[incrementField+index]=key;
                    }
                    else{
                        --incrementField;
                    }
                });

                var data = {
                    "typeUpdate":typeUpdate,
                    "uid":$scope.uid,
                    "collection":{
                        "name":collection,
                        "fields":fields
                    }
                };

                $http.post('/updateUserDaemon', data)
                    .success(function(res){
                        socket.emit('uid',$scope.uid); // tells server to update its info about new subscriptions of this user.
                        $scope.subscription.database.collection.forEach(function(col,index,arr){
                            var flag=0;
                            if(col.name == data.collection.name && flag==0){
                                flag=1;
                                var l = col.fields.length;
                                Object.keys(data.collection.fields).forEach(function(key,index){
                                    col.fields[l+key]=data.collection.fields[key];
                                });
                            }
                            if(index==(arr.length-1) && flag == 0){
                                $scope.subscription.database.collection.push(data.collection);
                            }
                        });

                        if($scope.subscription.database.collection.length == 0){
                            $scope.subscription.database.collection.push(data.collection);
                        }
                    });
            }
            $scope.subscribeFormData = {};
        }
    }])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/',{
                controller: 'dashboardController',
                templateUrl: '/views/dashboard.html'
            })
    }])
    .factory('socket', ['$rootScope', function ($rootScope) {
        //factory for using sockets with angular easily
        'use strict';
        var socket = io.connect();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    }]);


