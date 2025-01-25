import { getProfile, updateProfile } from '../../api/doctor/profile.js'
import { notEmpty, emailIsValid, profileDataAreValid } from '../../utils/validation/email.js'
import { birthDateIsValid } from '../../utils/validation/date.js'
import { phoneNumberIsValid } from '../../utils/validation/phone.js'
import { setAuthorizedHeader } from '../../utils/unauthorized.js'

export const getDoctorProfile = async () => {
    let token = localStorage.getItem('token');
    const result = await getProfile(token);
    await setAuthorizedHeader();
    if (result.value) {
        $('#username-field').val(result.value.name)
        $('#email-field').val(result.value.email);
        if (result.value?.birthday) {
            $('#birthdate').val(result?.value.birthday.slice(0, 10));
        } else {
            $('#birthdate').val('')
        }
        (result.value.gender === 'Male') ? $('#gender-select').val('Male') : $('#gender-select').val('Female')
        $('#phone-field').val(result.value.phone)

        localStorage.setItem('username', result.value.name)
        localStorage.setItem('doctorId', result.value.id)
    } else {
        if (result.responseCode === 401) {
            localStorage.clear();
            window.location.href = '/login'
        }
    }
}

export const updateDoctorProfile = async () => {
    $(document).on('click', '.login-form__submit-btn', async () => {
        $('#username-field').removeClass('is-invalid')
        $('#email-field').removeClass('is-invalid')
        $('#phone-field').removeClass('is-invalid')
        $('#birthdate').removeClass('is-invalid')

        $('#username-label').addClass('d-none')
        $('#email-label').addClass('d-none')
        $('#phone-label').addClass('d-none')
        $('#birthdate-label').addClass('d-none')


        if (profileDataAreValid(
            {
                name: $('#username-field').val(),
                email: $('#email-field').val(),
                birthday: $('#birthdate').val(),
                gender: $('#gender-select').val(),
                phone: $('#phone-field').val(),
            }
        )) {
            const response = await updateProfile(
                localStorage.getItem('token'),
                {
                    name: $('#username-field').val(),
                    email: $('#email-field').val(),
                    birthday: $('#birthdate').val() === '' ? null : $('#birthdate').val(),
                    gender: $('#gender-select').val(),
                    phone: ($('#phone-field').val() === '') ? null : $('#phone-field').val(),
                }
            )
            console.log(response)
            if (response.value) {
                await getDoctorProfile()
                await setAuthorizedHeader()
            } else {
                if (response.responseCode === 401) {

                    localStorage.clear();
                    window.location.href = '/login'
                }
            }
        }
        else {

            if (!notEmpty($('#username-field').val())) {
                $('#username-field').addClass('is-invalid')
                $('#username-label').removeClass('d-none')
            }

            if (!birthDateIsValid($('#birthdate').val())) {
                $('#birthdate').addClass('is-invalid')
                $('#birthdate-label').removeClass('d-none')
            }

            if (!emailIsValid($('#email-field').val())) {
                $('#email-field').addClass('is-invalid')
                $('#email-label').removeClass('d-none')
            }

            if (!phoneNumberIsValid($('#phone-field').val())) {
                $('#phone-field').addClass('is-invalid')
                $('#phone-label').removeClass('d-none')
            }
        }
    })
}

