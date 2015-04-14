RemoteStorage.defineModule('todoge', function(privateClient) {
	privateClient.cache('');	
	privateClient.declareType("task", {
		description: "a task",
		type: "object",
		properties: {
			id: { 
				type: "number",
				required : true
			},
			text: { 
				type: "string",
				required: true
			},
			done: { 
				type: "boolean",
				default: false		
			},
			dateCreated: { 
				type: "string",
				format: "date-time",			
			},
			dateDone: { 
				type: ["string","null"],
				format: "date-time",			
				default: null
			}	  
		}
	});

	return {
		exports: {
			store: function(id, listItem) {
				return privateClient.storeObject('task', id ,listItem);
			},
			list: function() {
				return privateClient.getAll('');
			}
		}
	};

});
