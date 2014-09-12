function Storage($){
	
	this.store = function(key, value) {
		localStorage.setItem(key, value);
	};
	
	this.load = function(){

		var deferred = $.Deferred();

		var items=[];
	
		for(var i=0; i < localStorage.length; i++){
			if(i > localStorage.length -1){
				return null;
			}
			items.push(localStorage.getItem(localStorage.key(i)));
		}		

		return deferred.resolve(items).promise();
	};
}