var pedido = new function() {

  this.getPedido = function(id) {

  };

  this.validar = function(dados, callback) {

    var validate = {
      status: true,
      mensagem:''
    }

    if (dados.tabela_id == "") {
      validate.status = false
      validate.mensagem = 'Selecione a tabela de preço.'
    }
    if (dados.forma_pagamento == "") {
      validate.status = false
      validate.mensagem = 'Selecione a forma de pagamento.'
    }
    if (dados.valor_imposto == "") {
      validate.status = false
      validate.mensagem = 'Selecione o valor do imposto.'
    }


    if (dados.forma_pagamento == "1") {

      if (dados.prazo == "") {
        validate.status = false
        validate.mensagem = 'Selecione prazo.'
      }

    }

    return callback(validate);


  }

  
  this.novoPedido = function(dados, callback) {

    
    $.ajax({
      url: request_url + "/pedidos/novo",
      type: "post",
      dataType: "json",
      data: {
        usuario_id: dados.usuario_id,
        pedido_status_id: dados.pedido_status_id
      }
    })
    .done(function (response) {

      var data = response.data;
      pedido_id = data.Pedido.id;
      localStorage.setItem("Pedido.id", data.Pedido.id);

      return callback(response);

    })
    .fail(function () {
      console.log("error");
    })
    .always(function () {
      myApp.hidePreloader();
    });




  };


  this.editPedido = function (dados, callback) {

    myApp.showPreloader("Carregando...");

    $.ajax({
      url: request_url + "/pedidos/edit/" + dados.pedido_id,
      type: "POST",
      dataType: "json",
      processData: false,
      data: {
        id: dados.pedido_id,
        prazo: dados.prazo,
        simulacao_referencia:simulacao_referencia,
        tabela_id: dados.tabela_id,
        forma_pagamento: dados.forma_pagamento,
        num_parcelas: dados.num_parcelas,
        imposto: dados.valor_imposto,
        "parcelas[]": dados.parcelas
      }
    })
    .done(function (data) {
      return callback(data);
      console.log("success");
    })
    .fail(function () {
      console.log("error");
    })
    .always(function () {
      myApp.hidePreloader();
    });


  };

  this.getPreview = function (id, el) {


    var searchTemplate = $('script#previewCarrinho').html();
    var compiledSearchTemplate = Template7.compile(searchTemplate);

    el.html('<i class="fa fa-spinner fa-spin"></i>')

    $.ajax({
      url: request_url+'/pedidos/info/'+id,
      type: 'GET',
      dataType: 'json',
      data: {
        // pedido_id: id
      },
    })
    .done(function(data) {
      el.html('<i class="fa fa-shopping-cart"></i>')

      console.log(data)

      var total_frete = 0;
      var total_final = 0;
      var subtotal = 0;
      var frete_com_financeiro = 0;
      var media_desconto = 0;
      var total = 0;

       $.each(data.ItensPedido, function (index, val) {
        media_desconto += parseFloat(val.total_desconto);
        // console.log(media_desconto)

        if (isNaN(val.preco_negociado) && isNaN(val.quantidade)) return;
        if (isNaN(val.preco_frete) && isNaN(val.quantidade)) return;

        subtotal += val.preco_negociado * 1;
        frete_com_financeiro += val.preco_frete * 1;

        var total_teste = val.preco_negociado * 1;
        var total_item = total_teste * 1;

        media_desconto = media_desconto / data.ItensPedido.length;

        total_final = val.preco_negociado;

        total += parseFloat(total_final);
      });

       total += parseFloat(frete_com_financeiro);


       var html = compiledSearchTemplate({

         subtotal : Moeda(parseFloat(subtotal).toFixed(2)),
         frete_com_financeiro : Moeda(parseFloat(frete_com_financeiro).toFixed(2)),
         media_desconto : Moeda(parseFloat(media_desconto).toFixed(2)),
         total : Moeda(parseFloat(total).toFixed(2)),

       });

       myApp.pickerModal('<div class="picker-modal">'+
                           '<div class="toolbar">'+
                             '<div class="toolbar-inner">'+
                               '<div class="left"></div>'+
                               '<div class="right">'+
                                 '<a href="#" class="link close-picker">OK</a>'+
                               '</div>'+
                             '</div>'+
                           '</div>'+
                           '<div class="picker-modal-inner">'+
                             html+
                           '</div>'+
                         '</div>');

       $$('.picker-modal').on('closed', function(event) {
         el.removeClass('disabled')
       });

       $$('.picker-modal').on('opened', function(event) {
         el.addClass('disabled')
       });


      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
    



    


    





  };

  this.addItem = function(data) {

  };

  this.removeItem = function(id) {

  };

  this.updateItem = function(data){

  };

  this.getTabelas = function(options, callback){

    $.ajax({
      url: request_url + "/tabelaDePrecos/listar_tabelas",
      type: "GET",
      dataType: "json"
    })
    .done(function(data){

      return callback(data)

    })


  };

  this.getFiliais = function(options, callback){

    $.ajax({
      url: request_url + "/filiais/listar",
      type: 'GET',
      dataType: 'json',
      data: null,
    })
    .done(function(data) {

      return callback(data);


      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
    


  };

  this.getProdutos = function(dados, callback){


    $.ajax({
      url: request_url + "/tabelaDePrecos/lista_produtos/"+dados.tabela_id,
      type: "GET",
      dataType: "json"
    })
    .done(function(data){

      return callback(data)

    })

  };



  this.openPopup = function(dados){
    console.log(dados)



    // if(dados.detalhesAprovacao == 1){

   var itemPrecoNegociadoComFrete = parseFloat(dados.preco_frete1) + parseFloat(dados.itemPrecoNegociado);
   console.log(itemPrecoNegociadoComFrete)
    myApp.popup(".popup-produtoinfo-2", true);


      $$(".popup-produtoinfo-2").on("popup:opened", function () {
        $("#itemNome-1").html(dados.nome);
        $("#itemDescricao-1").html(dados.descricao);
        $("#itemId-1").val(dados.pedido_id);

        $("#itemCarrinhoId-1").val(dados.id);
        $("#itemCarrinhocodigo-1").val(dados.codigo);

        $("#itemPrecoNego1-1").val(dados.preco_unit_negociado);
        $("#itemPrecoFrete-1").val(dados.preco_frete);
        $("#itemQuantidade-1").val(dados.quantidade);
        $("#itemPercentDesconto-1").val(dados.percentual_desconto);
        $("#itemPrecoTabela-1").val(dados.preco_unitario_tabela);
        $("#itemPrecoNegociado-1").val(dados.itemPrecoNegociado);
        $("#itemPrecoNegociadoComFrete-1").val(itemPrecoNegociadoComFrete.toFixed(2));
        $("#pedidos-status").val(dados.pedidoStatus);

        // calculos.frete_com_financeiro
      });


     // }else{

     //  myApp.popup(".popup-produtoinfo", true);

     //  $$(".popup-produtoinfo").on("popup:opened", function () {
     //    $("#itemNome").html(dados.nome);
     //    $("#itemDescricao").html(dados.descricao);
     //    $("#itemId").html(dados.id);
     //    $("#itemPrecoFrete").val(dados.preco_frete);
     //    $("#itemQuantidade").val(dados.quantidade);
     //    $("#itemPercentDesconto").val(dados.percentual_desconto);
     //    $("#itemPrecoTabela").val(dados.preco_unitario_tabela);
     //    $("#itemPrecoNegociado").val(dados.itemPrecoNegociado);
     //  });


     // }

  }


  this.getPrazos = function(dados, callback){

    $.ajax({
      url: request_url + '/prazosPagamentos/index',
      type: 'GET',
      dataType: 'json',
      data: null,
    })
    .done(function(data) {

      return callback(data)

    })

  }
  
}
