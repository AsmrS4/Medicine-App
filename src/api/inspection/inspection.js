import { URL_RESOURCE } from "../../utils/constants.js";

export const getPrevInspections = async (patientId, part) => {
    let token = localStorage.getItem('token');
    try {
        const response = await fetch(URL_RESOURCE + `patient/${patientId}/inspections/search?request=${part}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            }
        })

        if (response.ok) {
            return response.json();
        } else {
            if (response.status === 404) throw new Error('Resource not found');
            if (response.status === 400) throw new Error('Bad request');
            if (response.status === 401) {
                localStorage.clear();
                window.location.href = '/login';
            }
            if (response.status === 500) {
                window.location.href = '/error';
            }

            throw new Error(response.status)
        }

    } catch (error) {
        console.error('Fetch failed with' + error)
    }
}

export const getPatientInspections = async (params) => {
    let token = localStorage.getItem('token')
    let query = ""
    if (params?.grouped) {
        query += 'grouped=' + params.grouped
    }
    if (params?.icdRoots) {
        params.icdRoots.forEach(el => {
            query += '&icdRoots=' + el
        });
    }
    query += (params?.page) ? '&page=' + params.page : '&page=1'
    query += '&size=' + params.size;
    console.log(query)
    try {
        const response = await fetch(URL_RESOURCE + `patient/${params.patientId}/inspections?` + query, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            }
        })
        if (response.ok) {
            return response.json();

        } else {
            if (response.status === 404) throw new Error('Resource not found');
            if (response.status === 400) throw new Error('Bad request');
            if (response.status === 401) {
                localStorage.clear();
                window.location.href = '/login';
            }
            if (response.status === 500) {
                window.location.href = '/error';
            }

            throw new Error(response.status)
        }
    } catch (error) {
        console.error('Fetch failed with' + error)
    }
}

export const createNewInspection = async (data) => {
    let token = localStorage.getItem('token')
    console.log(data)
    let patientId = localStorage.getItem('patientId')
    try {
        const response = await fetch(URL_RESOURCE + `patient/${patientId}/inspections`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            },
            body: JSON.stringify({
                ...data
            })
        })
        if (response.ok) {
            return response.json()
        } else {
            if (response.status === 404) throw new Error('Resource not found');
            if (response.status === 400) throw new Error('Bad request');
            if (response.status === 401) {
                localStorage.clear();
                window.location.href = '/login';
            }
            if (response.status === 500) {
                window.location.href = '/error';
            }

            throw new Error(response.status)
        }
    } catch (error) {
        console.error('Fetch failed with', error)
    }
}

export const getInspectionById = async (inspectionId) => {
    let token = localStorage.getItem('token');
    try {
        const response = await fetch(URL_RESOURCE + `inspection/${inspectionId}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            }
        })
        if (response.ok) {
            return response.json()
        } else {
            if (response.status === 404) throw new Error('Resource not found');
            if (response.status === 400) throw new Error('Bad request');
            if (response.status === 401) {
                localStorage.clear();
                window.location.href = '/login';
            }
            if (response.status === 500) {
                window.location.href = '/error';
            }

            throw new Error(response.status)
        }
    } catch (error) {
        console.log('Fetch failed with', error)
    }
}

export const getNestedConsultations = async (parentId) => {
    let token = localStorage.getItem('token');
    try {
        const response = await fetch(URL_RESOURCE + `inspection/${parentId}/chain`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            }
        })
        if (response.ok) {
            return response.json()
        } else {
            if (response.status === 404) throw new Error('Resource not found');
            if (response.status === 400) throw new Error('Bad request');
            if (response.status === 401) {
                localStorage.clear();
                window.location.href = '/login';
            }
            if (response.status === 500) {
                window.location.href = '/error';
            }

            throw new Error(response.status)
        }
    } catch (error) {
        console.log('Fetch failed with', error)
    }
}

export const editInspection = async (inspectionId, data) => {
    let token = localStorage.getItem('token');
    console.log(data)
    try {
        const response = await fetch(URL_RESOURCE + `inspection/${inspectionId}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            },
            body: JSON.stringify({
                ...data
            })
        })
        console.log(response)
        if (response.ok) {
            window.location.href = `/inspection/${inspectionId}`
        } else {
            if (response.status === 404) throw new Error('Resource not found');
            if (response.status === 400) throw new Error('Bad request');
            if (response.status === 401) {
                localStorage.clear();
                window.location.href = '/login';
            }
            if (response.status === 500) {
                window.location.href = '/error';
            }

            throw new Error(response.status)
        }
    } catch (error) {
        console.error('Fetch failed with' + error)
    }
}