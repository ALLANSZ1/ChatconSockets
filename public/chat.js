var socket = io.connect('http://3.140.247.121:4000');
var persona = document.getElementById('persona'),
    appChat = document.getElementById('app-chat'),
    panelBienvenida = document.getElementById('panel-bienvenida'),
    usuario = document.getElementById('usuario'),
    mensaje = document.getElementById('mensaje'),
    botonEnviar = document.getElementById('enviar'),
    escribiendoMensaje = document.getElementById('escribiendo-mensaje'),
    output = document.getElementById('output');

// Mostrar estado de conexión
const estadoConexion = document.getElementById('estado-conexion');
estadoConexion.textContent = 'Conectado';

// Cargar el sonido tipo "burbuja" desde el archivo descargado
const notificationSound = new Audio('/bubble.mp3');

// Ajustar el tiempo de reproducción para que suene justo en el momento del "bubble"
function playBubbleSound() {
    notificationSound.currentTime = 1; // Inicia en el segundo 1
    notificationSound.play().catch(error => {
        console.error('Error al reproducir el sonido:', error);
    });
    setTimeout(() => {
        notificationSound.pause();
        notificationSound.currentTime = 0; // Reinicia el audio
    }, 1000); // Detiene el sonido después de 1 segundo
}

// Reproducir sonido al enviar un mensaje
botonEnviar.addEventListener('click', function() {
    if (mensaje.value) {
        socket.emit('chat', {
            mensaje: mensaje.value,
            usuario: usuario.value
        });
        playBubbleSound();
    }
    mensaje.value = '';
});

// Mostrar mensajes en el chat
socket.on('chat', function(data) {
    escribiendoMensaje.innerHTML = ''; // Limpia el indicador de escritura
    output.innerHTML += '<p style="background: #e0f7fa; padding: 10px; border-radius: 5px; margin-bottom: 5px; color: #000;"><strong>' + data.usuario + ':</strong> ' + data.mensaje + '</p>';
});

// Emitir evento de escritura cuando el usuario está escribiendo
mensaje.addEventListener('keyup', function() {
    if (usuario.value) {
        socket.emit('typing', {
            nombre: usuario.value
        });
    }
});

// Mostrar indicador de escritura con estilo visual destacado
socket.on('typing', function(data) {
    if (data.nombre !== usuario.value) { // Verifica que el indicador no sea del propio usuario
        escribiendoMensaje.innerHTML = '<p style="color: #4caf50; font-style: italic;"><em>' + data.nombre + ' está escribiendo...</em></p>';
    } else {
        escribiendoMensaje.innerHTML = '';
    }
});

// Habilitar el envío de mensajes con la tecla Enter
mensaje.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        botonEnviar.click();
    }
});

function ingresarAlChat(){
    if(persona.value){
        panelBienvenida.style.display = "none";
        appChat.style.display = "block";
        var nombreDeUsuario = persona.value;
        usuario.value = nombreDeUsuario;
        usuario.readOnly = true;
    }
}
