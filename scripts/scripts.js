let temasList = temas['tema'];

$(document).ready(function () {
  let param = new URLSearchParams(window.location.search).get('param');
  createMenu();
  refreshContent(param);
});

window.onpopstate = () => refreshContent(new URLSearchParams(window.location.search).get('param'));

function refreshContent(param) {
  if (!temasList || !Array.isArray(temasList)) {
    console.error("temasList no está definido o no es un array.");
    return;
  }

  if (param) {
    let tema = temasList.find(tema => tema.nombre === param);
    if (tema) {
      $('#content').load(tema.ruta + tema.nombre + '.html');

      // ✅ ACTUALIZAR EL TITLE CUANDO SE NAVEGA HACIA ATRÁS/DELANTE
      document.title = tema.titulo + " - Espacio Personal";
    } else {
      $('#content').html('Contenido no disponible');
      document.title = "Error - Espacio Personal"; // Título en caso de error
    }
  } else {
    $('#content').load('assets/sobre-mi.html');
    document.title = "Sobre Mí - Espacio Personal"; // Título por defecto
  }
}


function createMenu() {
  let menu = document.getElementById('menu');
  if (!menu) {
    console.error("El elemento #menu no se encontró en el DOM.");
    return;
  }

  temasList.forEach((tema) => {
    let liTemas = document.createElement('li');
    liTemas.className = 'nav-item';

    let btn = document.createElement('button');
    let txtTema = document.createTextNode(tema.titulo);
    btn.append(txtTema);
    btn.setAttribute('class', 'nav-link text-light');
    btn.setAttribute('data-href', tema.nombre);
    btn.addEventListener('click', updateContent);

    liTemas.appendChild(btn)
    menu.appendChild(liTemas);
  });

  let liTema = document.createElement('li');
  let enlace = document.createElement('a');
  let icon = document.createElement('span');
  enlace.innerHTML = "Guía de accesibilidad ";
  enlace.href = "https://mel-caballero.github.io/guide/";
  enlace.classList.add('nav-link', 'text-light');
  enlace.target = "_blank";
  enlace.title = "Abre una nueva ventana";
  icon.classList.add('bi', 'bi-box-arrow-up-right');
  enlace.appendChild(icon);
  liTema.appendChild(enlace);

  menu.appendChild(liTema);
}

function updateContent(event) {
  event.preventDefault();

  if (!temasList || !Array.isArray(temasList)) {
    console.error("temasList no está definido o no es un array.");
    return;
  }

  let temaNombre = $(this).data('href');
  let tema = temasList.find(t => t.nombre === temaNombre);

  if (tema) {
    let temaUrl = tema.ruta + tema.nombre + '.html';

    $.get({
      url: temaUrl,
      success: function (data) {
        window.history.pushState({}, '', '?param=' + temaNombre);
        $('#content').html(data);

        document.title = tema.titulo + " - Espacio Personal";
      },
      error: function () {
        $('#content').html('Error al cargar el contenido');
      },
      complete: function () {
        $(event.target).focus();
      }
    });
  } else {
    $('#content').html('Contenido no disponible');
    document.title = "Error - Espacio Personal";
  }
}

