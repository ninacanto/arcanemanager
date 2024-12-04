// Funções para interagir com o backend são importadas do api.js
import { getCidades, getCidadeById, createCidade, updateCidade, deleteCidade } from './api-cidade.js';

// Referências para elementos do DOM
const cidadesTableBody = document.querySelector('#cidadesTable tbody');
const cidadeForm = document.querySelector('#cidadeForm');
const nomeInput = document.querySelector('#nomeCidade');
const estadoInput = document.querySelector('#estadoCidade');
const paisInput = document.querySelector('#paisCidade');
const cidadeIdInput = document.querySelector('#cidadeId');

// Função para criar linhas da tabela com os dados das cidades
function createTableRow(cidade) {
  const row = document.createElement('tr');
  row.innerHTML = `
      <td data-label="CIDADEID">${cidade.CIDADEID}</td>
      <td data-label="NOME">${cidade.NOME}</td>
      <td data-label="ESTADO">${cidade.ESTADO}</td>
      <td data-label="PAIS">${cidade.PAIS}</td>
      <td>
        <button class="edit-btn">Editar</button>
        <button class="delete-btn">Excluir</button>
      </td>
    `;
  // Adiciona os eventos nos botões
  row.querySelector('.edit-btn').addEventListener('click', () => editCidade(cidade, row));
  row.querySelector('.delete-btn').addEventListener('click', () => startDelete(cidade.CIDADEID));
  return row;
}



// Função para carregar e exibir a lista de cidades
function loadCidades() {
  getCidades()
    .then(response => {
      console.log(response.data);
      cidadesTableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados
      response.data.forEach(cidade => {
        cidadesTableBody.appendChild(createTableRow(cidade));
      });
    })
    .catch(error => console.error('Falha ao carregar cidades:', error));
}

function editCidade(cidade, row) {
  // Transforma as células da tabela em campos de entrada
  row.children[0].innerHTML = cidade.CIDADEID;
  row.children[1].innerHTML = `<input type="text" value="${cidade.NOME}" />`;
  row.children[2].innerHTML = `<input type="text" value="${cidade.ESTADO}" />`;
  row.children[3].innerHTML = `<input type="text" value="${cidade.PAIS}" />`;

  // Muda os botões
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Salvar';
  saveButton.addEventListener('click', () => saveEdit(cidade, row));

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancelar';
  cancelButton.addEventListener('click', () => cancelEdit(cidade, row));

  row.children[4].innerHTML = ''; // Limpa a célula dos botões
  row.children[4].appendChild(saveButton);
  row.children[4].appendChild(cancelButton);
}

function saveEdit(cidade, row) {
  const updatedNome = row.children[1].querySelector('input').value.trim();
  const updatedEstado = row.children[2].querySelector('input').value.trim();
  const updatedPais = row.children[3].querySelector('input').value.trim();

  // Verifica se os campos não estão vazios
  if (!updatedNome || !updatedEstado) {
    alert('Os campos nome e estado não podem estar vazios.');
    return;
  }

  const cidadeData = {
    NOME: updatedNome,
    ESTADO: updatedEstado,
    PAIS: updatedPais
  };

  console.log(cidadeData);

  // Chamada para a API de atualização
  updateCidade(cidade.CIDADEID, cidadeData)
    .then(() => loadCidades())
    .catch(error => console.error('Falha ao atualizar cidade:', error));
}



function cancelEdit(cidade, row) {
  // Simplesmente recria a linha da tabela com os valores originais
  const newRow = createTableRow(cidade);
  row.parentNode.replaceChild(newRow, row);
}


// Evento de submit do formulário para adicionar ou atualizar cidade
cidadeForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const cidadeData = {
    nome: nomeInput.value,
    estado: estadoInput.value,
    pais: paisInput.value
  };

  const cidadeId = cidadeIdInput.value;
  if (cidadeId) {
    // Atualizar cidade existente
    updateCidade(cidadeId, cidadeData)
      .then(() => {
        loadCidades();
        resetForm();
      })
      .catch(error => console.error('Falha ao atualizar cidade:', error));
  } else {
    // Criar nova cidade
    createCidade(cidadeData)
      .then(() => {
        loadCidades();
        resetForm();
      })
      .catch(error => console.error('Falha ao criar cidade:', error));
  }
});

// Função para iniciar a edição de uma cidade
function startEdit(cidade) {
  nomeInput.value = cidade.Nome;  // Alterado de cidade.nome para cidade.Nome
  estadoInput.value = cidade.Estado;  // Alterado de cidade.estado para cidade.Estado
  cidadeIdInput.value = cidade.CidadeID;  // Alterado de cidade.id para cidade.CidadeID
  paisInput.value = cidade.PAIS;
}

// Função para iniciar a exclusão de uma cidade
function startDelete(id) {
  if (confirm('Tem certeza que deseja excluir esta cidade?')) {
    deleteCidade(id)
      .then(() => loadCidades())
      .catch(error => console.error('Falha ao excluir cidade:', error));
  }
}

// Função para resetar o formulário
function resetForm() {
  nomeInput.value = '';
  estadoInput.value = '';
  cidadeIdInput.value = '';
  paisInput.value = '';
}

// Carrega as cidades quando a página é carregada
document.addEventListener('DOMContentLoaded', loadCidades);
