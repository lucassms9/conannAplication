'use strict';

(function() {

/*
|------------------------------------------------------------------------------
| Initialize Framework7
| For more parameters visit https://framework7.io/docs/init-app.html
|------------------------------------------------------------------------------
*/

window.myApp = new Framework7({
    swipePanel: 'left',
	cache: true,
	init: false,
	material: true,
    // template7Pages: true, // enable Template7 rendering for Ajax and Dynamic pages
    // precompileTemplates: true,
	modalTitle: 'Connan',
	modalButtonCancel:'Cancelar',
	modalPreloaderTitle:'Carregando...',
	notificationCloseButtonText: 'OK',
	smartSelectPickerCloseText:'OK',
	scrollTopOnNavbarClick: true,
	pushState:true
});

/*
|------------------------------------------------------------------------------
| Initialize Main View
|------------------------------------------------------------------------------
*/

window.mainView = myApp.addView('.view-main');

/*
|------------------------------------------------------------------------------
| Assign Dom7 Global Function to a variable $$ to prevent conflicts with other
| libraries like jQuery or Zepto.
|------------------------------------------------------------------------------
*/

window.$$ = Dom7;

})();

/*
|------------------------------------------------------------------------------
| Function performed on every AJAX request
|------------------------------------------------------------------------------
*/

$$(document).on('ajaxStart', function (e) {
	// myApp.showIndicator();
});

$$(document).on('ajaxComplete', function (e) {
	// myApp.hideIndicator();
});

/*
|------------------------------------------------------------------------------
| Set last saved color and layout theme
|------------------------------------------------------------------------------
*/

function initSimulador() {

	localStorage.setItem('Simulador.ativo', '1');
    localStorage.setItem("Pedido.id", null);

	mainView.router.loadPage('novo-pedido-1.html');

}



function Moeda(valor){
	console.log(valor)
		var numero = valor.split('.');

         numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
         var numeroF = numero.join(',');
         
         return numeroF;

}

function meu_callback(conteudo) {
        if (!("erro" in conteudo)) {
       
        } //end if.
        else {
              myApp.alert('Insira um CEP válido');
              return false;
        }
    }

// function validaCep(valor){
	
//     var cep = valor.replace(/\D/g, '');

// 	if (cep != "") {

//             //Expressão regular para validar o CEP.
//             var validacep = /^[0-9]{8}$/;

//             //Valida o formato do CEP.
//             if(validacep.test(cep)) {

//             	$.ajax({
//             				url: 'https://viacep.com.br/ws/'+ cep +'/json/',
//             				type: 'get',
//             				dataType: 'json',
//             				async:false,
//             				data: {param1: 'value1'},
//             			})
//             			.done(function(data) {
//             				console.log(data.erro);
//             				if(data.erro == true){
//             				myApp.hidePreloader();
//             				 myApp.alert('Insira um CEP válido');
//               				 return false;

//             				}
//             			})
//             			.fail(function(error) {
//             				console.log(error);
//             				 myApp.hidePreloader();
//             				 myApp.alert('Insira um CEP válido');
//               				 return false;

//             			})
//             			.always(function() {
//             				console.log("complete");
//             			});
            					
//             	//Cria um elemento javascript.
//                 var script = document.createElement('script');

//                 //Sincroniza com o callback.
//                 script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback';

//                 //Insere script no documento e carrega o conteúdo.
//                 document.body.appendChild(script);



//             	return false;
//             } //end if.
//             else {
//             	return true;
//             }
//         }else{

//         	return true;
//         } 
//     }

$$(document).on('pageInit', function(e) {




    var userTipo = localStorage.getItem('Usuario.usuario_tipo_id');

	if(userTipo == 5 || userTipo == 8){

		$('#aprovacao-pedidos-show').show();
		
	}else{


		$('#aprovacao-pedidos-show').hide();
	}
	
	  if(userTipo == 5 ){

          $('#pedidos-gestor').show();

        }else{

         $('#pedidos-gestor').hide();
        }

         if(userTipo == 2 ){

          $('#pedidos-supervisor').show();

        }else{

         $('#pedidos-supervisor').hide();
        }




	/*if (true) {
		mainView.router.load({
						url: 'home.html'
					});
	}

	if (sessionStorage.getItem('nectarMaterialThemeColor')) {
		$$('body').removeClass('theme-red theme-pink theme-purple theme-deeppurple theme-indigo theme-blue theme-lightblue theme-cyan theme-teal theme-green theme-lightgreen theme-lime theme-yellow theme-amber theme-orange theme-deeporange theme-brown theme-gray theme-bluegray theme-white theme-black');
		$$('body').addClass('theme-' + sessionStorage.getItem('nectarMaterialThemeColor'));
	}

	if (sessionStorage.getItem('nectarMaterialThemeLayout')) {
		switch(sessionStorage.getItem('nectarMaterialThemeLayout')) {
			case 'dark':
				$$('body').removeClass('layout-dark');
				$$('body').addClass('layout-' + sessionStorage.getItem('nectarMaterialThemeLayout'));
			break;
			default:
				$$('body').removeClass('layout-dark');
			break;
		}
	}*/
});
