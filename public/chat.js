var socket = io.connect('http://localhost:4000');
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

// Reproducir sonido al recibir un mensaje
socket.on('chat', function(data) {
    escribiendoMensaje.innerHTML = '';
    output.innerHTML += '<p style="background: #e0f7fa; padding: 10px; border-radius: 5px; margin-bottom: 5px; color: #000;"><strong>' + data.usuario + ':</strong> ' + data.mensaje + '</p>';
    playBubbleSound();
});

// Mostrar indicador de escritura
mensaje.addEventListener('keyup', function() {
    if (persona.value) {
        socket.emit('typing', {
            nombre: usuario.value,
            texto: mensaje.value
        });
    }
});

socket.on('typing', function(data) {
    if (data.texto) {
        escribiendoMensaje.innerHTML = '<p><em>' + data.nombre + ' está escribiendo...</em></p>';
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
