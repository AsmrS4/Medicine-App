import { URL_RESOURCE } from "../../utils/constants.js"

export const getVisits = async (params) => {
    let token = localStorage.getItem('token');
    let query = ""
    query += 'start=' + params.start
    query += '&end=' + params.end;
    if (params.icdRoots.length > 0) {
        for (let i = 0; i < params.icdRoots.length; i++) {
            query += '&icdRoots=' + params.icdRoots[i]
        }
    }
    try {
        const response = await fetch(URL_RESOURCE + 'report/icdrootsreport?' + query, {
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
                window.location.href = '/error'
            };
            throw new Error(response.status)
        }
    } catch (error) {
        console.error('Fetch failed with', error)
    }
}