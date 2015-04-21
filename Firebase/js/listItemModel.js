function ListItemModel(id,text) {
	var currentDate = new Date();
    this.id = id;	
    this.text = text;
	this.done = false;
	this.dateCreated = currentDate;
	this.dateDone = null;
}