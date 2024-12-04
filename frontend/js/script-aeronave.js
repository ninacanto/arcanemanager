// Funções para interagir com o backend são importadas do api-aeronaves.js
import { getAeronaves, createAeronave, updateAeronave, deleteAeronave } from './api-aeronave.js';

// Referências para elementos do DOM
const aeronavesTableBody = document.querySelector('#aeronavesTable tbody');
const aeronaveForm = document.querySelector('#aeronaveForm');
const modeloInput = document.querySelector('#modeloAeronave');
const numeroIdentificacaoInput = document.querySelector('#numeroIdentificacao');
const fabricanteInput = document.querySelector('#fabricanteAeronave');
const anoFabricacaoInput = document.querySelector('#anoFabricacao');
const qtdLinhasInput = document.querySelector('#qtdLinhas');
const qtdColunasInput = document.querySelector('#qtdColunas');
const aeronaveIdInput = document.querySelector('#aeronaveId');

// Função para criar linhas da tabela com os dados das aeronaves
function createTableRow(aeronave) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${aeronave.AERONAVEID}</td>
      <td>${aeronave.MODELO}</td>
      <td>${aeronave.NUMEROIDENTIFICACAO}</td>
      <td>${aeronave.FABRICANTE}</td>
      <td>${aeronave.ANOFABRICACAO}</td>
      <td>${aeronave.QTDLINHAS} x ${aeronave.QTDCOLUNAS}</td>
      <td>
        <button class="edit-btn">Editar</button>
        <button class="delete-btn">Excluir</button>
      </td>
    `;
    // Adiciona os eventos nos botões
    row.querySelector('.edit-btn').addEventListener('click', () => editAeronave(aeronave, row));
    row.querySelector('.delete-btn').addEventListener('click', () => startDelete(aeronave.AERONAVEID));
    return row;
}

// Função para carregar e exibir a lista de aeronaves
function loadAeronaves() {
    getAeronaves()
        .then(response => {
            console.log(response.data);
            aeronavesTableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados
            response.data.forEach(aeronave => {
                aeronavesTableBody.appendChild(createTableRow(aeronave));
            });
        })
        .catch(error => console.error('Falha ao carregar aeronaves:', error));
}

// Evento de submit do formulário para adicionar ou atualizar aeronave
aeronaveForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const aeronaveData = {
        modelo: modeloInput.value,
        numeroIdentificacao: numeroIdentificacaoInput.value,
        fabricante: fabricanteInput.value,
        anoFabricacao: anoFabricacaoInput.value,
        qtdLinhas: qtdLinhasInput.value,
        qtdColunas: qtdColunasInput.value
    };

    const aeronaveId = aeronaveIdInput.value;
    if (aeronaveId) {
        // Atualizar aeronave existente
        updateAeronave(aeronaveId, aeronaveData)
            .then(() => {
                loadAeronaves();
                resetForm();
            })
            .catch(error => console.error('Falha ao atualizar aeronave:', error));
    } else {
        // Criar nova aeronave
        createAeronave(aeronaveData)
            .then(() => {
                loadAeronaves();
                resetForm();
            })
            .catch(error => console.error('Falha ao criar aeronave:', error));
    }
});

function editAeronave(aeronave, row) {
    // Transforma as células da tabela em campos de entrada
    row.children[1].innerHTML = `<input type="text" value="${aeronave.MODELO}" />`;
    row.children[2].innerHTML = `<input type="text" value="${aeronave.NUMEROIDENTIFICACAO}" />`;
    row.children[3].innerHTML = `<input type="text" value="${aeronave.FABRICANTE}" />`;
    row.children[4].innerHTML = `<input type="number" value="${aeronave.ANOFABRICACAO}" />`;
    row.children[5].innerHTML = `<input type="number" value="${aeronave.QTDLINHAS}" /> x <input type="number" value="${aeronave.QTDCOLUNAS}" />`;

    // Muda os botões
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Salvar';
    saveButton.addEventListener('click', () => saveEdit(aeronave, row));

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancelar';
    cancelButton.addEventListener('click', () => cancelEdit(aeronave, row));

    row.children[6].innerHTML = ''; // Limpa a célula dos botões
    row.children[6].appendChild(saveButton);
    row.children[6].appendChild(cancelButton);
}

function saveEdit(aeronave, row) {
    const updatedModelo = row.children[1].querySelector('input').value.trim();
    const updatedNumeroIdentificacao = row.children[2].querySelector('input').value.trim();
    const updatedFabricante = row.children[3].querySelector('input').value.trim();
    const updatedAnoFabricacao = parseInt(row.children[4].querySelector('input').value);
    const updatedQtdLinhas = parseInt(row.children[5].querySelectorAll('input')[0].value);
    const updatedQtdColunas = parseInt(row.children[5].querySelectorAll('input')[1].value);

    if (!updatedModelo || !updatedNumeroIdentificacao || !updatedFabricante) {
        alert('Os campos não podem estar vazios.');
        return;
    }

    const aeronaveData = {
        modelo: updatedModelo,
        numeroIdentificacao: updatedNumeroIdentificacao,
        fabricante: updatedFabricante,
        anoFabricacao: updatedAnoFabricacao,
        qtdLinhas: updatedQtdLinhas,
        qtdColunas: updatedQtdColunas
    };

    // Chamada para a API de atualização
    updateAeronave(aeronave.AERONAVEID, aeronaveData)
        .then(() => loadAeronaves())
        .catch(error => console.error('Falha ao atualizar aeronave:', error));
}

function cancelEdit(aeronave, row) {
    // Recria a linha da tabela com os valores originais
    const newRow = createTableRow(aeronave);
    row.parentNode.replaceChild(newRow, row);
}

// Função para iniciar a exclusão de uma aeronave
function startDelete(id) {
    if (confirm('Tem certeza que deseja excluir esta aeronave?')) {
        deleteAeronave(id)
            .then(() => loadAeronaves())
            .catch(error => console.error('Falha ao excluir aeronave:', error));
    }
}

// Função para resetar o formulário
function resetForm() {
    aeronaveForm.reset();
    aeronaveIdInput.value = '';
}

// Carrega as aeronaves quando a página é carregada
document.addEventListener('DOMContentLoaded', loadAeronaves);
