/* Controllers */

function IndexController($scope) {
}

function InstancesController($scope, Instances, $http, createDialog, $log) {
    var instancesQuery = Instances.get({}, function(infos) {
        $scope.instances = infos.instances;
        $scope.stopped = infos.stopped;
        $scope.running = infos.running;
        $scope.resource = infos;
    });

    $scope.updateInfos = function() {
        var instancesQuery = Instances.get({}, function(infos) {
            $scope.instances = infos.instances;
            $scope.stopped = infos.stopped;
            $scope.running = infos.running;
            $scope.resource = infos;
        });
    };

    $scope.instanceInfo = {
        'name': '',
        'path': '',
    };

    $scope.create = function() {
        createDialog('/static/partials/create.html',{ 
           id : 'createDialog', 
           title: 'Create a new machine',
           backdrop: true, 
           scope: $scope,
           success: {
               label: 'Create',
               fn: function(){
                   var instance = new Instances();
                   instance.name = $scope.instanceInfo.name;
                   instance.path = $scope.instanceInfo.path;
                   instance.state = 'create';
                   instance.$save();
                   $scope.updateInfos();
               }
           },
           cancel: {
               label: 'Cancel',
           }
        });
    };

    $scope.stopInstance = function(instanceId) {
        angular.forEach($scope.instances, function(instance, idx){
            if(instance.id == instanceId){
                $scope.instances[idx].state = 'stop';
            }
        });
        $scope.resource.$save();
    };

    $scope.startInstance = function(instanceId) {
        angular.forEach($scope.instances, function(instance, idx){
            if(instance.id == instanceId){
                $scope.instances[idx].state = 'start';
            }
        });
        $scope.resource.$save();
    };

    $scope.control = function(instanceId, state) {
        $http.post('/api/instances/', {
            state : state,
            instanceId : instanceId,
        })
        .success(function(infos) {
            //console.log(infos.instances);
            $scope.instances = infos.instances;
            //$scope.stopped = infos.stopped;
            //$scope.running = infos.running;
            $scope.resource = infos;
        });
    };

}

function InstanceController($scope, $routeParams, Instances) {
    var instancesQuery = Instances.get({instanceId: $routeParams.instanceId}, function(instance) {
        $scope.instance = instance;
    });
    $scope.setName = function(newName) {
        $scope.instance.$save();
    };
    $scope.stop = function() {
        $scope.instance.state = 'stop';
        $scope.instance.$save();
    };
    $scope.start = function() {
        $scope.instance.state = 'start';
        $scope.instance.$save();
    };
}
