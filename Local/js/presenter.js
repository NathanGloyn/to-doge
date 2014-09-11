(function Presenter(document, $) {

	var toType = function(obj) {
	  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
	}

    var listCount = 0;
	var dogePos;
	var dogeHidden;
	var listService = new List(new Storage());
	
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
		console.log(listCount);
	});
	
	function loadExistingItems(){
		listService.loadItems();
		
		for(var i =0; i < listService.toDo.length; i++){
			addElement(listService.toDo[i],toDoList);
			listCount++;
		}
		
		for(var i = 0; i < listService.done.length; i++) {
			addElement(listService.done[i],$('#doneList'));
		}		
	}

    function addHandlers () {
        console.log("Add handlers");
		
		$('body').keypress(cancelEntry);
        newItemBtn.click(displayNewItem);
		newItemTxt.keyup(addItemKeyPress);
        $('#btnAddNewItem').click(addNewItem);
        $('#doge').click(hideDoge);
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
				hideDoge;
				removeItem(doneItem);
			} , 2000);
		}
	}
	
    function displayNewItem() {
        console.log("New item clicked");
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
        console.log("Hide new item entry");
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
		$('#doge').toggle();
	}
	
}(window.document, window.jQuery));