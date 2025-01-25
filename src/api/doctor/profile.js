export const getProfile = async (token) => {
    try {
        const response = await fetch('https://mis-api.kreosoft.space/api/doctor/profile', {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            }
        })

        if (response.ok) {
            return {
                value: await response.json(),
                responseCode: response.status
            }
        } else {
            return {
                value: null,
                responseCode: response.status
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export const updateProfile = async (token, data) => {
    try {
        const response = await fetch('https://mis-api.kreosoft.space/api/doctor/profile', {
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

        if (response.ok) {
            return {
                value: true,
                responseCode: response.status
            }
        } else {
            return {
                value: null,
                responseCode: response.status
            }
        }

    } catch (error) {
        console.log(error)
    }
}

export default { getProfile, updateProfile }