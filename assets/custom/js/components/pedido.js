var pedido = new function() {
    this.type = "macintosh";
    this.color = "red";
    this.atualizarValores = function(id){

    	var result = null

    	$.ajax({
    		url: request_url+'/pedidos/info/'+id,
    		type: 'GET',
    		dataType: 'json'
    	})
    	.done(function(data) {
    		console.log(data)
	    	result = data
	    	return result;
    	})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus)

    		result.erro = true;
    	})


    }
    this.getInfo = function () {
        return this.color + ' ' + this.type + ' apple';
    };
}