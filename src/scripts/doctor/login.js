import { getProfile } from '../../api/doctor/profile.js'
import { emailIsValid } from '../../utils/validation/email.js'
import { passwordIsValid } from '../../utils/validation/password.js'
import { loginDoctor } from '../../api/doctor/login.js'
import { setAuthorizedHeader, setUnauthorizedHeader } from '../../utils/unauthorized.js'
import { notEmpty } from '../../utils/validation/email.js'
import { EMPTY_FIELD_ERROR, INVALID_EMAIL_FORMAT, INVALID_LOGIN } from '../../utils/constants.js'

export const initLogin = async () => {
    await setUnauthorizedHeader(null);
    $(document).on('click', '#login-btn', async () => {

        $('#password-field').removeClass('is-invalid')
        $('#email-field').removeClass('is-invalid')

        $('#email-label').addClass('d-none')
        $('#password-label').addClass('d-none')

        if (notEmpty($('#email-field').val()) && emailIsValid($('#email-field').val()) && passwordIsValid($('#password-field').val())) {
            let response = await loginDoctor(
                {
                    email: $('#email-field').val(),
                    password: $('#password-field').val()
                }
            );
            if (response != null) {
                const token = response.token;
                localStorage.setItem('token', token);
                const result = await getProfile(token);
                localStorage.setItem('username', result.value.name);

                setAuthorizedHeader();
                window.location.href = '/profile'

            } else {
                $('#email-field').addClass('is-invalid')
                $('#password-field').val("")
                $('#password-field').addClass('is-invalid')
                $('#email-label').removeClass('d-none')
                $('#email-label').html(INVALID_LOGIN)
            }

        } else {
            if (!notEmpty($('#email-field').val())) {
                $('#email-field').addClass('is-invalid')
                $('#email-label').removeClass('d-none')
                $('#email-label').html(EMPTY_FIELD_ERROR)
            }

            if (!emailIsValid($('#email-field').val())) {
                $('#email-field').addClass('is-invalid')
                $('#email-label').removeClass('d-none')
                $('#email-label').html(INVALID_EMAIL_FORMAT)
            }

            if (!passwordIsValid($('#password-field').val())) {
                $('#password-field').addClass('is-invalid')
                $('#password-label').removeClass('d-none')
            }
        }
    })

    $(document).on('click', '#register-btn', async () => {
        window.location.href = '/registration'
    })
}

export default initLogin();