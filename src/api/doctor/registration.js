export const registerNewDoctor = async (data) => {
    console.log(JSON.stringify(data))
    try {
        const response = await fetch('https://mis-api.kreosoft.space/api/doctor/register', {
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
            return response.json()

        } else {
            return null
        }

    } catch (error) {
        console.log(error)
    }
}

export default registerNewDoctor();