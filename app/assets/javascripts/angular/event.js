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

app.controller('eventCtrl', ['$scope', 'Spin', 'Events', 'Event','$state', 'ipCookie', 'User',
  function($scope, Spin, Events, Event, $state, ipCookie, User){
  $scope.payee_users = {};
  $scope.payer_users = {};
  $scope.users = [];
  $scope.user = ipCookie('user');
  User.all(function(resp){
    $scope.users_list = resp.result.users;
  });
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
        if(v.payee_id==ipCookie('user').id && !v.settled){
          if($scope.payer_users[v.payer_id]==undefined){
            $scope.payer_users[v.payer_id] = { 'name': v.payer.name, 
              'ids':v.id, 'amount': parseFloat(v.amount) };
          }else{
            $scope.payer_users[v.payer_id]['ids'] += ',' + v.id;
            $scope.payer_users[v.payer_id]['amount'] = parseFloat(
              $scope.payer_users[v.payer_id]['amount']) + parseFloat(v.amount);
          }
        };
      });
    });
    $scope.users_list.forEach(function(u) {
      var payer = {}, payee = {};
      angular.forEach($scope.payee_users,function(v, k){
        if(k == u.id){ payee=v };
      });
      angular.forEach($scope.payer_users,function(v, k){
        if(k == u.id){ payer=v };
      });
      if(payee.amount >= payer.amount){
        payee.amount -= payer.amount;
        payee.ids += ',' + payer.ids;
        payee['status'] = 'lent';
        $scope.users.push(payee);
      }else if (payer.amount > payee.amount){
        payer.amount -= payee.amount;
        payer.ids += ',' + payee.ids;
        payer['status'] = 'owe';
        $scope.users.push(payer);
      }else{
        if(!angular.equals(payee, {})){
          payee['status'] = 'lent';
          $scope.users.push(payee);
        }else if(!angular.equals(payer, {})){
          payer['status'] = 'owe';
          $scope.users.push(payer);
        }
      }
    });
  });

  $scope.status = function(log, user){
    if(log.payer_id==user.id){
      return "You lent "+ log.payee.name +" "+$scope.round(log.amount);
    }else if(log.payee_id==user.id){
      return "You owe "+ log.payer.name +" "+$scope.round(log.amount);
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

  $scope.round = function(amount){
    return Math.round(amount*100)/100
  };
}]);
