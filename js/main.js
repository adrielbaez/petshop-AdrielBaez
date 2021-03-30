// variables
const contactPage = document.getElementById('contact');
const homePage = document.getElementById('home');
const farmaciaPage = document.getElementById('farmaciaPage');
const juguetesPage = document.getElementById('juguetesPage');
const cardFarmacia = document.getElementById('cardFarmacia');
const checkBoxes = document.getElementsByName('mascota');
const form = document.getElementById('form');
const btnSend = document.getElementById('btnSend');
const nameInput = document.getElementById('nameInput');
const lastNameInput = document.getElementById('apellido');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('mensaje');
// materialize
document.addEventListener('DOMContentLoaded', function(){
    M.AutoInit()
})
if (homePage) {
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.sidenav');
        var instances = M.Sidenav.init(elems, options);
      });
      document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.carousel');
        var instances = M.Carousel.init(elems, options);
      });
      document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.parallax');
        var instances = M.Parallax.init(elems, options);
      });
    
}
// fetxh

if (contactPage) {
    
var check = [];
loadEventListeners()
function loadEventListeners(){
    nameInput.addEventListener('blur', validationForm);
    lastNameInput.addEventListener('blur', validationForm);
    emailInput.addEventListener('blur', validationForm);
    messageInput.addEventListener('blur', validationForm);

    checkBoxes.forEach(checkBox => {
        checkBox.addEventListener('change',() => {
            check = [];
            checkBoxes.forEach(item =>{
                if (item.checked) {
                    check.push(item)
                }
            })
            if (check.length > 0 && nameInput.value !== '' && lastNameInput.value !== '' && emailInput.value !== '' && messageInput.value !== '') {
                btnSend.removeAttribute('disabled');
            } else {
                btnSend.setAttribute('disabled', '');
            }
        })
    });
}
function validationForm(e){
    let field = e.target;
    if(field.value.length > 0 ) {
        field.style.borderBottomColor = '#76ff03'
   } else {
        field.style.borderBottomColor = 'red';
   }

    if (nameInput.value !== '' && lastNameInput.value !== '' && emailInput.value !== '' && messageInput.value !== '' ) {
        btnSend.removeAttribute('disabled');
    } else {
        btnSend.setAttribute('disabled', '');
    }
}
btnSend.addEventListener('click', (event)=>{
    event.preventDefault()
    Swal.fire({
        // position: 'top-center',
        icon: 'success',
        title: `Tu mensaje fue enviado con exito, ${nameInput.value}!`,
        showConfirmButton: true,
        timer: 4000
      })
      .then(()=> {
          window.location.href = '/'
      })
})

}

if (farmaciaPage || juguetesPage) {




fetchArticulos()
async function fetchArticulos(){
    try {
        var respond = await fetch('https://apipetshop.herokuapp.com/api/articulos')
        var articulos = await respond.json()
        mostrarArticulos(articulos.response)
    }
    catch (error){
        console.log(error)
    }
} //fin fetch function

function mostrarArticulos(articulos){
    var catalogo = {
        juguetes: [],
        farmacia: [],
        precioProducto: '',
        otroPrecioProducto: '',
    }
    var {juguetes, farmacia, precioProducto, otroPrecioProducto} = catalogo;

    // filtro los articulos por tipo 
    juguetes = articulos.filter( articulo => articulo.tipo === 'Juguete')
    farmacia = articulos.filter( articulo => articulo.tipo === 'Medicamento')

    // boton
    cardFarmacia.addEventListener('click', agregarCarrito)

    function agregarCarrito(e){
        e.preventDefault()
        if (e.target.classList.contains('boton')) {
            
            console.log(e.target.parentElement);
        }
    }
    // filtros inicia aqui
    const filtroPrecios = document.getElementById('filtroPrecios');
    filtroPrecios.addEventListener('change', (e) => {
        precioProducto = e.target.value;
        if (farmaciaPage) {
            comparaPrecios(farmacia)
        } 
        if (juguetesPage) {
            comparaPrecios(juguetes)
        }
    })
    // necesito comparar ese precio
    function comparaPrecios(arrayProductos){
        // filtro mi array de productos
        let precioFiltrado = arrayProductos.filter(filtrarPrecio)
        if (precioFiltrado.length > 0) {
            if (precioProducto == '0') {
                let nuevoPrecioFiltrado =  precioFiltrado.sort((a , b) =>  a.precio - b.precio)
            crearCards(nuevoPrecioFiltrado)
            collapseCall()
        } else if (precioProducto == '10000') {
            let nuevoPrecioFiltrado2 =  precioFiltrado.sort((a , b) =>  b.precio - a.precio)
            crearCards(nuevoPrecioFiltrado2)
            collapseCall()
            
            }
        }
    }
    function filtrarPrecio(producto){
        if (precioProducto == 'all') {
            callCrearCards()
        } else if (precioProducto == '0') {
            return producto.precio >= precioProducto
        }else if (precioProducto == '10000') {
            return producto.precio <= precioProducto
        }
    }
    // filtros termina aqui

    function crearCards(arrayProductos){
        clearCards()
        arrayProductos.forEach( producto => {
            const card = document.createElement('div')
            card.classList.add('card', 'd-flex', 'flex-colum')
            card.innerHTML +=` 
            
            
                    <img class="img-card" src=${producto.imagen}/>
                    <div class="card-content d-flex  flex-colum flex-grow">
                        <div class="tittle-card d-flex flex-centrado">
                        <h3 class="center-align fw-bold">${producto.nombre}</h3>
                        </div>
                        <div>
                            <button type="button" class="collapsible">Descripcion</button>
                            <div class="content">
                                <p>${producto.descripcion}</p>
                            </div>
                        </div>    
                        <div class="${producto.stock < 5 ? 'stockUltimos'  : 'stock'}">
                            <p > ${producto.stock < 5 ?  'Ultimas unidades!' : 'Stock: '+ producto.stock}</p>
                        </div>
                        <div class="tipo left-align">
                            <p class="precio fw-bold">Precio: $<span class="precio2">${producto.precio} ARS</span></p>
                        </div>
                        <a class="boton" id="${producto._id}" href="#">Agregar al carrito</a>
                    </div>
                    `; 
                    cardFarmacia.appendChild(card)
        })
    }
    callCrearCards()
    // esta funcion evita repetir el llamado que tiene dentro
function callCrearCards(){
    if (farmaciaPage) {
        crearCards(farmacia)
    }
    if (juguetesPage) {
        crearCards(juguetes)
    }
}
collapseCall()
function collapseCall(){
    var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
}
}
function clearCards() {
    while(cardFarmacia.firstChild) {
        cardFarmacia.removeChild(cardFarmacia.firstChild);
    }
}
}