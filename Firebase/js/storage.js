function Storage(ref, $){
	
	this.count = 0;

	this.store = function(key, value) {
		var tasksRef = ref.child("tasks").child(key);
		
		tasksRef.set(value);		
	};
	
	this.load = function(){
		var deferred = $.Deferred();
	
		ref.child("tasks").once('value', function(snapshot){
			var items = [];
			var data = snapshot.val();
			for(var property in data){
				var item = data[property];
				item = item.substring(0, item.length);
				items.push(item);
			}
			deferred.resolve(items);
			
		}, function(error){
			console.log('Loading of tasks failed');
		});
		
		return deferred.promise();
	};
}