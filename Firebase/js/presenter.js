(function Presenter(document, $) {

	var toType = function(obj) {
	  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	};

	var myUser = {};
	var ref = new Firebase("https://to-doge.firebaseio.com");
	
    var listCount = 0;
	var dogePos;
	var dogeHidden;
	var listService = new List(new Storage(ref, $), $);
	
	var dogeFn = new Doge($);
	
    var toDoList = $('#toDoList'),
        newItemBtn = $('#btnNewItem'),
        newItemDiv = $('#newItemDiv'),
        newItemTxt = $('#txtNewItem');

	$(document).ready(function () {
		$('#doge').toggle();
		tabSwitch();
		addHandlers();
		loadExistingItems();
	});
	
	function loadExistingItems(){
		listService.loadItems().then(function (){
			for(var i =0; i < listService.toDo.length; i++){
				addElement(listService.toDo[i],toDoList);
				listCount++;
			}
			
			for(var i = 0; i < listService.done.length; i++) {
				addElement(listService.done[i],$('#doneList'));
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
    }
	
	function login(event){
		event.stopPropagation();
		var email = $('#email').val();
		var password = $('#password').val();
		console.log('Trying to log ' + email + ' in');
		if(email && password) {
			console.log('Email: ' + email + ', Password: ' + password);
			authClient.login('password', {
			  email: email,
			  password: password
			});	
		}
	}
	
	
	function logout(){
		console.log('log out called');
		authClient.logout();
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
										 id:	'item-' + listItem.id
										,type:	'checkbox'
									})
									.click(itemChecked)
								)
								.append(
									$(document.createElement('label')).attr({
										'for':	'item-' + listItem.id
									})
									.text( listItem.text)
								)		
		
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
	
	function hideDoge(){
		$('#doge div').remove();
		$('#doge').toggle();
	}
	
	var authClient = new FirebaseSimpleLogin(ref, function (error, user) {
		console.log('In callback: Error: ' + error + ', User: ' + user);
		if (error) {
			alert(error);
			return;
		}
		if (user) {
			// User is already logged in.
			console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
			myUser = user;
			console.log('logged in');
			$(".tabs").show();
			$(".logon").hide();
		} else {
			// User is logged out.
			console.log('logged out');
			$(".tabs").hide();
			$(".logon").show();
		}
	});	
	
}(window.document, window.jQuery));