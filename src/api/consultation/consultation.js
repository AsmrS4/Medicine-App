import { URL_RESOURCE } from "../../utils/constants.js"

export const getConsultations = async (params) => {
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
        const response = await fetch(URL_RESOURCE + 'consultation?' + query, {
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

            throw new Error(response.status)
        }
    } catch (error) {
        console.error('Fetch failed with', error)
    }
}

