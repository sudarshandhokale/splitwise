var app = angular.module('splitwise');
app.controller('MainCtrl', ['$scope', '$auth', '$state', 
  '$window', 'Flash', 'Spin', 'ipCookie',
  function($scope, $auth, $state, $window, Flash, Spin, ipCookie){
  $scope.form = { login: true, register: false, forget_password: false};

  Spin.startSpin();
  $auth.validateUser().then(function(result) {
    $scope.authenticateUser = true;
    $scope.user = ipCookie('user');
    Spin.stopSpin();
  }).catch(function(result) {
    $scope.authenticateUser = false;
    $state.go('*');
    Spin.stopSpin();
  });

  $scope.signOut = function(){
    Spin.startSpin();
    $auth.signOut().then(function(resp) {
      $window.location.href = "/";
      Spin.stopSpin();
    });
  };

  $scope.loginForm = function(){
    $scope.form = { login: true, register: false, forget_password: false};
  };

  $scope.registerForm = function(){
    $scope.form = { login: false, register: true, forget_password: false};
  };

  $scope.forgetPasswordForm = function(){
    $scope.form = { login: false, register: false, forget_password: true};
  };
}]);

app.controller('LoginCtrl', ['$scope', '$auth', '$window', 'Flash', 'Spin',
  function($scope, $auth, $window, Flash, Spin){
  this.login = function(){
    Spin.startSpin();
    $auth.submitLogin(this.credentials).then(function() {
      $window.location.href = "/";
      Spin.stopSpin();
    }).catch(function(result) {
      var messages = "Invalid email or password!, "+
      "Or may be you are not confirm your account from email.";
      Flash.create('danger', messages, 'custom-class');
      Spin.stopSpin();
    });
  };
}]);

app.controller('RegisterCtrl', ['$scope', '$auth', 'Flash', 'Spin',
  function($scope, $auth, Flash, Spin){
  $scope.registers = { email: '', password: '', password_confirmation: '' };
  $scope.errors = {};

  this.register = function(){
    Spin.startSpin();
    $auth.submitRegistration($scope.registers).then(function(){
      $scope.registers = { email: '', password: '', password_confirmation: '' };
      var messages = "You will receive an email with instructions " +
        "about how to confirm your account in a few minutes."
      Flash.create('success', messages, 'custom-class');
      Spin.stopSpin();
    }).catch(function(result){
      angular.forEach(result.data.error.errors, function(error, field) {
        if($scope.registerForm[field] != undefined){
          $scope.registerForm[field].$setValidity('server', false);
          $scope.errors[field] = error;
        }
      });
      Spin.stopSpin();
    });
  };

  $scope.errorClass = function(name) {
    return $scope.registerForm[name].$error.server ? 'has-error' : '';
  };
}]);

app.controller('ForgetPasswordCtrl', ['$scope', '$auth', 'Flash', '$state', 'Spin',
  function($scope, $auth, Flash, $state, Spin){
  $scope.forgetpassword = { email: '' };

  this.forgetPassword = function(){
    Spin.startSpin();
    $auth.requestPasswordReset($scope.forgetpassword).then(function(res){
      $scope.forgetpassword = { email: '' };
      Flash.create('success', res.data.result.message, 'custom-class');
      Spin.stopSpin();
    }).catch(function(result){
      Flash.create('danger', result.data.error.message, 'custom-class');
      Spin.stopSpin();
    });
  };
}]);

app.controller('ResetPassword', ['$scope', '$auth', 'Flash', '$state', 'Spin',
  function($scope, $auth, Flash, $state, Spin){
  $scope.reset = { password: '', password_confirmation: '' };
  $scope.errors = {};

  $scope.reset_password = function(){
    Spin.startSpin();
    $auth.updatePassword($scope.reset).then(function(res){
      $scope.reset = { password: '', password_confirmation: '' };
      Flash.create('success', res.data.result.message, 'custom-class');
      $state.go('home');
      Spin.stopSpin();
    }).catch(function(result){
      angular.forEach(result.data.error.errors, function(error, field) {
        if($scope.resetPasswordForm[field] != undefined){
          $scope.resetPasswordForm[field].$setValidity('server', false);
          $scope.errors[field] = error;
        }
      });
      Spin.stopSpin();
    });
  };

  $scope.errorClass = function(name) {
    return $scope.resetPasswordForm[name].$error.server ? 'has-error' : '';
  };
}]);

app.controller('omniauth', ['$scope', '$auth', function($scope, $auth){
  $scope.authenticate = function(oauth){
    $auth.authenticate(oauth);
  };
}]);
