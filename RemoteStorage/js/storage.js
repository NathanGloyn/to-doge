function Storage(remoteStorage,$){
	
	this.store = function(key, value) {
		remoteStorage.todoge.store(key.toString(),value);
	};
	
	this.load = function(){

		var deferred = $.Deferred();

		remoteStorage.todoge.list().then(function(data){
			var items = [];
			for(var key in data){
				items.push(data[key]);
			}
			deferred.resolve(items);
		}, function(error){
			console.log(error);
		});

		return deferred.promise();
	};
}