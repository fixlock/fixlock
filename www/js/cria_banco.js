var dbShell;


//Criando e configurando banco de dados
function doLog(s) {
    console.log("Ret>> " + s);
}
function dbErrorHandler(err) {
    alert("DB Error: " + err.message + "\nCode=" + err.code);
}
function abre_banco() {
    dbShell = window.openDatabase("banco", 2, "banco", 10000000);
    dbShell.transaction(setupTable, dbErrorHandler, dbOKHandler);
}
function consulta_banco() {
    dbShell = window.openDatabase("banco", 2, "banco", 10000000);
}
function dbOKHandler() {
    console.log("db ok")
}

function retLoc() {
    //doLog("local gravado");
}

//Criando as tabelas
function setupTable(tx) {
    //Dropo para não repetir
    tx.executeSql('DROP TABLE IF EXISTS dispositivo');
    tx.executeSql('DROP TABLE IF EXISTS dispositivo_registro');
    tx.executeSql('DROP TABLE IF EXISTS regiao');

    //Crio as tabelas
    tx.executeSql("CREATE TABLE IF NOT EXISTS dispositivo(id_dis INTEGER PRIMARY KEY, dsc_dis TEXT, ser_dis TEXT, id_reg INTEGER)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS dispositivo_registro(id INTEGER PRIMARY KEY, dta_reg TEXT, dsc_reg TEXT, id_dis INTEGER, id_tec INTEGER)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS regiao(id_reg INTEGER PRIMARY KEY, nom_reg TEXT)");
    import_dados();
}


function import_dados() {

    $("#loading").show();

    var id_tec = localStorage.getItem("id_tec")

    $.ajax({
        type: "POST",
        url: "http://fixlock.net/versao/v1_1/import.aspx",
        data: { "id_tec": id_tec },
        timeout: 60000 * 5,
        async: true,
        dataType: 'json',
        beforeSend: function () {
        },
        complete: function () {
        },
        cache: false,
        success: function (result) {

            // populo as tabelas

            //regiao
            for (var i = 0, len = result.regiao.length; i < len; i++) {
                var id_reg = result.regiao[i].id_reg;
                var nom_reg = result.regiao[i].nom_reg;

                //gravo
                var dataRegiao = {
                    id_reg: id_reg,
                    nom_reg: nom_reg
                };
                saveRegiao(dataRegiao, retLoc);
            }

            //regiao
            for (var i = 0, len = result.dispositivo.length; i < len; i++) {
                var id_dis = result.dispositivo[i].id_dis;
                var dsc_dis = result.dispositivo[i].dsc_dis;
                var ser_dis = result.dispositivo[i].ser_dis;
                var id_reg = result.dispositivo[i].id_reg;

                //gravo
                var dataDispositivo = {
                    id_dis: id_dis,
                    dsc_dis: dsc_dis,
                    ser_dis: ser_dis,
                    id_reg: id_reg
                };
                saveDispostivo(dataDispositivo, retLoc);
            }

            localStorage.setItem("banco_criado", "1")
            setTimeout(getRegiao, 5000)

        },

        error: function (result) {
            console.log(result)

        }



    });
}


//Functions que populam as tabelas após import
function saveRegiao(note, cb) {
    dbShell.transaction(function (tx) {
        tx.executeSql("insert into regiao(id_reg, nom_reg) values(?,?)", [note.id_reg, note.nom_reg]);
    }, dbErrorHandler, cb);
}

function saveDispostivo(note, cb) {
    dbShell.transaction(function (tx) {
        tx.executeSql("insert into dispositivo(id_dis, dsc_dis, ser_dis, id_reg) values(?,?,?,?)", [note.id_dis, note.dsc_dis, note.ser_dis, note.id_reg]);
    }, dbErrorHandler, cb);
}
