function InstancesController($scope, Instances, Projects, Hosts, $http, createDialog, $log) {
    $scope.states = [
        {label: 'Development', type:'dev'},
        {label: 'Sandbox', type:'sandbox'},
        {label: 'QA', type:'qa'},
        {label: 'Validation', type:'validation'}
    ];

    $scope.updateInfos = function() {
        Instances.get({}, function(infos) {
            $scope.instances = infos.instances;
        });
        Projects.get({}, function(infos) {
            $scope.projects = infos.projects;
        });
        Hosts.get({}, function(infos) {
            $scope.hosts = infos.hosts;
        });
        $('.loading').hide();
    };
    $scope.updateInfos();

    $scope.instanceInfo = {
        'name': '',
        'environment': '',
        'path': '',
        'project': '',
    };

    $scope.create = function() {
        createDialog('/partials/instances/form.html',{ 
           id : 'createDialog', 
           title: 'Create a new machine',
           backdrop: true, 
           scope: $scope,
           success: {
               label: 'Create',
               fn: function(){
                   $('.loading').show();
                   var instance = new Instances();
                   instance.name = $scope.instanceInfo.name;
                   instance.path = $scope.instanceInfo.path;
                   instance.environment = $scope.instanceInfo.environment;
                   instance.project = $scope.instanceInfo.project;
                   instance.host = $scope.instanceInfo.host;
                   instance.state = 'create';
                   instance.$save();
                   setTimeout($scope.updateInfos, 100);
               }
           },
           cancel: {
               label: 'Cancel',
           },
        });
    };


    $scope.control = function(instanceId, state) {
        $http.post('/api/instances/', {
            state : state,
            id : instanceId,
        })
        .success(function(result) {
            instanceInfos = result.instance;
            angular.forEach($scope.instances, function(instance, idx){
                if(instance.id == instanceInfos.id){
                    $scope.instances[idx] = instanceInfos;
                }
            });
        });
    };

    $scope.delete = function(instanceId, instanceName) {
        $scope.deleteId = instanceId;
        createDialog({
            id : 'createDialog', 
            title: 'Delete instance',
            backdrop: true, 
            scope: $scope,
            btntype: 'danger',
            template: 'Are you sure you want to delete <b>' + instanceName +'</b> ?',
            success: {
                label: 'Yes, delete it',
                fn: function(){
                    instanceId = $scope.deleteId;
                    $('.loading').show();
                    $http.delete('/api/instances/' + instanceId)
                    .success(function(infos) {
                        setTimeout($scope.updateInfos, 100);
                        $scope.deleteId = undefined;
                    });
                }
            },
            cancel: {
                label: 'Cancel',
            },
        });
    };
}
