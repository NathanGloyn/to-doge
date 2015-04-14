var convert = {
	toStorageFormat: function(listItem){
		var convertedObject = {
			id: listItem.id,
			text: listItem.text,
			done: listItem.done,
			dateCreated: JSON.stringify(listItem.dateCreated),
			dateDone: null
		};
		
		if(listItem.dateDone){
			convertedObject.dateDone = JSON.stringify(listItem.dateDone);
		}
		
		return convertedObject;
	},

	toListItem: function(data){
		var convertedObject = {
			id: data.id,
			text: data.text,
			done: data.done,
			dateCreated: new Date(JSON.parse(data.dateCreated)),
			dateDone: null
		};
		
		if(data.dateDone){
			convertedObject.dateDone = new Date(JSON.parse(data.dateDone));
		}
		
		return convertedObject;
	}	
};
