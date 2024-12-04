const apiBaseUrl = 'http://localhost:3000/aeronaves';

function getAeronaves() {
    return axios.get(apiBaseUrl);
}

function createAeronave(aeronave) {
    return axios.post(apiBaseUrl, aeronave);
}

function updateAeronave(id, aeronave) {
    return axios.put(`${apiBaseUrl}/${id}`, aeronave);
}

function deleteAeronave(id) {
    return axios.delete(`${apiBaseUrl}/${id}`);
}

function getAeronaveById(id) {
    return axios.get(`${apiBaseUrl}/${id}`);
}

export { getAeronaves, getAeronaveById, createAeronave, updateAeronave, deleteAeronave };
