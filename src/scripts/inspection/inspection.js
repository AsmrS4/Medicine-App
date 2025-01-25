import { logoutDoctor } from "../../api/doctor/logout.js";
import { setAuthorizedHeader } from "../../utils/unauthorized.js";
import { tranformDate, tranformDateWithTime } from "../../utils/converter/converter.js";
import { getPatientById } from "../../api/patient/patients.js";
import { DEATH_LABEL, EMPTY_FIELD_ERROR, NEXTDATE_LABEL, SPECIALITY_AlREADY_TAKEN, URL_RESOURCE } from "../../utils/constants.js";
import { createNewInspection } from "../../api/inspection/inspection.js";
import { inspectionDateIsValid, nextDateIsValid } from "../../utils/validation/date.js";
import { notEmpty } from "../../utils/validation/email.js";
import { renderInnerConsultationCard, renderInnerDiagnosisCard } from "../../utils/render.js";

const consultations = [];
const diagnoses = [];

$(document).on('click', '#logout-a', () => {
    logoutDoctor();
})

$(document).ready(async () => {
    await setAuthorizedHeader()
    let patient = await getPatientById(localStorage.getItem('patientId'));
    let bday = tranformDate(patient.birthday) === null ? 'Не указано' : tranformDate(patient.birthday)
    if (patient.gender === 'Female') {
        $('img.gender-icon').attr('src', '../images/gender-female.svg')
    } else {
        $('img.gender-icon').attr('src', '../images/gender-male.svg');
    }
    $('span.patient-card-head').html(patient.name)
    $('.patient-card-head-bday').html('Дата рождения: ' + bday)
}
)

$('#inspection-type').on('click', () => {
    if (!$('#inspection-type').is(':checked')) {
        $('.prev-inspection-wrapper').addClass('d-none')
        $('#primary-label').addClass('active-label')
        $('#repeated-label').removeClass('active-label')
    } else {
        $('.prev-inspection-wrapper').removeClass('d-none')
        $('#primary-label').removeClass('active-label')
        $('#repeated-label').addClass('active-label')
    }
})

$('#need-consultation').on('click', () => {
    if (!$('#need-consultation').is(':checked')) {
        $('#specialty-select').prop('disabled', true)
        $('#consultation-comment').prop('disabled', true)
        $('#add-consultation-btn').prop('disabled', true)
    } else {
        $('#specialty-select').prop('disabled', false)
        $('#consultation-comment').prop('disabled', false)
        $('#add-consultation-btn').prop('disabled', false)
    }
})

$('#add-diagnosis-btn').on('click', async () => {
    let found = diagnoses.find(el => {
        return el.type === 'Main'
    })
    $('#diagnosis-description-text-label').addClass('d-none');
    $('#diagnosis-select-label').addClass('d-none');
    if (found === undefined) {
        if ($('#diagnosis-type').val() === 'Main') {
            if (notEmpty($('#diagnosis-description-text').val()) && notEmpty($('#diagnosis-select').val())) {
                $('#remove-diagnosis').hasClass('d-none') ? $('#remove-diagnosis').removeClass('d-none') : null
                diagnoses.push({
                    icdDiagnosisId: $('#diagnosis-select').val(),
                    description: $('#diagnosis-description-text').val(),
                    type: $('#diagnosis-type').val()
                })
                $('.prev-diagnosis-holder').append(
                    await renderInnerDiagnosisCard(
                        {
                            name: $('#diagnosis-select option:selected').text(),
                            description: $('#diagnosis-description-text').val(),
                            type: $('#diagnosis-type').val()
                        }
                    )
                )
                $('#diagnosis-description-text').val('')
            } else {
                if (!notEmpty($('#diagnosis-description-text').val())) {
                    $('#diagnosis-description-text-label').removeClass('d-none');
                    $('#diagnosis-description-text-label').html(EMPTY_FIELD_ERROR)
                }
                if (!notEmpty($('#diagnosis-select').val())) {
                    $('#diagnosis-select-label').removeClass('d-none');
                    $('#diagnosis-select-label').html(EMPTY_FIELD_ERROR)
                }
            }
        } else {

            $('#diagnosis-description-text-label').removeClass('d-none');
            $('#diagnosis-description-text-label').html('Требуется основной диагноз!')
        }
    } else {
        if ($('#diagnosis-type').val() === 'Main') {
            $('#diagnosis-description-text-label').removeClass('d-none');
            $('#diagnosis-description-text-label').html('Нельзя назначить несколько основных диагнозов!')
            return;
        }
        if (notEmpty($('#diagnosis-description-text').val()) && notEmpty($('#diagnosis-select').val())) {
            $('#remove-diagnosis').hasClass('d-none') ? $('#remove-diagnosis').removeClass('d-none') : null
            diagnoses.push({
                icdDiagnosisId: $('#diagnosis-select').val(),
                description: $('#diagnosis-description-text').val(),
                type: $('#diagnosis-type').val()
            })
            $('.prev-diagnosis-holder').append(
                await renderInnerDiagnosisCard(
                    {
                        name: $('#diagnosis-select option:selected').text(),
                        description: $('#diagnosis-description-text').val(),
                        type: $('#diagnosis-type').val()
                    }
                )
            )
            $('#diagnosis-description-text').val('')
        } else {
            if (!notEmpty($('#diagnosis-description-text').val())) {
                $('#diagnosis-description-text-label').removeClass('d-none');
                $('#diagnosis-description-text-label').html(EMPTY_FIELD_ERROR)
            }
            if (!notEmpty($('#diagnosis-select').val())) {
                $('#diagnosis-select-label').removeClass('d-none');
                $('#diagnosis-select-label').html(EMPTY_FIELD_ERROR)
            }
        }
    }
})

$('#add-consultation-btn').on('click', async () => {

    $('#specialty-label').addClass('d-none')
    $('#consultation-comment').removeClass('is-invalid')
    $('#consultation-comment-label').addClass('d-none')

    let found = consultations.find(el => {
        return el.specialityId === $('#specialty-select').val()
    })

    if (found === undefined) {
        if (notEmpty($('#consultation-comment').val()) && notEmpty($('#specialty-select').val())) {
            $('#remove-consultation').hasClass('d-none') ? $('#remove-consultation').removeClass('d-none') : null
            consultations.push({
                specialityId: $('#specialty-select').val(),
                comment: {
                    content: $('#consultation-comment').val()
                }
            })
            $('#inner-consultation-holder').append(
                await renderInnerConsultationCard(
                    {
                        specialityId: $('#specialty-select').val(),
                        comment: {
                            content: $('#consultation-comment').val()
                        }
                    }
                )
            )
            $('#consultation-comment').val('')

        } else {
            if (!notEmpty($('#specialty-select').val())) {
                $('#specialty-label').removeClass('d-none')
                $('#specialty-label').html(EMPTY_FIELD_ERROR)
            }
            if (!notEmpty($('#consultation-comment').val())) {
                $('#consultation-comment').addClass('is-invalid')
                $('#consultation-comment-label').removeClass('d-none')
                $('#consultation-comment-label').html(EMPTY_FIELD_ERROR)
            }
        }

    } else {
        $('#specialty-label').removeClass('d-none')
        $('#specialty-label').html(SPECIALITY_AlREADY_TAKEN)
    }
})

$('#remove-consultation').on('click', async () => {
    consultations.pop();
    if (consultations.length === 0) {
        $('#remove-consultation').addClass('d-none')
    }
    $('#inner-consultation-holder').children().last().remove()
})

$('#remove-diagnosis').on('click', async () => {
    diagnoses.pop();
    if (diagnoses.length === 0) {
        $('#remove-diagnosis').addClass('d-none')
    }
    $('.prev-diagnosis-holder').children().last().remove()
})


const checkRequireFields = () => {
    $('#inspection-date').removeClass('is-invalid')
    $('#disease-text').removeClass('is-invalid')
    $('#complaint-text').removeClass('is-invalid')
    $('#recommendation-text').removeClass('is-invalid')
    $('#conclusion-type').removeClass('is-invalid')

    $('#inspection-date-label').addClass('d-none');
    $('#diagnosis-description-text-label').addClass('d-none');
    $('#disease-text-label').addClass('d-none');
    $('#complaint-text-label').addClass('d-none')
    $('#recommendation-text-label').addClass('d-none')

    if (notEmpty($('#inspection-date').val()) && notEmpty($('#disease-text').val()) && notEmpty(
        $('#complaint-text').val()) && notEmpty($('#recommendation-text').val()) && (diagnoses.length !== 0)) {

        if (inspectionDateIsValid($('#inspection-date').val(), $('#prev-inspection').text().trim())) {
            $('#inspection-date-label').addClass('d-none')
            $('#inspection-date').removeClass('is-invalid')
            return true
        } else {
            $('#inspection-date').addClass('is-invalid')
            $('#inspection-date-label').removeClass('d-none');
            $('#inspection-date-label').html("Введите корректную дату осмотра");
            return false;
        }

    } else {
        if (!notEmpty($('#inspection-date').val())) {
            $('#inspection-date').addClass('is-invalid')
            $('#inspection-date-label').removeClass('d-none')
            $('#inspection-date-label').html(EMPTY_FIELD_ERROR)
        }

        if (!notEmpty($('#disease-text').val())) {
            $('#disease-text').addClass('is-invalid')
            $('#disease-text-label').removeClass('d-none')
            $('#disease-text-label').html(EMPTY_FIELD_ERROR)
        }
        if (!notEmpty($('#complaint-text').val())) {
            $('#complaint-text').addClass('is-invalid')
            $('#complaint-text-label').removeClass('d-none')
            $('#complaint-text-label').html(EMPTY_FIELD_ERROR)
        }
        if (!notEmpty($('#recommendation-text').val())) {
            $('#recommendation-text').addClass('is-invalid')
            $('#recommendation-text-label').removeClass('d-none')
            $('#recommendation-text-label').html(EMPTY_FIELD_ERROR)
        }
        if (diagnoses.length === 0) {
            $('#diagnosis-description-text-label').removeClass('d-none')
            $('#diagnosis-description-text-label').html("Укажите диагноз")
        }
        return false
    }
}

$(document).on('click', '#save-btn', async () => {
    let nextDate = null;
    let deathDate = null;
    let previousId = null;
    switch ($('#conclusion-type').val()) {
        case "Recovery":
            break;
        case "Disease":
            nextDate = $('#conclusion-datetime').val() === "" ? null : $('#conclusion-datetime').val();
            break;
        case "Death":
            deathDate = $('#conclusion-datetime').val() === "" ? null : $('#conclusion-datetime').val();
            break;
    }

    if ($('#inspection-type').is(':checked')) {
        previousId = $('#prev-inspection').val()
    }

    if (checkRequireFields()) {
        if ($('#conclusion-type').val() === 'Disease') {
            if (nextDateIsValid($('#conclusion-datetime').val())) {
                $('#conclusion-date-label').addClass('d-none')
                $('#conclusion-datetime').removeClass('is-invalid')

            } else {
                $('#conclusion-date-label').removeClass('d-none')
                $('#conclusion-datetime').addClass('is-invalid')
                $('#conclusion-date-label').html('Укажите корректную дату')
                return false
            }
        }
        const result = await createNewInspection(
            {
                date: $('#inspection-date').val(),
                anamnesis: $('#disease-text').val(),
                complaints: $('#complaint-text').val(),
                treatment: $('#recommendation-text').val(),
                conclusion: $('#conclusion-type').val(),
                nextVisitDate: nextDate,
                deathDate: deathDate,
                previousInspectionId: $('#prev-inspection').val(),
                diagnoses: diagnoses,
                consultations: consultations
            }
        )
        if (result) {
            window.location.href = `/inspection/${result}`
        } else {
            console.log(result)
        }

    } else {
        console.log("Error")
    }
})

$('#conclusion-type').on('click', () => {
    switch ($('#conclusion-type').val()) {
        case "Recovery":
            $('.datetime-info').addClass('d-none')
            break;
        case "Disease":
            $('.datetime-info').removeClass('d-none')
            $('#conclusion-date').html(NEXTDATE_LABEL)
            break;
        case "Death":
            $('.datetime-info').removeClass('d-none')
            $('#conclusion-date').html(DEATH_LABEL)
            break;
    }
})

$('#cancel-btn').on('click', () => {
    window.history.back();
})

$('#specialty-select').select2({
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
    placeholder: "Специализация консультанта",
})

$('#prev-inspection').select2({
    ajax: {
        url: URL_RESOURCE + `patient/${localStorage.getItem('patientId')}/inspections/search`,
        headers: {
            'Authorization': "Bearer " + localStorage.getItem('token')
        },
        dataType: 'json',
        data: function (params) {
            var query = {
                request: params.term,
            }
            return query;
        },
        processResults: function (data) {
            console.log(data)
            let recordsList = [];
            data.forEach(el => {
                recordsList.push({
                    id: el.id,
                    text: (`${tranformDateWithTime(el.date)} ${el.diagnosis.code} - ${el.diagnosis.name}`)
                })
            });
            return {
                results: recordsList
            };
        },
    },
    placeholder: "Введите название или код",
})

$('#diagnosis-select').select2({
    ajax: {
        url: URL_RESOURCE + 'dictionary/icd10',
        dataType: 'json',
        data: function (params) {
            var query = {
                request: params.term,
                page: 1,
                size: 20,
            }
            return query;
        },
        processResults: function (data) {
            console.log(data.records)
            let recordsList = [];
            data.records.forEach(el => {
                recordsList.push({
                    id: el.id,
                    text: (`(${el.code}) ${el.name}`)
                })
            });
            return {
                results: recordsList
            };
        },
    },
    placeholder: "Введите название или код",
})
