myApp.onPageInit("novo-pedido-1", function (page) {

	var simulador = localStorage.getItem("Simulador.ativo");
	var pedido_id = localStorage.getItem("Pedido.id");
	var usuario_id = localStorage.getItem("Usuario.id");
	var pedido_status_id = null;

	var $tabelaDePrecos = $("#tabelaDePrecos");
	var $selectformapagamento = $("#formapagamento");
	var $liprazodeterminado = $("#liprazodeterminado");
	var $linumeroparcelas = $("#linumeroparcelas");
	var $cbparcelas = $(".cb-parcelas");
	var $btnProximo = $("#btnPedido2");
	var $2pagamento = $("#2pagamento");
	var $1pagamento = $("#1pagamento");
	var $imposto = $('#imposto');
	var $filial = $('#filial')

	var $select_pagamento_2 = $("#2pagamento");


	$linumeroparcelas.hide();
	$cbparcelas.hide();
	$liprazodeterminado.hide();
	$liprazodeterminado.hide();

	if (simulador == "1") {
	  $(".btnSimuladorCancela").show();
	  $('#sim_referencia').show();
	  $(".btnPedidoVoltar").hide();
	} else {
	  $(".btnSimuladorCancela").hide();
	  $('#sim_referencia').hide();
	  $(".btnPedidoVoltar").show();
	}

	pedido.getFiliais(null, function(data){
	  var filial_options = '<option value="">Selecione</option>';
	  
	  $.each(data, function(findex, fval) {

	    filial_options += '<option value="' + findex + '">' + fval + "</option>";
	    
	  });

	  $filial.html(filial_options)

	})

	pedido.getPrazos(null, function(data){

	  var prazos_pagamento = '<option value=""> Selecione </option>'
	  $.each(data, function(index, val) {

	    prazos_pagamento +=
	    '<option data-totaldias = "'+val.PrazosPagamento.total_dias+'" value="' + val.PrazosPagamento.id + '" index="' + index + '">' +
	    val.PrazosPagamento.descricao +
	    "</option>";


	  });

	  $1pagamento.html(prazos_pagamento).on('change', function(event) {
	    var total_dias = $("#1pagamento option:selected").attr('data-totaldias');
	    localStorage.setItem('Pagamento.totaldias', total_dias)
	    event.preventDefault();
	  });


	})

	pedido.getTabelas(null, function(data){

	  var options = '';

	  $$.each(data.data, function (index, val) {
	    options += '<option value="' + index + '">' + val + "</option>";
	  });

	  $tabelaDePrecos.html(options).on('change', function(event) {
	    var dados = {
	      tabela_id:$(this).val()
	    }


	    pedido.getProdutos(dados, function(response){
	      var $listProdutoTabela = $("#listProdutoTabela");        
	      var options = '<option value="">Selecione</option>';
	      var produtosList = null;
	      var listItems = "";

	      produtosList = response.data;

	      myApp.hidePreloader();
	      if (produtosList.length == 0) {
	        myApp.alert("Esta tabela não possui nenhum produto.");
	      }

	      $$.each(produtosList.TabelaDePrecoProduto, function (index, val) {
	        listItems += '<li index="' + index + '">' +
	                      '<a href = "#"  class=" link item-link item-content">' +
	                        '<div class="item-media">' +
	                          '<img src="img/connan-default.jpg" width="44">' +
	                        "</div>" +

	                        '<div class="item-inner">' +
	                          '<div class="item-title-row">' +
	                            '<div class="item-title">' + val.Produto.nome + "</div>" +
	                            '<div class="item-subtitle">' + val.Produto.codigo + "</div>" +
	                          "</div>" +
	                        "</div>" +
	                      "</a>" +
	                    "</li>";
	      });

	      $listProdutoTabela.html(listItems).on("click", "li", function (event) {
	        var index = $$(this).attr("index");
	        var itemLista = produtosList.TabelaDePrecoProduto[index];

	        $("#itemNome").html(itemLista.Produto.nome);
	        $("#itemDescricao").html(itemLista.Produto.descricao);
	        $("#itemId").html(itemLista.id);
	        $("#itemId").val(itemLista.id);


	        $("#itemPrecoTabela").html(itemLista.Produto.descricao);

	        myApp.popup(".popup-produtoinfo", true);

	        $$(".popup-produtoinfo").on("popup:opened", function () {
	          var $itemQuantidade = $("#itemQuantidade");
	          var $itemPrecoTabela = $("#itemPrecoTabela");
	          var $itemPrecoFrete = $("#itemPrecoFrete");
	          var $itemPrecoNegociado = $("#itemPrecoNegociado");
	          var total = 0;
	        });

	        event.preventDefault();
	      });


	    })
	  });

	})


	$selectformapagamento.on("change", function(){

		localStorage.removeItem('Pagamento.totaldias')

		var value = $$(this).val();

		switch(value) {
		    case 1:
		    	$liprazodeterminado.show();
		    	$linumeroparcelas.hide();
		        break;
		    case 3:
		    	$liprazodeterminado.hide();
		    	$linumeroparcelas.hide();
		    	$cbparcelas.hide();
		        break;
		    default:
		    	$liprazodeterminado.hide();
		    	$linumeroparcelas.show();
		    	$cbparcelas.show();

		    	$select_pagamento_2.on("change", function (event) {
		    	  var listel = "";
		    	  var countparcelas = $$(this).val();
		    	  var $ulparcelas = $$("#parcelas");

		    	  $ulparcelas.html("");

		    	  for (var i = 1; i <= countparcelas; i++) {
		    	    var date_parcela = moment().add(i * 30, "day").format("Y-MM-DD");

		    	    listel += "<li>";
		    	    listel += '<div class="item-content">';
		    	    listel += '<div class="item-inner">';
		    	    listel += '<div class="item-title">Parcela ' + i + "</div>";
		    	    listel += '<div class="item-input item-input-field">';
		    	    listel += '<input type="date" name="parcela[' + i + ']" class="" value="' + date_parcela + '">';
		    	    listel += "</div>";
		    	    listel += "</div>";
		    	    listel += "</div>";
		    	    listel += "</li>";

		    	    $ulparcelas.append(listel);
		    	    listel = "";
		    	  }

		    	  event.preventDefault();
		    	  /* Act on the event */
		    	});


		        // code block
		}



	})


	$btnProximo.on("click", function (event) {

	  var prazo = $1pagamento.val();
	  var tabela_id = $tabelaDePrecos.val();
	  var forma_pagamento = $selectformapagamento.val();
	  var num_parcelas = $2pagamento.val();
	  var valor_imposto = $imposto.val();
	  var simulacao_referencia = $('#simulacao_referencia').val()
	  var parcelas = $("input[name^=parcela]").map(function () {
	    return this.value;
	  }).get();

	  var dados = {

	    prazo:prazo,
	    tabela_id:tabela_id,
	    forma_pagamento:forma_pagamento,
	    num_parcelas:num_parcelas,
	    valor_imposto:valor_imposto,
	    simulacao_referencia:simulacao_referencia,
	    parcelas:parcelas

	  }
	  
	  pedido.validar(dados, function(validate){

	    if (validate.status) {
	      localStorage.setItem("Pedido.prazo", prazo);
	      localStorage.setItem("Pedido.tabela_id", tabela_id);
	      localStorage.setItem("Pedido.forma_pagamento", forma_pagamento);
	      localStorage.setItem("Pedido.num_parcelas", num_parcelas);
	      localStorage.setItem("Pedido.valor_imposto", valor_imposto);


	      pedido.editPedido({
	        pedido_id,
	        prazo,
	        simulacao_referencia,
	        tabela_id,
	        forma_pagamento,
	        num_parcelas,
	        valor_imposto,
	        parcelas,
	      }, function(response){

	        localStorage.setItem('Pedido.tabela_id', tabela_id)
	        mainView.router.loadPage("novo-pedido-2.html");

	      })


	    }else{
	      return myApp.alert(validate.mensagem)
	    }

	  })

	  

	  event.preventDefault();
	  /* Act on the event */
	});









})
