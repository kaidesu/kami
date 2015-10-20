var newButton, openButton, saveButton;
var hasWriteAccess;
var editor;
var fileEntry;
var remote = require('remote');
var clipboard = require('clipboard');
var dialog = remote.require('dialog');
var fs = require('fs');
var marked = require('marked');
var Vue = require('vue');

editor = new Vue({
	el: '#editor',
	data: {
		input: ''
	},
	filters: {
		marked: marked
	}
});

function handleDocumentChange(title) {
	document.title = title;
}

var onChosenFileToOpen = function(theFileEntry) {
	console.log(theFileEntry);
	setFile(theFileEntry, false);
	readFileIntoEditor(theFileEntry);
}

function newFile() {
	fileEntry = null;
	hasWriteAccess = false;
	handleDocumentChange(null);
}

function setFile(theFileEntry, isWritable) {
	fileEntry = theFileEntry;
	hasWriteAccess = isWritable;
}

function readFileIntoEditor(theFileEntry) {
	fs.readFile(theFileEntry.toString(), function(err, data) {
		if (err) {
			console.log('Read file failed: ' + err);
		}

		handleDocumentChange(theFileEntry);
		editor.input = String(data);
	});
}

function handleNewButton() {
	console.log('New button has been clicked!');

	if (false) {
		newFile();
	} else {
		window.open('file://' + __dirname + '/../views/index.html');
	}
}

function handleOpenButton() {
	console.log('Open button has been clicked!');

	dialog.showOpenDialog({properties: ['openFile']}, function(filename) {
		onChosenFileToOpen(filename.toString());
	});
}

onload = function() {
	newButton = document.getElementById('new');
	openButton = document.getElementById('open');

	newButton.addEventListener('click', handleNewButton);
	openButton.addEventListener('click', handleOpenButton);
};
