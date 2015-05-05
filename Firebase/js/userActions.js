function UserActions(ref){
	
	var currentUserEmail = null;
	
	this.login = function(email, password){

		var deferred = $.Deferred();

		ref.authWithPassword({
		  email    : email,
		  password : password
		}, function (error, authData) {
			console.log('In callback: Error: ' + error + ', User: ' + authData);
			if (error) {
				alert(error);
				deferred.reject(error);
			}
			if (authData) {
				// User is already logged in.
				console.log('User ID: ' + authData.uid + ', Provider: ' + authData.provider);
				currentUserEmail = email;
				deferred.resolve(authData);
			} else {
				// User is logged out.
				console.log('logged out');
				deferred.reject();
			}
		});	
		
		return deferred.promise();
	};
	
	this.logout = function(){
		currentUserEmail = null;
		ref.unauth();
	};
	
	this.resetPassword = function (email){
		var deferred = $.Deferred();

		ref.resetPassword({
		  email: email
		}, function(error) {
		  if (error) {
			switch (error.code) {
			  case "INVALID_USER":
				console.log("The specified user account does not exist.");
				break;
			  default:
				console.log("Error resetting password:", error);
			}
			deferred.resolve(false);
		  } else {
			console.log("Password reset email sent successfully!");
			deferred.resolve(true);
		  }
		});		
		
		return deferred.promise();		
	};
	
	this.signUp = function(userEmail, userPassword){
		var deferred = $.Deferred();		
		
		ref.createUser({
		  email: userEmail,
		  password: userPassword
		}, function(error, userData) {
		  if (error) {
			switch (error.code) {
			  case "EMAIL_TAKEN":
				console.log("The new user account cannot be created because the email is already in use.");
				break;
			  case "INVALID_EMAIL":
				console.log("The specified email is not a valid email.");
				break;
			  default:
				console.log("Error creating user:", error);
			}
			deferred.resolve(false);
		  } else {
			console.log("Successfully created user account with uid:", userData.uid);
			
			deferred.resolve(true);
		  }
		});		
		
		return deferred.promise();		
	};
	
	this.changePassword = function(oldPassword, newPassword){
		var deferred = $.Deferred();
		
		ref.changePassword({
			email: currentUserEmail,
			oldPassword: oldPassword,
			newPassword: newPassword
		}, function (error) {
			var reason="";
			if(error){
				switch (error) {
					case "INVALID_PASSWORD":
						reason = "existing password is incorrect";		
						break;
						
					case "INVALID_USER":
						reason = "Unable to find the user details";
						break;
						
					default:
						reason = "error trying to change password " + error;
						break;
				}
			} 
			
			deferred.resolve(reason);			
		});
		
		return deferred.promise();						
	};
}