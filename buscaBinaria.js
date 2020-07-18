var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var app = express();

app.use(bodyParser.json());

app.listen(8080, function () {
  console.log("Servidor Web rodando na porta 8080");
});

app.get("/ler", function (req, res) {
  fs.readFile("./registros.json", "utf8", function (err, data) {
    if (err) {
      return console.log("Erro ao ler arquivo");
    }

    function buscaBinaria(umVetor, item) {
      let prim = 0;
      let ult = umVetor.length - 1;
      let achou = 0;
      while (prim <= ult && !achou) {
        meioLista = Math.ceil((prim + ult) / 2);
        if (umVetor[meioLista] === item) {
          achou = meioLista + 1;
        } else {
          if (item < umVetor[meioLista]) {
            ult = meioLista - 1;
          } else {
            prim = meioLista + 1;
          }
        }
      }
      return achou - 1;
    }

    var json = JSON.parse(data);
    var j = json.registros;
    var id = req.body.id;
    var key = Object.keys(j);
    var a = Object.entries(j);
    var d = buscaBinaria(key, id);

    res.json(a[d]);
  });
});

app.post("/enviar", function (req, res) {
  fs.readFile("registros.json", "utf8", function (err, data) {
    if (err) {
      var response = { status: "falha", resultado: err };
      res.json(response);
    } else {
      var obj = JSON.parse(data);

      obj.registros.push(req.body);

      fs.writeFile("registros.json", JSON.stringify(obj), function (err) {
        if (err) {
          var response = { status: "falha", resultado: err };
          res.json(response);
        } else {
          var response = {
            status: "sucesso",
            resultado: "Registro incluso com sucesso",
          };
          res.json(response);
        }
      });
    }
  });
});
