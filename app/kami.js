var marked = require('marked');
var Vue = require('vue');

new Vue({
	el: '#editor',
	data: {
		input: ''
	},
	filters: {
		marked: marked
	}
});

onload = function() {
	newButton = document.getElementById('new');
};
