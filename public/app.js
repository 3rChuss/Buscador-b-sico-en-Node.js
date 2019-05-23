
//Inicializador del elemento Slider
$("#rangoPrecio").ionRangeSlider({
  type: "double",
  grid: false,
  min: 0,
  max: 100000,
  from: 1000,
  to: 20000,
  prefix: "€"
})

function setSearch() {
  let busqueda = $('#checkPersonalizada')
  busqueda.on('change', (e) => {
    if (this.customSearch == false) {
      this.customSearch = true
    } else {
      this.customSearch = false
    }
    $('#personalizada').toggleClass('invisible')
  })
}

setSearch()

$(document).ready(function(){

  getData(Inicializa); // Invocamos el llenado de los selectores
  $('#buscar').on('click', () => {
    let busqueda = $('#checkPersonalizada')[0]
    if (busqueda.checked){
      getData(DatosFiltrados)
    } else {
      getData(MostrarDatos);
    }
  })

})

//Rellenar los selects de ciudad y tipo de vivienda
function Inicializa(res){
  var ciudades = [];
  var tipos = [];
  $.each(res, (i, data) => {
    ciudades[i] = data.Ciudad
    tipos[i] = data.Tipo
  })
  ciudades = unique(ciudades)
  tipos = unique(tipos)
  RellenarOptions(ciudades,'#ciudad');
  RellenarOptions(tipos,'#tipo');
}

// Hacemos un llenado de los selectores
function RellenarOptions(arry, select){
  $.map(arry, (val) => {
    var option = `<option value='${val}'>${val}</option>`;
    $(select).append(option);
  })
}

//Montamos el array de la busqueda
function DatosFiltrados(res){
  let filtro = [],
      rango = $('#rangoPrecio').data('ionRangeSlider');
      ciudad = $('#ciudad').val(),
      tipo = $('#tipo').val(),
      from = parseFloat(rango.result.from),
      to   = parseFloat(rango.result.to),
      add  = true


  $.each(res, (index, value) => {
    add = true
    let precio = parseFloat(value.Precio.substring(1,value.Precio.length).replace(/,/, ''))
    if (precio < from || precio > to) {
      add = false
    }
    if ((tipo != '') && add) {
      if (tipo != value.Tipo) {
        add = false
      }
    }
    if ((ciudad != '') && add) {
      if (ciudad != value.Ciudad) {
        add = false
      }
    }
    if (add) {
      filtro.push(res[index])
    }
  })
  MostrarDatos(filtro)
}

//Mostramos los datos
function MostrarDatos(data) {
  if (data.length <= 0)  alert('No hubo resultados para esta busqueda, porfavor pruebe con otros parámetros.')
  $(".enPantalla").remove()
  $.each(data, (index, value) => {
    let template = `<div class='card horizontal enPantalla'>
                      <div class='card-image'><img src='img/home.jpg'></div>
                      <div class='card-stacked'>
                        <div class='card card-content'>
                          <div><b> Dirección: </b>${value.Direccion}</div>
                          <div><b> Ciudad: </b>${value.Ciudad}</div>
                          <div><b> Teléfono: </b>${value.Telefono}</div>
                          <div><b> Codigo Postal: </b>${value.Codigo_Postal} </div>
                          <div><b> Precio: </b><span class='precioTexto'>${value.Precio}</span></div>
                          <div><b> Tipo: </b>${value.Tipo}</div>
                        </div>
                        <div class='card-action right-align'> <a href='#'>Ver más.</a> </div>
                      </div>
                    </div>`
    $('.lista').append(template)
  })
}

function getData(methodRes){
  $.ajax({
    url: 'data.json',
    type:"GET",
    dataType: "json",
    data: {},
    success: (data) => {
        methodRes(data);
    },
    error: (err) => {
        alert(err);
    }
  });
}

function unique(array){
    return array.filter((el, index, arr) => {
        return index === arr.indexOf(el);
    });
}
