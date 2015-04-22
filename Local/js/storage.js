function Storage($){
	
	this.store = function(key, value) {
		localStorage.setItem('to-doge\\'+ key, value);
	};
	
	this.load = function(){

		var deferred = $.Deferred();

		var items=[];
	
		for(var i=0; i < localStorage.length; i++){
			if(i > localStorage.length -1){
				return null;
			}
			if(localStorage.key(i).indexOf('to-doge')){
				items.push(localStorage.getItem(localStorage.key(i)));	
			}
		}		

		return deferred.resolve(items).promise();
	};
}