const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => document.getElementById('modal')
    .classList.remove('active')

//Pegando o que tem no Banco, converte para de String para JSON
//E armazena na variavel db_itens
//Se o retorno vier vazio eu retorno um arrya vazio
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_itens')) ?? []

//Precisa converter objeto para JSON, passo a "tabela" para o Banco
//Passando uma chave "db_itens", para saber onde iserir o item
const setLocalStorage = (db_itens) => localStorage.setItem("db_itens", JSON.stringify(db_itens))

//CRUD
const deleteItem = (index) =>{
    const db_itens = readItens()
    db_itens.splice(index, 1)
    setLocalStorage(db_itens)
}
const updateItem = (index, item) => {
    const db_itens = readItens()
    db_itens[index] = item
    setLocalStorage(db_itens)
}
const readItens = () => getLocalStorage()

const createItem = (item) =>{
    //Pegando o banco
    const db_itens = getLocalStorage()
    //Acrescenta o item na variavel
    db_itens.push(item)
    //Mandando o novo Array para o banco
    setLocalStorage(db_itens)
}

const isValidFields = () =>{
    return document.getElementById('formulario').reportValidity()
}

//Interação com o layout
const saveItem = () =>{
    var tempNome = document.getElementById('item').value
    var tempQuantidade = parseFloat(document.getElementById('quantidade').value)
    var tempValor = parseFloat(document.getElementById('valor').value.replace(',', '.'))

    var tempTotal = tempValor * tempQuantidade
    var totalConvertido = tempTotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    var valorConvertido = tempValor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})



    if (isValidFields()){
        const item = {
            nome: tempNome,
            quantidade: tempQuantidade,
            valor: valorConvertido,
            total: totalConvertido
        }
        const index = document.getElementById('item').dataset.index
        
        

        if(index == 'new'){
            createItem(item)
            updateTable()
        }else{
            updateItem(index, item)
            updateTable()
        }
        
    }
}

//Criando linha da tabela com o item
const createRow = (item, index) =>{
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.quantidade}</td>
    <td>${item.valor}</td>
    <td>${item.total}</td>
    <td>
        <a type="button" class="btn btn-warning" id="editar-${index}">
            x
        </a>
    </td>
    <td>
        <button type="button" class="btn btn-danger" id="excluir-${index}">
            X
        </button>
    </td>
    `
    document.querySelector('#tabela-items>tbody').appendChild(newRow)
}

const clearTable = () =>{
    //Arrya com todas as <tr>
    const rows = document.querySelectorAll('#tabela-items>tbody tr')
    //Pego os pais da linha e apago a própria linha
    rows.forEach(row => row.parentNode.removeChild(row))
}

//Função para atualizar a tabela
const updateTable = () =>{
    const db_itens = readItens()
    clearTable()
    db_itens.forEach(createRow)
}
updateTable()

//Eventos

//Quando clicar no botão vai salvar o cliente
document.getElementById('adicionar')
    .addEventListener('click', saveItem)

document.getElementById('editar-element')
    .addEventListener('click', saveItem)

//editar
document.getElementById('editar')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

const fillFields = (item) => {
    document.getElementById('item').value = item.nome
    document.getElementById('valor').value = item.valor
    document.getElementById('quantidade').value = item.quantidade
    document.getElementById('item').dataset.index = item.index
}

const editItem = (index) => {
    document.getElementById('adicionar').style.display = "none"
    document.getElementById('editar-element').style.display = "inline"

    const item = readItens()[index]
    item.index = index
    fillFields(item)
    openModal()
}

const editDelete = (event) =>{
    if (event.target.type == 'button'){
        const [action, index] = event.target.id.split('-')

        if(action == 'editar'){
            editItem(index)
        } else {
            //const item = readItens()[index]
            //const response = confirm(`Deseja realmente exluir ${item.nome}?`)
            //if (response){
                deleteItem(index)
                updateTable()
            //}
        }
    }
}

document.querySelector('#tabela-items>tbody')
    .addEventListener('click', editDelete)

