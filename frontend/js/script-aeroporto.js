// Funções para interagir com o backend são importadas do api-aeroporto.js
import { getAeroportos, createAeroporto, updateAeroporto, deleteAeroporto } from './api-aeroporto.js';

// Referências para elementos do DOM
const aeroportosTableBody = document.querySelector('#aeroportosTable tbody');
const aeroportoForm = document.querySelector('#aeroportoForm');
const nomeInput = document.querySelector('#nomeAeroporto');
const cidadeIdInput = document.querySelector('#cidadeIdAeroporto');
const aeroportoIdInput = document.querySelector('#aeroportoId');
const siglaInput = document.querySelector('#siglaAeroporto');

// Função para criar linhas da tabela com os dados dos aeroportos
function createTableRow(aeroporto) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${aeroporto.AEROPORTOID}</td>
      <td>${aeroporto.NOME}</td>
      <td>${aeroporto.SIGLA}</td>
      <td>${aeroporto.CIDADEID}</td>
      <td>
        <button class="edit-btn">Editar</button>
        <button class="delete-btn">Excluir</button>
      </td>
    `;
    // Adiciona os eventos nos botões
    row.querySelector('.edit-btn').addEventListener('click', () => editAeroporto(aeroporto, row));
    row.querySelector('.delete-btn').addEventListener('click', () => startDelete(aeroporto.AEROPORTOID));
    return row;
}

// Função para carregar e exibir a lista de aeroportos
function loadAeroportos() {
    getAeroportos()
        .then(response => {
            console.log(response.data);
            aeroportosTableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados
            response.data.forEach(aeroporto => {
                aeroportosTableBody.appendChild(createTableRow(aeroporto));
            });
        })
        .catch(error => console.error('Falha ao carregar aeroportos:', error));
}

// Evento de submit do formulário para adicionar ou atualizar aeroporto
aeroportoForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const aeroportoData = {
        nome: nomeInput.value,
        sigla: siglaInput.value,
        cidadeId: cidadeIdInput.value
    };

    const aeroportoId = aeroportoIdInput.value;
    if (aeroportoId) {
        // Atualizar aeroporto existente
        updateAeroporto(aeroportoId, aeroportoData)
            .then(() => {
                loadAeroportos();
                resetForm();
            })
            .catch(error => console.error('Falha ao atualizar aeroporto:', error));
    } else {
        // Criar novo aeroporto
        createAeroporto(aeroportoData)
            .then(() => {
                loadAeroportos();
                resetForm();
            })
            .catch(error => console.error('Falha ao criar aeroporto:', error));
    }
});

function editAeroporto(aeroporto, row) {
    // Transforma as células da tabela em campos de entrada
    row.children[1].innerHTML = `<input type="text" value="${aeroporto.NOME}" />`;
    row.children[2].innerHTML = `<input type="text" value="${aeroporto.SIGLA}" />`;
    row.children[3].innerHTML = `<input type="text" value="${aeroporto.CIDADEID}" />`;

    // Muda os botões
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Salvar';
    saveButton.addEventListener('click', () => saveEdit(aeroporto, row));

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancelar';
    cancelButton.addEventListener('click', () => cancelEdit(aeroporto, row));

    row.children[4].innerHTML = ''; // Limpa a célula dos botões
    row.children[4].appendChild(saveButton);
    row.children[4].appendChild(cancelButton);
}

function saveEdit(aeroporto, row) {
    const updatedNome = row.children[1].querySelector('input').value.trim();
    const updatedSigla = row.children[2].querySelector('input').value.trim();
    const updatedCidadeId = row.children[3].querySelector('input').value;

    // Verifica se o campo não está vazio
    if (!updatedNome) {
        alert('O campo nome não pode estar vazio.');
        return;
    }

    const aeroportoData = {
        nome: updatedNome,
        sigla: updatedSigla,
        cidadeId: parseInt(updatedCidadeId)
    };


    // Chamada para a API de atualização
    updateAeroporto(aeroporto.AEROPORTOID, aeroportoData)
        .then(() => loadAeroportos())
        .catch(error => console.error('Falha ao atualizar aeroporto:', error));

}

function cancelEdit(aeroporto, row) {
    // recria a linha da tabela com os valores originais
    const newRow = createTableRow(aeroporto);
    row.parentNode.replaceChild(newRow, row);
}

// Função para iniciar a edição de um aeroporto
function startEdit(aeroporto) {
    nomeInput.value = aeroporto.NOME;
    siglaInput.value = aeroporto.SIGLA;
    cidadeIdInput.value = aeroporto.CIDADEID;
    aeroportoIdInput.value = aeroporto.AEROPORTOID;
}


// Função para iniciar a exclusão de um aeroporto
function startDelete(id) {
    if (confirm('Tem certeza que deseja excluir este aeroporto?')) {
        deleteAeroporto(id)
            .then(() => loadAeroportos())
            .catch(error => console.error('Falha ao excluir aeroporto:', error));
    }
}

// Função para resetar o formulário
function resetForm() {
    nomeInput.value = '';
    cidadeIdInput.value = '';
    siglaInput.value = '';
    aeroportoIdInput.value = '';
}

// Carrega os aeroportos quando a página é carregada
document.addEventListener('DOMContentLoaded', loadAeroportos);
