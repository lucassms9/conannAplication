var app = new function() {

	this.checkLogin = function(){

		var user = localStorage.getItem('Usuario.id');

		if (typeof(user) !== 'undefined') {
			return true
		}

		return false

	}

	this.login = function(){

	}


	
}