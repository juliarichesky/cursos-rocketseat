function toggleMode() {
    const html = document.documentElement
    //pontinho . é para acessar propriedades e funcionalidades.

    // if(html.classList.contains('light')) {
    //    html.classList.remove('light')
    // } else {
    //     html.classList.add('light')
    // }

    //esse  código todo que está em comentário faz a mesma coisa que essa linha abaixo, porém a função toggle já é uma funcionalidade do javascript que faz direto.
    html.classList.toggle('light')

    //========== TROCANDO IMAGEM ===========
    //pegar a tag img

    const img = document.querySelector("#profile img")
                //querySelector => função do document, query é pesquisa e selector é do seletor, ou seja, o argumento que vem dentro de ("") é o mesmo do CSS.

    // substituir a imagem
    // se tiver light mode, adicionar a imagem light
    if(html.classList.contains('light')) {
        img.setAttribute('src', '../assets/img/avatar-light.png')
    }   //setAttribute => adicionar, ajustar, modificar um atributo.

    // se tiver sem light mode, manter a imagem normal
    else {
        img.setAttribute('src', '../assets/img/avatar.png')
    }

    const alternativeText = document.querySelector("#profile img")
        if(html.classList.contains('light')) {
        alternativeText.setAttribute('alt', 'Foto Julia Richesky - Light Mode')
        } else {
        alternativeText.setAttribute('alt', 'Julia Richesky - Dark Mode')
        }
}