//funções são metodos prontos que podem ser reaproveitados, pode-se criar proprias funções ou usar funções prontas do JS.
//texto sempre entre aspas "", números sem aspas, boolean true/false sem aspas.




// chave para idenfiticar os dados salvos pela aplicação no navegador.
const STORAGE_KEY = "prompts_storage"
//importante usar const para variaveis que não vão mudar, e let para variaveis que vão mudar.
//estamos guardando um texto, por isso usamos aspas.





// estado para carregar os prompts salvos e exibir na tela.
const state = {
    prompts: [],
    selectedId: null,
}
//estamos guardando um objeto, por isso usamos { }.
//prompts é um array vazio, que vai guardar os prompts salvos.
//selectedId é null, que vai guardar o id do prompt selecionado. é importante essa propriedade para saber se tem algun prompt selecionado. quando gerar um id, a gente vai saber qual prompt está selecionado. isso serve para mostrar o prompt na tela, editar, excluir, etc.




// seletores dos elementos HTML por ID
const elements = {
  promptTitle: document.getElementById("prompt-title"),
  promptContent: document.getElementById("prompt-content"),
  titleWrapper: document.getElementById("title-wrapper"),
  contentWrapper: document.getElementById("content-wrapper"),
  btnOpen: document.getElementById("btn-open"),
  btnCollapse: document.getElementById("btn-collapse"),
  sidebar: document.querySelector(".sidebar"),
  btnSave: document.getElementById("btn-save"),
  list: document.getElementById("prompt-list"),
  search: document.getElementById("search-input"),
  btnNew: document.getElementById("btn-new"),
  btnCopy: document.getElementById("btn-copy"),
}
//documento.getElementById() seleciona um elemento HTML pelo ID
//documento.querySelector() seleciona um elemento HTML por classe, id, atributo, etc.





// atualiza o estado do wrapper conforme o conteúdo do elemento
function updateEditableWrapperState(element, wrapper) {
  const hasText = element.textContent.trim().length > 0
  wrapper.classList.toggle("is-empty", !hasText)
}
//aqui estamos criando uma  função nossa, que recebe dois parametros (elemento e wrapper usando camelCase) nao escreve com espaços; e verifica se o elemento tem texto, se tiver, remove a classe is-empty do wrapper, se não tiver, adiciona a classe is-empty ao wrapper.
//element é o que o usuário digita, wrapper é a div que envolve o elemento, que mostra o placeholder quando o elemento está vazio.
//trim() remove espaços em branco no início e no fim do texto.
//length conta o número de caracteres do texto.
//toggle adiciona a classe se o segundo parametro for true, remove se for false.
//wrapper.classList.toggle("is-empty", !hasText) significa que se hasText for false (ou seja, não tem texto), a classe is-empty será adicionada ao wrapper. Se hasText for true (ou seja, tem texto), a classe is-empty será removida do wrapper.





// funções para abrir e fechar a sidebar
function openSidebar() {
  elements.sidebar.classList.add("open")
  elements.sidebar.classList.remove("collapsed")
}
//usamos flex porque a sidebar usa flexbox no CSS.
//usamos none porque o botão de abrir deve desaparecer quando a sidebar estiver aberta.




function closeSidebar() {
  elements.sidebar.classList.remove("open")
  elements.sidebar.classList.add("collapsed")
}
//usamos none para esconder a sidebar quando fechada.
//usamos block para mostrar o botão de abrir quando a sidebar estiver fechada.





// atualiza o estado de todos os elementos editáveis
function updateAllEditableStates() {
  updateEditableWrapperState(elements.promptTitle, elements.titleWrapper)
  updateEditableWrapperState(elements.promptContent, elements.contentWrapper)
}
//aqui a gente usa o const = elements para pegar os elementos do HTML e atualizar o estado de todos os elementos editáveis, chamando a função updateEditableWrapperState para cada par de elemento e wrapper. ou seja, verifica se o título e o conteúdo estão vazios ou não, e adiciona ou remove a classe is-empty dos wrappers correspondentes.




// adiciona ouvintes de input para atualizar wrappers em tempo real
function attachAllEditableHandlers() {
  elements.promptTitle.addEventListener("input", function () {
    updateEditableWrapperState(elements.promptTitle, elements.titleWrapper)
  })

  elements.promptContent.addEventListener("input", function () {
    updateEditableWrapperState(elements.promptContent, elements.contentWrapper)
  })
  //aqui estamos adicionando ouvintes de eventos de input aos elementos de título e conteúdo, para que quando o usuário digitar neles, a função updateEditableWrapperState seja chamada, atualizando o estado dos wrappers em tempo real.
}







function save() {
  const title = elements.promptTitle.textContent.trim()
  const content = elements.promptContent.innerHTML.trim()
  const hasContent = elements.promptContent.textContent.trim().length > 0
  //const title e const content estão pegando o valor do título e do conteúdo, removendo espaços em branco no início e no fim.
  //const hasContent está verificando se o conteúdo tem texto, retornando true ou false.

   if (!title || !hasContent) {
    alert("Título e conteúdo não podem estar vazios.")
    return
  }

  if (state.selectedId) { // editar prompt existente
    const existingPrompt = state.prompts.find((p) => p.id === state.selectedId) //encontra o prompt existente pelo id selecionado

    if (existingPrompt) {
      existingPrompt.title = title || "Sem título" //atualiza o título do prompt existente ou "Sem título" se estiver vazio
      existingPrompt.content = content || "Sem conteúdo" //atualiza o conteúdo do prompt existente ou "Sem conteúdo" se estiver vazio
    }

  } else {  // criar novo prompt
    const newPrompt = {
      id: Date.now().toString(36), //gerando um id único baseado na data e hora atual, convertendo para string. usamos base 36 para ter uma string mais curta.
      title, //título do promp (simplificamos porque a chave e o valor são iguais)
      content, //conteúdo do prompt (simplificamos porque a chave e o valor são iguais)
    }
    state.prompts.unshift(newPrompt) //adiciona o novo prompt no início da lista de prompts
    state.selectedId = newPrompt.id //define o id do novo prompt como o selecionado
    
    //aqui estamos criando um novo prompt com id, título e conteúdo, adicionando ao array de prompts no estado, e definindo o selectedId para o id do novo prompt.
    //Date.now() gera um número único baseado na data e hora atual, que usamos como id do prompt. usamos toString() para converter esse número em string.
    //push() adiciona o novo prompt ao final do array de prompts.
  }

    renderList(elements.search.value) //atualiza a lista de prompts exibida, mantendo o filtro atual
    persist() //salva os dados no armazenamento local
    alert("Prompt salvo com sucesso!") //mostrando um alerta para o usuário informando que o prompt foi salvo com sucesso.
}





function persist() {
    try { //ele vai tentar executar o código dentro do bloco try
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.prompts))
        //mostrando um alerta para o usuário informando que o prompt foi salvo com sucesso.

        //localStorage.setItem() salva os dados no armazenamento local do navegador, usando a chave STORAGE_KEY e convertendo o array de prompts em string com JSON.stringify().

    } catch (error) { //se der erro, ele vai executar o código dentro do bloco catch
        console.error("Erro ao salvar os dados no armazenamento local (localStorage):", error)
    }
}
//essa função persist() vai ser usada para salvar os dados no armazenamento local do navegador, usando a chave STORAGE_KEY. usamos try/catch para tratar erros caso ocorra algum problema ao salvar os dados. é legal usar para nao travar a aplicação se der erro.





function load() { //carrega os dados do armazenamento local ao iniciar
    try {
        const storage = localStorage.getItem(STORAGE_KEY) //pegando os dados salvos no armazenamento local do navegador, usando a chave STORAGE_KEY.
        state.prompts = storage ? JSON.parse(storage) : [] //se tiver dados, converte de string para array com JSON.parse(), se não tiver, define como array vazio.
        //aqui estamos carregando os dados do armazenamento local do navegador para o array de prompts no estado. se não tiver dados, o array fica vazio.
        //storage ? JSON.parse(storage) : [] é uma forma curta de escrever um if/else. se storage for true (ou seja, tiver dados), executa JSON.parse(storage), se for false (ou seja, não tiver dados), executa [].
        state.selectedId = null //inicializa o selectedId como null, ou seja, nenhum prompt selecionado.  

    } catch (error) { //se der erro, ele vai executar o código dentro do bloco catch
        console.error("Erro ao carregar os dados do armazenamento local (localStorage):", error)
    }   
}
//essa função load() vai ser usada para carregar os dados do armazenamento local do navegador quando a página for carregada. usamos try/catch para tratar erros caso ocorra algum problema ao carregar os dados.





function createPromptItem(prompt) {
    const tmp = document.createElement("div") //criando um elemento div temporário
    tmp.innerHTML = prompt.content //definindo o conteúdo do prompt no elemento temporário
    return `
    <li class="prompt-item" data-id="${prompt.id}" data-action="select">
        <div class="prompt-item-content">
            <span class="prompt-item-title">${prompt.title}</span>
            <span class="prompt-item-description">${tmp.textContent}</span>
        </div>

        <button class="btn-icon" title="Remover" data-action="remove">
            <img src="assets/remove.svg" alt="Remover" class="icon-trash" />
        </button>
    </li>
 `
}
//essa função createPromptItem() cria um item de prompt na lista de prompts, recebendo um objeto prompt como parametro. ela retorna um template string com o HTML do item, que inclui o título e a descrição do prompt, e um botão para remover o prompt. essa função ainda não está sendo usada no código, mas pode ser usada futuramente para renderizar a lista de prompts na sidebar.





function renderList(filterText = "") {
  const filteredPrompts = state.prompts //filtra os prompts pelo texto do filtro
    .filter((prompt) => //filtra os prompts pelo texto do filtro
      prompt.title.toLowerCase().includes(filterText.toLowerCase().trim()) //verifica se o título do prompt inclui o texto do filtro, ignorando maiúsculas/minúsculas e espaços em branco no início/fim.
    )
    .map((p) => createPromptItem(p)) //mapeia os prompts filtrados para criar os itens de prompt
    .join("") //junta os itens de prompt em uma única string

  elements.list.innerHTML = filteredPrompts //atualiza o HTML da lista de prompts com os itens filtrados
  //aqui estamos renderizando a lista de prompts na sidebar, filtrando pelo texto do filtro (se houver), criando os itens de prompt com a função createPromptItem, e atualizando o HTML da lista com os itens filtrados.
}





function newPrompt() {
    state.selectedId = null //nenhum prompt selecionado
    elements.promptTitle.textContent = "" //limpa o título do prompt na área de edição
    elements.promptContent.textContent = "" //limpa o conteúdo do prompt na área de edição
    updateAllEditableStates() //atualiza o estado dos placeholders
    elements.promptTitle.focus() //foca o cursor no título do prompt para facilitar a digitação.
}





function copySelected() {
  try {
    const content = elements.promptContent //pegando o conteúdo do prompt

    if (!navigator.clipboard) { //verificando se o navegador suporta a API de clipboard
      console.error("Clipboard API não suportada neste ambiente.") //se não suportar, mostra um erro no console
      return
    }

    navigator.clipboard.writeText(content.innerText) //copiando o texto do conteúdo do prompt para a área de transferência
    alert("Conteúdo copiado para a área de transferência!")
  } catch (error) { //se der erro, ele vai executar o código dentro do bloco catch
    console.log("Erro ao copiar para a área de transferência:", error)
  }
}




//eventos
elements.btnSave.addEventListener("click", save) //quando o usuário clicar no botão de salvar, a função save será chamada.
elements.btnNew.addEventListener("click", newPrompt) //quando o usuário clicar no botão de novo, a função add será chamada.
elements.btnCopy.addEventListener("click", copySelected) //quando o usuário clicar no botão de copiar, a função copySelected será chamada.

elements.search.addEventListener("input", function (event) {
  renderList(event.target.value) //chamando a função renderList com o texto do filtro
  //quando o usuário digitar no input de busca, a função anônima será chamada, pegando o valor do input e chamando a função renderList com esse valor para filtrar os prompts exibidos na lista.  
})

elements.list.addEventListener("click", function (event) {
    const removeBtn = event.target.closest("[data-action='remove']") //verifica se o clique foi no botão de remover
    const item = event.target.closest("[data-id]") //verifica se o clique foi em um item de prompt

    if (!item) return //se não for em um item, sai da função

    const id = item.getAttribute("data-id") //pega o id do prompt clicado
    state.selectedId = id //define o id do prompt clicado como o selecionado
    
    if (removeBtn) { //remover prompt
        state.prompts = state.prompts.filter((p) => p.id !== id) //filtra os prompts, removendo o prompt com o id clicado
        renderList(elements.search.value) //atualiza a lista de prompts exibida, mantendo o filtro atual
        persist() //salva os dados no armazenamento local
        return
    }

    if (event.target.closest('[data-action="select"]')) {
        const prompt = state.prompts.find((p) => p.id === id) //encontra o prompt pelo id

        if (prompt) {
            elements.promptTitle.textContent = prompt.title //atualiza o título do prompt na área de edição
            elements.promptContent.innerHTML = prompt.content //atualiza o conteúdo do prompt na área de edição
            updateAllEditableStates() //atualiza o estado dos placeholders
        }
    }
})




// inicialização
function init() {
  load() //carrega os dados do armazenamento local ao iniciar
  renderList("") //chamando a função renderList com parametro vazio para mostrar todos os prompts ao iniciar
  attachAllEditableHandlers()
  //essa função attachAllEditableHandlers() é chamada aqui para adicionar os ouvintes de input aos elementos editáveis, para que o estado dos wrappers seja atualizado em tempo real conforme o usuário digita. 
  updateAllEditableStates()
  //essa função updateAllEditableStates() é chamada aqui para garantir que o estado inicial dos elementos editáveis seja definido corretamente quando a página for carregada.

//essa função init() é a função principal que inicializa o comportamento do site. ela chama as funções para adicionar os ouvintes de input e atualizar o estado inicial dos elementos editáveis.

  // estado inicial: sidebar aberta (desktop) ou fechada (mobile)
  elements.sidebar.classList.remove("open")
  elements.sidebar.classList.remove("collapsed")
  //aqui estamos definindo o estado inicial da sidebar e do botão de abrir. a sidebar começa aberta (display vazio) e o botão de abrir começa oculto (display none).

  // eventos para abrir/fechar sidebar
  elements.btnOpen.addEventListener("click", openSidebar)
  elements.btnCollapse.addEventListener("click", closeSidebar)
  //aqui estamos adicionando ouvintes de eventos de clique aos botões de abrir e fechar a sidebar, para que quando o usuário clicar neles, as funções openSidebar e closeSidebar sejam chamadas, respectivamente.
}





// executa a inicialização ao carregar o script
init()
//essa função init() é a função principal que inicializa o comportamento do site. ela chama as funções para adicionar os ouvintes de input e atualizar o estado inicial dos elementos editáveis. ela está com parametro vazio porque não precisa de nenhum dado externo para funcionar.

//eventos no javascript são ações que ocorrem no navegador, como clicar em um botão, digitar em um campo de texto, carregar a página, etc. esses eventos podem ser capturados e tratados usando ouvintes de eventos (event listeners) que executam uma função quando o evento ocorre. no código acima, temos exemplos de eventos como "input" (quando o usuário digita no campo), "click" (quando o usuário clica no botão), etc. esses eventos são usados para atualizar o estado dos elementos editáveis e para abrir/fechar a sidebar.
//função anonima é uma função sem nome.