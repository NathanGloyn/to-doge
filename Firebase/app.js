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
			var associatedLabel = $("label[for='" + id + "']").text()
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
            console.log("Create new toDoList item");
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
										 id:	'item-' + listCount
										,type:	'checkbox'
									})
									.click(itemChecked)
								)
								.append(
									$(document.createElement('label')).attr({
										'for':	'item-' + listCount
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
		var itemToRemove = $("label:contains('" + item.text + "')" ).parent();
		itemToRemove.remove();
		var doneItem = createDoneItem(item);
		$('#doneList').append(doneItem);
	}
	
	function tabSwitch(){
		$('.tabs .tab-links a').on('click', function(e)  {
			var currentAttrValue = $(this).attr('href');
	 
			// Show/Hide Tabs
			$('.tabs ' + currentAttrValue).show().siblings().hide();
	 
			// Change/remove current tab to active
			$(this).parent('li').addClass('active').siblings().removeClass('active');
	 
			e.preventDefault();
		});
	}
	
	function hideDoge(){
		$('#doge div').remove();
		$('#doge').hide();
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
function List(storage, $) {
    var items = [];
	var doneItems = [];
	
	this.storage = storage;
	this.toDo = items;
	this.done = doneItems;
	
    this.add = function (text) {
        var newItem = new ListItemModel(text);
		items.push(newItem);
		storage.store(newItem.text, JSON.stringify(newItem));
		return newItem;
    }

	this.markDone = function(text) {
			var currentDate = new Date();
			var item = get(text, items);
			doneItems.push(item);
			item.done = true;
			item.dateDone = currentDate;
			storage.store(item.text, JSON.stringify(item));
			return item;
	}
	
	this.loadItems = function(areDone) {
	
		var deferred = $.Deferred();
	
		storage.load().then(populateLists).then(function(){
			deferred.resolve();
		});
		
		return deferred.promise();
	}
	
	function populateLists(data){
		
		for(var i=0; i < data.length ;i++){
			var item = JSON.parse(data[i], reviver);
			if(item.done){
				doneItems.push(item)
			} else {
				items.push(item);
			}
		}		
	}
	
	function get(text, list){
		for(var i=0; i < list.length; i++){
			if(list[i].text == text){
				return list[i];
			}
		}
		return null;
	}
}
function ListItemModel(text) {
	var currentDate = new Date();
    this.text = text;
	this.done = false;
	this.dateCreated = currentDate;
	this.dateDone = null;
}
function reviver(key, value){
	if(key === ""){
		return value;
	}
	
	var match;
	if (typeof value === 'string') {
		match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(Z)$/.exec(value);
		if (match) {
			return  new Date(Date.UTC(+match[1], +match[2] - 1, +match[3], +match[4], +match[5], +match[6]));
		}
	}
	return value;	
}
function Storage(ref, $){
	
	this.count = 0;

	this.store = function(key, value) {
		var tasksRef = ref.child("tasks").child(key);
		
		tasksRef.set(value);		
	}
	
	this.load = function(){
		var deferred = $.Deferred();
	
		ref.child("tasks").once('value', function(snapshot){
			var items = [];
			var data = snapshot.val();
			for( property in data){
				var item = data[property];
				item = item.substring(0, item.length);
				items.push(item);
			}
			deferred.resolve(items);
			
		}, function(error){
			console.log('Loading of tasks failed');
		});
		
		return deferred.promise();
	}
}
function Doge($){
	var colors = ["red", "green", "blue", "yellow", "magenta", "cyan"];
	var sizes = ["small", "medium", "big"];
	var phrases = ["wow", "much cool", "lol"];
	
	var dogePos;
	var dogeWidth = 0;
	
	function getPhrase() {
		if(!phrases.length) {
			return "wow";
		}
		var i = Math.floor(Math.random() * phrases.length);
		return phrases[i];
	}	
	
	function createText() {
		var text = $('.text');
		if(text.length > 50) {
			text[0].remove();
		}
		var div = $('<div />').addClass('text');
		div.addClass( sizes[Math.floor(Math.random() * sizes.length)] )
		div.addClass( colors[Math.floor(Math.random() * sizes.length)] )
		div.html(getPhrase());
		var leftPosition = (Math.random() * 550) + dogePos.left;
		if(leftPosition < dogePos.left){
			leftPosition = leftPosition + dogePos.left;
		}
		
		var topPosition = (Math.random() * 600) + dogePos.top;
		
		
		div.css('left', leftPosition + "px");
		div.css('top', topPosition + "px");
		div.hide();
		$('#doge').append(div);
		div.fadeIn(600);
	}

	this.display = function() {
		$('#doge').show();
		dogePos = $('#doge').position();
		dogeWidth = $('#doge').width();
		for(var i = 0; i < 50; i++) {
			createText();
		}			
	}	
}