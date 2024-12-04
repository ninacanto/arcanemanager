const apiBaseUrl = 'http://localhost:3000/aeroportos';

function getAeroportos() {
    return axios.get(apiBaseUrl);
}

function createAeroporto(aeroporto) {
    return axios.post(apiBaseUrl, aeroporto);
}

function updateAeroporto(id, aeroporto) {
    return axios.put(`${apiBaseUrl}/${id}`, aeroporto);
}

function deleteAeroporto(id) {
    return axios.delete(`${apiBaseUrl}/${id}`);
}

function getAeroportoById(id) {
    return axios.get(`${apiBaseUrl}/${id}`);
}

export { getAeroportos, getAeroportoById, createAeroporto, updateAeroporto, deleteAeroporto };
