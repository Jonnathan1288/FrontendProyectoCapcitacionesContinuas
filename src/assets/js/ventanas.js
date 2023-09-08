function OcultarPersonales() {
    const ventanaFlotante5 = document.querySelector('.m-6');
    ventanaFlotante5.style.display = 'none';
    const ventanaFlotante = document.querySelector('.m-5');
    ventanaFlotante.style.display = 'block';
    const ventanaFlotante1 = document.querySelector('.m-4');
    ventanaFlotante1.style.display = 'block';
    const ventanaFlotante2 = document.querySelector('.m-3');
    ventanaFlotante2.style.display = 'block';
    const ventanaFlotante4 = document.querySelector('.m-7');
    ventanaFlotante4.style.display = 'block';
    const ventanaFlotante6 = document.querySelector('.m-9');
    ventanaFlotante6.style.display = 'block';

}

function OcultarPersonales2() {
    const ventanaFlotante = document.querySelector('.m-5');
    ventanaFlotante.style.display = 'none';
    const ventanaFlotante1 = document.querySelector('.m-4');
    ventanaFlotante1.style.display = 'none';
    const ventanaFlotante2 = document.querySelector('.m-3');
    ventanaFlotante2.style.display = 'none';
    const ventanaFlotante4 = document.querySelector('.m-7');
    ventanaFlotante4.style.display = 'none';
    const ventanaFlotante5 = document.querySelector('.m-6');
    ventanaFlotante5.style.display = 'block';
    const ventanaFlotante6 = document.querySelector('.m-9');
    ventanaFlotante6.style.display = 'none';
    ;
}

function presentarVentanas() {
    const ventanaFlotante = document.querySelector('.ventana-act');
    if (ventanaFlotante.style.display === 'block') {
        ventanaFlotante.style.display = 'none';
    } else {
        ventanaFlotante.style.display = 'block';
    }
}





