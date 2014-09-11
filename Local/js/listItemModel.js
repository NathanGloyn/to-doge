function ListItemModel(text) {
	var currentDate = new Date();
    this.text = text;
	this.done = false;
	this.dateCreated = currentDate;
	this.dateDone = null;
}