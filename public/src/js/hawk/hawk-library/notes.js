Jak w temacie. Za starych (dobrych? ;)) czasów problem z [tt]this[/tt] w przypadku obiektów można było elegancko rozwiązać przez własność prywatną, zwyczajowo [tt]that[/tt]:

[code]function MyClass() {
	var that = this;
	
	this.firstMethod = function() {
		setTimeout(function() {
			that.secondMethod("Działam!");
		}, 500);
	}
	
	this.secondMethod = function(msg) {
		console.log(msg);
	}
	
	this.thirdMethod = function() {
		setTimeout(function() {
			that.secondMethod("Tu też!");
		}, 500);
	}
}[/code]

Chodzi mi o to, że można było sobie to zdefiniować raz, a dobrze. W przypadku klasy zgodnej z nową składnią jest problem, bo nie da się 