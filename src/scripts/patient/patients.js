import { logoutDoctor } from "../../api/doctor/logout.js";
import { createNewPatient, getPatientById, getPatients } from "../../api/patient/patients.js";
import { setAuthorizedHeader } from "../../utils/unauthorized.js";
import { setNumber, setPage } from '../../utils/pagination.js';
import { renderCard } from "../../utils/render.js";
import { notEmpty } from "../../utils/validation/email.js";
import { birthDateIsValid } from "../../utils/validation/date.js";
import { EMPTY_FIELD_ERROR, BIRTHDATE_ERROR } from "../../utils/constants.js";

$(document).on('click', '#logout-a', () => {
    logoutDoctor();
})

$(document).ready(
    await setAuthorizedHeader(),
    $('#diagnosis-select').val('')
)

const showPatientList = async (page = 1) => {
    $(document).on('click', '#search-btn', async () => {
        const result = await getPatients(
            {
                name: $('#username-field').val(),
                visits: $('#planned-visits').is(':checked'),
                conclusions: $('#diagnosis-select').val(),
                onlyMine: $('#my-patients-only').is(':checked'),
                sort: $('#sort-select').val(),
                size: $('#count-select').val(),
                page: page
            }
        )

        if (result) {
            $('.patient-card-holder').html('')
            if (result.patients.length === 0) {
                console.log('Nothing')
                $('.nothing').removeClass('d-none')
            } else {
                $('.nothing').addClass('d-none')
                for (let i = 0; i < result.patients.length; i++) {
                    $('.patient-card-holder').append(
                        renderCard(result.patients[i])
                    )
                }
            }

            setPage(result.pagination.current, result.pagination.count);
        }
    })
}

$(document).on('click', 'a.page-link', async (e) => {
    await setNumber(e.target.id)
    const result = await getPatients(
        {
            name: $('#username-field').val(),
            visits: $('#planned-visits').is(':checked'),
            conclusions: $('#diagnosis-select').val(),
            onlyMine: $('#my-patients-only').is(':checked'),
            sort: $('#sort-select').val(),
            size: $('#count-select').val(),
            page: localStorage.getItem('page')
        }
    )

    if (result) {
        $('.patient-card-holder').html('')
        if (result.patients.length === 0) {
            $('.nothing').removeClass('d-none')
        } else {
            $('.nothing').addClass('d-none')

            for (let i = 0; i < result.patients.length; i++) {
                $('.patient-card-holder').append(
                    renderCard(result.patients[i])
                )
            }
        }

        setPage(result.pagination.current, result.pagination.count);
    }

})

$('#register-patient-btn').on('click', async () => {
    $('#register-username-field').removeClass('is-invalid')
    $('#register-birthdate').removeClass('is-invalid')

    $('#register-username-label').addClass('d-none')
    $('#register-birthdate-label').addClass('d-none')

    if (notEmpty($('#register-username-field').val()) && birthDateIsValid($('#register-birthdate').val())) {
        let result = await createNewPatient({
            name: $('#register-username-field').val(),
            birthday: $('#register-birthdate').val() === '' ? null : $('#register-birthdate').val(),
            gender: $('#register-gender-select').val()
        })

        if (result) {
            window.location.href = '/patients'
        }
    } else {
        if (!notEmpty($('#register-username-field').val())) {
            $('#register-username-field').addClass('is-invalid')
            $('#register-username-label').removeClass('d-none')
            $('#register-username-label').html(EMPTY_FIELD_ERROR)
        }

        if (!birthDateIsValid($('#register-birthdate').val())) {
            $('#register-birthdate').addClass('is-invalid')
            $('#register-birthdate-label').removeClass('d-none')
            $('#register-birthdate-label').html(BIRTHDATE_ERROR)
        }
    }
})

$('.multiple-select').select2({
    placeholder: "Выберите заключения",
    multiple: true,
    closeOnSelect: false
})

export default showPatientList()
