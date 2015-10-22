var newButton, openButton, saveButton;
var hasWriteAccess;
var editor;
var fileEntry;

var remote = require('remote');
var dialog = remote.require('dialog');
var fs = require('fs');
var marked = require('marked');
var Vue = require('vue');
var notifier = require('node-notifier');

editor = new Vue({
	el: '#kami-editor',
	data: {
		input: '# Hello World!'
	},
	filters: {
		marked: marked
	}
});

enableTabs('editor-textarea');

function handleDocumentChange(title) {
	document.title = title;
}

var onChosenFileToOpen = function(theFileEntry) {
	console.log(theFileEntry);
	setFile(theFileEntry, true);
	readFileIntoEditor(theFileEntry);
}

var onChosenFileToSave = function(theFileEntry) {
	setFile(theFileEntry, true);
	writeEditorToFile(theFileEntry);
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

function writeEditorToFile(theFileEntry) {
	var str = editor.input;
	fs.writeFile(theFileEntry, editor.input, function(err) {
		if (err) {
			console.log('Write failed: ' + err);
			return;
		}

		handleDocumentChange(theFileEntry);
		console.log('Write complete.');
		notifier.notify({
			title: 'File saved successfully',
			message: theFileEntry
		}, function(err, response) {
			//
		});
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

function handleSaveButton() {
	console.log(fileEntry);
	console.log(hasWriteAccess);

	if (fileEntry && hasWriteAccess) {
		writeEditorToFile(fileEntry);
	} else {
		dialog.showSaveDialog(function(filename) {
			onChosenFileToSave(filename.toString(), true);
		});
	}
}

function enableTabs(id) {
    var el = document.getElementById(id);
    el.onkeydown = function(e) {
        if (e.keyCode === 9) { // tab was pressed

            // get caret position/selection
            var val = this.value,
                start = this.selectionStart,
                end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            this.value = val.substring(0, start) + '\t' + val.substring(end);

            // put caret at right position again
            this.selectionStart = this.selectionEnd = start + 1;

            // prevent the focus lose
            return false;

        }
    };
}

onload = function() {
	newButton = document.getElementById('new');
	openButton = document.getElementById('open');
	saveButton = document.getElementById('save');

	newButton.addEventListener('click', handleNewButton);
	openButton.addEventListener('click', handleOpenButton);
	saveButton.addEventListener('click', handleSaveButton);
};
