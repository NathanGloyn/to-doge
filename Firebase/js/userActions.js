function UserActions(ref){
	
	var fb = ref;
	
	var authClient = new FirebaseSimpleLogin(ref, function (error, user) {
		console.log('In callback: Error: ' + error + ', User: ' + user);
		if (error) {
			alert(error);
			return null;
		}
		if (user) {
			// User is already logged in.
			console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
			return user;
		} else {
			// User is logged out.
			console.log('logged out');
			return null;
		}
	});		
	
	this.login = function(email, password){
		return authClient.login('password', {
			  email: email,
			  password: password
			});	
	}
	
	this.logout = function(){
		authClient.logout();
	}
	
	this.resetPassword = function (email){
		fb.resetPassword({
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
			return false;
		  } else {
			console.log("Password reset email sent successfully!");
			return true;
		  }
		});		
		
	};
	
	this.signUp = function(userEmail, userPassword){
		
		fb.createUser({
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
			return false;
		  } else {
			console.log("Successfully created user account with uid:", userData.uid);
			
			return true;
		  }
		});		
	};
}