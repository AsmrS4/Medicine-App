import { URL_RESOURCE } from '../../utils/constants.js'

export const getSpecialties = async (part) => {
    try {
        const response = await fetch(URL_RESOURCE + `dictionary/speciality?page=1&size=50`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        if (response.ok) {
            return response.json()
        }

    } catch (error) {
        console.log(error)
    }
}