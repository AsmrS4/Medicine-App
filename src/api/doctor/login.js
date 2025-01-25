import { URL_RESOURCE } from "../../utils/constants.js"

export const loginDoctor = async (data) => {
    try {
        const response = await fetch(URL_RESOURCE + 'doctor/login', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data
            })
        })

        if (response.ok) {
            return await response.json()
        } else {
            return null
        }

    } catch (error) {
        console.log(error)
    }
}

export default loginDoctor