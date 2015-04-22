function List(storage, $) {
    var items = [];
	var doneItems = [];
	var nextId = 0;
	
	this.storage = storage;
	this.toDo = items;
	this.done = doneItems;
	
    this.add = function (text) {
        var newItem = new ListItemModel(nextId,text);
		items.push(newItem);
		storage.store(newItem.id, JSON.stringify(newItem));
		nextId++;
		return newItem;
    };

	this.markDone = function(id) {
			var currentDate = new Date();
			var item = get(id, items);
			doneItems.push(item);
			item.done = true;
			item.dateDone = currentDate;
			storage.store(item.id, JSON.stringify(item));
			return item;
	};
	
	this.loadItems = function(areDone) {
	
		var deferred = $.Deferred();
	
		storage.load()
			   .then(populateLists)
			   .then(function(){
					deferred.resolve();
				});
	
		return deferred.promise();
	};
	
	function populateLists(data){
		for(var i=0; i < data.length ;i++){
			var item = JSON.parse(data[i], reviver);

			if(item.id > nextId){
				nextId = item.id;
			}
			
			if(item.done){
				doneItems.push(item);
			} else {
				items.push(item);
			}
		}

		// increase nextId by 1 so that it ready for use
		nextId++;
	}
		
	function get(id, list){
		for(var i=0; i < list.length; i++){
			if(list[i].id == id){
				return list[i];
			}
		}
		return null;
	}
}