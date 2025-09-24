var socket = io.connect('http://localhost:4000');
var persona = document.getElementById('persona'),
    appChat = document.getElementById('app-chat'),
    panelBienvenida = document.getElementById('panel-bienvenida'),
    usuario = document.getElementById('usuario'),
    mensaje = document.getElementById('mensaje'),
    botonEnviar = document.getElementById('enviar'),
    escribiendoMensaje = document.getElementById('escribiendo-mensaje'),
    output = document.getElementById('output');

// Cargar el sonido desde la carpeta pública
const notificationSound = new Audio('/sonido.mp3');

// Reproducir sonido cuando se envía un mensaje
botonEnviar.addEventListener('click', function() {
    if (mensaje.value) {
        socket.emit('chat', {
            mensaje: mensaje.value,
            usuario: usuario.value
        });
        notificationSound.play().catch(error => {
            console.error('Error al reproducir el sonido:', error);
        });
    }
    mensaje.value = '';
});

mensaje.addEventListener('keyup', function(){
    if(persona.value){
        socket.emit('typing', {
            nombre: usuario.value,
            texto: mensaje.value
        });
    }
});

// Reproducir sonido cuando se recibe un mensaje
socket.on('chat', function(data) {
    escribiendoMensaje.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.usuario + ':</strong> ' + data.mensaje + '</p>';
    notificationSound.play().catch(error => {
        console.error('Error al reproducir el sonido:', error);
    });
});

socket.on('typing', function(data){
    if(data.texto){
        escribiendoMensaje.innerHTML = '<p><em>' + data.nombre + ' está escribiendo un mensaje...</em></p>';
    }else{
        escribiendoMensaje.innerHTML = '';
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
