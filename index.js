const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => document.getElementById('modal')
    .classList.remove('active')

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_itens_fornecedorr')) ?? []

const setLocalStorage = (db_itens_fornecedorr) => localStorage.setItem("db_itens_fornecedorr", JSON.stringify(db_itens_fornecedorr))

//CRUD
const deleteItem = (index) =>{
    const db_itens_fornecedorr = readItens()
    db_itens_fornecedorr.splice(index, 1)
    setLocalStorage(db_itens_fornecedorr)
}
const updateItem = (index, item) => {
    const db_itens_fornecedorr = readItens()
    db_itens_fornecedorr[index] = item
    setLocalStorage(db_itens_fornecedorr)
}
const readItens = () => getLocalStorage()

const createItem = (item) =>{
    const db_itens_fornecedor_fornecedor_fornecedor = getLocalStorage()
    db_itens_fornecedor_fornecedor_fornecedor.push(item)
    setLocalStorage(db_itens_fornecedor_fornecedor_fornecedor)
}

const isValidFields = () =>{
    return document.getElementById('formulario').reportValidity()
}

function clearInputs(){
    document.getElementById('fornecedor').value = ''
    document.getElementById('item').value = ''
    document.getElementById('quantidade').value = ''
    document.getElementById('valor').value = ''
    document.getElementById('data-pedido').value = ''
    document.getElementById('item').dataset.index = 'new'
}

const saveItem = () =>{
    var tempQuantidade = parseFloat(document.getElementById('quantidade').value)
    var tempValor = tempValor = parseFloat(document.getElementById('valor').value.replace(',', '.'))
    if(isNaN(tempQuantidade)){
        tempQuantidade = 1
    }
    var tempNome = document.getElementById('item').value
    var tempTotal = tempValor * tempQuantidade
    if(isNaN(tempValor)){
        tempValor = 0
    }
    if(isNaN(tempTotal)){
        tempTotal = 0
    }
    var totalConvertido = tempTotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    var valorConvertido = tempValor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})

    var tempFornecedor = document.getElementById('fornecedor').value

    var tempDataPedido = document.getElementById('data-pedido').value

    if (isValidFields()){
        const item = {
            fornecedor: tempFornecedor,
            nome: tempNome,
            quantidade: tempQuantidade,
            valor: valorConvertido,
            dataPedido: tempDataPedido,
            total: totalConvertido
        }
        const index = document.getElementById('item').dataset.index
        if(index == 'new'){
            createItem(item)
            clearInputs()
            document.getElementById('fornecedor').focus();
            updateTable()
            
        }else{
            document.getElementById('adicionar').style.display = "inline"
            document.getElementById('editar-element').style.display = "none"
            clearInputs()
            updateItem(index, item)
            updateTable()
        }
    }
}

const disableButton = () =>{
    const obj =  getLocalStorage()
    if(Object.keys(obj).length == 0){
        document.getElementById("list").style.display = "none";
        document.getElementById('carrinho').style.display = "flex"
    }
    else{
        if (Object.keys(obj).length == 1){
            document.getElementById('excluir-tudo').classList.add('disabled')
        }
        else{
            document.getElementById('excluir-tudo').classList.remove('disabled')
        }
        document.getElementById('list').style.display = "inline";
        document.getElementById('carrinho').style.display = "none"
    }
}

const soma = () =>{
    const obj =  getLocalStorage()
    var carrinho = 0;
    for(i = 0; i < Object.keys(obj).length; i++){
        obj[i].total.substr(3).replace(',', '.')
        carrinho += parseFloat(obj[i].total.substr(3).replace(',', '.'))
    }
    var carrinhoConvertido = carrinho.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('total').innerText = carrinhoConvertido
}

const createRow = (item, index) =>{
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
    <td>${item.fornecedor}</td>
    <td>${item.nome}</td>
    <td>${item.quantidade}</td>
    <td>${item.valor}</td>
    <td>${item.dataPedido}</td>
    <td>${item.total}</td>
    <td>
        <button type="button" class="btn btn-custom rounded-circle" id="editar-${index}">
            ✎
        </button>    
    </td>
    <td>
        <button type="button" class="btn btn-danger rounded-circle" id="excluir-${index}">
            X
        </button>
    </td>
    `
    document.querySelector('#tabela-items>tbody').appendChild(newRow)
    soma()
}

const clearTable = () =>{
    const rows = document.querySelectorAll('#tabela-items>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const deleteAll = () =>{
    localStorage.clear()
    updateTable()
}

const updateTable = () =>{
    soma()
    disableButton()
    const db_itens_fornecedor_fornecedor_fornecedor = readItens()
    clearTable()
    db_itens_fornecedor_fornecedor_fornecedor.forEach(createRow)
}
updateTable()

const fillFields = (item) => {
    document.getElementById('fornecedor').value = item.fornecedor
    document.getElementById('item').value = item.nome
    document.getElementById('quantidade').value = item.quantidade
    document.getElementById('valor').value = item.valor.substr(3);
    document.getElementById('data-pedido').value = item.dataPedido
    
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

document.getElementById('adicionar')
    .addEventListener('click', saveItem)

document.getElementById('editar-element')
    .addEventListener('click', saveItem)

document.getElementById('editar')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.querySelector('#tabela-items>tbody')
    .addEventListener('click', editDelete)

document.getElementById('excluir-tudo')
    .addEventListener('click', deleteAll)