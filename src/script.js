let menuVisible= false;
// Funcion para ocultar Menu
function mostrarOcultarMenu(){
    if (menuVisible){
        document.getElementById("nav").classList ="";
        menuVisible = false
    }else{
            document.getElementById("nav").classList ="responsive";
            menuVisible = true

        }
    }
function seleccionar(){
    document.getElementById("nav").classList ="";
    menuVisible = false
}
function efectoHabilidades(){
    var skills = document.getElementById("skills");
    var distancia_skills = window.innerHeight - skills.getBoundingClientRect().top;
    if (distancia_skills >= 300){
        let habilidades = document.getElementsByClassName("progreso");
        habilidades[0].classList.add("javascript");
        habilidades[1].classList.add("htmlcss");
        habilidades[2].classList.add("excel");
        habilidades[3].classList.add("sql");
        habilidades[4].classList.add("powerbi");
        habilidades[5].classList.add("python");
        habilidades[6].classList.add("trabajoenequipo");
        habilidades[7].classList.add("comunicacion");
        habilidades[8].classList.add("organizacion");
        habilidades[9].classList.add("tiempo");
        habilidades[10].classList.add("frustracion");
        habilidades[11].classList.add("metodologias");
    }
}
window.onscroll =function(){
    efectoHabilidades();
}
const btn = document.getElementById('button');

document.getElementById('form')
 .addEventListener('submit', function(event) {
   event.preventDefault();

   btn.value = 'Sending...';

   const serviceID = 'default_service';
   const templateID = 'template_bixc80n';

   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = 'Send Email';
      alert('Sent!');
    }, (err) => {
      btn.value = 'Send Email';
      alert(JSON.stringify(err));
    });
});