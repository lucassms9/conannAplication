var cliente = new function() {

	this.model = {}

	this.echo = function(){
		alert();
	}

}

var pedido = new function() {

	this.model = { 
		"cliente" : cliente,
	}

	this.model.cliente.echo()

}