import { URL_RESOURCE } from "../../utils/constants.js"

export const getPatients = async (params) => {

    let token = localStorage.getItem('token')
    let query = ""
    if (params?.name) {
        query += 'name=' + params.name
    }
    if (params?.conclusions) {
        params.conclusions.forEach(el => {
            query += '&conclusions=' + el
        });
    }
    query += '&sorting=' + params.sort;
    query += '&scheduledVisits=' + params.visits
    query += '&onlyMine=' + params.onlyMine
    query += (params?.page) ? '&page=' + params.page : '&page=1'
    query += '&size=' + params.size;
    console.log(query)
    try {
        const response = await fetch(URL_RESOURCE + `patient?${query}`, {
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
        console.error('Fetch failed with', error)
    }
}

export const getPatientById = async (patientId) => {
    let token = localStorage.getItem('token')
    try {
        const response = await fetch(URL_RESOURCE + 'patient/' + patientId, {
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
        console.error('Fetch failed with', error)
    }
}

export const createNewPatient = async (data) => {
    let token = localStorage.getItem('token')
    try {
        const response = await fetch(URL_RESOURCE + 'patient', {
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
        console.error('Fetch failed with', error)
    }
}