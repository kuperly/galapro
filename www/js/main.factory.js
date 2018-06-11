app.factory('MainFctory',MainFctory);

function MainFctory ($http) {

    var service = {};
    var urlBase = 'http://localhost:3000/api/v1';
    

    service.getURLs = function(data) {
        return $http.post(urlBase + '/url', data);
    };

    // service.getUser = function(id){
    //     return $http.get(urlBase + '/user/' + id);
    // };

    return service;
}