// VERIFICAR CONEXÃO
function checar_conexao() {
    var internet = navigator.connection.type
    return (internet)
}

//DEFAULT.HTML LOGIN   
function entrar() {

    var conexao = checar_conexao()

    if (conexao == "none") {
        document.getElementById('alert_erro_internet').click()
        return;
    }

    var id_tec = $('#id_tec').val();
    var serial = device.serial;

    if (id_tec == '') {
        document.getElementById('msg_alert_erro').innerHTML = "Por favor, digite seu ID!";
        document.getElementById('alert_erro').click()
        return;
    }

    $.ajax({
        type: 'post',
        url: 'http://fixlock.net/versao/v1_1/login.aspx',
        data: {
            id_tec: id_tec,
            serial: serial
        },
        timeout: 60000,
        async: true,
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        dataType: 'json',
        success: function (result) {


            if (result == 2) {
                document.getElementById('msg_alert_erro').innerHTML = "Smartphone não autorizado!";
                document.getElementById('alert_erro').click()
            }

            if (result == 3) {
                document.getElementById('msg_alert_erro').innerHTML = "Técnico desativado!";
                document.getElementById('alert_erro').click()
            }

            if (result == 4) {
                document.getElementById('msg_alert_erro').innerHTML = "Técnico não encontrado!";
                document.getElementById('alert_erro').click()
            }

            else {
                var id_tec = result.results[0].id_tec
                var cod_cli = result.results[0].cod_cli
                var logo_cli = result.results[0].logo_cli
                localStorage.setItem("id_tec", id_tec)
                localStorage.setItem("cod_cli", cod_cli)
                localStorage.setItem("logo_cli", logo_cli)
                verifica_registro()
            }


        }
    })
}

function serial_number() {
    var serial = device.serial;
    document.getElementById('txt_alert_sucesso').innerHTML = "O seu serial é: <b>" + serial + "</b>";
    document.getElementById('alert_serial').click()
}

function conecta() {
    $("#loading").show();
    bluetoothSerial.connect("" + localStorage.getItem("ser_dis") + "", connectSuccess, connectFailure);
}

function connectSuccess() {
    $("#loading").hide();
    document.getElementById('msg_alert_sucesso').innerHTML = "Conectado com sucesso!";
    document.getElementById('alert_sucesso').click()    
    salva_registro("Conectou")
}

function connectFailure() {    
    $("#loading").hide();
    document.getElementById('msg_alert_erro').innerHTML = "Ocorreu um erro, tente novamente!";
    document.getElementById('alert_erro').click()
}

function nova_senha() {
    var txt = "fbdtn"
    var senha_nova = $("#nova_senha").val()
    var novasenha = txt + senha_nova

    bluetoothSerial.write(novasenha, sucesso_nova_senha, falhou_nova_senha);
}

function sucesso_nova_senha() {
    document.getElementById('msg_alert_sucesso').innerHTML = "Senha alterada!";
    document.getElementById('alert_sucesso').click()
}

function falhou_nova_senha() {
    document.getElementById('msg_alert_erro').innerHTML = "Ocorreu um erro, tente novamente!";
    document.getElementById('alert_erro').click()
}


function abrir() {
    var cod_cli = localStorage.getItem("cod_cli")
    var txt = cod_cli + "a"
    bluetoothSerial.write(txt, sucesso_abrir, falhou_abrir);
}

function sucesso_abrir() {
    document.getElementById('msg_alert_sucesso').innerHTML = "Aberto!";
    document.getElementById('alert_sucesso').click()
    salva_registro("Abriu")
}

function falhou_abrir() {
    document.getElementById('msg_alert_erro').innerHTML = "Ocorreu um erro, tente novamente!";
    document.getElementById('alert_erro').click()
}

function ligar_energia() {
    var cod_cli = localStorage.getItem("cod_cli")
    var txt = cod_cli + "r"
    bluetoothSerial.write(txt, sucesso_ligar, falhou_ligar);
}

function sucesso_ligar() {
    document.getElementById('msg_alert_sucesso').innerHTML = "Energia ligada!";
    document.getElementById('alert_sucesso').click()
    salva_registro("Ligou energia")
}

function falhou_ligar() {
    document.getElementById('msg_alert_erro').innerHTML = "Ocorreu um erro, tente novamente!";
    document.getElementById('alert_erro').click()
}

function desligar_energia() {
    var cod_cli = localStorage.getItem("cod_cli")
    var txt = cod_cli + "d"
    bluetoothSerial.write(txt, sucesso_desligar, falhou_desligar);
}


function sucesso_desligar() {
    document.getElementById('msg_alert_sucesso').innerHTML = "Energia desligada!";
    document.getElementById('alert_sucesso').click()
    salva_registro("Desligou energia")
}

function falhou_desligar() {
    document.getElementById('msg_alert_erro').innerHTML = "Ocorreu um erro, tente novamente!";
    document.getElementById('alert_erro').click()
}

var htm_regiao = ''
function getRegiao() {
    $("#monta_regiao").html('')
    htm_regiao = ''
    dbShell = window.openDatabase("banco", 2, "banco", 10000000);
    dbShell.transaction(function (tx) {
        tx.executeSql("select * from regiao", [], monta_regiao, dbErrorHandler);
    }, dbErrorHandler);
}
function monta_regiao(tx, result) {
    for (var i = 0; i < result.rows.length; i++) {
        htm_regiao += "<a href ='interna_regiao.html' onclick='getDispositivo(" + result.rows.item(i).id_reg + ")'><strong></strong><em>" + result.rows.item(i).nom_reg + "</em><img src='images/8w.jpg' class='preload-image responsive-image' alt='img'></a>"
    }
    setTimeout(regiao, 1000)
}
function regiao() {
    $("#loading").hide();
    $("#monta_regiao").html(htm_regiao);
}

var htm_dispositivo = ''
function getDispositivo(id_reg) {

    localStorage.setItem("id_reg", id_reg);

    $("#monta_dispositivo").html('')
    htm_dispositivo = ''
    dbShell = window.openDatabase("banco", 2, "banco", 10000000);
    dbShell.transaction(function (tx) {
        tx.executeSql("select * from dispositivo where id_reg = ?", [id_reg], monta_dispositivo, dbErrorHandler);
    }, dbErrorHandler);
}

function getDispositivoVolta() {

    var id_reg = localStorage.getItem("id_reg");

    $("#monta_dispositivo").html('')
    htm_dispositivo = ''
    dbShell = window.openDatabase("banco", 2, "banco", 10000000);
    dbShell.transaction(function (tx) {
        tx.executeSql("select * from dispositivo where id_reg = ?", [id_reg], monta_dispositivo, dbErrorHandler);
    }, dbErrorHandler);
}

function monta_dispositivo(tx, result) {
    for (var i = 0; i < result.rows.length; i++) {
        htm_dispositivo += "<a href ='interna_dispositivo.html' onclick='interna_dispositivo(&quot;" + result.rows.item(i).ser_dis + "&quot;,&quot;" + result.rows.item(i).id_dis + "&quot;)'><strong></strong><em id='" + result.rows.item(i).ser_dis + "'>" + result.rows.item(i).dsc_dis + "</em><img src='images/7s.jpg' class='preload-image responsive-image' alt='img'></a>"
    }
    setTimeout(dispositivo, 1000)
}
function dispositivo() {
    $("#monta_dispositivo").html(htm_dispositivo);
    scan()
}

function interna_dispositivo(ser_dis, id_dis) {
    localStorage.setItem("ser_dis", ser_dis);
    localStorage.setItem("id_dis", id_dis);
}


function salva_registro(dsc_reg) {
    var id_dis = localStorage.getItem("id_dis");
    var id_tec = localStorage.getItem("id_tec");
    var d1 = new Date();
    var d = d1.getDate();
    var m = d1.getMonth() + 1; //Months are zero based
    var y = d1.getFullYear();
    var h = d1.getHours();
    var mi = d1.getMinutes();
    var data = (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y + " " + (h <= 9 ? '0' + h : h) + ":" + (mi <= 9 ? '0' + mi : mi)
    dbShell = window.openDatabase("banco", 2, "banco", 10000000);
    dbShell.transaction(function (tx) {
        tx.executeSql("insert into dispositivo_registro(dta_reg, dsc_reg, id_dis, id_tec) values(?,?,?,?)", [data, dsc_reg, id_dis, id_tec]);
    }, dbErrorHandler);

}





function verifica_registro() {
    if (window.localStorage.getItem("banco_criado") != null) {
        dbShell = window.openDatabase("banco", 2, "banco", 10000000);
        dbShell.transaction(function (tx) {
            tx.executeSql("select * from dispositivo_registro", [], envia_registro, dbErrorHandler);
        }, dbErrorHandler);
    }
    else {
        location.href = 'interna.html'
    }
}

function envia_registro(tx, result) {
    var json = ""
    if (result.rows.length > 0) {
        for (var i = 0; i < result.rows.length; i++) {
            if (i == result.rows.length - 1) {
                json += "" + result.rows.item(i).dta_reg + ","
                json += "" + result.rows.item(i).dsc_reg + ","
                json += "" + result.rows.item(i).id_dis + ","
                json += "" + result.rows.item(i).id_tec + ""
            }
            else {
                json += "" + result.rows.item(i).dta_reg + ","
                json += "" + result.rows.item(i).dsc_reg + ","
                json += "" + result.rows.item(i).id_dis + ","
                json += "" + result.rows.item(i).id_tec + "!"
            }
        }


        $.ajax({
            type: "POST",
            url: "http://fixlock.net/versao/v1_1/salva_registro.aspx",
            data: { "json": json },
            timeout: 60000 * 5,
            async: true,
            dataType: 'json',
            beforeSend: function () {
            },
            complete: function () {
            },
            cache: false,
            success: function (result) {
                if (result = "0") {
                    location.href = 'interna.html'
                }
                else {
                    location.href = 'interna.html'
                }
            },

            error: function (result) {
                console.log(result)
            }
        });

    }
    else {
        location.href = 'interna.html'
    }

}


function configurar() {
    var sen_master = $("#senha_master").val()

    if (sen_master == "fixlock$2018") {
        $("#div_senha_master").show();
    }
    else {
        document.getElementById('msg_alert_erro').innerHTML = "Senha incorreta!";
        document.getElementById('alert_erro').click()
    }
}

function scan() {
    bluetoothSerial.discoverUnpaired(function (devices) {
        devices.forEach(function (device) {
            var id_texto = device.id

            try {
                document.getElementById(id_texto).style.color = "#6cff11";
            }
            catch (err) {
            }
        })
    }, failure);
}
function failure() { }

