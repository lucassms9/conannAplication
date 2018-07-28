function App() {

  this.okIcon = '<i class="color-green material-icons">check</i>';
  this.syncingIcon = '<i class="material-icons fa-counter-spin">sync</i>';
  this.errorIcon = '<i class="color-red material-icons">replay</i>';
  this.db = null;
  this.downloadedData = null;
  this.status = 0;


  this.db_schema = null;


  this.downloadDbSchema = function () {

    var schema = {
      produtos: '++id, codigo, codigo_connan, nome, valor_unitario_tabela, valor_frete, descricao, peso_liq, peso_bruto, url_foto, created, modified, updated',
      clientes: '++id, cpf, nome_completo, email, senha, codigo_nova_senha, telefone, celular, data_nascimento, cep, logradouro, numero, complemento, bairro, cidade, estado, created, modified, usuario_id',
      usuarios: '++id, codigo, liberado, nome_completo, cpf, email, senha, codigo_nova_senha, telefone, celular, data_nascimento, cep, logradouro, numero, complemento, bairro, cidade, estado, usuario_tipo_id, created, modified, foto, ativo',
      pedidos: '++id, codigo, usuario_id, vendedor_id, cliente_id, valor_pedido, data_pedido, data_entrega, observacao, created, modified, accessed, pedido_status_id, prazo, tabela_id, forma_pagamento, num_parcelas',
      fazendas: '++id, id, cliente_id, fazenda_id, created, modified',
      clientes_fazendas: '++id, cliente_id, fazenda_id, created, modified',
      pedido_parcelas: '++id, pedido_id, data_parcela, parcela_valor, created, modified',
      tabela_de_precos: '++id, nome, vigencia, created, modified, updated',
      tabela_de_preco_produto: '++id, tabela_de_preco_id, produto_id, preco_frete, preco_tabela',
      itens_pedido: '++id, pedido_id, produto_id, quantidade, preco_frete, preco_negociado, valor_total, created, modified, accessed, total_desconto',
      pedido_status: '++id, nome, created, modified',
    }

    return this.db_schema = schema;

  }






  this.open = function () {

    db = new Dexie("connan_offline");

  }


  this.downloadDB = function (callback) {

    // console.log('downloadDB')
    var okIcon = this.okIcon
    var errorIcon = this.errorIcon

    var success = null;
    var $downloadDB = $('#downloadDB')
    $downloadDB.find('.item-after').html(this.syncingIcon)

    var success = true;


    $.ajax({
        url: internal_url + '/offline/downloadEstrutura',
        type: 'GET',
        dataType: 'json',
      })
      .done(function (data, textStatus, jqXHR) {

        db.version(1.1).stores(stores);


      })
      .fail(function () {
        // console.log("error");
      })
      .always(function () {
        // console.log("complete");
      });




    setTimeout(function () {
      if (success) {
        $downloadDB.find('.item-after').html(okIcon)

      }
      this.status = 1;
      return callback();
    }, 1000)



  }

  this.dataApply = function (callback) {

    // var dataDownload = this.data


    $.each(downloadedData.Produtos, function (index, val) {
      db.produtos.put(val.Produto)
    });

    $.each(downloadedData.TabelaDePreco, function (index, val) {
      db.tabela_de_precos.put(val.TabelaDePreco)
    });

    $.each(downloadedData.Cliente, function (index, val) {
      db.clientes.put(val.Cliente)
    });

    $.each(downloadedData.Fazenda, function (index, val) {
      db.fazendas.put(val.Fazenda)
    });

    $.each(downloadedData.Status, function (index, val) {
      db.pedido_status.put(val.Status)
    });




    var okIcon = this.okIcon


    var success = null;
    var $downloadDB = $('#dataApply')
    $downloadDB.find('.item-after').html(this.syncingIcon)

    var success = true;

    setTimeout(function () {
      if (success) {
        $downloadDB.find('.item-after').html(okIcon)
      }
      return callback();
    }, 1000)


  }

  this.tablesInit = function (callback) {

    console.log(arguments[1])

    var okIcon = this.okIcon

    var delete_ativacao = "DROP TABLE IF EXISTS table_name;"
    var ativacao = "CREATE TABLE ativacao (fields_name);"


    var success = null;
    var $downloadDB = $('#tablesInit')
    $downloadDB.find('.item-after').html(this.syncingIcon)

    var success = true;

    setTimeout(function () {
      if (success) {
        $downloadDB.find('.item-after').html(okIcon)
      }
      return callback();
    }, 1000)



  }

  this.downloadData = function (callback) {

    console.log(arguments[1])

    var okIcon = this.okIcon

    var success = null;
    var $downloadDB = $('#downloadData')
    $downloadDB.find('.item-after').html(this.syncingIcon)

    var success = true;


    // db = new Dexie("connan_offline");


    $.ajax({
        url: internal_url + '/offline/downloadDados',
        type: 'GET',
        dataType: 'json',
      })
      .done(function (data, textStatus, jqXHR) {

        downloadedData = data;
        console.log(downloadedData)


        console.log("clientes")
        db.pedido_status
          .each(function (status) {
            console.log(status.nome);
          });


      })
      .fail(function () {
        // console.log("error");
      })
      .always(function () {
        // console.log("complete");
      });





    setTimeout(function () {
      if (success) {
        $downloadDB.find('.item-after').html(okIcon)
      }
      return callback();
    }, 1000)



  }

  this.setDb = function () {
    db.open();
  }

  this.uploadDados = function () {

    var db = this.open()

  }

}