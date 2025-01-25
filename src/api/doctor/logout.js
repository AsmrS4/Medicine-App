import { URL_RESOURCE } from "../../utils/constants.js"

export const logoutDoctor = async (token) => {
    try {
        const response = await fetch(URL_RESOURCE + 'doctor/logout', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            }
        })
        localStorage.clear();
        window.location.href = '/login'

    } catch (error) {
        console.log(error)
    }
}
