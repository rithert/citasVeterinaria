//variables del DOM
const $mascota = document.querySelector("#mascota");
const $propietario = document.querySelector("#propietario");
const $telefono = document.querySelector("#telefono");
const $fecha = document.querySelector("#fecha");
const $hora = document.querySelector("#hora");
const $sintomas = document.querySelector("#sintomas");
const $formulario = document.querySelector("#nueva-cita");
const $listaCitas = document.querySelector("#citas");

//variables logica
let edicion

//registro de eventos
eventListeners();

function eventListeners() {
  $mascota.addEventListener("input", datosCitas);
  $propietario.addEventListener("input", datosCitas);
  $telefono.addEventListener("input", datosCitas);
  $fecha.addEventListener("input", datosCitas);
  $hora.addEventListener("input", datosCitas);
  $sintomas.addEventListener("input", datosCitas);

  //añadir citas y validar
  $formulario.addEventListener("submit", nuevaCita);
}

class Citas {
  constructor() {
    this.citas = [];
  }

  agregarCitas(cita) {
    this.citas = [...this.citas, cita];
    console.log(this.citas);
  }

  eliminarCita(id){
    this.citas = this.citas.filter(cita=> cita.id !== id)
  }

  modificarCita(citaActulizada){
    this.citas = this.citas.map(cita => cita.id === citaActulizada.id ? citaActulizada : cita)
  }
}

let administrarCitas = new Citas();

class UI {
  imprimirAlerta(mensaje, tipo) {
    //crear mensaje
    const mensajeDiv = document.createElement("div");
    mensajeDiv.classList.add("text-center", "alert", "d-block", "col-12");
    //agregar clases depediento del error
    if (tipo === "error") {
      mensajeDiv.classList.add("alert-danger");
    } else {
      mensajeDiv.classList.add("alert-success");
    }
    //agregar mensaje al div
    mensajeDiv.textContent = mensaje;
    //agregar Dom
    document
      .querySelector("#contenido")
      .insertBefore(mensajeDiv, document.querySelector(".agregar-cita"));
    //se desaparesza el mensaje luego de 3 seg
    setTimeout(() => {
      mensajeDiv.remove();
    }, 3000);
  }

  citasHtml({ citas }) {
    this.limpiarHtml()

    citas.forEach((cita) => {
      const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

      //crear div de la cita
      const divCita = document.createElement("div");
      divCita.classList.add("cita", "p-3");
      divCita.dataset.id = id;

      //script de los elementos que componen la cita
      const mascotaParrafo = document.createElement("h2");
      //mascotaParrafo.classLis.add("");
      mascotaParrafo.textContent = mascota;

      const propietarioParrafo = document.createElement("p");
      propietarioParrafo.innerHTML =`<span class="font-weight-bolder">Propietario: </span>${propietario} `

      const telefonoParrafo =document.createElement("p")
      telefonoParrafo.innerHTML =`<span class="font-weight-bolder">Telefono: </span>${telefono}`
      
      const fechaParrafo =document.createElement("p")
      fechaParrafo.innerHTML =`<span class="font-weight-bolder">Fecha: </span>${fecha}`
      
      const horaParrafo =document.createElement("p")
      horaParrafo.innerHTML =`<span class="font-weight-bolder">Hora: </span>${hora}`
      
      const sintomasParrafo =document.createElement("p")
      sintomasParrafo.innerHTML =`<span class="font-weight-bolder">Sintomas: </span>${sintomas}`

      const btnEliminar = document.createElement("button")
      btnEliminar.classList.add("btn", "btn-danger","mr-2")
      btnEliminar.innerHTML ='Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
      btnEliminar.onclick = ()=>{
        eliminarCita(id)
      }

      const BtnModificar = document.createElement("button")
      BtnModificar.classList.add("btn", "btn-info","mr-2")
      BtnModificar.innerHTML = 'Modificar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>'
      BtnModificar.onclick = ()=>{
        modificarCita(cita)
      }

      //agregar al div de la Cita
      divCita.appendChild(propietarioParrafo)
      divCita.appendChild(mascotaParrafo)
      divCita.appendChild(telefonoParrafo)
      divCita.appendChild(fechaParrafo)
      divCita.appendChild(horaParrafo)
      divCita.appendChild(sintomasParrafo)
      divCita.appendChild(btnEliminar)
      divCita.appendChild(BtnModificar)
      
      //agregar el div a la lista de citas
      $listaCitas.appendChild(divCita)
    });
  }

  limpiarHtml(){
    while($listaCitas.firstChild){
      $listaCitas.removeChild($listaCitas.firstChild)
    }
  }
}

let ui = new UI();

//objeto
const objCita = {
  mascota: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
  sintomas: "",
};

//llena los objetos
function datosCitas(e) {
  objCita[e.target.name] = e.target.value;
}

//reinicia objeto
function reiniciaObjeto() {
  objCita.mascota = "";
  objCita.fecha = "";
  objCita.hora = "";
  objCita.propietario = "";
  objCita.sintomas = "";
  objCita.telefono = "";
}

//valida y agrega un nueva cita
function nuevaCita(e) {
  e.preventDefault();
  const { mascota, propietario, telefono, fecha, hora, sintomas } = objCita;
  if (mascota === "" || propietario === "" || telefono === "" || fecha === "" || hora === "" || sintomas === ""){
    ui.imprimirAlerta("Todos los campos son requeridos", "error");
    return;
  }

  if(edicion){
    //mesaje de edicion correcta
    ui.imprimirAlerta("Cita modificada satisfactoriamente")
    //llamado a la fucnion que modifica
    administrarCitas.modificarCita({...objCita})
    //regresar el texto del boton al estado inicial
    $formulario.querySelector("button").textContent = "Crear cita"
    //quitar el modo edicion
    edicion = false
  }
  else{
    console.log('modo cre')
    //generar id
    objCita.id = Date.now();
    //creando una nueva cita
    administrarCitas.agregarCitas({ ...objCita });
    //mensaje de agregado corectamente
    ui.imprimirAlerta("Cita creada satisfactoriamente")
  }

  //reinicia el formulario
  $formulario.reset();
  //reiniciar el objeto
  reiniciaObjeto();
  //mostrar Html
  ui.citasHtml(administrarCitas);
}

//eliminar cita
function eliminarCita(id){
  //eliminar cita
  administrarCitas.eliminarCita(id)
  //muestre un mensaje
  ui.imprimirAlerta("La cita se elimino correctamente")
  //refresque
  ui.citasHtml(administrarCitas)
}

//Modificar Cita
function modificarCita(cita){
  edicion = true
  const { mascota, propietario, telefono, fecha, hora, sintomas,id } = cita;
  //rellena los inputs con la informacion 
  $mascota.value = mascota
  $propietario.value = propietario
  $telefono.value = telefono
  $fecha.value = fecha
  $hora.value = hora
  $sintomas.value = sintomas

  //rellena el objeto 
  objCita.mascota = mascota
  objCita.telefono = telefono
  objCita.propietario = propietario
  objCita.fecha = fecha
  objCita.hora = hora
  objCita.sintomas = sintomas
  objCita.id = id

  //cambiar el texto del boton 
  $formulario.querySelector("button").textContent = "Guardar Cambios"

}
