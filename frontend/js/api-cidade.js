const apiBaseUrl = 'http://localhost:3000/cidades';

function getCidades() {
    return axios.get(apiBaseUrl);
}

function createCidade(cidade) {
    return axios.post(apiBaseUrl, cidade);
}

function updateCidade(id, cidade) {
    return axios.put(`${apiBaseUrl}/${id}`, cidade);
}

function deleteCidade(id) {
    return axios.delete(`${apiBaseUrl}/${id}`);
}

function getCidadeById(id) {
    return axios.get(`${apiBaseUrl}/${id}`);
}

export { getCidades, getCidadeById, createCidade, updateCidade, deleteCidade };
