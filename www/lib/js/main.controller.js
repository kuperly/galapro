app.controller('main',main);

function main ($scope, $window, MainFctory,$log,SocketService, $interval) {

    var vm = this;
    var stop;
    vm.message = '';
    vm.submit = submit;

    function submit (form) {

        // Clear messages every server call
        vm.redirectMsg ='';
        vm.message = '';

        if(!form.$valid) {
            return;
        }

        // Send values to server
        if(vm.form.redirect) {
            SocketService.emit('askRedirect',vm.form);
        } else {
            MainFctory.getURLs(vm.form).then(function successCallback (res) {

                // 1. redirect is TRUE & and exist default URL in DB - will go to default URL
                if(res.data.url){
                    $window.location.href = res.data.url;
                }
                
            }, function errorCallback(res) { // 2. error no URL
                vm.message = res.data;
                form.$submitted = false;
            })
        }

        
        
            
    }

    SocketService.on('redirectMsg', function(msg) {
        vm.redirectMsg = msg;
    });

    SocketService.on('message', function(msg) {
        vm.message = msg;
    });
};