var cliente = new function() {

  this.load = function(el, vars) {
    console.log(vars)
  	$.ajax({
  	  url: request_url + "/clientes/listarporregiao/"+vars.grupo_clientes_id,
  	  type: "GET",
  	  dataType: "json",
  	  data: {
  	    cliente_id: vars.usuario_id,
        cnpj:vars.cnpj,
        nome:vars.nome,
        estado:vars.estado,
        cidade:vars.cidade
  	  }
  	})
  	.done(function (data) {
  	    var item = "";
  	    var clientes = data.data;
        el.html('');

  	    $$.each(clientes, function (index, val) {
          console.log(val)
  	      item +=
  	      '<li data-cliente-codigo="' +val.Cliente.codigo +'"  data-cliente-id="' +val.Cliente.id +'">' +
  	      '<a href="#" class="item-link">' +
  	      '<div class="item-content">' +
  	      '<div class="item-inner">' +
  	      '<div class="item-title">' +
  	      val.Cliente.nome_completo +
  	      "</div>" +
  	      "</div>" +
  	      "</div>" +
  	      "</a>" +
  	      "</li>";
  	    });

  	    if (clientes.length != 0) {
  	      el.append(item).on("click", "li", function () {
  	        var $li = $(this);
            var cliente_codigo = $li.attr("data-cliente-codigo");
  	        var cliente_id = $li.attr("data-cliente-id");

            localStorage.setItem("Cliente.codigo", cliente_codigo);

  	        localStorage.setItem("Cliente.id", cliente_id);

            var stateFazenda = localStorage.getItem('novaFazenda');
          
              
  	        mainView.router.loadPage("cliente-detalhe.html");
            

  	        event.preventDefault();
  	        /* Act on the event */
  	      });
  	    } else {
  	      myApp.alert("Nenhum cliente encontrado.");
  	    }

  	    console.log("success");
  	  })
  	.fail(function () {
  	  console.log("error");
  	})
  	.always(function () {
  	  myApp.hidePreloader();
  	});

  }


  
}



var clienteFazenda = new function() {

  this.load = function(el, vars) {
    console.log(vars)
    $.ajax({
      url: request_url + "/clientes/listarporregiao/"+vars.grupo_clientes_id,
      type: "GET",
      dataType: "json",
      data: {
        cliente_id: vars.usuario_id,
        cnpj:vars.cnpj,
        nome:vars.nome,
        estado:vars.estado,
        cidade:vars.cidade
      }
    })
    .done(function (data) {
        var item = "";
        var clientes = data.data;
        el.html('');

        $$.each(clientes, function (index, val) {
          console.log(val)
          item +=
          '<li data-cliente-codigo="' +val.Cliente.codigo +'"  data-cliente-id="' +val.Cliente.id +'">' +
          '<a href="#" class="item-link">' +
          '<div class="item-content">' +
          '<div class="item-inner">' +
          '<div class="item-title">' +
          val.Cliente.nome_completo +
          "</div>" +
          "</div>" +
          "</div>" +
          "</a>" +
          "</li>";
        });

        if (clientes.length != 0) {
          el.append(item).on("click", "li", function () {
            var $li = $(this);
            var cliente_codigo = $li.attr("data-cliente-codigo");
            var cliente_id = $li.attr("data-cliente-id");

            localStorage.setItem("Cliente.codigo", cliente_codigo);

            localStorage.setItem("Cliente.id", cliente_id);

            mainView.router.loadPage("nova-fazenda.html");
           

            event.preventDefault();
            /* Act on the event */
          });
        } else {
          myApp.alert("Nenhum cliente encontrado.");
        }

        console.log("success");
      })
    .fail(function () {
      console.log("error");
    })
    .always(function () {
      myApp.hidePreloader();
    });

  }

}



var clienteValidate = new function() {

  this.is_cpf= function(cpf) {
    { 

      // var cpf = 43031819861;
      var numeros, digitos, soma, i, resultado, digitos_iguais;
      digitos_iguais = 1;
      if (cpf.length < 11)
        return false;
      for (i = 0; i < cpf.length - 1; i++)
        if (cpf.charAt(i) != cpf.charAt(i + 1))
        {
          digitos_iguais = 0;
          break;
        }
        if (!digitos_iguais)
        {
          numeros = cpf.substring(0,9);
          digitos = cpf.substring(9);
          soma = 0;
          for (i = 10; i > 1; i--)
            soma += numeros.charAt(10 - i) * i;
          resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
          if (resultado != digitos.charAt(0))
            return false;
          numeros = cpf.substring(0,10);
          soma = 0;
          for (i = 11; i > 1; i--)
            soma += numeros.charAt(11 - i) * i;
          resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
          if (resultado != digitos.charAt(1))
            return false;
          return true;
        }
        else
          return false;
      }
    },


    this.is_cnpj = function(c) {
      var b = [6,5,4,3,2,9,8,7,6,5,4,3,2];
      if((c = c.replace(/[^\d]/g,"")).length != 14)
        return false;
      if(/0{14}/.test(c))
        return false;
      for (var i = 0, n = 0; i < 12; n += c[i] * b[++i]);
        if(c[12] != (((n %= 11) < 2) ? 0 : 11 - n))
          return false;
        for (var i = 0, n = 0; i <= 12; n += c[i] * b[i++]);
          if(c[13] != (((n %= 11) < 2) ? 0 : 11 - n))
            return false;

          return true;
          
        }
      }

