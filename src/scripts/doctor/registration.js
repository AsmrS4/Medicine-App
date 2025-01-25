import { getProfile } from '../../api/doctor/profile.js'
import { notEmpty, emailIsValid, registerDataAreValid } from '../../utils/validation/email.js'
import { passwordIsValid } from '../../utils/validation/password.js'
import { phoneNumberIsValid } from '../../utils/validation/phone.js'
import { birthDateIsValid } from '../../utils/validation/date.js'
import { registerNewDoctor } from '../../api/doctor/registration.js'
import { setAuthorizedHeader, setUnauthorizedHeader } from '../../utils/unauthorized.js'
import { INVALID_PHONE_FORMAT, INVALID_EMAIL_FORMAT, INVALID_PASSWORD_LENGTH, EMPTY_FIELD_ERROR, EMAIL_EXIST_ERROR } from '../../utils/constants.js'
import { URL_RESOURCE } from '../../utils/constants.js'


export const initRegister = async () => {
    await setUnauthorizedHeader();
    $(document).on('click', '#submit-register-btn', async () => {
        $('#username-field').removeClass('is-invalid')
        $('#email-field').removeClass('is-invalid')
        $('#password-field').removeClass('is-invalid')
        $('#phone-field').removeClass('is-invalid')
        $('#birthdate').removeClass('is-invalid')
        $('#specialty-select').removeClass('is-invalid')

        $('#username-label').addClass('d-none')
        $('#email-label').addClass('d-none')
        $('#password-label').addClass('d-none')
        $('#phone-label').addClass('d-none')
        $('#birthdate-label').addClass('d-none')
        $('#specialty-label').addClass('d-none')

        if (registerDataAreValid(
            {
                name: $('#username-field').val(),
                password: $('#password-field').val(),
                email: $('#email-field').val(),
                birthday: $('#birthdate').val(),
                gender: $('#gender-select').val(),
                phone: $('#phone-field').val(),
                speciality: $('#specialty-select').val(),
            }
        )) {
            let response = await registerNewDoctor(
                {
                    name: $('#username-field').val(),
                    password: $('#password-field').val(),
                    email: $('#email-field').val(),
                    birthday: $('#birthdate').val() === '' ? null : $('#birthdate').val(),
                    gender: $('#gender-select').val(),
                    phone: $('#phone-field').val() === '' ? null : $('#phone-field').val(),
                    speciality: $('#specialty-select').val(),
                });

            if (response !== null) {
                const token = response.token;
                localStorage.setItem('token', token);
                const result = await getProfile(token);
                localStorage.setItem('username', result.value.name);
                setAuthorizedHeader()
                window.location.href = '/profile'
            } else {
                $('#email-field').addClass('is-invalid')
                $('#email-label').removeClass('d-none')
                $('#email-label').html(EMAIL_EXIST_ERROR)
            }
        }
        else {

            if (!notEmpty($('#email-field').val())) {
                $('#email-field').addClass('is-invalid')
                $('#email-label').removeClass('d-none')
                $('#email-label').html(EMPTY_FIELD_ERROR)
            }

            if (!notEmpty($('#username-field').val())) {
                $('#username-field').addClass('is-invalid')
                $('#username-label').removeClass('d-none')
                $('#username-label').html(EMPTY_FIELD_ERROR)
            }
            
            if (!notEmpty($('#specialty-select').val())) {
                $('#specialty-select').addClass('is-invalid')
                $('#specialty-label').removeClass('d-none')
                $('#specialty-label').html(EMPTY_FIELD_ERROR)
            }

            if (!birthDateIsValid($('#birthdate').val())) {
                $('#birthdate').addClass('is-invalid')
                $('#birthdate-label').removeClass('d-none')
                $('#birthdate-label').html(BIRTHDATE_ERROR)
            }

            if (!emailIsValid($('#email-field').val())) { 
                $('#email-field').addClass('is-invalid')
                $('#email-label').removeClass('d-none')
                $('#email-label').html(INVALID_EMAIL_FORMAT)
            }

            if (!passwordIsValid($('#password-field').val())) {
                $('#password-field').addClass('is-invalid')
                $('#password-label').removeClass('d-none')
                $('#password-label').html(INVALID_PASSWORD_LENGTH)
            }

            if (!phoneNumberIsValid($('#phone-field').val())) { 
                $('#phone-field').addClass('is-invalid')
                $('#phone-label').removeClass('d-none')
                $('#phone-label').html(INVALID_PHONE_FORMAT)
            }
        }
    })

    $(document).on('click', '#login-btn', async () => {
        window.location.href = '/login'
    })

    $('.single-select').select2({
        ajax: {
            url: URL_RESOURCE + 'dictionary/speciality',
            dataType: 'json',
            data: function (params) {
                var query = {
                    name: params.term,
                    page: 1,
                    size: 20,
                }
                return query;
            },
            processResults: function (data) {
                console.log(data.specialties)
                let specList = [];
                data.specialties.forEach(el => {
                    specList.push({
                        id: el.id,
                        text: el.name
                    })
                });

                return {
                    results: specList
                };
            },
        },
        placeholder: "Укажите специальность",
    })
}

initRegister()


