"use strict";


if (typeof(request_url) == 'undefined') {
  var request_url = localStorage.getItem('request_url')
}
/*
|------------------------------------------------------------------------------
| Home
|------------------------------------------------------------------------------
*/

function redirect(pagina, fromUser) {

  if (pagina == "novo-pedido-1.html") {
    localStorage.setItem("Simulador.ativo", "0");
    localStorage.setItem("Pedido.id", null);
  }

  if(!fromUser){
    localStorage.removeItem("newClientePedido");
  }

  mainView.router.loadPage(pagina);
}

function gotoMain(event) {
  // myApp.mainView.router.back({ url: myApp.mainView.history[0], force: true })

  if (mainView.activePage.name == 'home') {
    return false
  }


  window.location.href = "index.html";

  // mainView.router.back({
  // url: myApp.mainView.history[0], // - in case you use Ajax pages

  // pageName: 'home', // - in case you use Inline Pages or domCache
  // force: true
  // });

  /*mainView.router.back({
    url: 'pageindex.html', // - in case you use Ajax pages
    // pageName: 'home', // - in case you use Ajax pages
    force: true
  });*/

  if (typeof event !== "undefined") {
    event.preventDefault();
  }
}

myApp.onPageInit("*", function (page) {
  mask()
});

myApp.onPageInit("home", function (page) {
  mainView.history = ["index.html"];
  $$(".pages .login").remove();

  /* Theme Color */
  if (sessionStorage.getItem("nectarMaterialThemeColor")) {
    $$(
      "input[name=theme-color][value=" +
      sessionStorage.getItem("nectarMaterialThemeColor") +
      "]"
      ).prop("checked", true);
  }

  $$("input[name=theme-color]").on("change", function () {
    if (this.checked) {
      $$("body").removeClass(
        "theme-red theme-pink theme-purple theme-deeppurple theme-indigo theme-blue theme-lightblue theme-cyan theme-teal theme-green theme-lightgreen theme-lime theme-yellow theme-amber theme-orange theme-deeporange theme-brown theme-gray theme-bluegray theme-white theme-black"
        );
      $$("body").addClass("theme-" + $$(this).val());
      sessionStorage.setItem("nectarMaterialThemeColor", $$(this).val());
    }
  });

  /* Theme Mode */
  if (sessionStorage.getItem("nectarMaterialThemeLayout")) {
    $$(
      "input[name=theme-layout][value=" +
      sessionStorage.getItem("nectarMaterialThemeLayout") +
      "]"
      ).prop("checked", true);
  }

  $$("input[name=theme-layout]").on("change", function () {
    if (this.checked) {
      switch ($$(this).val()) {
        case "dark":
        $$("body").removeClass("layout-dark");
        $$("body").addClass("layout-" + $$(this).val());
        break;
        default:
        $$("body").removeClass("layout-dark");
        break;
      }
      sessionStorage.setItem("nectarMaterialThemeLayout", $$(this).val());
    }
  });
});

/*
|------------------------------------------------------------------------------
| Log In
|------------------------------------------------------------------------------
*/

$$('.popup-login').on('popup:closed', function(event) {


  var primeiro_acesso = localStorage.getItem('Usuario.primeiro_acesso')

  if (primeiro_acesso == '1') {
    myApp.confirm('Você precisa alterar sua senha \n Deseja fazer isso agora?', function(){

      mainView.router.loadPage('meus-dados.html')

    })  
    
  }
  
  /* Act on the event */
});

$$('.popup-login').on('popup:opened', function (e, popup) {
  // console.log('About popup opened');

  try{
    $('#loginCPF').val(localStorage.getItem('Login.cpf')).trigger('input')
  }catch(err){
    console.log(err)
  }


  $("form#form-login").validate({

    rules: {

      cpf: {
        required: true,
      },
      senha: {
        required: true
      }
    },
    messages: {
      cpf: {
        required: "Informe seu e-mail.",
      },
      senha: {
        required: "Informe a sua senha."
      }
    },

    onkeyup: false,
    errorElement: "div",
    errorPlacement: function (error, element) {
      error.appendTo(element.parent().siblings(".input-error"));
    },
    submitHandler: function (form) {
      var formData = myApp.formToData("#form-login");

      myApp.showPreloader()

      formData.cpf = $('#loginCPF').cleanVal();

      console.log(request_url)

      $.ajax({
        url: request_url+"/pages/login",
        // url: '/path/to/file',
        type: 'POST',
        dataType: 'json',
        data: {
          'Usuario[cpf]': formData.cpf,
          'Usuario[senha]': formData.senha
        },
      })
      .done(function(data) {
        console.log(data)
        // return false

        if (data.mensagem != null) {
          return myApp.alert('Nenhum usuário encontrado.')
        }

        try{
          localStorage.setItem('Login.cpf', data.Usuario.cpf)
        }catch(erro){
          console.log(erro)
        }

        for (var dados in data.Usuario) {

          if (data.Usuario.hasOwnProperty(dados)) {
            var campo = "Usuario." + dados
            localStorage.setItem(campo, data.Usuario[dados])
          }
        }


        if (data.Usuario.base64_foto != null) {
          $('#fotoUsuario').attr('src', data.Usuario.base64_foto);          
        }else{
          $('#fotoUsuario').attr('src', 'img/default-profile.png');         
          
        }
        var $usuario_nome = $('.user-name')
        var usuario_nome = localStorage.getItem('Usuario.nome_completo')
        $usuario_nome.html(usuario_nome)
        var userTipo = localStorage.getItem('Usuario.usuario_tipo_id')

        console.log(userTipo)
        if(userTipo == 5 || userTipo == 8 ){

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



     myApp.hidePreloader();

     myApp.closeModal('.popup-login')

        // console.log("success");
      })
      // .fail(function() {
        .fail(function (jqXHR, textStatus, errorThrown) {
          // $$('body').html(JSON.stringify(textStatus))

          return myApp.alert('Erro ao entrar. Tente novamente. ' + errorThrown)
          // console.error(textStatus, errorThrown);
        })
        .always(function(data) {
          myApp.hidePreloader();
          console.log(data)
          console.log("complete");
        });



      /*$$.post(
        request_url+"/usuarios/login", {
          'Usuario[cpf]': formData.cpf,
          'Usuario[senha]': formData.senha
        },
        function (data) {

                


          // myApp.alert(data)
          // console.log(data);
        }
        );*/

        return false;
      }
    });



});




myApp.onPageInit('meus-dados', function(page){

  var formData = {
    'nome_completo': localStorage.getItem('Usuario.nome_completo'),
    'email': localStorage.getItem('Usuario.email'),
    'codigo': localStorage.getItem('Usuario.codigo'),
    'cpf': localStorage.getItem('Usuario.cpf'),
    'id': localStorage.getItem('Usuario.id'),
  }

  myApp.formFromData('#dadosUsuario', formData);

  $('#dadosUsuario').validate({

    rules: {
      senha :{
        required:true
      },
      confirma_senha :{
        equalTo:'#senha'
      }
    },

    messages: {
      senha: {
        required: "Senha não pode ser vazia",
      },
      confirma_senha: {
        equalTo: "Senhas não conferem",
      },

    },
    errorPlacement: function (error, element) {
      error.appendTo(element.parent().siblings(".input-error"));
    },

    submitHandler: function (form) {


      var formData = myApp.formToData('#dadosUsuario');

      console.log(formData)
      var id = formData.id
      myApp.showPreloader()
      $.ajax({
        url: request_url+'/usuarios/edit/'+id,
        type: 'POST',
        dataType: 'json',
        data: formData,
      })
      .done(function(data) {

        // console.log(data)
        if (data.error == true) {
          return myApp.alert('Erro ao salvar, tente novamente.')
        }

        localStorage.setItem('Usuario.nome_completo', formData.nome_completo);
        localStorage.setItem('Usuario.email', formData.email);
        localStorage.setItem('Usuario.codigo', formData.codigo);
        localStorage.setItem('Usuario.cpf', formData.cpf);
        localStorage.setItem('Usuario.id', formData.id);
        localStorage.setItem('Usuario.codigo', formData.codigo);


        return myApp.alert('Dados alterados com sucesso.')

        console.log("success");
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        myApp.hidePreloader()
        console.log("complete");
      });

    }
  })




})


myApp.onPageInit("login", function (page) {

  // $("#maskCPF").on("change", function (event) {
    // var value = $(this).val();
    // console.log(value);

    // $("#loginCPF").val();

    // event.preventDefault();
  // });

  /* Show|Hide Password */
  $$(".page[data-page=login] [data-action=show-hide-password]").on(
    "click",
    function () {
      if (
        $$(".page[data-page=login] input[data-toggle=show-hide-password]").attr(
          "type"
          ) === "password"
        ) {
        $$(".page[data-page=login] input[data-toggle=show-hide-password]").attr(
          "type",
          "text"
          );
      $$(this).attr("title", "Hide");
      $$(this).children("i").text("visibility_off");
    } else {
      $$(".page[data-page=login] input[data-toggle=show-hide-password]").attr(
        "type",
        "password"
        );
      $$(this).attr("title", "Show");
      $$(this).children("i").text("visibility");
    }
  }
  );

  /* Validate & Submit Form */
  
});

myApp.onPageInit("novo-cliente-4", function () {

  mask();

  var $buttonfinalizar = $$("#novoCliente4Finalizar");

  var $inputTelefone = $('input[name=telefone]');
  var $inputTelefone2 = $('input[name=info_comercial_telefone_1]');
  var $inputTelefone3 = $('input[name=info_comercial_telefone_2]');
  var $inputTelefone4 = $('input[name=pre_telefone_1]');
  var $inputTelefone5 = $('input[name=pre_telefone_2]');
  

  var $inputCPF = $('input[name=dados_bancarios_cpf]');



  $.getJSON('estados_cidades.json', function (data) {

    var items = [];
    var options = '<option value="">SELECIONE UM ESTADO</option>';  

    $.each(data, function (key, val) {
      options += '<option value="' + val.sigla + '">' + val.nome + '</option>';
    });


    $("#filtroEstado1").html(options); 

    $("#filtroEstado1").change(function () {

      var options_cidades = '<option value="">SELECIONE UMA CIDADE</option>';
      var str = "";         

      $("#filtroEstado1 option:selected").each(function () {
        str += $(this).text();
      });
      $.each(data, function (key, val) {
        if(val.nome == str) {             
          $.each(val.cidades, function (key_city, val_city) {
            options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
          });             
        }
      });
      $("#filtroCidade1").html(options_cidades);

    }).change();    

  });



  $.getJSON('estados_cidades.json', function (data) {

    var items = [];
    var options = '<option value="">SELECIONE UM ESTADO</option>';  

    $.each(data, function (key, val) {
      options += '<option value="' + val.sigla + '">' + val.nome + '</option>';
    });


    $("#filtroEstado2").html(options); 

    $("#filtroEstado2").change(function () {

      var options_cidades = '<option value="">SELECIONE UMA CIDADE</option>';
      var str = "";         

      $("#filtroEstado2 option:selected").each(function () {
        str += $(this).text();
      });
      $.each(data, function (key, val) {
        if(val.nome == str) {             
          $.each(val.cidades, function (key_city, val_city) {
            options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
          });             
        }
      });
      $("#filtroCidade2").html(options_cidades);

    }).change();    

  });


  $.getJSON('estados_cidades.json', function (data) {

    var items = [];
    var options = '<option value="">SELECIONE UM ESTADO</option>';  

    $.each(data, function (key, val) {
      options += '<option value="' + val.sigla + '">' + val.nome + '</option>';
    });


    $("#filtroEstado3").html(options); 

    $("#filtroEstado3").change(function () {

      var options_cidades = '<option value="">SELECIONE UMA CIDADE</option>';
      var str = "";         

      $("#filtroEstado3 option:selected").each(function () {
        str += $(this).text();
      });
      $.each(data, function (key, val) {
        if(val.nome == str) {             
          $.each(val.cidades, function (key_city, val_city) {
            options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
          });             
        }
      });
      $("#filtroCidade3").html(options_cidades);

    }).change();    

  });


  $.getJSON('estados_cidades.json', function (data) {

    var items = [];
    var options = '<option value="">SELECIONE UM ESTADO</option>';  

    $.each(data, function (key, val) {
      options += '<option value="' + val.sigla + '">' + val.nome + '</option>';
    });


    $("#filtroEstado4").html(options); 

    $("#filtroEstado4").change(function () {

      var options_cidades = '<option value="">SELECIONE UMA CIDADE</option>';
      var str = "";         

      $("#filtroEstado4 option:selected").each(function () {
        str += $(this).text();
      });
      $.each(data, function (key, val) {
        if(val.nome == str) {             
          $.each(val.cidades, function (key_city, val_city) {
            options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
          });             
        }
      });
      $("#filtroCidade4").html(options_cidades);

    }).change();    

  });

  $buttonfinalizar.on("click", function (event) {
    // alert(1)
    myApp.showPreloader("Finalizando...");

    var formData = myApp.formToData("#novoCliente4");

    console.log(formData);

    if(formData.info_comercial_empresa_1 == ''){
      myApp.hidePreloader();
      myApp.alert('Informações Comerciais:<br> Inserir Nome da primeira Empresa');
      return false;

    }else if(formData.info_comercial_cidade_1 == ''){

     myApp.hidePreloader();
     myApp.alert('Informações Comerciais:<br> Inserir a cidade primeira Empresa');
     return false;


   }else if(formData.pre_empresa_1 == ''){

     myApp.hidePreloader();
     myApp.alert('Empresas das quais adquiriu suplementos:<br> Inserir Nome da primeira Empresa');
     return false;


   }else if(formData.pre_cidade_1 == ''){

     myApp.hidePreloader();
     myApp.alert('Empresas das quais adquiriu suplementos:<br> Inserir a cidade primeira Empresa');
     return false;




   }




   var clienteValidaCPF = $("#clienteCPF").val();

   if(clienteValidaCPF != ''){

     let novoCPF = clienteValidaCPF.replace('.', '');
     novoCPF = novoCPF.replace('.', '');
     novoCPF = novoCPF.replace('/', '');
     novoCPF = novoCPF.replace('-', '');

     let result  = '';

     if(novoCPF.length <= 11){

      result = clienteValidate.is_cpf(novoCPF);

      if(result == false){
       myApp.hidePreloader();
       myApp.alert('Digite um CPF válido');
       $("#clienteCPF").focus();
       return false
     } 

   }else{

    result = clienteValidate.is_cnpj(novoCPF);
    if(result == false){
      myApp.hidePreloader();
      myApp.alert('Digite um CNPJ válido');
      $("#clienteCPF").focus();
      return false
    } 

  }

}


formData.info_comercial_cidade_1 = formData.info_comercial_cidade_1+'-'+formData.info_comercial_cidade_1_uf;
formData.info_comercial_cidade_2 = formData.info_comercial_cidade_2+'-'+formData.info_comercial_cidade_2_uf;
formData.pre_cidade_1 = formData.pre_cidade_1+'-'+formData.pre_cidade_1_uf;
formData.pre_cidade_2 = formData.pre_cidade_2+'-'+formData.pre_cidade_2_uf;


    // setTimeout(function(){

      var fazenda_id = localStorage.getItem("Fazenda.id");

      $.ajax({
        url: request_url + "/fazendas/edit/" + fazenda_id,
        type: "POST",
        dataType: "json",
        data: {
          id: fazenda_id,

          banco_nome: formData.dados_bancarios_banco,
          dados_bancarios_agencia: formData.dados_bancarios_agencia,
          dados_bancarios_conta: formData.dados_bancarios_conta,
          dados_bancarios_cpf: formData.dados_bancarios_cpf,
          dados_bancarios_titular: formData.dados_bancarios_titular,

          info_comercial_cidade_1: formData.info_comercial_cidade_1,
          info_comercial_cidade_2: formData.info_comercial_cidade_2,
          info_comercial_empresa_1: formData.info_comercial_empresa_1,
          info_comercial_empresa_2: formData.info_comercial_empresa_2,
          info_comercial_telefone_1: formData.info_comercial_telefone_1,
          info_comercial_telefone_2: formData.info_comercial_telefone_2,

          nome_contato: formData.nome_contato,

          pre_empresa_1: formData.pre_empresa_1,
          pre_cidade_1: formData.pre_cidade_1,
          pre_telefone_1: formData.pre_telefone_1,
          

          pre_empresa_2: formData.pre_empresa_2,
          pre_cidade_2: formData.pre_cidade_2,
          pre_telefone_2: formData.pre_telefone_2,


        }
      })
      .done(function (data) {
        // console.log(data);
        if (data.error == false) {
          myApp.modal({
            title: "Cadastro concluído.",
            text: "Deseja cadastrar um pedido para este cliente?",
            buttons: [{
              text: "Sim",
              onClick: function () {
                redirect("novo-pedido-1.html", true);
                localStorage.setItem("newClientePedido", true);
                event.preventDefault();
              }
            },
            {
              text: "Não",
              onClick: function () {
                localStorage.removeItem("newClientePedido");

                gotoMain();

              }
            }
            ]
          });
        }

        // console.log(data);
        console.log("success");
      })
      .fail(function () {
        console.log("error");
      })
      .always(function () {
        myApp.hidePreloader();

        // myApp.hidePreloader()
      });

    // myApp.alert('Cadastro finalizado com sucesso.', function(){
    // gotoMain()

    // })
    // }, 1500)

    event.preventDefault();
  });
});

//  novopedido {}


myApp.onPageInit("novo-pedido", function () {

  var $fotobase64 = $$('#fotobase64')
  var $tirarFotoComprovante = $$('#tirarFotoComprovante')
  var $removeComprovante = $$('#removeComprovante')
  var $liFotoComprovante = $$('#liFotoComprovante')
  var descontoAcima = '';
  var codigo_cliente = '';
  var simulador = localStorage.getItem("Simulador.ativo");
  $removeComprovante.on('click', function(event) {
    $liFotoComprovante.hide()
    $fotobase64.text('')
    $tirarFotoComprovante.removeClass('disabled')
  });

  $tirarFotoComprovante.on('click', function(event) {

    // alert(1)
    var options = {
      targetWidth: 600,
      targetHeight: 600,
      quality:25,
      destinationType: Camera.DestinationType.DATA_URL
    };

     var successCallback = function(imageData){

      var foto = "data:image/jpeg;base64," + imageData

      $fotobase64.text(foto)
      $tirarFotoComprovante.addClass('disabled')
      $liFotoComprovante.show()

      $$('.popup-comprovante').on('popup:opened', function (e, popup) {

        myApp.showPreloader()

        try{
          $('#base64Comprovante').attr('src', foto);          
          myApp.hidePreloader()
        }catch(err){
          myApp.hidePreloader()
          myApp.alert('Imagem indisponível')
        }


      })


    }

    var errorCallback = function(){

    }

    try {

      var obj = null;

      if (typeof(navigator.camera) !== 'undefined') {
        obj = navigator.camera
      }

      if (typeof(window.navigator.camera) !== 'undefined') {
        obj = window.navigator.camera
      }

      obj.getPicture(successCallback, errorCallback, options)

    } catch(err){

      return myApp.alert('Não foi possível abrir a camera, tente novamente. \n\n' + err.message)

    }

    return

    if (navigator.camera) {

      window.navigator.camera.getPicture(successCallback, errorCallback, options)

    }else{
      alert('nao foi possivel')
    }

    event.preventDefault();
    /* Act on the event */
  });

  var $pesquisaPreloader = $$(".preloaderDiv");
  var $btnProximo = $$(".btnProximo");
  var $infoCliente = $$("#infoCliente");
  var $divInfoCliente = $$("#infoPropietario");
  var $infoClienteRoteiroEnderecoEntrega = $$("#infoClienteRoteiroEnderecoEntrega");
  var $selectCliente = $$("#selectCliente");
  var $selectFazenda = $$("#selectFazenda");
  var $listFazendas = $$("#listFazendas");
  var $totalParcela = localStorage.getItem('totalPorParcela');
  var $user_id = localStorage.getItem('Usuario.id');
  var $perfilUsuario = localStorage.getItem('Usuario.usuario_tipo_id');

  var $finalizarPedido = $$("#finalizarPedido");
  
  if ( localStorage.getItem("newClientePedido") ){

    $("#divHolderCliente").show();
    $("#divHolderListCliente").hide();
    $("#PedidoCliente").val(localStorage.getItem("Cliente.nome"));

    var cliente_id = localStorage.getItem("Cliente.id");

  }else{

    $("#divHolderListCliente").show();
    $("#divHolderCliente").hide();

  }
  
  $finalizarPedido.on("click", function (event) {
    if ( localStorage.getItem("newClientePedido") ){

     var cliente_id = localStorage.getItem("Cliente.id");
     codigo_cliente = localStorage.getItem("Cliente.codigo");

   }else{

     var codigo_cliente = $selectCliente.val();
     var cliente_id = $("#selectCliente option:selected").attr("clienteid");

     if(codigo_cliente == 'Selecionar'){

      myApp.alert('selecione um cliente');
      return false
    }
  }


  var pedido_id = localStorage.getItem("Pedido.id")
  var fazenda_id = $('input:radio[name=radiofazenda]:checked').val()
  var pedido_total = localStorage.getItem("Pedido.total_final")
  var observacao = $('#obsPedido').val()
  var fazenda_codigo = '';
  var roteiro = $('#PedidoRoteiro').val()
  var comprovante = '';
  var valorTotalParcela = '';
  var valorMenorQue = 0;
  var simOuNaoGestor = '';


  $.ajax({
    url: request_url+'/pedidos/valorMinimo/',
    async: false,
    type: 'GET',
    dataType: 'json',
  })
  .done(function(data) {
    console.log(data)

    valorTotalParcela = data[0].PedidoValorMinimo.valor_minimo_parcela;

  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });


  $.ajax({
    url: request_url+'/pedidos/info/'+pedido_id,
    async: false,
    type: 'GET',
    dataType: 'json',
    data: {
        // pedido_id: id
      },
    })
  .done(function(data) {
    console.log(data)


    var qtd_vezes =  data.PrazosPagamento.qtd_vezes;
    simOuNaoGestor =  data.PrazosPagamento.aprovacao_gestor;
    var total = 0;
    var frete_com_financeiro = 0;
    $.each(data.ItensPedido, function (index, val) {

      var desc_con = parseFloat(val.total_desconto); 
      console.log(desc_con);

      if(desc_con > 15){

        descontoAcima = 1;
        localStorage.setItem('ativo1', 1)

      }
      

      var total_frete = 0;
      var total_final = 0;
      var subtotal = 0;

      var media_desconto = 0;



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
    var valorParcela = total/qtd_vezes;


    var valorTotalParcelaView = Moeda(valorTotalParcela);

    if(total < valorTotalParcela){

      valorMenorQue = 1;
      myApp.alert('Valor total do pedido não pode ser menor que R$ '+valorTotalParcelaView);

      return false;

    }

    if(valorParcela < valorTotalParcela){

      valorMenorQue = 1;
      myApp.alert('Valor da parcela não pode ser menor que R$ '+valorTotalParcelaView);


      return false;

    }


    console.log("success");
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });


  var finalizada = '1';

  var fazenda_codigo = $selectFazenda.val();

  if ( localStorage.getItem("newClientePedido") ){

   fazenda_codigo = localStorage.getItem("Fazenda.codigo");


 }  
   // console.log(fazenda_codigo)
   // return false
   if(fazenda_codigo == ''){

     myApp.alert('selecione uma fazenda');
     return false
   }

   if(valorMenorQue == 1){

     return false;

   }


   var pedido_status_idGlobal = '';

   if(simOuNaoGestor == 1 || descontoAcima == 1){
    // if(observacao != '' ||  simOuNaoGestor == 1 || descontoAcima == 1){


      if($perfilUsuario == 5){


       pedido_status_idGlobal = 4;

       var request_data = {

        id: pedido_id,
        pedido_status_id: 4,
        cliente_id: cliente_id,
        codigo_cliente: codigo_cliente,
        fazenda_id: fazenda_codigo,
        comprovante: $fotobase64.text(),
        roteiro:roteiro,
        observacao:observacao,
        descontoAcima:descontoAcima,
        totalParcela:$totalParcela,
        finalizada:finalizada,
        user_id:$user_id,
        valor_pedido:pedido_total,

      }


    }else{



      pedido_status_idGlobal = 1;

      var request_data = {
        id: pedido_id,
        pedido_status_id: 1,
        cliente_id: cliente_id,
        codigo_cliente: codigo_cliente,
        fazenda_id: fazenda_codigo,
        comprovante: $fotobase64.text(),
        roteiro:roteiro,
        observacao:observacao,
        descontoAcima:descontoAcima,
        totalParcela:$totalParcela,
        finalizada:finalizada,
        user_id:$user_id,
        valor_pedido:pedido_total,
      }


    }

  }else{


    pedido_status_idGlobal = 4;

    var request_data = {

      id: pedido_id,
      pedido_status_id: 4,
      cliente_id: cliente_id,
      codigo_cliente: codigo_cliente,
      fazenda_id: fazenda_codigo,
      comprovante: $fotobase64.text(),
      roteiro:roteiro,
      observacao:observacao,
      descontoAcima:descontoAcima,
      totalParcela:$totalParcela,
      finalizada:finalizada,
      user_id:$user_id,
      valor_pedido:pedido_total,


    }





  }



 // simulador

    // return console.log(request_data)


    $.ajax({
      url: request_url + "/pedidos/edit/" + pedido_id,
      type: "POST",
      dataType: "json",
      data: request_data
    })
    .done(function (data) {


      if( !localStorage.getItem("newClientePedido") ){
        localStorage.removeItem('Cliente.id')
        localStorage.removeItem('newClientePedido')
      }

      if(pedido_status_idGlobal == 1){
       myApp.alert("Pedido Aguardando aprovação do gestor comercial!");
     }

     if(pedido_status_idGlobal == 4){


      $.ajax({
        url: request_url+'/pedidos/enviar_email/'+pedido_id,
        type: 'post',
        dataType: 'json',
        data: {
                        // param1: 'value1'
                      },
                    })
      .done(function(data) {

        console.log('email enviado')
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {

       console.log("complete");
     });


    }


    myApp.alert("Pedido finalizado com sucesso", function () {

      localStorage.removeItem("Pedido.id");
      localStorage.removeItem("newClientePedido");
      localStorage.removeItem("Cliente.id");
      window.location.href = "index.html";


          // gotoMain()
          // gotoMain()
        });

    console.log("success");
  })
    .fail(function () {
      console.log("error");
    })
    .always(function () {
      myApp.hidePreloader();
      console.log("complete");
    });





    event.preventDefault();
    /* Act on the event */
  });

$infoClienteRoteiroEnderecoEntrega.hide();

var clienteData = null;
var pedido_id = localStorage.getItem("Pedido.id");
var grupo_clientes_id = localStorage.getItem("Usuario.codigo");



function listarFazenda(cliente_id) {

  $.ajax({
   url: request_url + "/clientes/view_fazendas/" + cliente_id,
   type: 'GET',
   dataType: 'json',
 })
  .done(function(data) {
    console.log(data);
    
    var fazendaOptions = '<option  value="" index=""></option>';
    $$.each(data, function (index, val) {
      fazendaOptions +=
      '<option  value="' + val.Fazenda.codigo + '" index="' + index + '">' +
      val.Fazenda.nome_completo+' - '+val.Fazenda.inc_estadual_rural+' - '+val.Fazenda.cidade+'/'+val.Fazenda.estado+
      "</option>";
    });

    $selectFazenda.html(fazendaOptions);

  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });
  
}


myApp.showPreloader("Carregando...");





$.ajax({
  url: request_url + "/clientes/listarporregiao/"+grupo_clientes_id,
  type: "GET",
  dataType: "json"
})
.done(function (data) {
  clienteData = data.data;
  var clienteOptions = "";
  console.log(clienteData)
  $$.each(clienteData, function (index, val) {
    clienteOptions +=
    '<option clienteId =  "' + val.Cliente.id + '" value="' + val.Cliente.codigo + '" index="' + index + '">' +
    val.Cliente.nome_completo +
    "</option>";
  });

  $selectCliente.append(clienteOptions).on("change", function (event) {
    $('#titulo-after').text('')
    $('#titulo-after').val('')
    var cliente_id = $("option:selected").attr("value");
    listarFazenda(cliente_id)
      // alert('1')
      var index = $("option:selected").attr("index");
      var cliente_id = index;

      if (index == "") {
        return;
      }

      var cliente = clienteData[cliente_id];


      $$("#ProprietarioNome").val(cliente.Cliente.nome_completo).trigger("blur");
      $$("#ProprietarioEndereco").val(cliente.Cliente.logradouro).trigger("blur");
      $$("#ProprietarioBairro").val(cliente.Cliente.bairro).trigger("blur");
      $$("#ProprietarioNumero").val(cliente.Cliente.numero).trigger("blur");
      $$("#ProprietarioCidade").val(cliente.Cliente.cidade).trigger("blur");
      $$("#ProprietarioEstado").val(cliente.Cliente.estado).trigger("blur");
      $$("#ProprietarioCEP").val(cliente.Cliente.cep).trigger("blur");
      $$("#ProprietarioEmail").val(cliente.Cliente.email).trigger("blur");

      var options = "";

      $$("#fazendasCliente").show();

      if (cliente.Fazenda.length == 0){

        options +=
        "<li>" +
        '<label class="label-radio item-content">' +
        '<input type="radio" checked name="radiofazenda" value="' + cliente.Cliente.id + '">' +
        '<span class="item-media">' +
        '<i class="icon icon-form-radio"></i>' +
        "</span>" +
        '<span class="item-inner">' +
        '<span class="item-title">' +
        'FAZENDA PRÓPRIA' +
        "</span>" +
        "</span>" +
        "</label>" +
        "</li>";


          // return myApp.alert("Cliente não possui nenhuma fazenda.");
        }

        $$.each(cliente.Fazenda, function (index2, val2) {
          options +=
          "<li>" +
          '<label class="label-radio item-content">' +
          '<input type="radio" name="radiofazenda" value="' +
          index2 +
          '">' +
          '<span class="item-media">' +
          '<i class="icon icon-form-radio"></i>' +
          "</span>" +
          '<span class="item-inner">' +
          '<span class="item-title">' +
          val2.nome_completo +
          "</span>" +
          "</span>" +
          "</label>" +
          "</li>";
        });

        $listFazendas.html(options).on("change", function (event) {

          if (cliente.Fazenda.length == 0) {

            // $$("#FazendaEndereco").val(cliente.Cliente.logradouro).trigger("blur");
            // $$("#FazendaBairro").val(cliente.Cliente.bairro).trigger("blur");
            // $$("#FazendaNumero").val(cliente.Cliente.numero).trigger("blur");
            // $$("#FazendaCidade").val(cliente.Cliente.cidade).trigger("blur");
            // $$("#FazendaEstado").val(cliente.Cliente.estado).trigger("blur");
            // $$("#FazendaRoteiro").val(cliente.Cliente.roteiro).trigger("change");
            
            return console.log(cliente)
          }

          // return alert(cliente.Fazenda.length)

          $btnProximo.removeClass("disabled");
          $infoClienteRoteiroEnderecoEntrega.show();

          var fazendaindex = $("input[name=radiofazenda]:checked").val();

          $$("#FazendaEndereco").val(cliente.Fazenda[fazendaindex].logradouro).trigger("blur");
          $$("#FazendaBairro").val(cliente.Fazenda[fazendaindex].bairro).trigger("blur");
          $$("#FazendaNumero").val(cliente.Fazenda[fazendaindex].numero).trigger("blur");
          $$("#FazendaCidade").val(cliente.Fazenda[fazendaindex].cidade).trigger("blur");
          $$("#FazendaEstado").val(cliente.Fazenda[fazendaindex].estado).trigger("blur");
          $$("#FazendaRoteiro").val(cliente.Fazenda[fazendaindex].roteiro).trigger("change");

          event.preventDefault();
        });

        // $infoClienteRoteiroEnderecoEntrega.show();
        $divInfoCliente.show();
        $infoCliente.show();
        event.preventDefault();
      });

  console.log("success");
})
.fail(function () {
      // console.log("error");
    })
.always(function () {
  myApp.hidePreloader();
});

if (pedido_id == 'null') {
  myApp.showPreloader("Carregando...");

  $.ajax({
    url: request_url + "/pedidos/novo",
    type: "post",
    dataType: "json",
    data: {
      usuario_id: 1
    }
  })
  .done(function (data) {
    var data = data.data;
    console.log('pedido novo')

    localStorage.setItem("Pedido.id", data.Pedido.id)
    pedido_id = data.Pedido.id
  })
  .fail(function () {
    console.log("error");
  })
  .always(function () {
    myApp.hidePreloader();
  });
}

$("input[name=radio]").on("change", function (event) {
  $infoClienteRoteiroEnderecoEntrega.show();
});

$infoClienteRoteiroEnderecoEntrega.hide();
$infoCliente.hide();
$pesquisaPreloader.hide();
$btnProximo.addClass("disabled");

});

/*
|------------------------------------------------------------------------------
| Contacts List
|------------------------------------------------------------------------------
*/

myApp.onPageInit("pesquisar-cliente", function (page) {
  mask();
  var grupo_clientes_id = localStorage.getItem('Usuario.codigo');
  var $clienteList = $$("#clienteList");

  $.getJSON('estados_cidades.json', function (data) {

    var items = [];
    var options = '<option value="">SELECIONE UM ESTADO</option>';  

    $.each(data, function (key, val) {
      options += '<option value="' + val.sigla + '">' + val.nome + '</option>';
    });


    $("#filtroEstado").html(options); 

    $("#filtroEstado").change(function () {

      var options_cidades = '<option value="">SELECIONE UMA CIDADE</option>';
      var str = "";         

      $("#filtroEstado option:selected").each(function () {
        str += $(this).text();
      });
      $.each(data, function (key, val) {
        if(val.nome == str) {             
          $.each(val.cidades, function (key_city, val_city) {
            options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
          });             
        }
      });
      $("#filtroCidade").html(options_cidades);

    }).change();    

  });


  $('#limparFiltros').on('click', function(event) {

    $('#filtroCPF').val(''),
    $('#filtroNome').val(''),
    $('#filtroEstado').val(''),
    $('#filtroCidade').val(''),

    event.preventDefault();
    /* Act on the event */
  });

  var filtros = {
    cnpj:'',
    nome:'',
    estado:'',
    cidade:'',
  };

  // usuario_id = 56051

  $$('#tab1').on('tab:show', function () {
      // myApp.alert('Tab 1 is visible');
    });



  $('#aplicarFiltros').on('click', function(event) {


    var clienteValidaCPF = $("#filtroCPF").val();

    let novoCPF = clienteValidaCPF.replace('.', '');
    novoCPF = novoCPF.replace('.', '');
    novoCPF = novoCPF.replace('/', '');
    novoCPF = novoCPF.replace('-', '');

    var filtros = {
      cnpj:novoCPF,
      nome:$('#filtroNome').val(),
      estado:$('#filtroEstado').val(),
      cidade:$('#filtroCidade').val(),
    };





    myApp.showTab('#tab1');
    myApp.showPreloader("Carregando...");
    cliente.load($clienteList, {
      grupo_clientes_id:grupo_clientes_id,
      cnpj:filtros.cnpj,
      nome:filtros.nome,
      estado:filtros.estado,
      cidade:filtros.cidade,
    })

  });

  myApp.showPreloader("Carregando...");

  cliente.load(
    $clienteList,  
    {
      grupo_clientes_id:grupo_clientes_id,
      cnpj:filtros.cnpj,
      nome:filtros.nome,
      estad:filtros.estad,
      cnpj:filtros.cnpj,

    }
    )

});


myApp.onPageInit("pesquisar-cliente-2", function (page) {
  mask();
  var grupo_clientes_id = localStorage.getItem('Usuario.codigo')
  var $clienteList = $$("#clienteList");


  $.getJSON('estados_cidades.json', function (data) {

    var items = [];
    var options = '<option value="">SELECIONE UM ESTADO</option>';  

    $.each(data, function (key, val) {
      options += '<option value="' + val.sigla + '">' + val.nome + '</option>';
    });

    $("#filtroEstado").html(options); 
    $("#filtroEstado").change(function () {

      var options_cidades = '<option value="">SELECIONE UMA CIDADE</option>';
      var str = "";         

      $("#filtroEstado option:selected").each(function () {
        str += $(this).text();
      });

      $.each(data, function (key, val) {

        if(val.nome == str) {             
          $.each(val.cidades, function (key_city, val_city) {
            options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
          });             
        }
      });

      $("#filtroCidade").html(options_cidades);

    }).change();    


  });


  $('#limparFiltros').on('click', function(event) {
    $('#filtroCPF').val(''),
    $('#filtroNome').val(''),
    $('#filtroEstado').val(''),
    $('#filtroCidade').val(''),
    event.preventDefault();
    /* Act on the event */
  });


  var filtros = {
    cnpj:'',
    nome:'',
    estado:'',
    cidade:'',
  };

  // usuario_id = 56051

  $$('#tab1').on('tab:show', function () {
      // myApp.alert('Tab 1 is visible');
    });



  $('#aplicarFiltros').on('click', function(event) {

    var clienteValidaCPF = $("#filtroCPF").val();

    let novoCPF = clienteValidaCPF.replace('.', '');
    novoCPF = novoCPF.replace('.', '');
    novoCPF = novoCPF.replace('/', '');
    novoCPF = novoCPF.replace('-', '');


    var filtros = {
      cnpj:novoCPF,
      nome:$('#filtroNome').val(),
      estado:$('#filtroEstado').val(),
      cidade:$('#filtroCidade').val(),
    };


    myApp.showTab('#tab1');
    myApp.showPreloader("Carregando...");
    clienteFazenda.load($clienteList, {
      grupo_clientes_id:grupo_clientes_id,
      cnpj:filtros.cnpj,
      nome:filtros.nome,
      estado:filtros.estado,
      cidade:filtros.cidade,
    })

  });


  myApp.showPreloader("Carregando...");

  clienteFazenda.load(
    $clienteList,  
    {
      grupo_clientes_id:grupo_clientes_id,
      cnpj:filtros.cnpj,
      nome:filtros.nome,
      estad:filtros.estad,
      cnpj:filtros.cnpj,

    }
    )

});


myApp.onPageInit("novo-pedido-2", function () {

  myApp.hidePreloader();
  var $iconeCarrinho = $("#iconeCarrinho");
  var $validaPrecoParcela = $("#valida-preco-parcela");

  $iconeCarrinho.on('click', function(event) {
    // $(this).addClass('disabled')
    var pedido_id = localStorage.getItem('Pedido.id')
    pedido.getPreview(pedido_id, $("#modalPreVisualizacao") )

    event.preventDefault();
    /* Act on the event */
  });


  $validaPrecoParcela.on('click', function(event) {


    mainView.router.loadPage("novo-pedido-3.html");

    var id = localStorage.getItem('Pedido.id')

    $.ajax({
      url: request_url+'/pedidos/info/'+id,
      type: 'GET',
      dataType: 'json',
      data: {
        // pedido_id: id
      },
    })
    .done(function(data) {

      console.log(data)
      var total_frete = 0;
      var total_final = 0;
      var subtotal = 0;
      var frete_com_financeiro = 0;
      var media_desconto = 0;
      var total = 0;
      var parcelas = ''
      if(data.Pedido.forma_pagamento == 2 ){
        console.log('igual a 2');

        if(data.Pedido.num_parcelas == 5){
          parcelas = 1;
        }else  if(data.Pedido.num_parcelas == 1){
         parcelas = 2;
       }else  if(data.Pedido.num_parcelas == 10){
        parcelas = 3;
      }else  if(data.Pedido.num_parcelas == 11){
       parcelas = 4;
     }

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

     total = parseFloat(total).toFixed(2);

     console.log(total);


     var valida = total/parcelas;

     localStorage.setItem('totalPorParcela',valida)

   }
 })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
     mainView.router.loadPage("novo-pedido-3.html");
     console.log("complete");
   });


  });


  var tipo_frete = localStorage.getItem('Pedido.tipo_frete')

    // console.log('tipo_frete', tipo_frete)
    if (tipo_frete == 'fob') {
      $('#itemPrecoFrete').attr('disabled', 'disabled');

    }

    var $listProdutoTabela = $("#listProdutoTabela");
    var options = '<option value="">Selecione</option>';
    var $tabelaDePrecos = $("#tabelaDePrecos");
    var $btnAdicionaItem = $("#btnAdicionaItem");
    var produtosList = null;

    var tabela_id = $$(this).val();
    tabela_id = localStorage.getItem('Pedido.tabela_id');

    myApp.showPreloader("Carregando");
    $.ajax({
      url: request_url + "/tabeladeprecos/lista_produtos/"+tabela_id,
      type: "GET",
      dataType: "json"
    })
    .done(function (response) {

      console.log(response.data)

      var listItems = "";
      produtosList = response.data;

      myApp.hidePreloader();
      if (produtosList.length == 0) {
        myApp.alert("Esta tabela não possui nenhum produto.");
      }

    // console.log(produtosList);

    $$.each(produtosList.TabelaDePrecoProduto, function (index, val) {

      var nome_1 = '';
      var nome_2 = '';
      if(val.Produto != ''){
        
      try{
        nome_1 = val.Produto.nome.split('-')[0];
        nome_2 = val.Produto.nome.split('-')[1];
      }catch(err){
        nome_1 = val.Produto.nome;
        nome_2 = '';
      }
      console.log(val.Produto)
      listItems +=
      '<li index="' + index + '">' +
      '<a href = "#"  class=" link item-link item-content">' +
      '<div class="item-media">' +
      '<img src="img/connan-default.jpg" width="44">' +
      "</div>" +

      '<div class="item-inner">' +
      '<div class="item-title-row">' +
      '<div class="item-title">' +
      nome_1  +
      "</div>" +

      '<div class="item-title">' +
      nome_2  +
      "</div>" +

      '<div class="item-subtitle">' +
      val.Produto.codigo +
      "</div>" +
      "</div>" +
      "</div>" +
      "</a>" +
      "</li>";
      }
    });

    $listProdutoTabela.html("").html(listItems).on("click", "li", function (event) {
      var index = $$(this).attr("index");
      var itemLista = produtosList.TabelaDePrecoProduto[index];
      var aliquota = localStorage.getItem('Pedido.valor_imposto')
      var preco_produto = 0;

      // console.log(itemLista)

      $("#itemNome").html(itemLista.Produto.nome);
      $("#itemDescricao").html(itemLista.Produto.descricao);
      $("#itemId").html(itemLista.Produto.listProdutoTabela);
      $("#itemId").val(itemLista.Produto.codigo);
      $("#itemCarrinhoId").val('')

      switch (aliquota) {
        case '2.8':
        preco_produto = itemLista.aliq28
        break;
        case '4.8':
        preco_produto = itemLista.aliq48
        break;
        case '6.8':
        preco_produto = itemLista.aliq68
        break;
        case '7.2':
        preco_produto = itemLista.aliq72
        break;
        case '0.0':
        preco_produto = itemLista.preco_tabela
        break;
        default:
        preco_produto = itemLista.aliq72
        break;

      }


      itemLista.preco_tabela = preco_produto;

      $("#itemPrecoTabela").val(itemLista.preco_tabela).attr("readonly", "readonly");
      $("#itemPrecoFrete").val('0.0');

      var porcentagem_calculo1 = 6 / 100;
      var total_dias_pagamento1 = 0;
      if (localStorage.getItem('Pagamento.totaldias') != null) {

        total_dias_pagamento1 = parseFloat( localStorage.getItem('Pagamento.totaldias') )

      }
      var base_calculo1 = porcentagem_calculo1 * total_dias_pagamento1 / 100;
      var valorFinal1 = itemLista.preco_tabela+(base_calculo1 +1);
      valorFinal1 = parseFloat(valorFinal1);
      valorFinal1 = valorFinal1.toFixed(2)

      $("#itemPrecoNego1").val(valorFinal1).attr("readonly", false);
      $("#itemPrecoNegociado").attr("readonly", 'readonly');
          // calculo ICMS



          $$("#itemQuantidade, #itemPercentDesconto, #itemPrecoFrete, #itemPrecoNego1").on("keyup", function (event) {



            var total = 0;



            var itemPrecoNego1 = $("#itemPrecoNego1").val();
            var quantidade = $("#itemQuantidade").val();

            var preco_unit_tabela = $("#itemPrecoTabela").val();
            var preco_frete = $("#itemPrecoFrete").val();
            var desconto = $("#itemPercentDesconto").val();

            var prazo = localStorage.getItem("Pedido.prazo");

            var tabela_id = localStorage.getItem("Pedido.tabela_id");
            var forma_pagamento = localStorage.getItem("Pedido.forma_pagamento");
            var num_parcelas = localStorage.getItem("Pedido.num_parcelas");

            var percentual = $$("#itemPercentDesconto").val();

            var total_item = 0;
            var total_frete = 0;

            var porcentagem_calculo = 6 / 100;

            var total_dias_pagamento = 0;



            if ($("#itemPrecoNego1").is(":focus")) {



             if (localStorage.getItem('Pagamento.totaldias') != null) {

              total_dias_pagamento = parseFloat( localStorage.getItem('Pagamento.totaldias') )

            }



            var Debugpreco_unit_tabela = $("#itemPrecoTabela").val();
            var preco_unit_tabela = $("#itemPrecoNego1").val();

            var base_calculo = porcentagem_calculo * total_dias_pagamento / 100;

            var total_item_sem_desconto = preco_unit_tabela * quantidade;
            
            // var total_desconto_item = total_item_sem_desconto * desconto / 100;
            // var total_desconto_item = total_item_sem_desconto * desconto / 100;

            // var total_item_com_desconto = total_item_sem_desconto - total_desconto_item;
            var total_item_com_desconto = total_item_sem_desconto ;

            var total_com_financeiro = total_item_com_desconto * (base_calculo + 1);

            // console.log(base_calculo+1)
            // console.log(total_com_financeiro)

            var total_frete = preco_frete * quantidade;

            var total_frete_com_financeiro = (preco_frete * quantidade) * (base_calculo + 1);
            var total_frete = total_frete_com_financeiro;


            var Debugtotal_frete = Debugpreco_unit_tabela * quantidade;

            console.log(total_item_sem_desconto)
            console.log(Debugtotal_frete)


            var calcTeste =  total_item_sem_desconto / Debugtotal_frete;
            var calcTestedec = calcTeste.toFixed(2);
            var calcTeste2 = calcTestedec * 100;
            var calcTesteFim =  100 - calcTeste2;


            console.log(calcTesteFim)

            var valorFinalCalculo = total_com_financeiro + total_frete;

            $("#itemPrecoNegociadoComFrete").val(valorFinalCalculo.toFixed(2));
            $("#itemPercentDesconto").val(calcTesteFim);

            $("#itemPrecoNegociado").val(total_com_financeiro.toFixed(2));

            $("#itemPrecoFreteTotal").val(total_frete.toFixed(2));


          }else{


           if (localStorage.getItem('Pagamento.totaldias') != null) {

            total_dias_pagamento = parseFloat( localStorage.getItem('Pagamento.totaldias') )

          }


          var base_calculo = porcentagem_calculo * total_dias_pagamento / 100;

          var total_item_sem_desconto = preco_unit_tabela * quantidade;

          var total_desconto_item = total_item_sem_desconto * desconto / 100;

          var total_item_com_desconto = total_item_sem_desconto - total_desconto_item;

          var total_com_financeiro = total_item_com_desconto * (base_calculo + 1);

          var total_frete = preco_frete * quantidade;

          var total_frete_com_financeiro = (preco_frete * quantidade) * (base_calculo + 1);
          var total_frete = total_frete_com_financeiro;

          var valorFinalCalculo = total_com_financeiro + total_frete;

          $("#itemPrecoNegociadoComFrete").val(valorFinalCalculo.toFixed(2));
          $("#itemPrecoNegociado").val(total_com_financeiro.toFixed(2));

          $("#itemPrecoFreteTotal").val(total_frete.toFixed(2));
          var desconto_fim = (desconto/100) * preco_unit_tabela;
          var desconto_fim2 = preco_unit_tabela - desconto_fim
          var desconto_fim3 = desconto_fim2 * (base_calculo + 1)

            // console.log(desconto_fim2)
            $("#itemPrecoNego1").val(desconto_fim3.toFixed(2));



          }



        });

$("#itemPrecoTabela").html(itemLista.Produto.descricao);
$('#btnAdicionaItem').html('Adicionar ao carrinho')

myApp.popup(".popup-produtoinfo", true);

event.preventDefault();
/* Act on the event */
});
})
.fail(function () {
  console.log("error");
})
.always(function () {});

$btnAdicionaItem.on("click", function (event) {

  var data = {

    preco_unitario_tabela: $("#itemPrecoTabela").val(),
    preco_negociado: $("#itemPrecoNegociado").val(),
    preco_frete: $("#itemPrecoFreteTotal").val(),
    pedido_id: localStorage.getItem("Pedido.id"),
    quantidade: $("#itemQuantidade").val(),
    produto_id: $("#itemId").val(),
    percentual: $$("#itemPercentDesconto").val(),
    frete_total: $("#itemPrecoFreteTotal").val(),
    item_preco_frete: $("#itemPrecoFrete").val(),
    cart_id: $("#itemCarrinhoId").val(),
    produto_codigo: $("#itemId").val(),


  };  

  var item_preco_frete = parseFloat(data.item_preco_frete)
  var tipo_frete = localStorage.getItem('Pedido.tipo_frete')



  if (item_preco_frete == 0) {

    if (tipo_frete == 'cif') {


      return myApp.alert('Para fretes CIF é obrigatório o preço do frete')
      
    }

  }

  var cart_id = $("#itemCarrinhoId").val();
  var preco_unitario_tabela = $("#itemPrecoTabela").val();
  var preco_negociado = $("#itemPrecoNegociado").val();
  var preco_unit_negociado = $("#itemPrecoNego1").val();
  var preco_frete = $("#itemPrecoFreteTotal").val();
  var pedido_id = localStorage.getItem("Pedido.id");
  var quantidade = $("#itemQuantidade").val();
  var produto_id = $("#itemId").val();
  var percentual = $$("#itemPercentDesconto").val();
  var frete_total = $("#itemPrecoFreteTotal").val();
  var item_preco_frete = $("#itemPrecoFrete").val();
  var produto_codigo = $("#itemId").val();


  myApp.showPreloader();

  $.ajax({
    url: request_url + "/ItensPedidos/add",
    type: "POST",
    dataType: "json",
    data: {
      id: cart_id,
      produto_id: produto_id,
      preco_unitario_tabela: preco_unitario_tabela,
      preco_negociado: preco_negociado,
      valor_frete_saca:item_preco_frete,
      produto_codigo: produto_codigo,
      preco_frete: frete_total,
      quantidade: quantidade,
      preco_unit_negociado: preco_unit_negociado,
      pedido_id: pedido_id,
      total_desconto: percentual,
        // obs_item: obs_item
      }
    })
  .done(function () {

    var toast = myApp.toast(
      "Produto adicionado",
      '<i class="fa fa-check"></i>'
      );

    $("#itemObs").val('');
    $("#itemPercentDesconto").val(0);
    $("#itemPrecoNego1").val(0);
    $("#itemQuantidade").val(0);
    $("#itemPrecoFrete").val(0);
    $("#itemPrecoFreteTotal").val(0.00);
    $("#itemPrecoNegociado").val(0.00);
    $("#itemPrecoNegociadoComFrete").val(0.00);
      // $("#itemPrecoNegociado").text("0.00");

      toast.show();

      console.log("success");
    })
  .fail(function (jqXHR, textStatus, errorThrown) {
    console.error(textStatus, errorThrown);
  })
  .always(function () {
    myApp.hidePreloader();
    myApp.closeModal(".popup-produtoinfo", true);
  });

  event.preventDefault();
  /* Act on the event */
});





$('#close-modal-1').on("click", function (event) {

  $("#itemObs").val('');
  $("#itemPercentDesconto").val(0);
  $("#itemPrecoNego1").val(0);
  $("#itemQuantidade").val(0);
  $("#itemPrecoFrete").val(0);
  $("#itemPrecoFreteTotal").val(0.00);
  $("#itemPrecoNegociado").val(0);
  $("#itemPrecoNegociadoComFrete").val(0);

});

return;

});

myApp.onPageInit("minhas-simulacoes", function (event) {
  var usuario_id = localStorage.getItem("Usuario.id");
  var $pedidoList = $$("#pedidosList");

  myApp.showPreloader("Carregando...");

  $.ajax({
    url: request_url + "/pedidos/index/sort:created/direction:desc",
    type: "GET",
    dataType: "json",
    data: {
      usuario_id: usuario_id,
      pedido_status_id: 23
    }
  })
  .done(function (data) {
    if (data.length == 0) {
      return myApp.alert("Nenhuma simulação encontrada.");
    }

    var pedidoListHtml = "";

    $.each(data, function (index, val) {
      var item =
      '<li data-pedido-id="' + val.Pedido.id + '">' +
      '<a href="#" class="item-link item-content">' +
      '<div class="item-inner">' +
      '<div class="item-title-row">' +
      '<div class="item-title">' +
      val.Pedido.created.split(" ")[0] +
      "</div>" +
          // '<div class="item-after">' + val.Pedido.created.split(' ')[0] + '</div>' +
          "</div>" +
          '<div class="item-subtitle">' + val.Pedido.simulacao_referencia + '</div>' +
          '<div class="item-text">' +
          '<div class="chip chip-small">' +
          '<div class="chip-media bg-lightgreen">' +
          '<i class="fa fa-check"></i>' +
          "</div>" +
          '<div class="chip-label">' +
          val.Status.nome +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</a>" +
          "</li>";

          pedidoListHtml += item;
        });

      // console.log(pedidoListHtml)
      $pedidoList.html(pedidoListHtml).on("click", "li", function (event) {
        var $li = $(this);
        var pedido_id = $li.attr("data-pedido-id");
        // alert(pedido_id)

        var buttons = [{
          text: "Vincular Cliente",
          color: "green",
          onClick: function () {
            localStorage.setItem("Pedido.id", pedido_id);
            mainView.router.loadPage("novo-pedido.html");
            event.preventDefault();
          },
          bold: true
        },
        {
          text: "Ver Detalhes",
          onClick: function () {
            localStorage.setItem("Pedido.id", pedido_id);
            localStorage.setItem("Pedido.detalhes", "1");
            localStorage.setItem("Pedido.detalhesAprovacao", "1");
            mainView.router.loadPage("novo-pedido-3.html");
            event.preventDefault();
          },
          bold: true
        },
        {
          text: "Deletar",
          onClick: function () {
            $li.fadeOut(400, function () {
              $.ajax({
                url: request_url + "/pedidos/delete/" + pedido_id,
                type: "POST",
                dataType: "json",
                data: {
                  id: pedido_id
                }
              })
              .done(function () {
                console.log("success");
              })
              .fail(function () {
                console.log("error");
              })
              .always(function () {
                console.log("complete");
              });
            });
          },
          color: "red"
        }
        ];

        myApp.actions(buttons);

        // alert('gotopedidodetail')

        event.preventDefault();
        /* Act on the event */
      });

      console.log("success");
    })
  .fail(function () {
    console.log("error");
  })
  .always(function () {
    myApp.hidePreloader();
  });
});

myApp.onPageInit("meus-pedidos", function (event) {


  // mask();
  
// Mascara de CPF e CNPJ
var CpfCnpjMaskBehavior = function (val) {
  return val.replace(/\D/g, '').length <= 11 ? '000.000.000-009' : '00.000.000/0000-00';
},
cpfCnpjpOptions = {
  onKeyPress: function(val, e, field, options) {
    field.mask(CpfCnpjMaskBehavior.apply({}, arguments), options);
  }
};

$(function() {
  $(':input[name=cpfCnpj]').mask(CpfCnpjMaskBehavior, cpfCnpjpOptions);
})




var usuario_id = localStorage.getItem("Usuario.id");
var $pedidoList = $("#pedidosList");



$.getJSON(request_url+'/pedidos/getStatus',function(data){

  $.each(data, function(index) {

    var select ="<option value="+data[index].Status.id+">  "+data[index].Status.nome+" </option>";
  // <option value='volvo'>Volvo </option>
  $("#status_pedido").append(select);

});
});


$('#aplicar-filtro').on('click', function(event) {




  var status = [];

  var total = $('#status_pedido')[0].selectedOptions.length;
  var documento = $('#cpf-pedido-cliente').val();

  if(total == '' && documento == '' ){

    return myApp.alert('Selecione alguma opção para realizar o filtro!');
  }

  myApp.showTab('#tab1');
  for (var i = 0 ; i < total; i++) {

    status.push($('#status_pedido')[0].selectedOptions[i].value);


  }


  myApp.showPreloader("Carregando...");

  $.ajax({
    url: request_url + "/pedidos/getFiltros",
    type: "GET",
    dataType: "json",
    data: {
      usuario_id: usuario_id,
      documento: documento,
      status:status
    }
  })
  .done(function (data) {

    console.log(data)
    var pedidoListHtml = "";

    if (data.length == 0) {
      return myApp.alert("Nenhum pedido encontrado.", function () {
        myApp.showTab('#tab2');
      });
    }



    $.each(data, function (index, val) {


     var total = 10 - val.Pedido.id.length;

     var pedido_cod = '';

     for ( var i = 1; i <= total; i++ ) {

      pedido_cod += '0';

    }

    var pedido_cod_fim = pedido_cod+val.Pedido.id
    

    var hora_pedido = val.Pedido.created.split(" ")[1];
    hora_pedido =  hora_pedido.split(":");

    var data_pedido = val.Pedido.created.split(" ")[0]
    data_pedido = data_pedido.split('-');
    console.log(data_pedido)

    if(val.Cliente.id != null){

      if( val.Pedido.pedido_status_id == 1  || val.Pedido.pedido_status_id == 15  || val.Pedido.pedido_status_id == 16 || val.Pedido.pedido_status_id == 6  || val.Pedido.pedido_status_id == 10 ){

        var color_bg = 'bg-yellow';
        var fa_icon = 'fa-check';

      }else if( val.Pedido.pedido_status_id == 3 ||  val.Pedido.pedido_status_id == 8 ||  val.Pedido.pedido_status_id == 12 ||  val.Pedido.pedido_status_id == 22  ){
        var color_bg = 'bg-red';
        var fa_icon = 'fa-times';
      }else{    
        var color_bg = 'bg-lightgreen';
        var fa_icon = 'fa-check';
      }



      var item =
      '<li data-pedido-id = "' + val.Pedido.id + '" data-pedido-status =" ' + val.Status.id + ' ">' +
      '<a href="#" class="item-link item-content">' +
      '<div class="item-inner">' +
      '<div class="item-title-row">' +
      '<div class="item-title">' +
      (val.Cliente.nome_completo == null ?
        "Cliente não vinculado" :
        val.Cliente.nome_completo) +
      "</div>" +

      '<div class="item-after">' +
      data_pedido[2]+'/'+data_pedido[1]+'/'+data_pedido[0]  + ' '+ hora_pedido[0]+':'+hora_pedido[1] +
      "</div>" +
      "</div>" +
      '<div class="item-subtitle">' +
      (val.Cliente.telefone == null ? "" : val.Cliente.telefone) +
      "</div>" +
      '<div class="item-subtitle">' +
      (val.Pedido.id == null ? "" : pedido_cod_fim) +
      "</div>" +

      '<div class="item-text">' +
      '<div class="chip chip-small">' +
      '<div class="chip-media '+color_bg+' ">' +
      '<i class="fa '+fa_icon+'"></i>' +
      "</div>" +
      '<div class="chip-label">' +
      (val.Status.nome == null ? "" : val.Status.nome) +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +

      "</a>" +
      "</li>";

      pedidoListHtml += item;
    }
  });

      // console.log(pedidoListHtml)
      $pedidoList.html("").append(pedidoListHtml).on("click", "li", function (event) {
        var $li = $(this);
        var pedido_id = $li.attr("data-pedido-id");
        var pedido_status_id = $li.attr("data-pedido-status");
        // console.log(pedido_status_idss)
          // return alert(pedido_id)

          if(pedido_status_id == 15){


            var buttons = [{
              text: "Ver Detalhes",
              bold: true,
              onClick: function () {

                localStorage.setItem("Pedido.id", pedido_id);
                localStorage.setItem("Pedido.detalhes", "1");
                localStorage.setItem("Pedido.detalhesAprovacao", "1");

                mainView.router.loadPage("novo-pedido-3.html");
                event.preventDefault();

              },
            },


            {
              text: "Enviar cópia por email",
              disabled:false,
              onClick: function () {
                myApp.showPreloader();

              // alert(request_url+'/pedidos/enviar_email/'+pedido_id);

              $.ajax({
                url: request_url+'/pedidos/enviar_email_espelho/'+pedido_id,
                type: 'POST',
                dataType: 'json',
                data: {
                  // param1: 'value1'
                },
              })
              .done(function(data) {



                if(data.error == false){

                  myApp.alert("Uma cópia do pedido foi enviada aos e-mails cadastrados.");

                }else{

                  myApp.alert("Ocorreu algum erro! Tente novamente.");

                }


              })
              .fail(function() {
                console.log("error");
              })
              .always(function() {
               myApp.hidePreloader();
               console.log("complete");
             });

              setTimeout(function () {



              }, 1000);


            },
            color: "green"
          },

          

          {
            text: "Cancelar Pedido",
              // disabled:true,
              onClick: function () {
                // myApp.showPreloader()

                myApp.confirm("Deseja cancelar este pedido?", function () {
                  $.ajax({
                    url: request_url + "/pedidos/edit/" + pedido_id,
                    type: "POST",
                    dataType: "json",
                    data: {
                      id: pedido_id,
                      pedido_status_id: 22,
                      user_id: usuario_id,
                    }
                  })
                  .done(function () {
                    console.log("success");
                  })
                  .fail(function () {
                    console.log("error");
                  })
                  .always(function () {
                    myApp.hidePreloader();
                    var toast = myApp.toast(
                      "Pedido cancelado.",
                      '<i class="fa fa-check"></i>'
                      );
                    toast.show();
                    mainView.router.reloadPage("meus-pedidos.html");

                    console.log("complete");
                  });
                });
              },
              color: "red",
              bold: true
            }
            ];

          } else if(pedido_status_id == 20 || pedido_status_id == 22){


            var buttons = [{
              text: "Ver Detalhes",
              bold: true,
              onClick: function () {

                localStorage.setItem("Pedido.id", pedido_id);
                localStorage.setItem("Pedido.detalhes", "1");
                localStorage.setItem("Pedido.detalhesAprovacao", "1");

                mainView.router.loadPage("novo-pedido-3.html");
                event.preventDefault();

              },
            },


            ];



          }else{



            var buttons = [{
              text: "Ver Detalhes",
              bold: true,
              onClick: function () {

                localStorage.setItem("Pedido.id", pedido_id);
                localStorage.setItem("Pedido.detalhes", "1");
                localStorage.setItem("Pedido.detalhesAprovacao", "1");

                mainView.router.loadPage("novo-pedido-3.html");
                event.preventDefault();

              },
            },

            {
              text: "Cancelar Pedido",
              // disabled:true,
              onClick: function () {
                // myApp.showPreloader()

                myApp.confirm("Deseja cancelar este pedido?", function () {
                  $.ajax({
                    url: request_url + "/pedidos/edit/" + pedido_id,
                    type: "POST",
                    dataType: "json",
                    data: {
                      id: pedido_id,
                      pedido_status_id: 22,
                      user_id: usuario_id,
                    }
                  })
                  .done(function () {
                    console.log("success");
                  })
                  .fail(function () {
                    console.log("error");
                  })
                  .always(function () {
                    myApp.hidePreloader();
                    var toast = myApp.toast(
                      "Pedido cancelado.",
                      '<i class="fa fa-check"></i>'
                      );
                    toast.show();
                    mainView.router.reloadPage("meus-pedidos.html");

                    console.log("complete");
                  });
                });
              },
              color: "red",
              bold: true
            }
            ];

          }



          myApp.actions(buttons);

          event.preventDefault();
        });

console.log("success");
})
.fail(function () {
  console.log("error");
})
.always(function () {
  myApp.hidePreloader();
});





});





myApp.showPreloader("Carregando...");

$.ajax({
  url: request_url + "/pedidos/index/sort:created/direction:desc",
  type: "GET",
  dataType: "json",
  data: {
    usuario_id: usuario_id
  }
})
.done(function (data) {

  var pedidoListHtml = "";

  if (data.length == 0) {
    return myApp.alert("Nenhum pedido encontrado.", function () {
      mainView.router.back();
    });
  }



  $.each(data, function (index, val) {


   var total = 10 - val.Pedido.id.length;

   var pedido_cod = '';

   for ( var i = 1; i <= total; i++ ) {

    pedido_cod += '0';

  }

  var pedido_cod_fim = pedido_cod+val.Pedido.id


  var hora_pedido = val.Pedido.created.split(" ")[1];
  hora_pedido =  hora_pedido.split(":");

  var data_pedido = val.Pedido.created.split(" ")[0]
  data_pedido = data_pedido.split('-');
  console.log(data_pedido)

  if(val.Cliente.id != null){

    if( val.Pedido.pedido_status_id == 1  || val.Pedido.pedido_status_id == 15  || val.Pedido.pedido_status_id == 16 || val.Pedido.pedido_status_id == 6  || val.Pedido.pedido_status_id == 10 ){

      var color_bg = 'bg-yellow';
      var fa_icon = 'fa-check';

    }else if( val.Pedido.pedido_status_id == 3 ||  val.Pedido.pedido_status_id == 8 ||  val.Pedido.pedido_status_id == 12  ||  val.Pedido.pedido_status_id == 22 ){
      var color_bg = 'bg-red';
      var fa_icon = 'fa-times';
    }else{    
      var color_bg = 'bg-lightgreen';
      var fa_icon = 'fa-check';
    }



    var item =
    '<li data-pedido-id = "' + val.Pedido.id + '" data-pedido-status =" ' + val.Status.id + ' ">' +
    '<a href="#" class="item-link item-content">' +
    '<div class="item-inner">' +
    '<div class="item-title-row">' +
    '<div class="item-title">' +
    (val.Cliente.nome_completo == null ?
      "Cliente não vinculado" :
      val.Cliente.nome_completo) +
    "</div>" +

    '<div class="item-after">' +
    data_pedido[2]+'/'+data_pedido[1]+'/'+data_pedido[0]  + ' '+ hora_pedido[0]+':'+hora_pedido[1] +
    "</div>" +
    "</div>" +
    '<div class="item-subtitle">' +
    (val.Cliente.telefone == null ? "" : val.Cliente.telefone) +
    "</div>" +
    '<div class="item-subtitle">' +
    (val.Pedido.id == null ? "" : pedido_cod_fim) +
    "</div>" +

    '<div class="item-text">' +
    '<div class="chip chip-small">' +
    '<div class="chip-media '+color_bg+' ">' +
    '<i class="fa '+fa_icon+'"></i>' +
    "</div>" +
    '<div class="chip-label">' +
    (val.Status.nome == null ? "" : val.Status.nome) +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +

    "</a>" +
    "</li>";

    pedidoListHtml += item;
  }
});

      // console.log(pedidoListHtml)
      $pedidoList.html("").append(pedidoListHtml).on("click", "li", function (event) {
        var $li = $(this);
        var pedido_id = $li.attr("data-pedido-id");
        var pedido_status_id = $li.attr("data-pedido-status");
        // console.log(pedido_status_idss)
          // return alert(pedido_id)

          if(pedido_status_id == 15){


            var buttons = [{
              text: "Ver Detalhes",
              bold: true,
              onClick: function () {

                localStorage.setItem("Pedido.id", pedido_id);
                localStorage.setItem("Pedido.detalhes", "1");
                localStorage.setItem("Pedido.detalhesAprovacao", "1");

                mainView.router.loadPage("novo-pedido-3.html");
                event.preventDefault();

              },
            },


            {
              text: "Enviar cópia por email",
              disabled:false,
              onClick: function () {
                myApp.showPreloader();

              // alert(request_url+'/pedidos/enviar_email/'+pedido_id);

              $.ajax({
                url: request_url+'/pedidos/enviar_email_espelho/'+pedido_id,
                type: 'POST',
                dataType: 'json',
                data: {
                  // param1: 'value1'
                },
              })
              .done(function(data) {



                if(data.error == false){

                  myApp.alert("Uma cópia do pedido foi enviada aos e-mails cadastrados.");

                }else{

                  myApp.alert("Ocorreu algum erro! Tente novamente.");

                }


              })
              .fail(function() {
                console.log("error");
              })
              .always(function() {
               myApp.hidePreloader();
               console.log("complete");
             });

              setTimeout(function () {



              }, 1000);


            },
            color: "green"
          },

          

          {
            text: "Cancelar Pedido",
              // disabled:true,
              onClick: function () {
                // myApp.showPreloader()

                myApp.confirm("Deseja cancelar este pedido?", function () {
                  $.ajax({
                    url: request_url + "/pedidos/edit/" + pedido_id,
                    type: "POST",
                    dataType: "json",
                    data: {
                      id: pedido_id,
                      pedido_status_id: 22,
                      user_id: usuario_id,
                    }
                  })
                  .done(function () {
                    console.log("success");
                  })
                  .fail(function () {
                    console.log("error");
                  })
                  .always(function () {
                    myApp.hidePreloader();
                    var toast = myApp.toast(
                      "Pedido cancelado.",
                      '<i class="fa fa-check"></i>'
                      );
                    toast.show();
                    mainView.router.reloadPage("meus-pedidos.html");

                    console.log("complete");
                  });
                });
              },
              color: "red",
              bold: true
            }
            ];

          } else if(pedido_status_id == 20 || pedido_status_id == 22){


            var buttons = [{
              text: "Ver Detalhes",
              bold: true,
              onClick: function () {

                localStorage.setItem("Pedido.id", pedido_id);
                localStorage.setItem("Pedido.detalhes", "1");
                localStorage.setItem("Pedido.detalhesAprovacao", "1");

                mainView.router.loadPage("novo-pedido-3.html");
                event.preventDefault();

              },
            },


            ];



          }else{



            var buttons = [{
              text: "Ver Detalhes",
              bold: true,
              onClick: function () {

                localStorage.setItem("Pedido.id", pedido_id);
                localStorage.setItem("Pedido.detalhes", "1");
                localStorage.setItem("Pedido.detalhesAprovacao", "1");

                mainView.router.loadPage("novo-pedido-3.html");
                event.preventDefault();

              },
            },

            {
              text: "Cancelar Pedido",
              // disabled:true,
              onClick: function () {
                // myApp.showPreloader()

                myApp.confirm("Deseja cancelar este pedido?", function () {
                  $.ajax({
                    url: request_url + "/pedidos/edit/" + pedido_id,
                    type: "POST",
                    dataType: "json",
                    data: {
                      id: pedido_id,
                      pedido_status_id: 22,
                      user_id: usuario_id,
                    }
                  })
                  .done(function () {
                    console.log("success");
                  })
                  .fail(function () {
                    console.log("error");
                  })
                  .always(function () {
                    myApp.hidePreloader();
                    var toast = myApp.toast(
                      "Pedido cancelado.",
                      '<i class="fa fa-check"></i>'
                      );
                    toast.show();
                    mainView.router.reloadPage("meus-pedidos.html");

                    console.log("complete");
                  });
                });
              },
              color: "red",
              bold: true
            }
            ];

          }



          myApp.actions(buttons);

          event.preventDefault();
        });

console.log("success");
})
.fail(function () {
  console.log("error");
})
.always(function () {
  myApp.hidePreloader();
});
});

myApp.onPageBeforeRemove("novo-pedido-3", function () {
  // localStorage.removeItem("Pedido.detalhes");
  // localStorage.removeItem("Pedido.detalhesAprovacao");
});

myApp.onPageInit("novo-pedido-3", function (page) {

  var $acoesNormal = $("#acoesNormal");
  var detalhe = localStorage.getItem("Pedido.detalhes");
  var detalhesAprovacao = localStorage.getItem("Pedido.detalhesAprovacao");
  var $btnProximoPasso = $$('#btnProximoPasso')


  $btnProximoPasso.on('click', function(event) {

    mainView.router.loadPage('novo-pedido.html')

    event.preventDefault();
    /* Act on the event */
  });


  // console.log(detalhe);

  $("#voltar").on('click', function(event) {


    localStorage.removeItem("Pedido.detalhes");
    localStorage.removeItem("Pedido.detalhesAprovacao");
    

  });

  if (detalhe == "1") {

    var $nav = $("#navPedido3");
    $nav.html("DETALHES");
    $acoesNormal.hide();

  }

  var $simulacaoCancelar = $("#simulacaoCancelar");

  $simulacaoCancelar.on("click", function (event) {
    gotoMain(event);

    event.preventDefault();
    /* Act on the event */
  });

  var simulador = localStorage.getItem("Simulador.ativo");

  if (simulador == "1") {
    var usuario_id = localStorage.getItem('Usuario.id');
    var $acoesSimulador = $("#acoesSimulador");
    var $navSimulacao = $("#navSimulacao");

    var pedido_id = localStorage.getItem("Pedido.id");

    $navSimulacao.on("click", function (event) {

      myApp.showPreloader();


      $.ajax({
        url: request_url + "/pedidos/edit/" + pedido_id,
        type: "POST",
        dataType: "json",
        data: {
          id: pedido_id,
          pedido_status_id: 23,
          user_id: usuario_id,
        }
      })
      .done(function () {
       myApp.alert("Simulação Salva.", function () {
        gotoMain();
      });
     })
      .fail(function () {
        console.log("error");
      })
      .always(function () { myApp.hidePreloader(); });

    });

    $acoesSimulador.show();
    $navSimulacao.show();
    $acoesNormal.hide();
  }

  var pedido_id = localStorage.getItem("Pedido.id");

  var $productslist = $("#products-list");
  var $produtocount = $(".product-count");
  var $desconto = $(".pedido-desconto");

  var $subtotal = $(".subtotal");
  var $shipping_charges = $(".shipping-charges");
  var $payable_amount = $(".payable-amount");

  myApp.showPreloader("Carregando...");

  $.ajax({
    url: request_url + "/pedidos/info/" + pedido_id,
    type: "GET",
    dataType: "json",
    data: {}
  })
  .done(function (data) {

    var listhtml = "";
    var total_frete = 0;
    var total_final = 0;
      // var total = 0;

      
      console.log(data)
      if (detalhesAprovacao == "1") {

        // console.log(data.Gestor.Usuario.nome_completo)
        $("#conteudo-historico").show();

        
        if( data.Pedido.observacao != null && data.Pedido.observacao != '' ){

          $("#li-pedido-obs").show();
          $('.pedido-obs').text(data.Pedido.observacao);

        }


        if( data.Pedido.usuario_id != null && data.Pedido.usuario_id != '' ){

          $("#li-pedido-vendedor").show();
          $('.pedido-vendedor').text(data.Usuario.nome_completo);

          // console.log()

          if( data.Gestor != ""){

           $("#li-pedido-gestor").show();
           $('.pedido-gestor').text(data.Gestor.Usuario.nome_completo);

         }
       }

  
             // if( data.Pedido.usuario_id != null && data.Pedido.usuario_id != '' ){

           

          // }

     }

        if( data.Pedido.forma_pagamento == 3){

               $('#pedido-pagamento-avista').text('À vista (pagamento antecipado)');

             }else if(data.Pedido.forma_pagamento == 1){

              $('#pedido-pagamento-avista').text(data.PrazosPagamento.descricao);

            }else if(data.Pedido.forma_pagamento == 2){

              $('#pedido-pagamento-parcela').show();

              $.each(data.Parcelas, function(index, val) {

                let dataFinal1 = val.data_parcela.split("-"); 
                let dataFinal = dataFinal1[2]+'-'+dataFinal1[1]+'-'+dataFinal1[0];
                let indice  = index+1;
                let parcelas = '<div style="margin:5px;">'+

                                indice+' - '+dataFinal
                                +'</div>';
                 
                 $('#pedido-pagamento-parcela').append(parcelas); 

              });


            } 


     var itens_qnt = data.ItensPedido.length
     if (itens_qnt == 0) {

      $btnProximoPasso.addClass('disabled')

    }else{
      $btnProximoPasso.removeClass('disabled')
    }

    var calculos = {

      subtotal:0,
      frete_com_financeiro:0,
      media_desconto:0,
      total:0,

    };

    var subtotal = 0;
    var frete_com_financeiro = 0;
    var media_desconto = 0;
    var total = 0;
    console.log(data.PrazosPagamento.total_dias)

    if(data.PrazosPagamento.total_dias != null){

      localStorage.setItem('Pedido.prazos_pagamento', data.PrazosPagamento.total_dias); 

    }
    

    $.each(data.ItensPedido, function (index, val) {
      media_desconto += parseFloat(val.total_desconto);
      calculos.media_desconto = media_desconto;

      if (isNaN(val.preco_negociado) && isNaN(val.quantidade)) return;

      if (isNaN(val.preco_frete) && isNaN(val.quantidade)) return;

      subtotal += val.preco_negociado * 1;
      calculos.subtotal = subtotal;
      frete_com_financeiro += val.preco_frete * 1;
      calculos.frete_com_financeiro = frete_com_financeiro;

      var total_teste = val.preco_negociado * 1;
      var total_item = total_teste * 1;

        // console.log(val.Produto)
        listhtml += '<li class="tooltipstered" data-index = "' + index +'" data-carrinho-id ="' + val.id + '">' +
        '<div class="item-content" style="">' +
        '<div class="item-media">' +
        '<img src="img/connan-default.jpg">' +
        "</div>" +
        '<div class="item-inner">' +
        '<div class="item-title-row">' +
        '<div class="item-title"> ' + val.Produto.nome + " </div>" +
        '<div class="item-after" data-unit-price="100">R$&nbsp;<span class="product-amount"> ' +
        Moeda(parseFloat(total_item).toFixed(2))+
        "</span></div>" +
        "</div>" +
        '<div class="item-subtitle">' + val.Produto.codigo_connan + "</div>" +
        '<div class="item-title-row">' +
        '<div class="chip chip-small">' +
        '<div class="chip-label">' +
        '<span class="product-quantity"> ' +
        val.quantidade +
        "</span>" +
        "</div>" +

        "</div>" +
       
        '<div class="item-after" data-unit-price="100"><span class="product-amount">'+val.total_desconto+'% -</span></div>'+
        "</div>" +
        "</div>" +
        "</div>" +
        "</li>";

        total_final += total;
        // total = 0;
      });

    media_desconto = media_desconto / data.ItensPedido.length;
    calculos.media_desconto = media_desconto;
    total_final = total_frete + total;
    calculos.total_final = total_final;

      // console.log(calculos)


      $productslist.append(listhtml).on("click", "li", function (event) {
       if(data.Pedido.pedido_status_id != 20){

        // if(detalhesAprovacao != 1 ){
          var simulador = localStorage.getItem("Simulador.ativo");
        // if (simulador == "1") return;

        var $li = $(this);
        var cart_id = $li.attr("data-carrinho-id");

        if(data.Pedido.pedido_status_id == 5 || data.Pedido.pedido_status_id == 16 || data.Pedido.pedido_status_id ==  null){

          if(data.Pedido.pedido_status_id ==  null){




            var buttons = [{
              text: "Alterar",
              bold: true,
              onClick: function () {

            // alert('1')
            var $itemCarrinhoId = $$("#itemCarrinhoId");
            $itemCarrinhoId.val(cart_id);
                // alert($itemCarrinhoId.val())
                var indexCarrinho =  $li.attr('data-index');

                try {

                  var item = data.ItensPedido[indexCarrinho];  

                }catch(err){

                  return myApp.alert('Algo deu errado, tente novamente.')
                }

                // console.log('datacarrinho', data.ItensPedido[indexCarrinho])

                console.log(item)


                pedido.openPopup({
                  id:item.id,
                  nome:item.Produto.nome,
                  pedido_id:item.Produto.id,
                  descricao:item.Produto.descricao,
                  codigo:item.Produto.codigo,
                  preco_frete1:item.preco_frete,
                  percentual_desconto:item.total_desconto,
                  quantidade:item.quantidade,
                  preco_unit_negociado:item.preco_unit_negociado,
                  preco_frete:item.valor_frete_saca,
                  valor_total:item.valor_total,
                  preco_unitario_tabela:item.preco_unitario_tabela,
                  itemPrecoNegociado:item.preco_negociado,
                  detalhesAprovacao:detalhesAprovacao
                })
                // myApp.popup(".popup-produtoinfo");


                $('#btnAdicionaItem-1').html('Alterar')



              }
            },
            {
              text: "Remover",
              onClick: function () {
                $li.fadeOut(400, function () {
                  $.ajax({
                    url: request_url + "/ItensPedidos/delete/" + cart_id,
                    type: "POST",
                    dataType: "json"
                  })
                  .done(function () {
                    console.log("success");
                  })
                  .fail(function () {
                    $li.fadeIn(400);


                    console.log("error");
                  })
                  .always(function () {});

                  $li.remove();
                  mainView.refreshPage();
                });
              },
              color: "red"
            }
            ];
            myApp.actions(buttons);

          }




          if(data.Pedido.pedido_status_id == 5 || data.Pedido.pedido_status_id == 16 ){




            var buttons = [{
              text: "Alterar",
              bold: true,
              onClick: function () {

            // alert('1')
            var $itemCarrinhoId = $$("#itemCarrinhoId");
            $itemCarrinhoId.val(cart_id);
                // alert($itemCarrinhoId.val())
                var indexCarrinho =  $li.attr('data-index');

                try {

                  var item = data.ItensPedido[indexCarrinho];  

                }catch(err){

                  return myApp.alert('Algo deu errado, tente novamente.')
                }

                // console.log('datacarrinho', data.ItensPedido[indexCarrinho])

                console.log(item.preco_frete)

                pedido.openPopup({
                  id:item.id,
                  nome:item.Produto.nome,
                  pedido_id:item.Produto.id,
                  descricao:item.Produto.descricao,
                  codigo:item.Produto.codigo,
                  preco_frete1:item.preco_frete,
                  percentual_desconto:item.total_desconto,
                  quantidade:item.quantidade,
                  preco_unit_negociado:item.preco_unit_negociado,
                  preco_frete:item.valor_frete_saca,
                  valor_total:item.valor_total,
                  preco_unitario_tabela:item.preco_unitario_tabela,
                  pedidoStatus:data.Pedido.pedido_status_id,
                  itemPrecoNegociado:item.preco_negociado,
                  detalhesAprovacao:detalhesAprovacao
                })
                // myApp.popup(".popup-produtoinfo");


                $('#btnAdicionaItem-1').html('Alterar')



              }
            },

            ];
            myApp.actions(buttons);

          }
        }



        event.preventDefault();
  // }
}
});


total_final = frete_com_financeiro + subtotal;

$produtocount.html(data.ItensPedido);


$subtotal.html(Moeda(parseFloat(subtotal).toFixed(2)));

media_desconto = parseFloat(media_desconto).toFixed(2);

$desconto.html(media_desconto);

$shipping_charges.html(Moeda(parseFloat(frete_com_financeiro).toFixed(2)));


total_final = parseFloat(total_final).toFixed(2);
var total_final1 = Moeda(parseFloat(total_final).toFixed(2));
$payable_amount.html(total_final1);

localStorage.setItem("Pedido.total_final", total_final);
localStorage.setItem("novo-pedido-3", "1");

      // console.log("success");
    })
.fail(function () {
  // console.log("error");
})
.always(function () {
  myApp.hidePreloader();
});




$.ajax({
  url: request_url + "/pedidoshistorico/index/" + pedido_id,
  type: "GET",
  dataType: "json",
  data: {}
})
.done(function(data) {

  // console.log(data)


  $.each(data, function (index, val) {

    console.log(val)
    if (val.PedidosHistoricos.observacoes == null || val.PedidosHistoricos.observacoes == '') {

      val.PedidosHistoricos.observacoes = 'sem observações.';
    }

    var historico = '<div style="margin:0 !important; " class="card">'+
    '<div class="card-content">'+
    '<div class="card-content-inner">'+

    '<div class="row">'+
    '<div style="font-weight: bold;">Status</div>'+
    '</div>'+

    '<div class="row">'+

    val.PedidosHistoricos.descricao+
    '</div>'+


    '<div class="row">'+
    '<div style="font-weight: bold;">Data</div>'+
    '</div>'+


    '<div class="row">'+

    val.PedidosHistoricos.data+
    '</div>'+
    '<div id="obs-status-'+index+'" style="display:none;">'+

    '<div class="row">'+
    '<div style="font-weight: bold;">Observações</div>'+
    '</div>'+


    '<div  style="text-align: justify;" class="row">'+
    val.PedidosHistoricos.observacoes+
    '</div>'+

    '</div>'+

    '</div>'+
    '</div>'+
    '</div>';

    // '<hr>'+ 
    // '<li>'+
    // '<div class="item-content">'+
    // '<i style="color:#007c76; position: relative;right: 3%;" class="fa fa-check-circle-o" aria-hidden="true"></i>'+
    // '<div class="item-inner">'+

    // '<div class="item-title">'+val.PedidosHistoricos.descricao+'</div>'+
    // // '<div style="position: relative;top: -30px;" class="item-after">'+val.PedidosHistoricos.data+'<br><div style="display:none;" id="obs-histo-'+index+'">Obs: '+val.PedidosHistoricos.observacoes+'<div></div>'+
    // '<div style="position: relative;top: -10px;" class="item-after">'+val.PedidosHistoricos.data+'<br>Obs: '+val.PedidosHistoricos.observacoes+'</div>'+
    // '</div>'+
    // '</div>'+
    // '</li>' ;
    




    $('#itens-historico').append(historico);


    var tipoUser = localStorage.getItem("Usuario.usuario_tipo_id");

    if(tipoUser == 5 || tipoUser == 2|| tipoUser == 8){

      $('#obs-status-'+index).show();

    }

    // if(val.PedidosHistoricos.observacoes != null){

    // $('#obs-histo-'+index).show();  
    // }





  });
  


  console.log("success");
})
.fail(function() {
  console.log("error");
})
.always(function() {
  console.log("complete");
});




// $( "#itemPrecoNego1-1" ).focus(function() {



// });

$$("#itemQuantidade-1, #itemPercentDesconto-1, #itemPrecoFrete-1, #itemPrecoNego1-1").on("keyup", function (event) {

  var total = 0;
  var itemPrecoNego1 = $("#itemPrecoNego1-1").val();
  var quantidade = $("#itemQuantidade-1").val();

  var preco_unit_tabela = $("#itemPrecoTabela-1").val();
  var preco_frete = $("#itemPrecoFrete-1").val();
  var desconto = $("#itemPercentDesconto-1").val();

  var prazo = localStorage.getItem("Pedido.prazo");



  var tabela_id = localStorage.getItem("Pedido.tabela_id");
  var forma_pagamento = localStorage.getItem("Pedido.forma_pagamento");
  var num_parcelas = localStorage.getItem("Pedido.num_parcelas");

  var percentual = $$("#itemPercentDesconto-1").val();

  var total_item = 0;
  var total_frete = 0;

  var porcentagem_calculo = 6 / 100;

  var total_dias_pagamento = 0;
          // var teste123 =  $( "#itemPrecoNego1-1" ).focus();

          if ($("#itemPrecoNego1-1").is(":focus")) {
           if (localStorage.getItem('Pedido.prazos_pagamento') != null) {

            total_dias_pagamento = parseFloat( localStorage.getItem('Pedido.prazos_pagamento') )

          }


          var Debugpreco_unit_tabela = $("#itemPrecoTabela-1").val();
          var preco_unit_tabela = $("#itemPrecoNego1-1").val();

          var base_calculo = porcentagem_calculo * total_dias_pagamento / 100;



          var total_item_sem_desconto = preco_unit_tabela * quantidade;

            // var total_desconto_item = total_item_sem_desconto * desconto / 100;
            // var total_desconto_item = total_item_sem_desconto * desconto / 100;

            // var total_item_com_desconto = total_item_sem_desconto - total_desconto_item;
            var total_item_com_desconto = total_item_sem_desconto ;

            var total_com_financeiro = total_item_com_desconto * (base_calculo + 1);

            // console.log(base_calculo+1)
            // console.log(total_com_financeiro)

            var total_frete = preco_frete * quantidade;

            var total_frete_com_financeiro = (preco_frete * quantidade) * (base_calculo + 1);
            var total_frete = total_frete_com_financeiro;


            var Debugtotal_frete = Debugpreco_unit_tabela * quantidade;

            console.log(total_item_sem_desconto)
            console.log(Debugtotal_frete)


            var calcTeste =  total_item_sem_desconto / Debugtotal_frete;
            var calcTestedec = calcTeste.toFixed(2);
            var calcTeste2 = calcTestedec * 100;
            var calcTesteFim =  100 - calcTeste2;


            console.log(calcTesteFim)


            var valorFinalCalculo = total_com_financeiro + total_frete;

            $("#itemPrecoNegociadoComFrete-1").val(valorFinalCalculo.toFixed(2));
            $("#itemPercentDesconto-1").val(calcTesteFim);
            $("#itemPrecoNegociado-1").val(total_com_financeiro.toFixed(2));

            $("#itemPrecoFreteTotal-1").val(total_frete.toFixed(2));



          }else{







          // if(teste123 == true){}
          // console.log(teste123)
        // if(itemPrecoNego1 == 0){

          if (localStorage.getItem('Pedido.prazos_pagamento') != null) {

            total_dias_pagamento = parseInt( localStorage.getItem('Pedido.prazos_pagamento') )

            console.log(total_dias_pagamento);
          }

          var base_calculo = porcentagem_calculo * total_dias_pagamento / 100;

          var total_item_sem_desconto = preco_unit_tabela * quantidade;

          var total_desconto_item = total_item_sem_desconto * desconto / 100;

          var total_item_com_desconto = total_item_sem_desconto - total_desconto_item;

          var total_com_financeiro = total_item_com_desconto * (base_calculo + 1);

          var total_frete = preco_frete * quantidade;

          var total_frete_com_financeiro = (preco_frete * quantidade) * (base_calculo + 1);

          var total_frete = total_frete_com_financeiro;

          var desconto_fim = (desconto/100) * preco_unit_tabela;
          var desconto_fim2 = preco_unit_tabela - desconto_fim
          var desconto_fim3 = desconto_fim2 * (base_calculo + 1);

            // console.log(desconto_fim2)

            var valorFinalCalculo = total_com_financeiro + total_frete;

            $("#itemPrecoNegociadoComFrete-1").val(valorFinalCalculo.toFixed(2));

            $("#itemPrecoNego1-1").val(desconto_fim3.toFixed(2));
            $("#itemPrecoNegociado-1").val(total_com_financeiro.toFixed(2));

            $("#itemPrecoFreteTotal-1").val(total_frete.toFixed(2));
          }
      // }
      // else{

      //  var Debugpreco_unit_tabela = $("#itemPrecoTabela-1").val();
      //  var preco_unit_tabela = $("#itemPrecoNego1-1").val();

      //  var base_calculo = porcentagem_calculo * total_dias_pagamento / 100;

      //  var total_item_sem_desconto = preco_unit_tabela * quantidade;

      //       // var total_desconto_item = total_item_sem_desconto * desconto / 100;
      //       // var total_desconto_item = total_item_sem_desconto * desconto / 100;

      //       // var total_item_com_desconto = total_item_sem_desconto - total_desconto_item;
      //       var total_item_com_desconto = total_item_sem_desconto ;

      //       var total_com_financeiro = total_item_com_desconto * (base_calculo + 1);

      //       // console.log(base_calculo+1)
      //       // console.log(total_com_financeiro)

      //       var total_frete = preco_frete * quantidade;

      //       var total_frete_com_financeiro = (preco_frete * quantidade) * (base_calculo + 1);
      //       var total_frete = total_frete_com_financeiro;


      //       var Debugtotal_frete = Debugpreco_unit_tabela * quantidade;

      //       console.log(total_item_sem_desconto)
      //       console.log(Debugtotal_frete)


      //       var calcTeste =  total_item_sem_desconto / Debugtotal_frete;
      //       var calcTestedec = calcTeste.toFixed(2);
      //       var calcTeste2 = calcTestedec * 100;
      //       var calcTesteFim =  100 - calcTeste2;


      //       console.log(calcTesteFim)


      //       $("#itemPercentDesconto-1").val(calcTesteFim);
      //       $("#itemPrecoNegociado-1").val(total_com_financeiro.toFixed(2));

      //       $("#itemPrecoFreteTotal-1").val(total_frete.toFixed(2));



      // }



    });




var $btnAdicionaItem =  $('#btnAdicionaItem-1');

$btnAdicionaItem.on("click", function (event) {


  var pedidosStatus = $("#pedidos-status").val();
  var user_id = localStorage.getItem('Usuario.id');

  console.log(pedidosStatus)

  var cart_id = $("#itemCarrinhoId-1").val();
  var preco_unitario_tabela = $("#itemPrecoTabela-1").val();
  var preco_unit_negociado = $("#itemPrecoNego1-1").val();
  var preco_negociado = $("#itemPrecoNegociado-1").val();
  var preco_frete = $("#itemPrecoFreteTotal-1").val();
  var pedido_id = localStorage.getItem("Pedido.id");
  var quantidade = $("#itemQuantidade-1").val();
  var produto_id = $("#itemId-1").val();
  var percentual = $$("#itemPercentDesconto-1").val();
  var frete_total = $("#itemPrecoFreteTotal-1").val();
  var item_preco_frete = $("#itemPrecoFrete-1").val();
  var produto_codigo = $("#itemCarrinhocodigo-1").val();


  myApp.showPreloader();

  $.ajax({
    url: request_url + "/ItensPedidos/edit",
    type: "POST",
    dataType: "json",
    data: {
      id: cart_id,
      produto_id: produto_id,
      preco_unitario_tabela: preco_unitario_tabela,
      preco_negociado: preco_negociado,
      valor_frete_saca:item_preco_frete,
      produto_codigo: produto_codigo,
      preco_unit_negociado: preco_unit_negociado,
      preco_frete: frete_total,
      quantidade: quantidade,
      pedido_id: pedido_id,
      total_desconto: percentual,
        // obs_item: obs_item
      }
    })
  .done(function () {



    $.ajax({
      url: request_url + "/Pedidos/editTotal/"+pedido_id,
      type: "POST",
      dataType: "json",
      data: {

      }
    })
    .done(function () {

    });



    if(pedidosStatus == 16){

      $.ajax({
        url: request_url + "/Pedidos/editStatus/"+pedido_id,
        type: "POST",
        dataType: "json",
        data: {
          pedido_status_id: 14,
          user_id: user_id,
        }
      })
      .done(function (data) {

      });

      localStorage.removeItem("Pedido.detalhes");
      localStorage.removeItem("Pedido.detalhesAprovacao");


      var toast = myApp.toast(
        "O Pedido foi Alterado com Sucesso!",
        '<i class="fa fa-check"></i>'
        );

      $("#itemObs").val('');
      $("#itemPercentDesconto").val(0);
      $("#itemQuantidade").val(0);
      toast.show();

      

      gotoMain();


    }else{

     var toast = myApp.toast(
      "O Pedido foi Alterado com Sucesso!",
      '<i class="fa fa-check"></i>'
      );

     $("#itemObs").val('');
     $("#itemPercentDesconto").val(0);
     $("#itemQuantidade").val(0);
     toast.show();


   }







 })
  .fail(function (jqXHR, textStatus, errorThrown) {
    console.error(textStatus, errorThrown);
  })
  .always(function () {
    myApp.hidePreloader();
    myApp.closeModal(".popup-produtoinfo-2", true);
    mainView.router.refreshPage();
  });




  event.preventDefault();
  /* Act on the event */
});



});

myApp.onPageBeforeRemove('novo-cliente-1', function(page){

  // if( !localStorage.getItem("newClientePedido") ){
  //   localStorage.removeItem('Cliente.id')
  // }

})

myApp.onPageInit("novo-cliente-1", function (page) {

  var $btnproximo = $$("#btnClienteProximo");

  var $clienteCPF = $("#clienteCPF");




  var $data_nascimento = $('#data_nascimento');

  var $telefone = $('#ClienteTelefone')

  var $celular = $('#clienteCelular')

  var $clienteCEP = $('#clienteCEP')

  var $data_nascimento = $("#data_nascimento");


  // $btnproximo

  $.getJSON('estados_cidades.json', function (data) {

    var items = [];
    var options = '<option value="">SELECIONE UM ESTADO</option>';  

    $.each(data, function (key, val) {
      options += '<option value="' + val.sigla + '">' + val.nome + '</option>';
    });


    $("#filtroEstado").html(options); 

    $("#filtroEstado").change(function () {

      var options_cidades = '<option value="">SELECIONE UMA CIDADE</option>';
      var str = "";         

      $("#filtroEstado option:selected").each(function () {
        str += $(this).text();
      });
      $.each(data, function (key, val) {
        if(val.nome == str) {             
          $.each(val.cidades, function (key_city, val_city) {
            options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
          });             
        }
      });
      $("#filtroCidade").html(options_cidades);

    }).change();    

  });

  $("#ButtonNext").on('click', function(event) {
    var clienteValidaCPF = $("#clienteCPF").val();

    let novoCPF = clienteValidaCPF.replace('.', '');
    novoCPF = novoCPF.replace('.', '');
    novoCPF = novoCPF.replace('/', '');
    novoCPF = novoCPF.replace('-', '');

    let result  = '';

    if(novoCPF.length <= 11){

      result = clienteValidate.is_cpf(novoCPF);

      if(result == false){

        myApp.alert('Digite um CPF válido');
        $("#clienteCPF").focus();
        return false
      } 

    }else{

      result = clienteValidate.is_cnpj(novoCPF);
      if(result == false){

        myApp.alert('Digite um CNPJ válido');
        $("#clienteCPF").focus();
        return false

      } 




    }

    var filtroEstado  = $('#filtroEstado').val() ;
    var filtroCidade  = $('#filtroCidade').val() ;
    if(filtroEstado == ''){

     myApp.hidePreloader();
     myApp.alert('Escolha um estado');
     $("#filtroEstado").focus();
     return false;
     
   }

   if(filtroCidade == ''){

     myApp.hidePreloader();
     myApp.alert('Escolha uma cidade');
     $("#filtroCidade").focus();
     return false;
     
   }


   var valueCep = $('#clienteCEP').val();

   if(valueCep < 9){
     myApp.hidePreloader();
     myApp.alert('Insira um CEP válido');
     $("#clienteCEP").focus();
     return false;
   }


   var clienteTelefone  = $('#ClienteTelefone').val();
   var clienteCelular  = $('#clienteCelular').val();


   if(clienteTelefone != ''){

    if( clienteTelefone.length < 14){

     myApp.hidePreloader();
     myApp.alert('Insira um Telefone válido');
     $("#ClienteTelefone").focus();
     return false;
   }
 }

 if(clienteCelular != ''){

  if( clienteCelular.length < 15){

   myApp.hidePreloader();
   myApp.alert('Insira um Celular válido');
   $("#clienteCelular").focus();
   return false;
 }
}


});





  $('#novoCliente1').validate({

    rules: {
      cpf :{
        required:true
      },
      nome_completo :{
        required:true
      },
      data_nascimento :{
        required:false
      },
      inc_estadual :{
        depends: function(element) {
          isento_check
        },
        required:true
      },
      logradouro :{
        required:true
      },
      numero :{
        required:true
      },
      bairro :{
        required:true
      },
      complemento :{
        required:false
      },
      cidade_cliente :{
        required:true
      },
      estados_cliente :{
        required:true,
        maxlength:2
      },
      cep :{
        required:true
      },
      telefone :{
        required:true
      },
      celular :{
        required:true
      },
      email_financeiro :{
        required:true
      },
      email :{
        required:true
      },
      nome_contato :{
        required:true
      },
      apelido :{
        required:false
      }
    },

    messages: {
      nome_completo: {
        required: "Informe seu e-mail.",
      }
    },


    errorPlacement: function (error, element) {
      // alert(1)
      // return false
      // console.log(error)
      error.appendTo(element.parent().siblings(".input-error"));

      event.preventDefault();
    },
    submitHandler: function (form) {




      var boletoEmail = $("#boletoEmail").prop("checked");
      var boletoCarga = $("#boletoCarga").prop("checked");
      var forma_recebimento_boleto = '';
      // alert(1)
      // return false
      var formData = myApp.formToData("#novoCliente1");
    // alert(JSON.stringify(formData));

    var usuario_codigo = localStorage.getItem('Usuario.codigo')
    var id = localStorage.getItem('Cliente.id');
    var hasId = false;
    if (id != null) {
      hasId = true
    }
      // console.log(boletoEmail)
      // console.log(boletoCarga)

      if(boletoEmail == true){

        forma_recebimento_boleto = 'Recebimento por E-mail';

      }else{

        forma_recebimento_boleto = 'Recebimento pela Carga';
      }


      formData.cidade1 =  $('#filtroCidade').val();
      formData.estado1 =  $('#filtroEstado').val();

      $.ajax({
        // url: request_url + "/clientes/add",
        url: request_url + "/clientes/add",
        type: "POST",
        dataType: "json",
        data: {
          mobile:'1',
          cpf: formData.cpf,
          nome_completo: formData.nome_completo,
          email: formData.email,
          telefone: formData.telefone,
          celular: formData.celular,
          bairro: formData.bairro,
          data_nascimento: formData.data_nascimento,
          cep: formData.cep,
          logradouro: formData.logradouro,
          numero: formData.numero,
          complemento: formData.complemento,
          email_financeiro: formData.email_financeiro,
          bairro: formData.bairro,
          cidade: formData.cidade1,
          estado: formData.estado1,
          nome_contato: formData.nome_contato,
          apelido: formData.apelido,
          usuario_id: usuario_codigo,
          forma_recebimento_boleto: forma_recebimento_boleto
        }
      })
      .done(function (data) {
        console.log(data)

        

        if (data.erro == false) {


         localStorage.setItem("Cliente.id", data.data.cliente_id); 
         localStorage.setItem("Cliente.codigo", data.data.codigo_cliente); 
         localStorage.setItem("Cliente.nome", data.data.nome_completo); 

         if (!hasId) {
          localStorage.setItem("Cliente.nome", data.data.nome_completo);         

        }

      }else{
        return myApp.alert('CPF/CNPJ Já cadastrado!');
      }

      mainView.router.loadPage("novo-cliente-2.html");
        // return false

        event.preventDefault();

        // console.log("success");
      })
      .fail(function () {
        // console.log("error");
      })
      .always(function () {

      });

    },


  })

});

myApp.onPageInit("novo-cliente-2", function () {

  var $inscricao_estadual = $$('#Clienteinc_estadual');
  var isento_check = $("#checkIsento").is(":checked");
  var cliente_codigo = localStorage.getItem('Cliente.codigo')

  $('#checkIsento').on('change', function(event) {
    var checked = this.checked;
    $inscricao_estadual.attr({
      value: checked ? 'ISENTO' : ''
    }).trigger('blur');
  });


  $.getJSON('estados_cidades.json', function (data) {

    var items = [];
    var options = '<option value="">SELECIONE UM ESTADO</option>';  

    $.each(data, function (key, val) {
      options += '<option value="' + val.sigla + '">' + val.nome + '</option>';
    });


    $("#filtroEstado-2").html(options); 

    $("#filtroEstado-2").change(function () {

      var options_cidades = '<option value="">SELECIONE UMA CIDADE</option>';
      var str = "";         

      $("#filtroEstado-2 option:selected").each(function () {
        str += $(this).text();
      });
      $.each(data, function (key, val) {
        if(val.nome == str) {             
          $.each(val.cidades, function (key_city, val_city) {
            options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
          });             
        }
      });
      $("#filtroCidade-2").html(options_cidades);

    }).change();    

  });

  var $btnProximo = $("#btnProximo");

  var cliente_id = localStorage.getItem("Cliente.id");

  $btnProximo.on("click", function (event) {

    var filtroEstado  = $('#filtroEstado-2').val() ;
    var filtroCidade  = $('#filtroCidade-2').val() ;

    var formData = myApp.formToData("#formCliente2");

    if(formData.nome_completo == ''){
      myApp.hidePreloader();
      myApp.alert('Inserir Nome da fazenda');
      return false;

    }else if(formData.inc_estadual == ''){

     myApp.hidePreloader();
     myApp.alert('Inserir a inscrição estadual');
     return false;

   }else if(formData.email == ''){

     myApp.hidePreloader();
     myApp.alert('Inserir E-mail Gerente Faz/Comprador');
     return false;


   }else if(formData.nomeContatoFazenda == ''){

     myApp.hidePreloader();
     myApp.alert('Inserir Nome de Contato');
     return false;


   }else if(formData.canalvenda == ''){

     myApp.hidePreloader();
     myApp.alert('Escolher o canal de venda');
     return false;
   }else if(formData.logradouro1 == ''){

     myApp.hidePreloader();
     myApp.alert('Inserir o endereço');
     return false;
   }else if(formData.bairro1 == ''){

     myApp.hidePreloader();
     myApp.alert('Inserir o Bairro');
     return false;
   }else if(formData.canalvenda == ''){

     myApp.hidePreloader();
     myApp.alert('Inserir o número');
     return false;
   } else  if(filtroEstado == ''){

     myApp.hidePreloader();
     myApp.alert('Escolha um estado');
     $("#filtroEstado").focus();
     return false;
     
   }else if(filtroCidade == ''){

     myApp.hidePreloader();
     myApp.alert('Escolha uma cidade');
     $("#filtroCidade").focus();
     return false;
     
   }else if(formData.cep1 == ''){

     myApp.hidePreloader();
     myApp.alert('Inserir o cep');
     return false;
   }else if( formData.telefone1 == '' && formData.celular1 == ''  ){

     myApp.hidePreloader();
     myApp.alert('Inserir o telefone ou celular');
     return false;
   }else if( formData.roteiro == '' ){

     myApp.hidePreloader();
     myApp.alert('Inserir o roteiro');
     return false;

   }


   var lei215 = '';
   if(formData.suframa == 'lei215'){

    lei215 = 'lei215';

  }




  if(formData.cep1 < 9){
   myApp.hidePreloader();
   myApp.alert('Insira um CEP válido');

   return false;

 }




 var clienteTelefone  = formData.telefone1;
 var clienteCelular  = formData.celular1;


 if(clienteTelefone != ''){

  if( clienteTelefone.length < 14){

   myApp.hidePreloader();
   myApp.alert('Insira um Telefone válido');
         // $("#ClienteTelefone").focus();
         return false;
       }
     }

     if(clienteCelular != ''){

      if( clienteCelular.length < 15){

       myApp.hidePreloader();
       myApp.alert('Insira um Celular válido');
         // $("#clienteCelular").focus();
         return false;
       }
     }




     var $inscricao_estadualValor =  $$('#Clienteinc_estadual').val();
     var emailFazenda = $$('#emailFazenda').val();
     var nomeContatoFazenda = $$('#nomeContatoFazenda').val();

     var outrasInfo = $('#outrasInfo1').val();



     var filtroEstado1  = $('#filtroEstado-2').val() ;
     var filtroCidade1  = $('#filtroCidade-2').val() ;


     $.ajax({
      url: request_url + "/fazendas/add",
      type: "POST",
      dataType: "json",
      data: {
        cliente_id: cliente_codigo,
        inc_estadual_rural: $inscricao_estadualValor,
        nome_completo: formData.nome_completo,
        codigo_suframa: formData.codigo_suframa,
        lei215: lei215,
        canal_de_venda: formData.canalvenda,
        email: emailFazenda,
        nome_contato: nomeContatoFazenda,
        roteiro: formData.roteiro,
        bairro: formData.bairro1, 
        cep: formData.cep1,
        estado: filtroEstado1,
        cidade: filtroCidade1,
        complemento: formData.complemento1,
        logradouro: formData.logradouro1,
        numero: formData.numero1,
        celular: formData.celular1,
        telefone: formData.telefone1,
        outras_info: outrasInfo,
      }
    })
     .done(function (data) {
      console.log(data);

      localStorage.setItem("Fazenda.id", data.data.fazenda_id);
      localStorage.setItem("Fazenda.codigo", data.data.fazenda_codigo);
      mainView.router.loadPage("novo-cliente-3.html");
      event.preventDefault();

      console.log("success");
    })
     .fail(function () {
      console.log("error");
    })
     .always(function () {});

    // console.log(formData);
    /* Act on the event */
  });
});

myApp.onPageInit("novo-cliente-3", function () {


  var $cep = $('input[name=cep]')

  var $btnProximo = $$("#btnProximo2");
  var fazenda_id = localStorage.getItem("Fazenda.id");

  $btnProximo.on("click", function (event) {

    var formData = myApp.formToData("#novoCliente2");

    if(formData.outros != '' &&  formData.outrosQtde == ''){
      myApp.hidePreloader();
      myApp.alert('Inserir a quantidade para Outros');
      return false;

    }

    if( formData.bovinos_corte == '' && formData.bovinos_leite == '' && formData.equinos == ''
      && formData.ovinos == '' && formData.suinos == '' && formData.aves == ''
      && formData.outros == '' && formData.outrosQtde == ''){

     myApp.hidePreloader();
   myApp.alert('Preencher ao menos 1 campo');
   return false;

 }


 $.ajax({
  url: request_url + "/fazendas/edit/" + fazenda_id,
  type: "POST",
  dataType: "json",
  data: {
    id: fazenda_id,
    aves: formData.aves,
    bovinos_corte: formData.bovinos_corte,
    bovinos_leite: formData.bovinos_leite,
    consumo_suplemento_mineral: formData.consumo_suplemento_mineral,
    consumo_suplemento_proteico: formData.consumo_suplemento_proteico,
    equinos: formData.equinos,
    nucleo_premix: formData.nucleo_premix,
    outros: formData.outros,
    ovinos: formData.ovinos,
    racao: formData.racao,
    outros_quantidade: formData.outrosQtde,
    suinos: formData.suinos
  }
})
 .done(function (data) {
        // if (data.erro == false) {
        // myApp.alert('Dados salvos com sucesso', function(){
          mainView.router.loadPage("novo-cliente-4.html");
        // })
        // }

        console.log("success");
      })
 .fail(function () {
  console.log("error");
})
 .always(function () {});

    // console.log(formData);

    event.preventDefault();
    /* Act on the event */
  });
});

// myApp.onPageBeforeRemove('novo-pedido-1', function(page){

//   if( !localStorage.getItem("newClientePedido") ){
//     localStorage.removeItem('Cliente.id')
//   }

// })


myApp.onPageInit("novo-pedido-1", function (page) {

  var simulador = localStorage.getItem("Simulador.ativo");

  if (simulador == "1") {
    $(".btnSimuladorCancela").show();
    $(".btnPedidoVoltar").hide();
    $('#sim_referencia').show()
  } else {
    $(".btnSimuladorCancela").hide();
    $(".btnPedidoVoltar").show();
    $('#sim_referencia').hide()
  }

  var pedido_id = localStorage.getItem("Pedido.id");
  var usuario_id = localStorage.getItem("Usuario.id");
  var filialUnd = $("#filial");

  var $tabelaDePrecos = $("#tabelaDePrecos");
  var $selectformapagamento = $("#formapagamento");
  var $liprazodeterminado = $("#liprazodeterminado");
  var $linumeroparcelas = $("#linumeroparcelas");
  var $cbparcelas = $(".cb-parcelas");
  var $simulacao_referencia = $("#simulacao_referencia");

  var $btnProximo = $("#btnPedido2");
  var $2pagamento = $("#2pagamento");
  var $1pagamento = $("#1pagamento");

  var $imposto = $('#imposto');

  var pedido_status_id = null;

  $btnProximo.on("click", function (event) {

    var forma_pagamento = $selectformapagamento.val();
    localStorage.setItem("Pedido.forma_pagamento", forma_pagamento);

    var tabela_id = $tabelaDePrecos.val();
    localStorage.setItem("Pedido.tabela_id", tabela_id);
    var num_parcelas = $2pagamento.val();
    localStorage.setItem("Pedido.num_parcelas", num_parcelas);
    var valor_imposto = $imposto.val();
    localStorage.setItem("Pedido.valor_imposto", valor_imposto);
    var simulacao_referencia = $simulacao_referencia.val();
    localStorage.setItem("Pedido.simulacao_referencia", simulacao_referencia);
    var tipo_frete = $('input:radio[name=tipo_frete]:checked').val();


    if (forma_pagamento == "1" && $1pagamento.val() == "") {
      return myApp.alert('Preencha o prazo.')
    }


    // return console.log(forma_pagamento)

    var parcelas = $("input[name^=parcela]").map(function () {
      return this.value;

    }).get();

    console.log(parcelas)
    if (forma_pagamento == 2) {

      var debugaParcela = Array();
      var pagamenTototaldias = '';

       // debugaParcela[0] = 30;

       var data = new Date();


       var dia     = data.getDate(); 
       var mes     = data.getMonth();  
       var ano2    = data.getFullYear(); 

       var dataAtual = ano2+'/'+(0+''+(mes+1)) +'/'+dia;




       if(parcelas.length > 1){


        var contador = 0;

        $.each(parcelas, function(index, val) {



          if(parcelas.length == 2){


            if(index == 0){



               // debugaParcela[0] = 30;


               var dia0 =  dataAtual;
               var primeira =  parcelas[0];


               var a = moment( dia0 );
               var b = moment( primeira );

               var prazo_em_dias6 = b.diff( a, 'days' ); 

               debugaParcela[0] = prazo_em_dias6;




             }


             if(index == 1){

               var primeira =  parcelas[0];
               var segunda  =  parcelas[1];

               var a = moment( primeira );
               var b = moment( segunda );

               var prazo_em_dias = b.diff( a, 'days' ); 
               console.log(debugaParcela)
               var prazoDias2 = prazo_em_dias + debugaParcela[0];
               debugaParcela.push(prazoDias2);

             }



             pagamenTototaldias = (debugaParcela[0] + debugaParcela[1]) / 2;

           }


           if(parcelas.length == 3){

            if(index == 0){

              var dia0 =  dataAtual;
              var primeira =  parcelas[0];


              var a = moment( dia0 );
              var b = moment( primeira );

              var prazo_em_dias7 = b.diff( a, 'days' ); 

              debugaParcela[0] = prazo_em_dias7;

            }


            if(index == 1){

              var primeira =  parcelas[0];
              var segunda  =  parcelas[1];

              var a = moment( primeira );
              var b = moment( segunda );

              var prazo_em_dias3 = b.diff( a, 'days' ); 
              console.log(debugaParcela)
              var prazoDias3 = prazo_em_dias3 + debugaParcela[0];
              debugaParcela.push(prazoDias3);

            }


            if(index == 2){

              var segunda =  parcelas[1];
              var terceira  =  parcelas[2];

              var a = moment( segunda );
              var b = moment( terceira );

              var prazo_em_dias4 = b.diff( a, 'days' ); 

              var prazoDias4 = prazo_em_dias4 + debugaParcela[1];
              debugaParcela.push(prazoDias4);

            }



            pagamenTototaldias = (debugaParcela[0] + debugaParcela[1] + debugaParcela[2]) / 3;
          }


          if(parcelas.length == 4){

            if(index == 0){

              var dia0 =  dataAtual;
              var primeira =  parcelas[0];


              var a = moment( dia0 );
              var b = moment( primeira );

              var prazo_em_dias8 = b.diff( a, 'days' ); 

              debugaParcela[0] = prazo_em_dias8;

            }



            if(index == 1){

              var primeira =  parcelas[0];
              var segunda  =  parcelas[1];

              var a = moment( primeira );
              var b = moment( segunda );

              var prazo_em_dias3 = b.diff( a, 'days' ); 
              console.log(debugaParcela)
              var prazoDias3 = prazo_em_dias3 + debugaParcela[0];
              debugaParcela.push(prazoDias3);

            }


            if(index == 2){

              var segunda =  parcelas[1];
              var terceira  =  parcelas[2];

              var a = moment( segunda );
              var b = moment( terceira );

              var prazo_em_dias4 = b.diff( a, 'days' ); 

              var prazoDias4 = prazo_em_dias4 + debugaParcela[1];
              debugaParcela.push(prazoDias4);

            }

            if(index == 3){

              var terceira =  parcelas[2];
              var quarta  =  parcelas[3];

              var a = moment( terceira );
              var b = moment( quarta );

              var prazo_em_dias5 = b.diff( a, 'days' ); 

              var prazoDias5 = prazo_em_dias5 + debugaParcela[2];
              debugaParcela.push(prazoDias5);

            }


            pagamenTototaldias = (debugaParcela[0] + debugaParcela[1] + debugaParcela[2] + debugaParcela[3]) / 4;
          }




        });


}else{


  var dia0 =  dataAtual;
  var primeira =  parcelas[0];


  var a = moment( dia0 );
  var b = moment( primeira );

  var prazo_em_dias8 = b.diff( a, 'days' ); 


  pagamenTototaldias = prazo_em_dias8;

}



      localStorage.setItem("Pagamento.totaldias", parseFloat(pagamenTototaldias) );      


      var prazo = $2pagamento.val();  

    }else if (forma_pagamento == 1) {
      var prazo = $1pagamento.val();   
    }

    // console.log('prazo', localStorage.getItem('Pedido.prazo'))
    // console.log(prazo)


    // return false
    if (tabela_id == "") {
      return myApp.alert('Selecione a tabela de preço.')
    }
    if (forma_pagamento == "") {
      return myApp.alert('Selecione a forma de pagamento.')
    }
    if (valor_imposto == "") {
      return myApp.alert('Selecione o valor do imposto.')
    }
    try{
      tipo_frete = tipo_frete.substr(0, 3)
      localStorage.setItem('Pedido.tipo_frete', tipo_frete)
    }catch(err){
      return myApp.alert('Informe o tipo do frete.')
    }


    $(".modal-overlay-visible").on('click', function(event) {

      $(this).remove()

      event.preventDefault();
      /* Act on the event */
    });

    if (simulador == "1") {
      $(".btnSimuladorCancela").show();
      $(".btnPedidoVoltar").hide();
      pedido_status_id = 1;
    } else {
      $(".btnSimuladorCancela").hide();
      $(".btnPedidoVoltar").show();
      // pedido_status_id = 3;
    }




    var pedido_id = localStorage.getItem("Pedido.id");

    if(pedido_id == 'null'){
      var link_url = "/pedidos/novo/";
    }else{
      var link_url = "/pedidos/edit/"+pedido_id;
    }

    var dataFilial = document.getElementById('filial');
    var filialSelected = dataFilial.options[dataFilial.selectedIndex];
    var filialId = filialSelected.getAttribute('data-filial')

    
    myApp.showPreloader("Carregando...");
    $.ajax({
      url: request_url + link_url,
      type: "POST",
      dataType: "json",
      data: {
        usuario_id: usuario_id,
        pedido_status_id: pedido_status_id,
        prazo: prazo,
        simulacao_referencia: simulacao_referencia,
        tabela_id: tabela_id,
        forma_pagamento: forma_pagamento,
        num_parcelas: num_parcelas,
        imposto:valor_imposto,
        filial_id: filialId,
        tipo_frete:tipo_frete,
        parcelas: parcelas
      }
    })
    .done(function (data) {

      if(pedido_id == 'null'){
        var data = data.data;
        localStorage.setItem("Pedido.id", data.Pedido.id);
      }
      
      localStorage.setItem('Pedido.tabela_id', tabela_id)
      mainView.router.loadPage("novo-pedido-2.html");

      event.preventDefault();
      console.log("pedido criado");
    })
    .fail(function () {
      console.log("error novo pedido");
    })
    .always(function () {
      myApp.hidePreloader();
    });

    event.preventDefault();
    /* Act on the event */
  });

myApp.showPreloader("Carregando");

$.ajax({
  url: request_url + "/tabeladeprecos/listar_tabelas",
  type: "GET",
  dataType: "json"
})
.done(function (data) {
  myApp.hidePreloader();
      // console.log(data);

      var $listProdutoTabela = $("#listProdutoTabela");
      var options = '<option value="">Selecione</option>';
      var produtosList = null;

      $$.each(data.data, function (index, val) {
        options += '<option value="' + index + '">' + val + "</option>";
      });

      $tabelaDePrecos.html(options).on("change", function (event) {


        $('#imposto').removeAttr("disabled");
        var tabela_id = $$(this).val();

        myApp.showPreloader("Carregando");
        $.ajax({
          url: request_url + "/tabeladeprecos/lista_produtos/"+tabela_id,
          type: "GET",
          dataType: "json"
        })
        .done(function (response) {
          var listItems = "";
          produtosList = response.data;

          myApp.hidePreloader();
          if (produtosList.length == 0) {
            myApp.alert("Esta tabela não possui nenhum produto.");
          }

            // console.log(produtosList);

            $$.each(produtosList.TabelaDePrecoProduto, function (index, val) {
              console.log(localStorage.getItem("Pedido.valor_imposto") )
              listItems +=
              '<li index="' + index + '">' +
              '<a href = "#"  class=" link item-link item-content">' +
              '<div class="item-media">' +
              '<img src="img/connan-default.jpg" width="44">' +
              "</div>" +
              '<div class="item-inner">' +
              '<div class="item-title-row">' +
              '<div class="item-title">' +
              val.Produto.nome +
              "</div>" +
              '<div class="item-subtitle">' +
              val.Produto.codigo +
              "</div>" +

              "</div>" +
              "</div>" +
              "</a>" +
              "</li>";
            });

            $listProdutoTabela.html("").append(listItems).on("click", "li", function (event) {
              var index = $$(this).attr("index");
              var itemLista = produtosList.TabelaDePrecoProduto[index];

                // console.log(itemLista)

                $("#itemNome").html(itemLista.Produto.nome);
                $("#itemDescricao").html(itemLista.Produto.descricao);
                $("#itemId").html(itemLista.id);
                $("#itemId").val(itemLista.id);
                $("#itemPrecoTabela").html(itemLista.Produto.descricao);

                pedido.openPopup(itemLista)
                // myApp.popup(".popup-produtoinfo", true);

                $('#btnAdicionaItem').html('Adicionar ao carrinho')


                // $$(".popup-produtoinfo").on("popup:opened", function () {
                //   var $itemQuantidade = $("#itemQuantidade");
                //   var $itemPrecoTabela = $("#itemPrecoTabela");
                //   var $itemPrecoFrete = $("#itemPrecoFrete");
                //   var $itemPrecoNegociado = $("#itemPrecoNegociado");
                //   var total = 0;
                // });

                event.preventDefault();
                /* Act on the event */
              });
          })
        .fail(function () {
          console.log("error");
        })
        .always(function () {});

        event.preventDefault();
        /* Act on the event */
      });

      console.log("success");
    })
.fail(function () {
  console.log("error");
})
.always(function () {});

$linumeroparcelas.hide();
$cbparcelas.hide();
$liprazodeterminado.hide();





const listaBTV = {
  0: '(SP)',
  28: '(AC, AL, AM, AP, BA, CE, DF, ES, GO, MA, MT, MS, PI, PE, PB, PA, RN, RR, RO, SE, TO)',
  48: '(MG, RJ, PR, SC, RS)',
  69: '(PA)',
  72: '(BA)',
}

const listaCampoVerde = {
  0: '(MT)',
  28: '',
  48: '(AC, AM, AP, AL, BA, CE, DF, ES, GO, MG, MA, MS, PR, PA, PI, PE, PB, RJ, RS, RN, RR, RO, SC, SE, TO)',
  69: '(PA)',
  72: '(BA)',
}

const listaSaoGabrielOeste = {
  0: '(MS)',
  28: '',
  48: '(AC, AM, AP, AL, BA, CE, DF, ES, GO, MG, MA, MT, PE, PB, PR, PI, RJ, RS, RN, PA, RR, RO, SC, SE, TO)',
  69: '(PA)',
  72: '(BA)',
}



console.log(listaBTV[0])



filialUnd.on("change", function (event) {


  $( "#tabelaDePrecos" ).prop( "disabled", false );


  var bodyHtml28 = '';
  var  bodyHtml48 = '';
  var  bodyHtml69 = '';
  var bodyHtml72 = '';
  var  bodyHtml0 = '';


  
  $('#tabelaPrecos').text('Selecione');

  var valueP = $$(this).val();
  console.log(valueP)

  if(valueP == 'SP'){

    $("#tabelaDePrecos option[value='7201801']").remove();
    $("#tabelaDePrecos option[value='7201804']").remove();
    $("#tabelaDePrecos option[value='7201805']").remove();
        $("#tabelaDePrecos option[value='1']").remove();
    $('#tabelaDePrecos').append('<option value="1">CAMPANHA AGLOMERAX - RECRIA</option>');
    $('#tabelaDePrecos').append('<option value="7201801">BOITUVA</option>');
    // $('#tabelaDePrecos').append('<option value="05201804">CAMPO VERDE</option>');
    // $('#tabelaDePrecos').append('<option value="05201805">SAO GABRIEL</option>');

    bodyHtml28 = '2,8 % '+listaBTV[28];
    bodyHtml48 = '4,8 % '+listaBTV[48];
    bodyHtml69 = '6,8 % '+listaBTV[69];
    bodyHtml72 = '7,2 % '+listaBTV[72];
    bodyHtml0 = 'Isento '+listaBTV[0];



    $('#imposto option').each(function() {
            // se localizar a frase, define o atributo selected


            if($(this).val() == '2.8') {
             $(this).text(bodyHtml28)

           }

           if($(this).val() == '4.8') {
             $(this).text(bodyHtml48)

           }


           if($(this).val() == '6.8') {
             $(this).text(bodyHtml69)

           }
           if($(this).val() == '7.2') {
             $(this).text(bodyHtml72)

           }

           if($(this).val() == '0.0') {
             $(this).text(bodyHtml0)

           }


         });



  }

  if(valueP == 'MT'){

    $("#tabelaDePrecos option[value='7201801']").remove();
    $("#tabelaDePrecos option[value='7201804']").remove();
    $("#tabelaDePrecos option[value='7201805']").remove();
    $("#tabelaDePrecos option[value='1']").remove();

    // $('#tabelaDePrecos').append('<option value="05201801">BOITUVA</option>');
    $('#tabelaDePrecos').append('<option value="7201804">CAMPO VERDE</option>');
    // $('#tabelaDePrecos').append('<option value="05201805">SAO GABRIEL</option>');


    bodyHtml28 = '2,8 % '+listaCampoVerde[28];
    bodyHtml48 = '4,8 % '+listaCampoVerde[48];
    bodyHtml69 = '6,9 % '+listaCampoVerde[69];
    bodyHtml72 = '7,2 % '+listaCampoVerde[72];
    bodyHtml0 = 'Isento '+listaCampoVerde[0];

    $("#imposto option[value='2.8']").remove();

    $('#imposto option').each(function() {
            // se localizar a frase, define o atributo selected

            if($(this).val() == '2.8') {
             $(this).text(bodyHtml28)

           }

           if($(this).val() == '4.8') {
             $(this).text(bodyHtml48)

           }


           if($(this).val() == '6.9') {
             $(this).text(bodyHtml69)

           }
           if($(this).val() == '7.2') {
             $(this).text(bodyHtml72)

           }

           if($(this).val() == '0.0') {
             $(this).text(bodyHtml0)

           }


         });



  }


  if(valueP == 'MS'){


    $("#tabelaDePrecos option[value='7201801']").remove();
    $("#tabelaDePrecos option[value='7201804']").remove();
    $("#tabelaDePrecos option[value='7201805']").remove();
    $("#tabelaDePrecos option[value='1']").remove();

    // $('#tabelaDePrecos').append('<option value="05201801">BOITUVA</option>');
    // $('#tabelaDePrecos').append('<option value="05201804">CAMPO VERDE</option>');
    $('#tabelaDePrecos').append('<option value="7201805">SAO GABRIEL</option>');

    bodyHtml28 = '2,8 % '+listaSaoGabrielOeste[28];
    bodyHtml48 = '4,8 % '+listaSaoGabrielOeste[48];
    bodyHtml69 = '6,9 % '+listaSaoGabrielOeste[69];
    bodyHtml72 = '7,2 % '+listaSaoGabrielOeste[72];
    bodyHtml0 = 'Isento '+listaSaoGabrielOeste[0];


    $("#imposto option[value='2.8']").remove();

    $('#imposto option').each(function() {
            // se localizar a frase, define o atributo selected



            if($(this).val() == '4.8') {
             $(this).text(bodyHtml48)

           }


           if($(this).val() == '6.9') {
             $(this).text(bodyHtml69)

           }
           if($(this).val() == '7.2') {
             $(this).text(bodyHtml72)

           }

           if($(this).val() == '0.0') {
             $(this).text(bodyHtml0)

           }


         });



  }


});

var parcelasGravarBd = [];
$selectformapagamento.on("change", function (event) {
  localStorage.removeItem('Pagamento.totaldias')

  var value = $$(this).val();
    // console.log(value)
    // alert(value)

    // if (value == 3) {
    // }


    if (value == 1) {


      $.ajax({
        url: request_url + '/prazosPagamentos/index',
        type: 'GET',
        dataType: 'json',
        data: null,
      })
      .done(function(data) {
        console.log(data)

        var prazos_pagamento = '<option value = ""> Selecione </option>'
        $.each(data, function(index, val) {

          prazos_pagamento +=
          '<option data-totaldias = "'+val.PrazosPagamento.total_dias+'" value="' +
          val.PrazosPagamento.id +
          '" index="' +
          index +
          '">' +
          val.PrazosPagamento.descricao +
          "</option>";


        });

        // console.log(prazos_pagamento)
        $1pagamento.html(prazos_pagamento).on('change', function(event) {

          var total_dias = $("#1pagamento option:selected").attr('data-totaldias');

          localStorage.setItem('Pagamento.totaldias', total_dias)

          console.log(localStorage.getItem('Pagamento.totaldias') )

          event.preventDefault();
          /* Act on the event */
        });


        console.log("success");
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
      

      $liprazodeterminado.show();
      $linumeroparcelas.hide();
    } else if (value == 3) {
      $liprazodeterminado.hide();
      $linumeroparcelas.hide();
      $cbparcelas.hide();
    } else {
      $liprazodeterminado.hide();
      $linumeroparcelas.show();
      $cbparcelas.show();

      var $select_pagamento_2 = $("#2pagamento");

      

      $select_pagamento_2.on("change", function (event) {
        var listel = "";

        var verificaParcelas = '';
        
        if($$(this).val() == 5){

          verificaParcelas = 1;
        }else  if($$(this).val() == 1){


          verificaParcelas = 2;
        }else  if($$(this).val() == 10){


          verificaParcelas = 3;
        }else  if($$(this).val() == 11){


          verificaParcelas = 4;
        }

        var countparcelas = verificaParcelas;
        var $ulparcelas = $$("#parcelas");



        $ulparcelas.html("");

        for (var i = 1; i <= countparcelas; i++) {
          var date_parcela = moment()
          .add(i * 30, "day")
          .format("Y-MM-DD");


          parcelasGravarBd[i] = date_parcela;

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
          // console.log(listel);
          listel = "";
        }

        event.preventDefault();
        /* Act on the event */
      });

    }

    event.preventDefault();
    /* Act on the event */
  });
console.log(parcelasGravarBd);
});

myApp.onPageInit("cliente-detalhe", function (page) {
  myApp.showPreloader();

  mask();
  var $fazendaList = $$("#fazendaList");
  var $btnProximo = $("#buttonProximo1");

  $btnProximo.on("click", function (event) {

    mainView.router.loadPage('cliente-detalhe-2.html');

  });


  var cliente_codigo = localStorage.getItem("Cliente.id");
  var cliente_codigo1 = localStorage.getItem("Cliente.codigo");

  $.ajax({
    url: request_url + "/clientes/view/" + cliente_codigo,
    type: "GET",
    dataType: "json"
  })
  .done(function (data) {






    console.log(data)
    // var $divInfoCliente = $$("#infoPropietario");
    // var $clientenome = $$(".cliente-nome");

    // var $listFazendas = $$("#listFazendas");

    if(data.Cliente.forma_recebimento_boleto == 'Recebimento por E-mail'){


      $("#boletoEmail").prop( "checked", true );
    }else{

      $("#boletoCarga").prop( "checked", true );
    }


    $$(".cliente-nome").text(data.Cliente.nome_completo).trigger("blur");

    $$("#ProprietarioCpf").val(data.Cliente.cpf).trigger("blur");
    $$("#ProprietarioNome").val(data.Cliente.nome_completo).trigger("blur");
    $$("#ProprietarioData_nascimento").val(data.Cliente.data_nascimento).trigger("blur");
    $$("#ProprietarioEndereco").val(data.Cliente.logradouro).trigger("blur");
    $$("#ProprietarioBairro").val(data.Cliente.bairro).trigger("blur");
    $$("#ProprietarioNumero").val(data.Cliente.numero).trigger("blur");
    $$("#ProprietarioComplemento").val(data.Cliente.complemento).trigger("blur");
    $$("#ProprietarioCidade").val(data.Cliente.cidade).trigger("blur");
    $$("#ProprietarioEstado").val(data.Cliente.estado).trigger("blur");
    $$("#ProprietarioCEP").val(data.Cliente.cep).trigger("blur");
    $$("#ProprietarioTelefone").val(data.Cliente.telefone).trigger("blur");
    $$("#ProprietarioCelular").val(data.Cliente.celular).trigger("blur");
    $$("#ProprietarioEmailFinan").val(data.Cliente.email_financeiro).trigger("blur");
    $$("#ProprietarioEmail").val(data.Cliente.email).trigger("blur");
    $$("#ProprietarioNomeContato").val(data.Cliente.nome_contato).trigger("blur");
    $$("#ProprietarioApelido").val(data.Cliente.apelido).trigger("blur");


    console.log("success");
  })
  .fail(function () {
    console.log("error");
  })
  .always(function () {
    myApp.hidePreloader();
  });





  $.ajax({
    url: request_url + "/clientes/view_fazendas/" + cliente_codigo1,
    type: "GET",
    dataType: "json"
  })
  .done(function (data) {

    console.log(data)
    var fazendaOptions = "";

    var item = '';
    $$.each(data, function (index, val) {


     item +=
     '<li data-cliente-id="' +val.Fazenda.codigo +'"  data-fazenda-id="' +val.Fazenda.id +'">' +
     '<a href="#" class="item-link">' +
     '<div class="item-content">' +
     '<div class="item-inner">' +
     '<div class="item-title">' +
     val.Fazenda.nome_completo +
     "</div>" +
     "</div>" +
     "</div>" +
     "</a>" +
     "</li>";

     $fazendaList.html(item).on("click", "li", function () {
      var $li = $(this);
            // var cliente_codigo = $li.attr("data-fazenda-codigo");
            var fazenda_id = $li.attr("data-fazenda-id");

            localStorage.setItem("Fazenda.id", fazenda_id);

            // localStorage.setItem("Cliente.id", cliente_id);

            // var stateFazenda = localStorage.getItem('novaFazenda');


            mainView.router.loadPage("fazenda-detalhe-1.html");
            

            event.preventDefault();
            /* Act on the event */
          });

   });
  });



});


myApp.onPageInit("cliente-detalhe-2", function (page) {


  var $btnProximo = $("#buttonProximo2");

  $btnProximo.on("click", function (event) {

    mainView.router.loadPage('cliente-detalhe-3.html');

  });


  var cliente_codigo = localStorage.getItem("Cliente.id");

  $.ajax({
    url: request_url + "/clientes/view/" + cliente_codigo,
    type: "GET",
    dataType: "json"
  })
  .done(function (data) {


    console.log(data);


    if(data.Fazenda[0].inc_estadual_rural == "ISENTO"){

     $("#checkIsento").prop( "checked", true );

   }

   if(data.Fazenda[0].lei215 != ""){

     $("#lei215").prop( "checked", true );

   } else{

     $("#suframa").prop( "checked", true );

   }


   if(data.Fazenda[0].canal_de_venda == "tradicional"){

     $("#tradicional").prop( "checked", true );

   }else if(data.Fazenda[0].canal_de_venda == "empresarial"){

     $("#empresarial").prop( "checked", true );
   }else if(data.Fazenda[0].canal_de_venda == "cooperativa"){

     $("#cooperativa").prop( "checked", true );
   }else if(data.Fazenda[0].canal_de_venda == "revenda"){

     $("#revenda").prop( "checked", true );
   }
   $$(".cliente-nome").text(data.Cliente.nome_completo).trigger("blur");
   $$("#FazendaNome").val(data.Fazenda[0].nome_completo).trigger("blur");
   $$("#FazendaInscricao").val(data.Fazenda[0].inc_estadual_rural).trigger("blur");
   $$("#FazendaEmailGerente").val(data.Fazenda[0].email).trigger("blur");
   $$("#FazendaNomeContato").val(data.Fazenda[0].nome_contato).trigger("blur");
   $$("#FazendaCodSuframa").val(data.Fazenda[0].codigo_suframa).trigger("blur");

   $$("#FazendaBairro").val(data.Fazenda[0].bairro).trigger("blur");
   $$("#FazendaLogradouro").val(data.Fazenda[0].logradouro).trigger("blur");
   $$("#FazendaNumero").val(data.Fazenda[0].numero).trigger("blur");
   $$("#FazendaCidade").val(data.Fazenda[0].cidade).trigger("blur");
   $$("#FazendaEstado").val(data.Fazenda[0].estado).trigger("blur");
   $$("#FazendaCep").val(data.Fazenda[0].cep).trigger("blur");
   $$("#FazendaComplemento").val(data.Fazenda[0].complemento).trigger("blur");
   $$("#FazendaTelefone").val(data.Fazenda[0].telefone).trigger("blur");
   $$("#FazendaCelular").val(data.Fazenda[0].celular).trigger("blur");
   $$("#outrasInfo1").val(data.Fazenda[0].outras_info).trigger("blur");
   $$("#outrasInfo1").val(data.Fazenda[0].outras_info).trigger("blur");
   $$("#FazendaRoteiro").val(data.Fazenda[0].roteiro).trigger("blur");

 })
  .fail(function () {
    console.log("error");
  })
  .always(function () {
    myApp.hidePreloader();
  }); 

});


myApp.onPageInit("cliente-detalhe-3", function (page) {

  var $btnProximo = $("#buttonProximo3");

  $btnProximo.on("click", function (event) {

    mainView.router.loadPage('cliente-detalhe-4.html');

  });



  var cliente_codigo = localStorage.getItem("Cliente.id");

  $.ajax({
    url: request_url + "/clientes/view/" + cliente_codigo,
    type: "GET",
    dataType: "json"
  })
  .done(function (data) {


    console.log(data);
    $$(".cliente-nome").text(data.Cliente.nome_completo).trigger("blur");

    $$("#bovinos_corte").val(data.Fazenda[0].bovinos_corte).trigger("blur");
    $$("#bovinos_leite").val(data.Fazenda[0].bovinos_leite).trigger("blur");
    $$("#equinos").val(data.Fazenda[0].equinos).trigger("blur");
    $$("#ovinos").val(data.Fazenda[0].ovinos).trigger("blur");
    $$("#suinos").val(data.Fazenda[0].suinos).trigger("blur");
    $$("#aves").val(data.Fazenda[0].aves).trigger("blur");
    $$("#outrosQtde").val(data.Fazenda[0].outros_quantidade).trigger("blur");
    $$("#outros").val(data.Fazenda[0].outros).trigger("blur");
    $$("#consumo_suplemento_mineral").val(data.Fazenda[0].consumo_suplemento_mineral).trigger("blur");
    $$("#consumo_suplemento_proteico").val(data.Fazenda[0].consumo_suplemento_proteico).trigger("blur");
    $$("#racao").val(data.Fazenda[0].racao).trigger("blur");
    $$("#nucleo_premix").val(data.Fazenda[0].nucleo_premix).trigger("blur");

  })
  .fail(function () {
    console.log("error");
  })
  .always(function () {
    myApp.hidePreloader();
  }); 

});


myApp.onPageInit("cliente-detalhe-4", function (page) {

  var cliente_codigo = localStorage.getItem("Cliente.id");

  $.ajax({
    url: request_url + "/clientes/view/" + cliente_codigo,
    type: "GET",
    dataType: "json"
  })
  .done(function (data) {


   console.log(data);
   $$(".cliente-nome").text(data.Cliente.nome_completo).trigger("blur");
   $$("#info_comercial_empresa_1").val(data.Fazenda[0].info_comercial_empresa_1).trigger("blur");
   $$("#info_comercial_cidade_1").val(data.Fazenda[0].info_comercial_cidade_1).trigger("blur");
   $$("#info_comercial_telefone_1").val(data.Fazenda[0].info_comercial_telefone_1).trigger("blur");
   $$("#info_comercial_empresa_2").val(data.Fazenda[0].info_comercial_empresa_2).trigger("blur");
   $$("#info_comercial_cidade_2").val(data.Fazenda[0].info_comercial_cidade_2).trigger("blur");
   $$("#info_comercial_telefone_2").val(data.Fazenda[0].info_comercial_telefone_2).trigger("blur");
   $$("#info_comercial_cidade_2").val(data.Fazenda[0].info_comercial_cidade_2).trigger("blur");

   $$("#pre_empresa_1").val(data.Fazenda[0].pre_empresa_1).trigger("blur");
   $$("#pre_cidade_1").val(data.Fazenda[0].pre_cidade_1).trigger("blur");
   $$("#pre_telefone_1").val(data.Fazenda[0].pre_telefone_1).trigger("blur");

   $$("#pre_empresa_2").val(data.Fazenda[0].pre_empresa_2).trigger("blur");
   $$("#pre_cidade_2").val(data.Fazenda[0].pre_cidade_2).trigger("blur");
   $$("#pre_telefone_2").val(data.Fazenda[0].pre_telefone_2).trigger("blur");

   $$("#dados_bancarios_banco").val(data.Fazenda[0].banco_nome).trigger("blur");
   $$("#dados_bancarios_agencia").val(data.Fazenda[0].dados_bancarios_agencia).trigger("blur");
   $$("#dados_bancarios_conta").val(data.Fazenda[0].dados_bancarios_conta).trigger("blur");
   $$("#dados_bancarios_titular").val(data.Fazenda[0].dados_bancarios_titular).trigger("blur");
   $$("#dados_bancarios_cpf").val(data.Fazenda[0].dados_bancarios_cpf).trigger("blur");

 })
  .fail(function () {
    console.log("error");
  })
  .always(function () {
    myApp.hidePreloader();
  }); 
  
});

myApp.onPageInit("pesquisar-produtos", function (page) {
  myApp.showPreloader();

  var $produtosList = $$("#produtosList");

  $.ajax({
    url: request_url + "/produtos/index/",
    type: "GET",
    dataType: "json"
  })
  .done(function (data) {
    var html = "";

    $$.each(data, function (index, val) {

      var nome_1 = '';
      var nome_2 = '';

      try{
        nome_1 = val.Produto.nome.split('-')[0];
        nome_2 = val.Produto.nome.split('-')[1];
      }catch(err){
        nome_1 = val.Produto.nome;
        nome_2 = '';
      }

      if( val.TabelaDePrecoProduto[0] ){
        var preco = val.TabelaDePrecoProduto[0].preco_tabela;
      }else{
        var preco = 0.0;
      }

      html +=
      '<li index="' + index + '" data-valor="'+preco+'">' +
      '<a href = "#"  class=" link item-link item-content">' +
      '<div class="item-media">' +
      '<img src="img/connan-default.jpg" width="44">' +
      "</div>" +

      '<div class="item-inner">' +
      '<div class="item-title-row">' +
      '<div class="item-title">' +
      nome_1  +
      "</div>" +

      '<div class="item-title">' +
      nome_2  +
      "</div>" +

      '<div class="item-subtitle">' +
      val.Produto.codigo +
      "</div>" +
      "</div>" +
      "</div>" +
      "</a>" +
      "</li>";
    });

    $produtosList.append(html).on("click", "li", function (event) {


      myApp.popup(".popup-produtoinfo", true);

      $('#itemPrecoProduto').val( $(this).data('valor') );


      $("#btnAdicionaItem").hide();
    });

    console.log("success");
  })
  .fail(function () {
    console.log("error");
  })
  .always(function () {
    myApp.hidePreloader();
    console.log("complete");
  });
});

myApp.onPageInit("*", function (page) {
  // console.log(page.name)
  //
  var simulador = localStorage.getItem("Simulador.ativo");

  var $btnDescartaSimulacao = $("#btnDescartaSimulacao");

  var pages = [
  "novo-pedido",
  "novo-pedido-1",
  "novo-pedido-2",
  "novo-pedido-3"
  ];

  if (true && page.name != "home") {
    var offlineheader =
    '<div class="subnavbar" style="height:14px; font-size: 12px; background-color: black; color: white">' +
    '<div class="navtext" style="margin: 0 auto">' +
    "MODO OFFLINE" +
    "</div>" +
    "</div>";

    // $('.navbar').append(offlineheader)
  }

  var ispagina = pages.indexOf(page.name);

  // console.log('ispagina', ispagina)
  if (ispagina !== -1) {
    if (simulador == "1") {
      $btnDescartaSimulacao.unbind("click").show().on("click", function (event) {
        myApp.confirm("Deseja descartar esta simulação?", function () {

          myApp.showPreloader()

          if(pedido_id == null){
            gotoMain();

          }else{

            var pedido_id = localStorage.getItem('Pedido.id')
            $.ajax({
              url: request_url+'/pedidos/delete/'+pedido_id,
              type: 'POST',
              dataType: 'json',
              data: {
                id: pedido_id
              },
            })
            .done(function() {
              gotoMain();
              console.log("success");
            })
            .fail(function() {
              myApp.alert('Ocorreu um erro, tente novamente.')
              console.log("error");
            })
            .always(function() {

              console.log("complete");
            });

          }

        });
        event.preventDefault();
      });
    }
  } else {
    $btnDescartaSimulacao.hide().unbind("click");
  }
});

myApp.onPageInit("home", function () {
 localStorage.removeItem("Pedido.prazos_pagamento");
 localStorage.removeItem("Pagamento.totaldias");

 var yourCallbackFunction = function () {
  return false;
};

document.addEventListener("backbutton", yourCallbackFunction, false);

mainView.history = [];
});

myApp.onPageInit('nova-fazenda-4', function(page){


 $.getJSON('estados_cidades.json', function (data) {

  var items = [];
  var options = '<option value="">SELECIONE UM ESTADO</option>';  

  $.each(data, function (key, val) {
    options += '<option value="' + val.sigla + '">' + val.nome + '</option>';
  });


  $("#filtroEstado1").html(options); 

  $("#filtroEstado1").change(function () {
   $( "#filtroCidade1" ).prop( "disabled", false );
   var options_cidades = '<option value="">SELECIONE UMA CIDADE</option>';
   var str = "";         

   $("#filtroEstado1 option:selected").each(function () {
    str += $(this).text();
  });

   $.each(data, function (key, val) {
    if(val.nome == str) {             
      $.each(val.cidades, function (key_city, val_city) {
        options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
      });             
    }
  });
   $("#filtroCidade1").html(options_cidades);

 }).change();    

});



 $.getJSON('estados_cidades.json', function (data) {

  var items = [];
  var options = '<option value="">SELECIONE UM ESTADO</option>';  

  $.each(data, function (key, val) {
    options += '<option value="' + val.sigla + '">' + val.nome + '</option>';
  });


  $("#filtroEstado2").html(options); 

  $("#filtroEstado2").change(function () {
   $( "#filtroCidade2" ).prop( "disabled", false );
   var options_cidades = '<option value="">SELECIONE UMA CIDADE</option>';
   var str = "";         

   $("#filtroEstado2 option:selected").each(function () {
    str += $(this).text();
  });
   $.each(data, function (key, val) {
    if(val.nome == str) {             
      $.each(val.cidades, function (key_city, val_city) {
        options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
      });             
    }
  });
   $("#filtroCidade2").html(options_cidades);

 }).change();    

});


 $.getJSON('estados_cidades.json', function (data) {

  var items = [];
  var options = '<option value="">SELECIONE UM ESTADO</option>';  

  $.each(data, function (key, val) {
    options += '<option value="' + val.sigla + '">' + val.nome + '</option>';
  });


  $("#filtroEstado3").html(options); 

  $("#filtroEstado3").change(function () {

    $( "#filtroCidade3" ).prop( "disabled", false );
    var options_cidades = '<option value="">SELECIONE UMA CIDADE</option>';
    var str = "";         

    $("#filtroEstado3 option:selected").each(function () {
      str += $(this).text();
    });
    $.each(data, function (key, val) {
      if(val.nome == str) {             
        $.each(val.cidades, function (key_city, val_city) {
          options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
        });             
      }
    });
    $("#filtroCidade3").html(options_cidades);

  }).change();    

});


 $.getJSON('estados_cidades.json', function (data) {

  var items = [];
  var options = '<option value="">SELECIONE UM ESTADO</option>';  

  $.each(data, function (key, val) {
    options += '<option value="' + val.sigla + '">' + val.nome + '</option>';
  });


  $("#filtroEstado4").html(options); 

  $("#filtroEstado4").change(function () {

    $( "#filtroCidade4" ).prop( "disabled", false );
    var options_cidades = '<option value="">SELECIONE UMA CIDADE</option>';
    var str = "";         

    $("#filtroEstado4 option:selected").each(function () {
      str += $(this).text();
    });
    $.each(data, function (key, val) {
      if(val.nome == str) {             
        $.each(val.cidades, function (key_city, val_city) {
          options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
        });             
      }
    });
    $("#filtroCidade4").html(options_cidades);

  }).change();    

});




 var cliente_codigo = localStorage.getItem("Cliente.codigo");

 var fazenda_id = localStorage.getItem('Fazenda.id');


 $.ajax({
  url: request_url + "/clientes/view_fazendas/" + cliente_codigo,
  type: "GET",
  dataType: "json"
})
 .done(function (data) {
   console.log(data);



   if(data[0].Fazenda.info_comercial_cidade_1 != '' && data[0].Fazenda.info_comercial_cidade_1 != null){

    var info_comercial_cidade_1 = data[0].Fazenda.info_comercial_cidade_1.split('-');
    // console.log(info_comercial_cidade_1)


    $$("#cidade-after12").text(info_comercial_cidade_1[0]);

    $$("#cidade-11").val(info_comercial_cidade_1[0]);

    $$("#filtroEstado1").val(info_comercial_cidade_1[1]).trigger("blur");

    $( "#filtroCidade1" ).prop( "disabled", true );

    $.getJSON('estados_cidades.json', function (data) {

      $.each(data, function (key, val) {
        // console.log(val.sigla == )

        if (val.sigla ==  info_comercial_cidade_1[1]) {

          $$("#estado-after1").text(val.nome);

        }


      });

    });





  }


  if(data[0].Fazenda.info_comercial_cidade_2 != '' && data[0].Fazenda.info_comercial_cidade_2 != null){

   var info_comercial_cidade_2 = data[0].Fazenda.info_comercial_cidade_2.split('-');

        // $$("#info_comercial_cidade_2").val(info_comercial_cidade_2[0]).trigger("blur");
     // $$("#info_comercial_cidade_2_uf").val(info_comercial_cidade_2[1]).trigger("blur");


     console.log(info_comercial_cidade_2)
     $$("#cidade-after22").text(info_comercial_cidade_2[0]);
     $$("#cidade-22").val(info_comercial_cidade_2[0]);
     $$("#filtroEstado2").val(info_comercial_cidade_2[1]).trigger("blur");

     $( "#filtroCidade2" ).prop( "disabled", true );

     $.getJSON('estados_cidades.json', function (data) {

      $.each(data, function (key, val) {
        // console.log(val.sigla == )

        if (val.sigla ==  info_comercial_cidade_2[1]) {

          $$("#estado-after22").text(val.nome);

        }


      });

    });


   }



   if(data[0].Fazenda.pre_cidade_1 != '' && data[0].Fazenda.pre_cidade_1 != null){

     var pre_cidade_1 = data[0].Fazenda.pre_cidade_1.split('-');

     $$("#cidade-after33").text(pre_cidade_1[0]);
     $$("#filtroEstado3").val(pre_cidade_1[1]).trigger("blur");

     $$("#cidade-33").val(pre_cidade_1[0]);


     $( "#filtroCidade3" ).prop( "disabled", true );

     $.getJSON('estados_cidades.json', function (data) {

      $.each(data, function (key, val) {
        // console.log(val.sigla == )

        if (val.sigla ==  pre_cidade_1[1]) {

          $$("#estado-after33").text(val.nome);

        }


      });

    });




   }


   if(data[0].Fazenda.pre_cidade_2 != '' && data[0].Fazenda.pre_cidade_2 != null){

     var pre_cidade_2 = data[0].Fazenda.pre_cidade_2.split('-');

     $$("#pre_cidade_2").val(pre_cidade_2[0]).trigger("blur");
     $$("#pre_cidade_2_uf").val(pre_cidade_2[1]).trigger("blur");

     $$("#cidade-44").val(pre_cidade_2[0]);
     $$("#cidade-after44").text(pre_cidade_2[0]);
     $$("#filtroEstado4").val(pre_cidade_2[1]).trigger("blur");


     $( "#filtroCidade4" ).prop( "disabled", true );

     $.getJSON('estados_cidades.json', function (data) {

      $.each(data, function (key, val) {
        // console.log(val.sigla == )

        if (val.sigla ==  pre_cidade_2[1]) {

          $$("#estado-after44").text(val.nome);

        }


      });

    });


   }




   $$("#info_comercial_empresa_1").val(data[0].Fazenda.info_comercial_empresa_1).trigger("blur");

   


   $$("#info_comercial_telefone_1").val(data[0].Fazenda.info_comercial_telefone_1).trigger("blur");
   $$("#info_comercial_empresa_2").val(data[0].Fazenda.info_comercial_empresa_2).trigger("blur");











   $$("#info_comercial_telefone_2").val(data[0].Fazenda.info_comercial_telefone_2).trigger("blur");


   $$("#pre_empresa_1").val(data[0].Fazenda.pre_empresa_1).trigger("blur");



   $$("#pre_telefone_1").val(data[0].Fazenda.pre_telefone_1).trigger("blur");

   $$("#pre_empresa_2").val(data[0].Fazenda.pre_empresa_2).trigger("blur");



   $$("#pre_telefone_2").val(data[0].Fazenda.pre_telefone_2).trigger("blur");

   $$("#dados_bancarios_banco").val(data[0].Fazenda.banco_nome).trigger("blur");
   $$("#dados_bancarios_agencia").val(data[0].Fazenda.dados_bancarios_agencia).trigger("blur");
   $$("#dados_bancarios_conta").val(data[0].Fazenda.dados_bancarios_conta).trigger("blur");
   $$("#dados_bancarios_titular").val(data[0].Fazenda.dados_bancarios_titular).trigger("blur");
   $$("#dados_bancarios_cpf").val(data[0].Fazenda.dados_bancarios_cpf).trigger("blur");
 })
.fail(function () {
  console.log("error");
})
.always(function () {
  myApp.hidePreloader();
}); 








  // $.ajax({
  //   url: request_url + "/clientes/view/" + cliente_codigo,
  //   type: "GET",
  //   dataType: "json"
  // })
  // .done(function (data) {


  //    console.log(data);
  //     $$(".cliente-nome").text(data.Cliente.nome_completo).trigger("blur");
  //    $$("#info_comercial_empresa_1").val(data.Fazenda[0].info_comercial_empresa_1).trigger("blur");
  //    $$("#info_comercial_cidade_1").val(data.Fazenda[0].info_comercial_cidade_1).trigger("blur");
  //    $$("#info_comercial_telefone_1").val(data.Fazenda[0].info_comercial_telefone_1).trigger("blur");
  //    $$("#info_comercial_empresa_2").val(data.Fazenda[0].info_comercial_empresa_2).trigger("blur");
  //    $$("#info_comercial_cidade_2").val(data.Fazenda[0].info_comercial_cidade_2).trigger("blur");
  //    $$("#info_comercial_telefone_2").val(data.Fazenda[0].info_comercial_telefone_2).trigger("blur");
  //    $$("#info_comercial_cidade_2").val(data.Fazenda[0].info_comercial_cidade_2).trigger("blur");

  //    $$("#pre_empresa_1").val(data.Fazenda[0].pre_empresa_1).trigger("blur");
  //    $$("#pre_cidade_1").val(data.Fazenda[0].pre_cidade_1).trigger("blur");
  //    $$("#pre_telefone_1").val(data.Fazenda[0].pre_telefone_1).trigger("blur");

  //    $$("#pre_empresa_2").val(data.Fazenda[0].pre_empresa_2).trigger("blur");
  //    $$("#pre_cidade_2").val(data.Fazenda[0].pre_cidade_2).trigger("blur");
  //    $$("#pre_telefone_2").val(data.Fazenda[0].pre_telefone_2).trigger("blur");

  //    $$("#dados_bancarios_banco").val(data.Fazenda[0].banco_nome).trigger("blur");
  //    $$("#dados_bancarios_agencia").val(data.Fazenda[0].dados_bancarios_agencia).trigger("blur");
  //    $$("#dados_bancarios_conta").val(data.Fazenda[0].dados_bancarios_conta).trigger("blur");
  //    $$("#dados_bancarios_titular").val(data.Fazenda[0].dados_bancarios_titular).trigger("blur");
  //    $$("#dados_bancarios_cpf").val(data.Fazenda[0].dados_bancarios_cpf).trigger("blur");

  //   })
  // .fail(function () {
  //   console.log("error");
  // })
  // .always(function () {
  //   myApp.hidePreloader();
  // }); 
  




  var $btnFinalizarCadastroFazenda = $('#btnFinalizarCadastroFazenda')

  $btnFinalizarCadastroFazenda.on('click', function(event) {

    var formData = myApp.formToData("#novaFazenda3");


    myApp.showPreloader("Finalizando...");

    console.log(formData);

    if(formData.info_comercial_empresa_1 == ''){
      myApp.hidePreloader();
      myApp.alert('Informações Comerciais:<br> Inserir Nome da primeira Empresa');
      return false;

    }else if(formData.info_comercial_cidade_1 == '' && $('#cidade-11').val() == ''){

     myApp.hidePreloader();
     myApp.alert('Informações Comerciais:<br> Inserir a cidade primeira Empresa');
     return false;


   }else if(formData.pre_empresa_1 == ''){

     myApp.hidePreloader();
     myApp.alert('Empresas das quais adquiriu suplementos:<br> Inserir Nome da primeira Empresa');
     return false;


   }else if(formData.pre_cidade_1 == '' && $('#cidade-33').val() == ''){

     myApp.hidePreloader();
     myApp.alert('Empresas das quais adquiriu suplementos:<br> Inserir a cidade primeira Empresa');
     return false;


   }


   var clienteValidaCPF = $("#dados_bancarios_cpf").val();

   if(clienteValidaCPF != ''){

     let novoCPF = clienteValidaCPF.replace('.', '');
     novoCPF = novoCPF.replace('.', '');
     novoCPF = novoCPF.replace('/', '');
     novoCPF = novoCPF.replace('-', '');

     let result  = '';

     if(novoCPF.length <= 11){

      result = clienteValidate.is_cpf(novoCPF);

      if(result == false){
       myApp.hidePreloader();
       myApp.alert('Digite um CPF válido');
       $("#dados_bancarios_cpf").focus();
       return false
     } 

   }else{

    result = clienteValidate.is_cnpj(novoCPF);
    if(result == false){
      myApp.hidePreloader();
      myApp.alert('Digite um CNPJ válido');
      $("#dados_bancarios_cpf").focus();
      return false
    } 

  }

}



    // setTimeout(function(){


     formData.id = localStorage.getItem('Fazenda.id');
     var cidade11 = '';
     var cidade22 = '';
     var cidade33 = '';
     var cidade44 = '';

     if(formData.info_comercial_cidade_1 == '' && $('#cidade-11').val() != '' ){


      cidade11 = $('#cidade-11').val()

    }else{
     cidade11 = formData.info_comercial_cidade_1

   }

   if(formData.info_comercial_cidade_2 == '' && $('#cidade-22').val() != '' ){


    cidade22 = $('#cidade-22').val()

  }else{
   cidade22 = formData.info_comercial_cidade_2

 }


 if(formData.pre_cidade_1 == '' && $('#cidade-33').val() != '' ){


  cidade33 = $('#cidade-33').val()

}else{
 cidade33 = formData.pre_cidade_1

}


if(formData.pre_cidade_2 == '' && $('#cidade-44').val() != '' ){


  cidade44 = $('#cidade-44').val()

}else{
 cidade44 = formData.pre_cidade_2

}



formData.info_comercial_cidade_1 = cidade11+'-'+formData.info_comercial_cidade_1_uf;
formData.info_comercial_cidade_2 = cidade22+'-'+formData.info_comercial_cidade_2_uf;
formData.pre_cidade_1 = cidade33+'-'+formData.pre_cidade_1_uf;
formData.pre_cidade_2 = cidade44+'-'+formData.pre_cidade_2_uf;


console.log(formData)
     // console.log(formData.info_comercial_cidade_2)
     // console.log(formData.pre_cidade_1)
     // console.log(formData.pre_cidade_2)
     // return false


     $.ajax({
      url: request_url+'/fazendas/edit',
      type: 'POST',
      dataType: 'json',
      data: formData
    })
     .done(function(data) {
      myApp.hidePreloader();
      myApp.alert('Cadastro finalizado com sucesso.', function(){


        gotoMain()
      })



      console.log("success");
    })
     .fail(function() {
      console.log("error");
    })
     .always(function() {
      console.log("complete");
    });




     event.preventDefault();
   });



})



myApp.onPageInit('nova-fazenda-3', function(page){



  var $btnNovaFazenda2Proximo = $('#btnProximo2')


  $btnNovaFazenda2Proximo.on('click', function(event) {

    var formData = myApp.formToData("#novaFazenda2");
    formData.id = localStorage.getItem('Fazenda.id');


    if( formData.bovinos_corte == '' && formData.bovinos_leite == '' && formData.equinos == ''
      && formData.ovinos == '' && formData.suinos == '' && formData.aves == ''
      && formData.outros == '' && formData.outrosQtde == ''){

     myApp.hidePreloader();
   myApp.alert('Preencher ao menos 1 campo');
   return false;

 }


 if(formData.outros != "" && formData.outrosQtde == ''){
  myApp.hidePreloader();
  myApp.alert('Inserir a quantidade para Outros');
  return false;

}

$.ajax({
  url: request_url+'/fazendas/edit',
  type: 'POST',
  dataType: 'json',
  data: formData
})
.done(function() {
  mainView.router.loadPage('nova-fazenda-3.html')
  console.log("success");
})
.fail(function() {
  console.log("error");
})
.always(function() {
  console.log("complete");
});



event.preventDefault();
/* Act on the event */
});



})


myApp.onPageInit('nova-fazenda-2', function(page){

  var $inscricao_estadual = $$('#Clienteinc_estadual')
  var isento_check = $("#checkIsento").is(":checked")
  $('#checkIsento').on('change', function(event) {

    var checked = this.checked;
    $inscricao_estadual.attr({
      // readonly: checked ? 'readonly' : null,
      value: checked ? 'ISENTO' : ''
    }).trigger('blur');

  });




  var $btnProximo = $("#btnProximo");

  var cliente_id = localStorage.getItem("Cliente.id");
  var cliente_codigo = localStorage.getItem('Cliente.codigo')


  $.getJSON('estados_cidades.json', function (data) {

    var items = [];
    var options = '<option value="">SELECIONE UM ESTADO</option>';  

    $.each(data, function (key, val) {
      options += '<option value="' + val.sigla + '">' + val.nome + '</option>';
    });


    $("#filtroEstado-3").html(options); 

    $("#filtroEstado-3").change(function () {

      var options_cidades = '<option value="">SELECIONE UMA CIDADE</option>';
      var str = "";         

      $("#filtroEstado-3 option:selected").each(function () {
        str += $(this).text();
      });
      $.each(data, function (key, val) {
        if(val.nome == str) {             
          $.each(val.cidades, function (key_city, val_city) {
            options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
          });             
        }
      });
      $("#filtroCidade-3").html(options_cidades);

    }).change();    

  });

  $btnProximo.on("click", function (event) {

    var formData = myApp.formToData("#formCliente2");
    var lei215 = '';

    var filtroEstado3 =  $("#filtroEstado-3").val(); 
    var filtroCidade3 =  $("#filtroCidade-3").val(); 

    if(formData.nome_completo == ''){
      myApp.hidePreloader();
      myApp.alert('Inserir Nome da fazenda');
      return false;

    }else if(formData.inc_estadual == ''){

     myApp.hidePreloader();
     myApp.alert('Inserir a inscrição estadual');
     return false;

   }else if(formData.email == ''){

     myApp.hidePreloader();
     myApp.alert('Inserir E-mail Gerente Faz/Comprador');
     return false;


   }else if(formData.nomeContatoFazenda == ''){

     myApp.hidePreloader();
     myApp.alert('Inserir Nome de Contato');
     return false;


   }else if(formData.canalvenda == ''){

     myApp.hidePreloader();
     myApp.alert('Escolher o canal de venda');
     return false;
   }else if(formData.logradouro1 == ''){

     myApp.hidePreloader();
     myApp.alert('Inserir o endereço');
     return false;
   }else if(formData.bairro1 == ''){

     myApp.hidePreloader();
     myApp.alert('Inserir o Bairro');
     return false;
   }else if(formData.numero1 == ''){

     myApp.hidePreloader();
     myApp.alert('Inserir o número');
     return false;
   }else if(filtroCidade3 == ''){

     myApp.hidePreloader();
     myApp.alert('Inserir o município');
     return false;
   }else if(filtroEstado3 == ''){

     myApp.hidePreloader();
     myApp.alert('Inserir o estado');
     return false;
   }else if(formData.cep1 == ''){

     myApp.hidePreloader();
     myApp.alert('Inserir o cep');
     return false;
   }else if( formData.telefone1 == '' && formData.celular1 == ''  ){

     myApp.hidePreloader();
     myApp.alert('Inserir o telefone ou celular');
     return false;
   }else if( formData.roteiro == '' ){

     myApp.hidePreloader();
     myApp.alert('Inserir o roteiro');
     return false;

   }


   if(formData.suframa == 'lei215'){

    lei215 = 'lei215';

  }



  if(formData.cep1 < 9){
   myApp.hidePreloader();
   myApp.alert('Insira um CEP válido');

   return false;

 }




 if( formData.telefone1 != '' ){

  if ( formData.telefone1.length < 14) {

    myApp.hidePreloader();
    return myApp.alert('Insira um Telefone válido');

  }

}

if( formData.celular1 != '' ){

  if ( formData.celular1.length < 15) {

    myApp.hidePreloader();
    return myApp.alert('Insira um Celular válido');

  }

}


var $inscricao_estadualValor =  $$('#Clienteinc_estadual').val();
var emailFazenda = $$('#emailFazenda').val();
var nomeContatoFazenda = $$('#nomeContatoFazenda').val();
var outrasInfo = $('#outrasInfo1').val();



$.ajax({
  url: request_url + "/fazendas/add",
  type: "POST",
  dataType: "json",
  data: {
    cliente_id: cliente_codigo,
    cliente_codigo: cliente_codigo,
    inc_estadual_rural: $inscricao_estadualValor,
    nome_completo: formData.nome_completo,
    codigo_suframa: formData.codigo_suframa,
    lei215: lei215,
    canal_de_venda: formData.canalvenda,
    email: emailFazenda,
    nome_contato: nomeContatoFazenda,
    roteiro: formData.roteiro,
    bairro: formData.bairro1, 
    cep: formData.cep1,
    estado: filtroEstado3,
    cidade: filtroCidade3,
    complemento: formData.complemento1,
    logradouro: formData.logradouro1,
    numero: formData.numero1,
    celular: formData.celular1,
    telefone: formData.telefone1,
    outras_info: outrasInfo,
  }
})
.done(function (data) {
      // console.log(data);

      localStorage.setItem("Fazenda.id", data.data.fazenda_id);
      mainView.router.loadPage("nova-fazenda-2.html");
      event.preventDefault();

      console.log("success");
    })
.fail(function () {
  console.log("error");
})
.always(function () {});

    // console.log(formData);
    /* Act on the event */
  });





})



myApp.onPageInit("modo-offline", function () {
  var $checkOffline = $("#modoOffline");

  var $systemStatus = $("#systemStatus");
  $systemStatus.hide();

  $checkOffline.on("change", function (event) {
    if ($checkOffline.is(":checked")) {
      myApp.confirm(
        "Deseja ativar o modo offline?",
        function () {
          $systemStatus.slideDown(400, function () {
            $checkOffline.closest(".label-switch").addClass("disabled");

            var app = new App();
            app.status = 0;

            app.open();

            app.downloadDB(function () {
              app.status = 1;

              app.tablesInit(function () {
                app.status = 2;

                app.downloadData(function () {
                  app.status = 3;

                  app.dataApply(function () {
                    app.setDb();
                    app.status = 4;
                    $checkOffline
                    .closest(".label-switch")
                    .removeClass("disabled");
                  }, app.status);
                }, app.status);
              }, app.status);
            }, app.status);
          });
        },
        function () {
          $checkOffline.prop("checked", false);
        }
        );
    } else {}

    event.preventDefault();
    /* Act on the event */
  });
});


function mask(){

  var options_cpf_cnpj =  {
    onKeyPress: function(cep, e, field, options) {
      var masks = ['000.000.000-000', '00.000.000/0000-00'];
      var mask = (cep.length>14) ? masks[1] : masks[0];
      $('.mask-cpf-cnpj').mask(mask, options_cpf_cnpj);
    }};

    var options_telefone_celular =  {
      onKeyPress: function(cep, e, field, options) {
        var masks = ['(00) 0000-00000', '(00) 00000-0000'];
        var mask = (cep.length>14) ? masks[1] : masks[0];
        $('.mask-telefone-celular').mask(mask,  options_telefone_celular);
      }};

      $('.mask-telefone-celular').mask('(00) 0000-00000', options_telefone_celular);
      $('.mask-telefone').mask('(00) 0000-0000');
      $('.mask-celular').mask('(00) 00000-0000');
      $('.mask-cpf-cnpj').mask('000.000.000-00', options_cpf_cnpj);
      $('.mask-cpf').mask('000.000.000-00');
      $('.mask-cnpj').mask('00.000.000/0000-00');
      $('.mask-placa').mask('AAA-0000');
      $('.mask-hora').mask('00:00');
      $('.mask-data').mask('00/00/0000');
      $('.mask-numero').mask('0#');
      $('.mask-cep').mask('00000-000');

    }





    myApp.onPageInit("aprovacao-pedidos", function (event) {
      var usuario_id = localStorage.getItem("Usuario.id");
      var perfilUsuario = localStorage.getItem("Usuario.usuario_tipo_id");
      var usuario_codigo = localStorage.getItem("Usuario.codigo");
      var $pedidoList = $("#pedidosList");



      myApp.showPreloader("Carregando...");

      if(perfilUsuario == 8){

       $.ajax({
        url: request_url + "/pedidos/aprovacaoPedidos/",
        type: "GET",
        dataType: "json",
        data: {
          usuario_id: usuario_id
        }
      })
       .done(function (data) {


        var pedidoListHtml = "";

        if (data.length == 0) {
          return myApp.alert("Nenhum pedido encontrado.", function () {
            mainView.router.back();
          });
        }



        $.each(data, function (index, val) {

          var total = 10 - val.Pedido.id.length;

          var pedido_cod = '';

          for ( var i = 1; i <= total; i++ ) {

            pedido_cod += '0';

          }


          var pedido_cod_fim = pedido_cod+val.Pedido.id


          var hora_pedido = val.Pedido.created.split(" ")[1];
          hora_pedido =  hora_pedido.split(":");

          var data_pedido = val.Pedido.created.split(" ")[0]
          data_pedido = data_pedido.split('-');



          if( val.Pedido.pedido_status_id == 9){
            var color_bg = 'bg-red';
            var fa_icon = 'fa-times';

          }else if( val.Pedido.pedido_status_id == 1 || val.Pedido.pedido_status_id == 6 || val.Pedido.pedido_status_id == 10  ){

            var color_bg = 'bg-yellow';
            var fa_icon = 'fa-check';

          }else{    
            var color_bg = 'bg-lightgreen';
            var fa_icon = 'fa-check';
          }

          var item =
          '<li data-pedido-id = "' + val.Pedido.id + '" data-pedido-status =" ' + val.Status.id + ' ">' +
          '<a href="#" class="item-link item-content">' +
          '<div class="item-inner">' +
          '<div class="item-title-row">' +
          '<div class="item-title">' +
          (val.Cliente.nome_completo == null ?
            "Cliente não vinculado" :
            val.Cliente.nome_completo) +
          "</div>" +

          '<div class="item-after">' +
          data_pedido[2]+'/'+data_pedido[1]+'/'+data_pedido[0]  + ' '+ hora_pedido[0]+':'+hora_pedido[1] +
          "</div>" +
          "</div>" +
          '<div class="item-subtitle">' +
          (val.Cliente.telefone == null ? "" : val.Cliente.telefone) +
          "</div>" +
          '<div class="item-subtitle">' +
          (val.Pedido.id == null ? "" : pedido_cod_fim) +
          "</div>" +

          '<div class="item-text">' +
          '<div class="chip chip-small">' +
          '<div class="chip-media '+color_bg+' ">' +
          '<i class="fa '+fa_icon+'"></i>' +
          "</div>" +
          '<div class="chip-label">' +
          (val.Status.nome == null ? "" : val.Status.nome) +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</a>" +
          "</li>";

          pedidoListHtml += item;
          
        });

      // console.log(pedidoListHtml)
      $pedidoList.html("").append(pedidoListHtml).on("click", "li", function (event) {
        var $li = $(this);
        var pedido_id = $li.attr("data-pedido-id");
        var pedido_status_id = $li.attr("data-pedido-status");
        // console.log(pedido_status_idss)
          // return alert(pedido_id)

          if(pedido_status_id == 1){
            var buttons = [

            {
              text: "Ver Detalhes",
              bold: true,
              onClick: function () {
                localStorage.setItem("Pedido.id", pedido_id);
                localStorage.setItem("Pedido.detalhes", "1");
                localStorage.setItem("Pedido.detalhesAprovacao", "1");

                mainView.router.loadPage("novo-pedido-3.html");
                event.preventDefault();
              },
            },

            {
              text: "Aprovar Pedido",
              onClick: function () {

                myApp.confirm("Deseja Aprovar este pedido?", function () {


                  $.ajax({
                    url: request_url+'/pedidos/enviar_email/'+pedido_id,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        // param1: 'value1'
                      },
                    })
                  .done(function(data) {

                    console.log(data)
                  })
                  .fail(function() {
                    console.log("error");
                  })
                  .always(function() {
                   myApp.hidePreloader();
                   console.log("complete");
                 });


                  $.ajax({
                    url: request_url + "/pedidos/edit/" + pedido_id,
                    type: "POST",
                    dataType: "json",
                    data: {
                      id: pedido_id,
                      pedido_status_id: 2,
                      user_id:usuario_id
                    }
                  })
                  .done(function () {


                    console.log("success");
                  })
                  .fail(function () {
                    console.log("error");
                  })
                  .always(function () {
                    myApp.hidePreloader();
                    var toast = myApp.toast(
                      "Pedido aprovado.",
                      '<i class="fa fa-check"></i>'
                      );
                    toast.show();


                    mainView.router.refreshPage();

                    console.log("complete");
                  });
                });
              },
              color: "green"
            },

            {
              text: "Reprovar Pedido",
              // disabled:true,
              onClick: function () {
                // myApp.showPreloader()

                myApp.confirm("Deseja reprovar este pedido?", function () {
                  $.ajax({
                    url: request_url + "/pedidos/edit/" + pedido_id,
                    type: "POST",
                    dataType: "json",
                    data: {
                      id: pedido_id,
                      pedido_status_id: 3,
                      user_id:usuario_id
                    }
                  })
                  .done(function () {
                    console.log("success");
                  })
                  .fail(function () {
                    console.log("error");
                  })
                  .always(function () {
                    myApp.hidePreloader();
                    var toast = myApp.toast(
                      "Pedido reprovado.",
                      '<i class="fa fa-check"></i>'
                      );
                    toast.show();
                    mainView.router.refreshPage();

                    console.log("complete");
                  });
                });
              },
              color: "red",
              bold: true
            }
            ];
          }else{

            var buttons = [

            {
              text: "Ver Detalhes",
              bold: true,
              onClick: function () {
                localStorage.setItem("Pedido.id", pedido_id);
                localStorage.setItem("Pedido.detalhes", "1");
                localStorage.setItem("Pedido.detalhesAprovacao", "1");

                mainView.router.loadPage("novo-pedido-3.html");
                event.preventDefault();
              },
            },

            {
              text: "Liberar Pedido",
              onClick: function () {

                myApp.confirm("Deseja Liberar este pedido?", function () {


                  $.ajax({
                    url: request_url + "/pedidos/edit/" + pedido_id,
                    type: "POST",
                    dataType: "json",
                    data: {
                      id: pedido_id,
                      pedido_status_id: 11,
                      user_id:usuario_id
                    }
                  })
                  .done(function () {


                    console.log("success");
                  })
                  .fail(function () {
                    console.log("error");
                  })
                  .always(function () {
                    myApp.hidePreloader();
                    var toast = myApp.toast(
                      "Pedido aprovado.",
                      '<i class="fa fa-check"></i>'
                      );
                    toast.show();


                    mainView.router.refreshPage();

                    console.log("complete");
                  });
                });
              },
              color: "green"
            },

            {
              text: "Bloquear Pedido",
              // disabled:true,
              onClick: function () {
                // myApp.showPreloader()

                myApp.confirm("Deseja bloquear este pedido?", function () {
                  $.ajax({
                    url: request_url + "/pedidos/edit/" + pedido_id,
                    type: "POST",
                    dataType: "json",
                    data: {
                      id: pedido_id,
                      pedido_status_id: 12,
                      user_id:usuario_id
                    }
                  })
                  .done(function () {
                    console.log("success");
                  })
                  .fail(function () {
                    console.log("error");
                  })
                  .always(function () {
                    myApp.hidePreloader();
                    var toast = myApp.toast(
                      "Pedido reprovado.",
                      '<i class="fa fa-check"></i>'
                      );
                    toast.show();
                    mainView.router.refreshPage();

                    console.log("complete");
                  });
                });
              },
              color: "red",
              bold: true
            }
            ];



          }
          myApp.actions(buttons);

          event.preventDefault();
        });

console.log("success");
})
.fail(function () {
  console.log("error");
})
.always(function () {
  myApp.hidePreloader();
});



}else{



  $.ajax({
    url: request_url + "/pedidos/aprovacaoPedidosGestor/"+usuario_codigo,
    type: "GET",
    dataType: "json",
    data: {
      usuario_id: usuario_id
    }
  })
  .done(function (data) {

    console.log(data)

    var pedidoListHtml = "";

    if (data.length == 0) {
      return myApp.alert("Nenhum pedido encontrado.", function () {
        mainView.router.back();
      });
    }



    $.each(data, function (index, val) {


      var total = 10 - val.Pedido.id.length;

      var pedido_cod = '';

      for ( var i = 1; i <= total; i++ ) {

        pedido_cod += '0';

      }


      
      var pedido_cod_fim = pedido_cod+val.Pedido.id
      

      var hora_pedido = val.Pedido.created.split(" ")[1];
      hora_pedido =  hora_pedido.split(":");

      var data_pedido = val.Pedido.created.split(" ")[0]
      data_pedido = data_pedido.split('-');
      


      if( val.Pedido.pedido_status_id == 9){
        var color_bg = 'bg-red';
        var fa_icon = 'fa-times';
      }else if( val.Pedido.pedido_status_id == 1 || val.Pedido.pedido_status_id == 6  ){

        var color_bg = 'bg-yellow';
        var fa_icon = 'fa-check';

      }else{    
        var color_bg = 'bg-lightgreen';
        var fa_icon = 'fa-check';
      }

      var item =
      '<li data-pedido-id = "' + val.Pedido.id + '" data-pedido-status =" ' + val.Status.id + ' ">' +
      '<a href="#" class="item-link item-content">' +
      '<div class="item-inner">' +
      '<div class="item-title-row">' +
      '<div class="item-title">' +
      (val.Cliente.nome_completo == null ?
        "Cliente não vinculado" :
        val.Cliente.nome_completo) +
      "</div>" +

      '<div class="item-after">' +
      data_pedido[2]+'/'+data_pedido[1]+'/'+data_pedido[0]  + ' '+ hora_pedido[0]+':'+hora_pedido[1] +
      "</div>" +
      "</div>" +
      '<div class="item-subtitle">' +
      (val.Cliente.telefone == null ? "" : val.Cliente.telefone) +
      "</div>" +
      '<div class="item-subtitle">' +
      (val.Pedido.id == null ? "" : pedido_cod_fim) +
      "</div>" +

      '<div class="item-text">' +
      '<div class="chip chip-small">' +
      '<div class="chip-media '+color_bg+' ">' +
      '<i class="fa '+fa_icon+'"></i>' +
      "</div>" +
      '<div class="chip-label">' +
      (val.Status.nome == null ? "" : val.Status.nome) +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</a>" +
      "</li>";

      pedidoListHtml += item;

    });

      // console.log(pedidoListHtml)
      $pedidoList.html("").append(pedidoListHtml).on("click", "li", function (event) {
        var $li = $(this);
        var pedido_id = $li.attr("data-pedido-id");
        var pedido_status_id = $li.attr("data-pedido-status");
        // console.log(pedido_status_idss)
          // return alert(pedido_id)

          if(pedido_status_id == 1){



            var buttons = [

            {
              text: "Ver Detalhes",
              bold: true,
              onClick: function () {
                localStorage.setItem("Pedido.id", pedido_id);
                localStorage.setItem("Pedido.detalhes", "1");
                localStorage.setItem("Pedido.detalhesAprovacao", "1");

                mainView.router.loadPage("novo-pedido-3.html");
                event.preventDefault();
              },
            },

            {
              text: "Aprovar Pedido",
              onClick: function () {

                myApp.confirm("Deseja Aprovar este pedido?", function () {


                  $.ajax({
                    url: request_url+'/pedidos/enviar_email/'+pedido_id,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        // param1: 'value1'
                      },
                    })
                  .done(function(data) {

                    console.log(data)
                  })
                  .fail(function() {
                    console.log("error");
                  })
                  .always(function() {
                   myApp.hidePreloader();
                   console.log("complete");
                 });


                  $.ajax({
                    url: request_url + "/pedidos/edit/" + pedido_id,
                    type: "POST",
                    dataType: "json",
                    data: {
                      id: pedido_id,
                      pedido_status_id: 2,
                      user_id:usuario_id
                    }
                  })
                  .done(function () {


                    console.log("success");
                  })
                  .fail(function () {
                    console.log("error");
                  })
                  .always(function () {
                    myApp.hidePreloader();
                    var toast = myApp.toast(
                      "Pedido aprovado.",
                      '<i class="fa fa-check"></i>'
                      );
                    toast.show();


                    mainView.router.refreshPage();

                    console.log("complete");
                  });
                });
              },
              color: "green"
            },

            {
              text: "Reprovar Pedido",
              // disabled:true,
              onClick: function () {
                // myApp.showPreloader()

                myApp.confirm("Deseja reprovar este pedido?", function () {
                  $.ajax({
                    url: request_url + "/pedidos/edit/" + pedido_id,
                    type: "POST",
                    dataType: "json",
                    data: {
                      id: pedido_id,
                      pedido_status_id: 3,
                      user_id:usuario_id
                    }
                  })
                  .done(function () {
                    console.log("success");
                  })
                  .fail(function () {
                    console.log("error");
                  })
                  .always(function () {
                    myApp.hidePreloader();
                    var toast = myApp.toast(
                      "Pedido reprovado.",
                      '<i class="fa fa-check"></i>'
                      );
                    toast.show();
                    mainView.router.refreshPage();

                    console.log("complete");
                  });
                });
              },
              color: "red",
              bold: true
            }
            ];

          }else{


            var buttons = [

            {
              text: "Ver Detalhes",
              bold: true,
              onClick: function () {
                localStorage.setItem("Pedido.id", pedido_id);
                localStorage.setItem("Pedido.detalhes", "1");
                localStorage.setItem("Pedido.detalhesAprovacao", "1");

                mainView.router.loadPage("novo-pedido-3.html");
                event.preventDefault();
              },
            },

            {
              text: "Liberar Pedido",
              onClick: function () {

                myApp.confirm("Deseja Liberar este pedido?", function () {


                  $.ajax({
                    url: request_url + "/pedidos/edit/" + pedido_id,
                    type: "POST",
                    dataType: "json",
                    data: {
                      id: pedido_id,
                      pedido_status_id: 7,
                      user_id:usuario_id
                    }
                  })
                  .done(function () {


                    console.log("success");
                  })
                  .fail(function () {
                    console.log("error");
                  })
                  .always(function () {
                    myApp.hidePreloader();
                    var toast = myApp.toast(
                      "Pedido aprovado.",
                      '<i class="fa fa-check"></i>'
                      );
                    toast.show();


                    mainView.router.refreshPage();

                    console.log("complete");
                  });
                });
              },
              color: "green"
            },

            {
              text: "Bloquear Pedido",
              // disabled:true,
              onClick: function () {
                // myApp.showPreloader()

                myApp.confirm("Deseja bloquear este pedido?", function () {
                  $.ajax({
                    url: request_url + "/pedidos/edit/" + pedido_id,
                    type: "POST",
                    dataType: "json",
                    data: {
                      id: pedido_id,
                      pedido_status_id: 8,
                      user_id:usuario_id
                    }
                  })
                  .done(function () {
                    console.log("success");
                  })
                  .fail(function () {
                    console.log("error");
                  })
                  .always(function () {
                    myApp.hidePreloader();
                    var toast = myApp.toast(
                      "Pedido reprovado.",
                      '<i class="fa fa-check"></i>'
                      );
                    toast.show();
                    mainView.router.refreshPage();

                    console.log("complete");
                  });
                });
              },
              color: "red",
              bold: true
            }
            ];


          }
          myApp.actions(buttons);

          event.preventDefault();
        });

console.log("success");
})
.fail(function () {
  console.log("error");
})
.always(function () {
  myApp.hidePreloader();
});



}
});




myApp.onPageInit("fazenda-detalhe-1", function (event) {



  var $btnProximo = $("#buttonFazendaProximo2");

  $btnProximo.on("click", function (event) {

    mainView.router.loadPage('fazenda-detalhe-2.html');

  });


  var fazenda_id = localStorage.getItem('Fazenda.id');
  $.ajax({
    url: request_url + "/fazendas/view/" + fazenda_id,
    type: "GET",
    dataType: "json"
  })
  .done(function (data) {


    console.log(data);


    if(data.Fazenda.inc_estadual_rural == "ISENTO"){

     $("#checkIsento").prop( "checked", true );

   }

   if(data.Fazenda.lei215 != ""){

     $("#lei215").prop( "checked", true );

   } else{

     $("#suframa").prop( "checked", true );

   }

   if(data.Fazenda.canal_de_venda == "tradicional"){

     $("#tradicional").prop( "checked", true );

   }else if(data.Fazenda.canal_de_venda == "empresarial"){

     $("#empresarial").prop( "checked", true );
   }else if(data.Fazenda.canal_de_venda == "cooperativa"){

     $("#cooperativa").prop( "checked", true );
   }else if(data.Fazenda.canal_de_venda == "revenda"){

     $("#revenda").prop( "checked", true );
   }

   $$(".cliente-nome").text(data.Cliente.nome_completo).trigger("blur");
   $$("#FazendaNome").val(data.Fazenda.nome_completo).trigger("blur");
   $$("#FazendaInscricao").val(data.Fazenda.inc_estadual_rural).trigger("blur");
   $$("#FazendaEmailGerente").val(data.Fazenda.email).trigger("blur");
   $$("#FazendaNomeContato").val(data.Fazenda.nome_contato).trigger("blur");
   $$("#FazendaCodSuframa").val(data.Fazenda.codigo_suframa).trigger("blur");

   $$("#FazendaBairro").val(data.Fazenda.bairro).trigger("blur");
   $$("#FazendaLogradouro").val(data.Fazenda.logradouro).trigger("blur");
   $$("#FazendaNumero").val(data.Fazenda.numero).trigger("blur");
   $$("#FazendaCidade").val(data.Fazenda.cidade).trigger("blur");
   $$("#FazendaEstado").val(data.Fazenda.estado).trigger("blur");
   $$("#FazendaCep").val(data.Fazenda.cep).trigger("blur");
   $$("#FazendaComplemento").val(data.Fazenda.complemento).trigger("blur");
   $$("#FazendaTelefone").val(data.Fazenda.telefone).trigger("blur");
   $$("#FazendaCelular").val(data.Fazenda.celular).trigger("blur");
   $$("#outrasInfo1").val(data.Fazenda.outras_info).trigger("blur");
   $$("#outrasInfo1").val(data.Fazenda.outras_info).trigger("blur");
   $$("#FazendaRoteiro").val(data.Fazenda.roteiro).trigger("blur");

 })
  .fail(function () {
    console.log("error");
  })
  .always(function () {
    myApp.hidePreloader();
  }); 




});



myApp.onPageInit("fazenda-detalhe-2", function (event) {



  var $btnProximo = $("#btnFazendaProximo3");

  $btnProximo.on("click", function (event) {

    mainView.router.loadPage('fazenda-detalhe-3.html');

  });


  var fazenda_id = localStorage.getItem('Fazenda.id');
  $.ajax({
    url: request_url + "/fazendas/view/" + fazenda_id,
    type: "GET",
    dataType: "json"
  })
  .done(function (data) {


    console.log(data);
    $$(".cliente-nome").text(data.Cliente.nome_completo).trigger("blur");

    $$("#bovinos_corte").val(data.Fazenda.bovinos_corte).trigger("blur");
    $$("#bovinos_leite").val(data.Fazenda.bovinos_leite).trigger("blur");
    $$("#equinos").val(data.Fazenda.equinos).trigger("blur");
    $$("#ovinos").val(data.Fazenda.ovinos).trigger("blur");
    $$("#suinos").val(data.Fazenda.suinos).trigger("blur");
    $$("#aves").val(data.Fazenda.aves).trigger("blur");
    $$("#outrosQtde").val(data.Fazenda.outros_quantidade).trigger("blur");
    $$("#outros").val(data.Fazenda.outros).trigger("blur");
    $$("#consumo_suplemento_mineral").val(data.Fazenda.consumo_suplemento_mineral).trigger("blur");
    $$("#consumo_suplemento_proteico").val(data.Fazenda.consumo_suplemento_proteico).trigger("blur");
    $$("#racao").val(data.Fazenda.racao).trigger("blur");
    $$("#nucleo_premix").val(data.Fazenda.nucleo_premix).trigger("blur");

  })
  .fail(function () {
    console.log("error");
  })
  .always(function () {
    myApp.hidePreloader();
  }); 

  
});
myApp.onPageInit("fazenda-detalhe-3", function (event) {

  var fazenda_id = localStorage.getItem('Fazenda.id');
  $.ajax({
    url: request_url + "/fazendas/view/" + fazenda_id,
    type: "GET",
    dataType: "json"
  })
  .done(function (data) {
   console.log(data);


   if(data.Fazenda.info_comercial_cidade_1 != '' && data.Fazenda.info_comercial_cidade_1 != null){

    var info_comercial_cidade_1 = data.Fazenda.info_comercial_cidade_1.split('-');


    $$("#info_comercial_cidade_1").val(info_comercial_cidade_1[0]).trigger("blur");
    $$("#info_comercial_cidade_1_uf").val(info_comercial_cidade_1[1]).trigger("blur");


  }


  if(data.Fazenda.info_comercial_cidade_2 != '' && data.Fazenda.info_comercial_cidade_2 != null){

   var info_comercial_cidade_2 = data.Fazenda.info_comercial_cidade_2.split('-');

   $$("#info_comercial_cidade_2").val(info_comercial_cidade_2[0]).trigger("blur");
   $$("#info_comercial_cidade_2_uf").val(info_comercial_cidade_2[1]).trigger("blur");

 }



 if(data.Fazenda.pre_cidade_1 != '' && data.Fazenda.pre_cidade_1 != null){

   var pre_cidade_1 = data.Fazenda.pre_cidade_1.split('-');

   $$("#pre_cidade_1").val(pre_cidade_1[0]).trigger("blur");
   $$("#pre_cidade_1_uf").val(pre_cidade_1[1]).trigger("blur");

 }


 if(data.Fazenda.pre_cidade_2 != '' && data.Fazenda.pre_cidade_2 != null){

   var pre_cidade_2 = data.Fazenda.pre_cidade_2.split('-');

   $$("#pre_cidade_2").val(pre_cidade_2[0]).trigger("blur");
   $$("#pre_cidade_2_uf").val(pre_cidade_2[1]).trigger("blur");

 }



 $$(".cliente-nome").text(data.Cliente.nome_completo).trigger("blur");
 $$("#info_comercial_empresa_1").val(data.Fazenda.info_comercial_empresa_1).trigger("blur");

 $$("#info_comercial_telefone_1").val(data.Fazenda.info_comercial_telefone_1).trigger("blur");
 $$("#info_comercial_empresa_2").val(data.Fazenda.info_comercial_empresa_2).trigger("blur");

 $$("#info_comercial_telefone_2").val(data.Fazenda.info_comercial_telefone_2).trigger("blur");
 $$("#info_comercial_cidade_2").val(data.Fazenda.info_comercial_cidade_2).trigger("blur");

 $$("#pre_empresa_1").val(data.Fazenda.pre_empresa_1).trigger("blur");

 $$("#pre_telefone_1").val(data.Fazenda.pre_telefone_1).trigger("blur");

 $$("#pre_empresa_2").val(data.Fazenda.pre_empresa_2).trigger("blur");

 $$("#pre_telefone_2").val(data.Fazenda.pre_telefone_2).trigger("blur");

 $$("#dados_bancarios_banco").val(data.Fazenda.banco_nome).trigger("blur");
 $$("#dados_bancarios_agencia").val(data.Fazenda.dados_bancarios_agencia).trigger("blur");
 $$("#dados_bancarios_conta").val(data.Fazenda.dados_bancarios_conta).trigger("blur");
 $$("#dados_bancarios_titular").val(data.Fazenda.dados_bancarios_titular).trigger("blur");
 $$("#dados_bancarios_cpf").val(data.Fazenda.dados_bancarios_cpf).trigger("blur");

})
  .fail(function () {
    console.log("error");
  })
  .always(function () {
    myApp.hidePreloader();
  }); 




});


myApp.onPageInit("meus-pedidos-gestor", function (event) {

  myApp.showPreloader("Carregando...");

  var usuario_id = localStorage.getItem("Usuario.codigo");
  var $pedidoList = $("#pedidosList");
  

  $.ajax({
    url: request_url + "/pedidos/gestorIndex/"+usuario_id,
    type: "GET",
    dataType: "json",
    data: {
      usuario_id: usuario_id
    }
  })
  .done(function (data) {

    var pedidoListHtml = "";

    if (data.length == 0) {
      return myApp.alert("Nenhum pedido encontrado.", function () {
        mainView.router.back();
      });
    }



    $.each(data, function (index, val) {


     var total = 10 - val.Pedido.id.length;

     var pedido_cod = '';

     for ( var i = 1; i <= total; i++ ) {

      pedido_cod += '0';

    }

    var pedido_cod_fim = pedido_cod+val.Pedido.id
    

    var hora_pedido = val.Pedido.created.split(" ")[1];
    hora_pedido =  hora_pedido.split(":");

    var data_pedido = val.Pedido.created.split(" ")[0]
    data_pedido = data_pedido.split('-');
    console.log(data_pedido)

    if(val.Cliente.id != null){

      if( val.Pedido.pedido_status_id == 1  || val.Pedido.pedido_status_id == 15  || val.Pedido.pedido_status_id == 16 || val.Pedido.pedido_status_id == 6  || val.Pedido.pedido_status_id == 10 ){

        var color_bg = 'bg-yellow';
        var fa_icon = 'fa-check';

      }else if( val.Pedido.pedido_status_id == 3 ||  val.Pedido.pedido_status_id == 8 ||  val.Pedido.pedido_status_id == 12  ||  val.Pedido.pedido_status_id == 22 ){
        var color_bg = 'bg-red';
        var fa_icon = 'fa-times';
      }else{    
        var color_bg = 'bg-lightgreen';
        var fa_icon = 'fa-check';
      }



      var item =
      '<li data-pedido-id = "' + val.Pedido.id + '" data-pedido-status =" ' + val.Status.id + ' ">' +
      '<a href="#" class="item-link item-content">' +
      '<div class="item-inner">' +
      '<div class="item-title-row">' +
      '<div class="item-title">' +
      (val.Cliente.nome_completo == null ?
        "Cliente não vinculado" :
        val.Cliente.nome_completo) +
      "</div>" +

      '<div class="item-after">' +
      data_pedido[2]+'/'+data_pedido[1]+'/'+data_pedido[0]  + ' '+ hora_pedido[0]+':'+hora_pedido[1] +
      "</div>" +
      "</div>" +
      '<div class="item-subtitle">' +
      (val.Cliente.telefone == null ? "" : val.Cliente.telefone) +
      "</div>" +
      '<div class="item-subtitle">' +
      (val.Pedido.id == null ? "" : pedido_cod_fim) +
      "</div>" +

      '<div class="item-text">' +
      '<div class="chip chip-small">' +
      '<div class="chip-media '+color_bg+' ">' +
      '<i class="fa '+fa_icon+'"></i>' +
      "</div>" +
      '<div class="chip-label">' +
      (val.Status.nome == null ? "" : val.Status.nome) +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +

      "</a>" +
      "</li>";

      pedidoListHtml += item;
    }
  });

      // console.log(pedidoListHtml)
      $pedidoList.html("").append(pedidoListHtml).on("click", "li", function (event) {
        var $li = $(this);
        var pedido_id = $li.attr("data-pedido-id");
        var pedido_status_id = $li.attr("data-pedido-status");
        // console.log(pedido_status_idss)
          // return alert(pedido_id)

          if(pedido_status_id == 15){


            var buttons = [{
              text: "Ver Detalhes",
              bold: true,
              onClick: function () {

                localStorage.setItem("Pedido.id", pedido_id);
                localStorage.setItem("Pedido.detalhes", "1");
                localStorage.setItem("Pedido.detalhesAprovacao", "1");

                mainView.router.loadPage("novo-pedido-3.html");
                event.preventDefault();

              },
            },


            {
              text: "Enviar cópia por email",
              disabled:false,
              onClick: function () {
                myApp.showPreloader();

              // alert(request_url+'/pedidos/enviar_email/'+pedido_id);

              $.ajax({
                url: request_url+'/pedidos/enviar_email_espelho/'+pedido_id,
                type: 'POST',
                dataType: 'json',
                data: {
                  // param1: 'value1'
                },
              })
              .done(function(data) {



                if(data.error == false){

                  myApp.alert("Uma cópia do pedido foi enviada aos e-mails cadastrados.");

                }else{

                  myApp.alert("Ocorreu algum erro! Tente novamente.");

                }


              })
              .fail(function() {
                console.log("error");
              })
              .always(function() {
               myApp.hidePreloader();
               console.log("complete");
             });

              setTimeout(function () {



              }, 1000);


            },
            color: "green"
          },

          

          {
            text: "Cancelar Pedido",
              // disabled:true,
              onClick: function () {
                // myApp.showPreloader()

                myApp.confirm("Deseja cancelar este pedido?", function () {
                  $.ajax({
                    url: request_url + "/pedidos/edit/" + pedido_id,
                    type: "POST",
                    dataType: "json",
                    data: {
                      id: pedido_id,
                      pedido_status_id: 22,
                      user_id: usuario_id,
                    }
                  })
                  .done(function () {
                    console.log("success");
                  })
                  .fail(function () {
                    console.log("error");
                  })
                  .always(function () {
                    myApp.hidePreloader();
                    var toast = myApp.toast(
                      "Pedido cancelado.",
                      '<i class="fa fa-check"></i>'
                      );
                    toast.show();
                    mainView.router.reloadPage("meus-pedidos.html");

                    console.log("complete");
                  });
                });
              },
              color: "red",
              bold: true
            }
            ];

          } else if(pedido_status_id == 20 || pedido_status_id == 22){


            var buttons = [{
              text: "Ver Detalhes",
              bold: true,
              onClick: function () {

                localStorage.setItem("Pedido.id", pedido_id);
                localStorage.setItem("Pedido.detalhes", "1");
                localStorage.setItem("Pedido.detalhesAprovacao", "1");

                mainView.router.loadPage("novo-pedido-3.html");
                event.preventDefault();

              },
            },


            ];



          }else{



            var buttons = [{
              text: "Ver Detalhes",
              bold: true,
              onClick: function () {

                localStorage.setItem("Pedido.id", pedido_id);
                localStorage.setItem("Pedido.detalhes", "1");
                localStorage.setItem("Pedido.detalhesAprovacao", "1");

                mainView.router.loadPage("novo-pedido-3.html");
                event.preventDefault();

              },
            },

            {
              text: "Cancelar Pedido",
              // disabled:true,
              onClick: function () {
                // myApp.showPreloader()

                myApp.confirm("Deseja cancelar este pedido?", function () {
                  $.ajax({
                    url: request_url + "/pedidos/edit/" + pedido_id,
                    type: "POST",
                    dataType: "json",
                    data: {
                      id: pedido_id,
                      pedido_status_id: 22,
                      user_id: usuario_id,
                    }
                  })
                  .done(function () {
                    console.log("success");
                  })
                  .fail(function () {
                    console.log("error");
                  })
                  .always(function () {
                    myApp.hidePreloader();
                    var toast = myApp.toast(
                      "Pedido cancelado.",
                      '<i class="fa fa-check"></i>'
                      );
                    toast.show();
                    mainView.router.reloadPage("meus-pedidos.html");

                    console.log("complete");
                  });
                });
              },
              color: "red",
              bold: true
            }
            ];

          }



          myApp.actions(buttons);

          event.preventDefault();
        });

console.log("success");
})
.fail(function () {
  console.log("error");
})
.always(function () {
  myApp.hidePreloader();
});
});


myApp.onPageInit("meus-pedidos-supervisor", function (event) {

  myApp.showPreloader("Carregando...");

  var usuario_id = localStorage.getItem("Usuario.codigo");
  var $pedidoList = $("#pedidosList");
  

  $.ajax({
    url: request_url + "/pedidos/supervisorIndex/"+usuario_id,
    type: "GET",
    dataType: "json",
    data: {
      usuario_id: usuario_id
    }
  })
  .done(function (data) {

    var pedidoListHtml = "";

    if (data.length == 0) {
      return myApp.alert("Nenhum pedido encontrado.", function () {
        mainView.router.back();
      });
    }



    $.each(data, function (index, val) {


     var total = 10 - val.Pedido.id.length;

     var pedido_cod = '';

     for ( var i = 1; i <= total; i++ ) {

      pedido_cod += '0';

    }

    var pedido_cod_fim = pedido_cod+val.Pedido.id
    

    var hora_pedido = val.Pedido.created.split(" ")[1];
    hora_pedido =  hora_pedido.split(":");

    var data_pedido = val.Pedido.created.split(" ")[0]
    data_pedido = data_pedido.split('-');
    console.log(data_pedido)

    if(val.Cliente.id != null){

      if( val.Pedido.pedido_status_id == 1  || val.Pedido.pedido_status_id == 15  || val.Pedido.pedido_status_id == 16 || val.Pedido.pedido_status_id == 6  || val.Pedido.pedido_status_id == 10 ){

        var color_bg = 'bg-yellow';
        var fa_icon = 'fa-check';

      }else if( val.Pedido.pedido_status_id == 3 ||  val.Pedido.pedido_status_id == 8 ||  val.Pedido.pedido_status_id == 12  ||  val.Pedido.pedido_status_id == 22 ){
        var color_bg = 'bg-red';
        var fa_icon = 'fa-times';
      }else{    
        var color_bg = 'bg-lightgreen';
        var fa_icon = 'fa-check';
      }



      var item =
      '<li data-pedido-id = "' + val.Pedido.id + '" data-pedido-status =" ' + val.Status.id + ' ">' +
      '<a href="#" class="item-link item-content">' +
      '<div class="item-inner">' +
      '<div class="item-title-row">' +
      '<div class="item-title">' +
      (val.Cliente.nome_completo == null ?
        "Cliente não vinculado" :
        val.Cliente.nome_completo) +
      "</div>" +

      '<div class="item-after">' +
      data_pedido[2]+'/'+data_pedido[1]+'/'+data_pedido[0]  + ' '+ hora_pedido[0]+':'+hora_pedido[1] +
      "</div>" +
      "</div>" +
      '<div class="item-subtitle">' +
      (val.Cliente.telefone == null ? "" : val.Cliente.telefone) +
      "</div>" +
      '<div class="item-subtitle">' +
      (val.Pedido.id == null ? "" : pedido_cod_fim) +
      "</div>" +

      '<div class="item-text">' +
      '<div class="chip chip-small">' +
      '<div class="chip-media '+color_bg+' ">' +
      '<i class="fa '+fa_icon+'"></i>' +
      "</div>" +
      '<div class="chip-label">' +
      (val.Status.nome == null ? "" : val.Status.nome) +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +

      "</a>" +
      "</li>";

      pedidoListHtml += item;
    }
  });

      // console.log(pedidoListHtml)
      $pedidoList.html("").append(pedidoListHtml).on("click", "li", function (event) {
        var $li = $(this);
        var pedido_id = $li.attr("data-pedido-id");
        var pedido_status_id = $li.attr("data-pedido-status");
        // console.log(pedido_status_idss)
          // return alert(pedido_id)

          if(pedido_status_id == 15){


            var buttons = [{
              text: "Ver Detalhes",
              bold: true,
              onClick: function () {

                localStorage.setItem("Pedido.id", pedido_id);
                localStorage.setItem("Pedido.detalhes", "1");
                localStorage.setItem("Pedido.detalhesAprovacao", "1");

                mainView.router.loadPage("novo-pedido-3.html");
                event.preventDefault();

              },
            },


            {
              text: "Enviar cópia por email",
              disabled:false,
              onClick: function () {
                myApp.showPreloader();

              // alert(request_url+'/pedidos/enviar_email/'+pedido_id);

              $.ajax({
                url: request_url+'/pedidos/enviar_email_espelho/'+pedido_id,
                type: 'POST',
                dataType: 'json',
                data: {
                  // param1: 'value1'
                },
              })
              .done(function(data) {



                if(data.error == false){

                  myApp.alert("Uma cópia do pedido foi enviada aos e-mails cadastrados.");

                }else{

                  myApp.alert("Ocorreu algum erro! Tente novamente.");

                }


              })
              .fail(function() {
                console.log("error");
              })
              .always(function() {
               myApp.hidePreloader();
               console.log("complete");
             });

              setTimeout(function () {



              }, 1000);


            },
            color: "green"
          },

          

          {
            text: "Cancelar Pedido",
              // disabled:true,
              onClick: function () {
                // myApp.showPreloader()

                myApp.confirm("Deseja cancelar este pedido?", function () {
                  $.ajax({
                    url: request_url + "/pedidos/edit/" + pedido_id,
                    type: "POST",
                    dataType: "json",
                    data: {
                      id: pedido_id,
                      pedido_status_id: 22,
                      user_id: usuario_id,
                    }
                  })
                  .done(function () {
                    console.log("success");
                  })
                  .fail(function () {
                    console.log("error");
                  })
                  .always(function () {
                    myApp.hidePreloader();
                    var toast = myApp.toast(
                      "Pedido cancelado.",
                      '<i class="fa fa-check"></i>'
                      );
                    toast.show();
                    mainView.router.reloadPage("meus-pedidos.html");

                    console.log("complete");
                  });
                });
              },
              color: "red",
              bold: true
            }
            ];

          } else if(pedido_status_id == 20 || pedido_status_id == 22){


            var buttons = [{
              text: "Ver Detalhes",
              bold: true,
              onClick: function () {

                localStorage.setItem("Pedido.id", pedido_id);
                localStorage.setItem("Pedido.detalhes", "1");
                localStorage.setItem("Pedido.detalhesAprovacao", "1");

                mainView.router.loadPage("novo-pedido-3.html");
                event.preventDefault();

              },
            },


            ];



          }else{



            var buttons = [{
              text: "Ver Detalhes",
              bold: true,
              onClick: function () {

                localStorage.setItem("Pedido.id", pedido_id);
                localStorage.setItem("Pedido.detalhes", "1");
                localStorage.setItem("Pedido.detalhesAprovacao", "1");

                mainView.router.loadPage("novo-pedido-3.html");
                event.preventDefault();

              },
            },

            {
              text: "Cancelar Pedido",
              // disabled:true,
              onClick: function () {
                // myApp.showPreloader()

                myApp.confirm("Deseja cancelar este pedido?", function () {
                  $.ajax({
                    url: request_url + "/pedidos/edit/" + pedido_id,
                    type: "POST",
                    dataType: "json",
                    data: {
                      id: pedido_id,
                      pedido_status_id: 22,
                      user_id: usuario_id,
                    }
                  })
                  .done(function () {
                    console.log("success");
                  })
                  .fail(function () {
                    console.log("error");
                  })
                  .always(function () {
                    myApp.hidePreloader();
                    var toast = myApp.toast(
                      "Pedido cancelado.",
                      '<i class="fa fa-check"></i>'
                      );
                    toast.show();
                    mainView.router.reloadPage("meus-pedidos.html");

                    console.log("complete");
                  });
                });
              },
              color: "red",
              bold: true
            }
            ];

          }



          myApp.actions(buttons);

          event.preventDefault();
        });

console.log("success");
})
.fail(function () {
  console.log("error");
})
.always(function () {
  myApp.hidePreloader();
});
});
