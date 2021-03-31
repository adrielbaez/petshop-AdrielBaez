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
function validationForm(event){
    let field = event.target;
    if(field.value.length > 0 ) {
        field.style.borderBottomColor = '#76ff03'
   } else {
        field.style.borderBottomColor = 'red';
        mensajeCamposObligatorios()
   }

    if (nameInput.value !== '' && lastNameInput.value !== '' && emailInput.value !== '' && messageInput.value !== '' ) {
        btnSend.removeAttribute('disabled');
    } else {
        btnSend.setAttribute('disabled', '');
    }
}
function mensajeCamposObligatorios(){
    const mostrarMensaje = document.getElementById('mostrarMensaje')
    const mensajeError = document.createElement('p');
    mensajeError.classList.add('mensaje-error')
     mensajeError.textContent = 'Faltan campos por completar';
     mostrarMensaje.appendChild(mensajeError)

     setTimeout(() =>  {
        mensajeError.remove();
   }, 3000);
}
btnSend.addEventListener('click', (event)=>{
    event.preventDefault()
    Swal.fire({
        icon: 'success',
        title: `¡Muchas gracias por escribirnos ${nameInput.value}, te responderemos a la brevedad!`,
        showConfirmButton: true,
        timer: 7000
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
        precioMinimoFarmacia: '',
        precioMaximoFarmacia: '',
        todosPrecios: 'all',
    }
    var {juguetes, farmacia, precioProducto, precioMaximoFarmacia, precioMinimoFarmacia, todosPrecios} = catalogo;

    // filtro los articulos por tipo 
    juguetes = articulos.filter( articulo => articulo.tipo === 'Juguete')
    farmacia = articulos.filter( articulo => articulo.tipo === 'Medicamento')
    // precio minimo y precio maximo
   if (farmaciaPage) {
    colocarValueOption(farmacia)
   }
   if (juguetesPage) {
       colocarValueOption(juguetes)
   }
   function colocarValueOption(categoriaProducto){
    const optionMayor = document.getElementById('optionMayor');
    const optionMenor = document.getElementById('optionMenor');

    precioMaximoFarmacia = categoriaProducto.sort((a,b) => b.precio - a.precio)[0].precio 
    precioMinimoFarmacia = categoriaProducto.sort((a,b) => a.precio - b.precio)[0].precio 


    optionMayor.value = precioMaximoFarmacia
    optionMenor.value = precioMinimoFarmacia
   }
        
   // filtros inicia aqui
   const filtroPrecios = document.getElementById('filtroPrecios');
   filtroPrecios.addEventListener('change', (e) => {
       precioProducto = e.target.value;
       console.log(precioProducto);
       if (farmaciaPage) {
           comparaPrecios(farmacia)
       } 
       if (juguetesPage) {
           comparaPrecios(juguetes)
       }
   })
    // // necesito comparar ese precio, llamo arrayProductos a juguetes y farmacia
   function comparaPrecios(arrayProductos){
    // filtro mi array de productos
    let precioFiltrado = arrayProductos.filter(filtrarPrecio);
    // una vez filtrados, comparo para ordenarlos y mostrarlo en el DOM

    if (precioFiltrado.length > 0) {
        if (precioProducto == precioMinimoFarmacia) {
            let nuevoPrecioFiltrado =  precioFiltrado.sort((a , b) =>  a.precio - b.precio)
        crearCards(nuevoPrecioFiltrado)
        collapseCall()
    } else if (precioProducto == precioMaximoFarmacia) {
        let nuevoPrecioFiltrado2 =  precioFiltrado.sort((a , b) =>  b.precio - a.precio)
        crearCards(nuevoPrecioFiltrado2)
        collapseCall()
        }
    }
}
    // esta funcion es callBack de filter

    function filtrarPrecio(producto){
        if (precioProducto == todosPrecios) {
            callCrearCards()
        } else if (precioProducto == precioMinimoFarmacia) {
            return producto.precio >= precioProducto
        }else if (precioProducto == precioMaximoFarmacia) {
            return producto.precio <= precioProducto
        }
}

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