(function Presenter(document, $) {

	var toType = function(obj) {
	  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	};

	var myUser = null;
	var currentUserName='';
	var ref = new Firebase("https://to-doge.firebaseio.com");
	var userActions = new UserActions(ref);
	
    var listCount = 0;
	var dogePos;
	var dogeHidden;
	var listService;
	
	var dogeFn = new Doge($);
	
    var toDoList = $('#toDoList'),
        newItemBtn = $('#btnNewItem'),
        newItemDiv = $('#newItemDiv'),
        newItemTxt = $('#txtNewItem');

	$(document).ready(function () {
		$('#doge').toggle();
		tabSwitch();
		userActionEvents();
		addHandlers();
	});
	
	function loadExistingItems(){
		listService.loadItems().then(function (){
			for(var i =0; i < listService.toDo.length; i++){
				addElement(listService.toDo[i],toDoList);
				listCount++;
			}
			
			for(var j = 0; j < listService.done.length; j++) {
				addElement(listService.done[j],$('#doneList'));
			}			
		});
	}

    function addHandlers () {
		$('body').keypress(cancelEntry);
        newItemBtn.click(displayNewItem);
		newItemTxt.keyup(addItemKeyPress);
        $('#btnAddNewItem').click(addNewItem);
        $('#doge').click(hideDoge);
		$('#submitLogin').click(login);
		$('#logout').click(logout);
		$('#forgottenPassword').click(displayReset);
		$('#submitReset').click(resetPassword);
		$('#resetBack').click(resetBack);
		$('#signUpBack').click(signUpBack);
		$('#submitSignup').click(signUp);
		$('#signUp').click(displaySignUp);
    }
	
	function login(event){
		event.stopPropagation();
		var email = $('#email').val();
		var password = $('#password').val();
		console.log('Trying to log ' + email + ' in');
		if(email && password) {
			userActions.login(email, password)
						.then(function (data) {
							var startIndex = data.uid.indexOf(':') + 1;
							myUser = data.uid.substring(startIndex);
							$('#userMenu [value="userName"]').text(email);
							$("#userMenu").val("userName");
							listService = new List(new Storage(ref, $, myUser), $);
							loadExistingItems();
							console.log('logged in');
							$(".tabs").show();
							$(".logon").hide();										
						 })
						 .fail(function(){
						 	alert("Couldn't log in'");
						 });
		}
	}
	
	
	function logout(){
		console.log('log out called');
		myUser = null;
		toDoList.children().remove();
		$('#doneList').children().remove();
		currentUserName = '';
		userActions.logout();
		$(".tabs").hide();
		$(".logon").show();		
	}
	
	function displayReset(event){
		event.stopPropagation();
		$('#userReset').show();
		$(".logon").hide();
	}
	
	function resetPassword(event){
		event.stopPropagation();
		var email = $('#resetEmail').val();
		if(email){
			userActions.resetPassword(email).then(function(result){
				if(result){
					$('#resetSent').show();
				} else {
					$('#resetFailed').show();
				}
			}).fail(function() {
				alert('Failed in calling reset');
			});
		}
	}
	
	function resetBack(event){
		event.stopPropagation();
		$('#userReset').hide();
		$('#resetFailed').hide();
		$('#resetSent').hide();		
		$(".logon").show();		
	}
	
	function displaySignUp(event){
		event.stopPropagation();
		$('#userSignUp').show();
		$('.logon').hide();
	}
	
	function signUp(event){
		event.stopPropagation();
		var email = $('#signUpEmail').val();
		var password = $('#signUpPassword').val();
		console.log('Trying to sign up ' + email);
		if(email && password) {
			userActions.signUp(email, password)
					   .then(function (result){
							if(result){
								$('#signedUp').show();				
							} else {
								$('#signUpFailed').show();				
							}	
						});
		}		
	}
	
	function signUpBack(event){
		event.stopPropagation();
		$('#userSignUp').hide();
		$('#signUpFailed').hide();
		$('#signedUp').hide();		
		$(".logon").show();		
	}
	
	function newItemDivVisible(isVisible){
		var visbleSetting = isVisible ? 'visible':'hidden';		
		newItemDiv.css('visibility', visbleSetting);
	}
	
	function itemChecked(event){
	
		var target = $(event.target);
		if(target.is(':checked')){
			event.stopPropagation();
			var id = target.attr("id");
			var associatedLabel = id.replace(/item-/gi,''); 
			var doneItem = listService.markDone(associatedLabel);
			dogeFn.display();
			setTimeout(function() {
				hideDoge();
				removeItem(doneItem);
			} , 2000);
		}
	}
	
    function displayNewItem() {
        newItemDivVisible(true);
        newItemBtn.hide();
        newItemTxt.focus();
    }

    function addItemKeyPress(event) {
        if (event.keyCode == 13) {
            addNewItem();
			event.stopPropagation();
        }
    }

    function addNewItem() {
        var itemText = newItemTxt.val();
        if (itemText) {
			var listItem = listService.add(itemText);
			addElement(listItem, toDoList);
			listCount++;
			hideNewItem();
        }
    }

	function addElement(listItem, listToAddTo){
		var newElement = listItem.done ? createDoneItem(listItem) : createListItemDOM(listItem);
		listToAddTo.append(newElement);	
	}
	
    function cancelEntry(event) {
        if (event.keyCode === 27) {
            hideNewItem();
            event.preventDefault();
            event.stopPropagation();
        }
    }

    function hideNewItem() {
        newItemTxt.val("");
        newItemDivVisible(false);
        newItemBtn.show();
        newItemBtn.focus();
    }

    function getElement(elementId) {
        return document.getElementById(elementId);
    }

    function createListItemDOM(listItem) {
        var newListItem = $(document.createElement("li"))
								.append(
									$(document.createElement("input")).attr({
										id:	'item-' + listItem.id,
										type:	'checkbox'
									})
									.click(itemChecked)
								)
								.append(
									$(document.createElement('label')).attr({
										'for':	'item-' + listItem.id
									})
									.text( listItem.text)
								);		
		
        return newListItem;
    }
	
	function createDoneItem(listItem){
		var newItem = $(document.createElement("li"))
							.append(
								$(document.createElement("span"))
								.text(listItem.text)
							)
							.append(
								$(document.createElement("span"))
									.text(listItem.dateDone.toLocaleString())
									.addClass("doneDate")
							);
		return newItem;
	}
	
    function createElement(tag) {
        return document.createElement(tag);
    }

	function removeItem(item){
		var itemToRemove = $("label[for='item-" + item.id + "']" ).parent();
		itemToRemove.remove();
		var doneItem = createDoneItem(item);
		$('#doneList').append(doneItem);
	}
	
	function tabSwitch(){
		$('.tabs .tab-links a').on('click', function(e)  {
			var currentAttrValue = $(this).attr('href');
	 
			// Show/Hide Tabs
			$('.tab' + currentAttrValue).show().siblings().hide();
	 
			// Change/remove current tab to active
			$(this).parent('li').addClass('active').siblings().removeClass('active');
	 
			e.preventDefault();
		});
	}
	
	function userActionEvents(params) {
		
		$('#userMenu').change(function(){
			var selectedItem = $("#userMenu option:selected").val();
			
			switch (selectedItem) {
				case "logOut":
					logout();
					break;
				case "userProfile":
					$('#submitChangePassword').show();
					displayUserProfile();
					break;
			}
		});
		
		changePasswordInputHandler();
		
		$('#submitChangePassword').on('click',function(e) {
			e.preventDefault();
			submitChangePassword();			
		});
		
		$('#backToLists').on('click',function(e){
			e.preventDefault();	
			$("#userActions").hide();
			$(".tabs").show();			
			$('#backToLists').text("Back");
			$('#changeResult').text("");
			$('#changeResultContainer').hide();			
			$('#oldPassword').text("");
			$('#newPassword').text("");
			$('#confirmPassword').text("");
			$("#userMenu").val("userName");
			enableChangePassword();
		});
	}
	
	function displayUserProfile(){
			$(".tabs").hide();
			$("#userActions").show();		
	}
	
	function changePasswordInputHandler() {
		enableChangePassword();
		
		$('#newPassword').keyup(function(){
			if($('#confirmPassword').val() !== ""){
				enableChangePassword();
			}
		});
		
		$('#confirmPassword').keyup(function(){
			if($('#newPassword').val() !== ""){
				enableChangePassword();
			}
		});		
	}
	
	function enableChangePassword(){
		var newPassword = $('#newPassword').val();
		var confirmPassword = $('#confirmPassword').val();
		
		
		var buttonDisabled = true;
		
		if(newPassword !== "" && confirmPassword !==""){
			buttonDisabled = newPassword !== confirmPassword;
		}
			
		$('#submitChangePassword').attr('disabled', buttonDisabled);
	}
	
	function submitChangePassword() {
		
		var oldPassword = $('#existingPassword').val();
		var newPassword = $('#newPassword').val();
				
		userActions.changePassword(oldPassword, newPassword)
				   .then(function(data) {
					  if(data){
						  $('#changeResult').text(data);
					  } else {
						  $('#changeResult').text("Sucessfully change password");
						  $('#backToLists').text("Back");
						  $('#submitChangePassword').hide();
					  } 
					  
					  $('#changeResultContainer').show();
					  
				   });
	}
	
	function hideDoge(){
		$('#doge div').remove();
		$('#doge').toggle();
	}
	
}(window.document, window.jQuery));