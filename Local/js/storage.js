function Storage($){
	
	this.store = function(key, value) {
		localStorage.setItem(key, value);
	}
	
	this.load = function(){

		var deferred = $.Deferred();)
	
		setTimeout(1,function(){
			var items=[];
		
			for(var i=0; i < localStorage.length; i++){
				if(index > localStorage.length -1){
					return null;
				}
				items.push(localStorage.key(index));
			}		
		});
		
		
		return deferred.promise();
	}
}