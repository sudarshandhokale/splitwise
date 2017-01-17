var app = angular.module('splitwise');
app.controller('neweventCtrl', ['$scope', 'Spin', 'Events', 'User', 'ipCookie', '$state',
  function($scope, Spin, Events, User, ipCookie, $state){
  User.all(function(resp){
    $scope.users = resp.result.users;
  });
  $scope.user = ipCookie('user');
  $scope.errors = {};
  $scope.event = {user_events_attributes: {'0': {user_id: ipCookie('user').id}}};
  $scope.contributers = 0;

  $scope.create = function(){
    Spin.startSpin();
    Events.create({event: $scope.event}, function(resp){
      $state.go('home');
      Spin.stopSpin();
    }, function(resp){
      angular.forEach(resp.data.error.errors, function(error, field) {
        if($scope.eventForm[field] != undefined){
          $scope.eventForm[field].$setValidity('server', false);
          $scope.errors[field] = error;
        };
      });
      Spin.stopSpin();
    });
  };

  $scope.errorClass = function(name) {
    return $scope.eventForm[name].$error.server ? 'has-error' : '';
  };

  $scope.getTimes = function(n){
    return new Array(n);
  };

  $scope.addContributer = function() {
    $scope.contributers += 1;
  };

  $scope.removeContributer = function() {
    $scope.contributers -= 1;
  };
}]);

app.controller('eventCtrl', ['$scope', 'Spin', 'Events', 'Event','$state', 'ipCookie',
  function($scope, Spin, Events, Event, $state, ipCookie){
  $scope.payee_users = {};
  $scope.payer_users = {};
  $scope.users = [];
  $scope.user = ipCookie('user');
  Events.all(function(resp){
    $scope.event_logs = resp.result.hash;
    $scope.events = resp.result.hash.events;
    angular.forEach(resp.result.hash, function(value, key) {
      value.forEach(function(v){
        if(v.payer_id==ipCookie('user').id && !v.settled){
          if($scope.payee_users[v.payee_id]==undefined){
            $scope.payee_users[v.payee_id] = { 'name': v.payee.name, 
              'ids':v.id, 'amount': parseFloat(v.amount) };
          }else{
            $scope.payee_users[v.payee_id]['ids'] += ',' + v.id;
            $scope.payee_users[v.payee_id]['amount'] = parseFloat(
              $scope.payee_users[v.payee_id]['amount']) + parseFloat(v.amount);
          }
        };
      });
    });
    angular.forEach(resp.result.hash, function(value, key) {
      value.forEach(function(v){
        if(v.payee_id==ipCookie('user').id && !v.settled){
          if($scope.payer_users[v.payer_id]==undefined){
            $scope.payer_users[v.payer_id] = { 'name': v.payer.name, 
              'ids':v.id, 'amount': parseFloat(v.amount) };
          }else{
            $scope.payee_users[v.payee_id]['ids'] += ',' + v.id;
            $scope.payer_users[v.payer_id]['amount'] = parseFloat(
              $scope.payer_users[v.payer_id]['amount']) + parseFloat(v.amount);
          }
        };
      });
    });
    angular.forEach($scope.payee_users, function(value, key) {
      var payer = {};
      angular.forEach($scope.payer_users,function(v, k){
        if(k == key){ payer=v };
      });
      if(value.amount >= payer.amount){
        value.amount -= payer.amount;
        value.ids += ',' + payer.ids;
        value['status'] = 'lent';
        $scope.users.push(value);
      }else{
        payer.amount -= value.amount;
        payer.ids += ',' + value.ids;
        payer['status'] = 'owe';
        $scope.users.push(payer);
      }
    });
  });

  $scope.status = function(log, user){
    if(log.payer_id==user.id){
      return "You lent "+ log.payee.name +" "+log.amount;
    }else if(log.payee_id==user.id){
      return "You owe "+ log.payer.name +" "+log.amount;
    };
  };

  $scope.settled = function(log){
    Spin.startSpin();
    Event.update({id: 1, ids: [log.id]}, function(resp){ 
      $state.reload();
      Spin.stopSpin();
    });
  };

  $scope.settled_multiple = function(userlog){
    var ids = userlog.ids.split(',');
    Spin.startSpin();
    Event.update({id: 1, ids: ids}, function(resp){ 
      $state.reload();
      Spin.stopSpin();
    });
  };
}]);
