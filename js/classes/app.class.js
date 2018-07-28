var app = new function() {

  
	this.redirect = function redirect(pagina) {
	  if (pagina == "novo-pedido-1.html") {
	    localStorage.setItem("Simulador.ativo", "0");
	  }

	  mainView.router.loadPage(pagina);
	}

  
}
