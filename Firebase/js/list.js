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