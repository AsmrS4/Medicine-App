import { logoutDoctor } from "../../api/doctor/logout.js";
import { editInspection, getInspectionById } from "../../api/inspection/inspection.js";
import { tranformDate, tranformDateWithTime, transformDateFromJSON } from "../../utils/converter/converter.js";
import { renderConclusion, renderInnerConsultation, renderInnerDiagnosisCard } from "../../utils/render.js";
import { NEXTDATE_LABEL, DEATH_LABEL, EMPTY_FIELD_ERROR } from "../../utils/constants.js";
import { setAuthorizedHeader } from "../../utils/unauthorized.js";
import { nextDateIsValid } from "../../utils/validation/date.js";
import { notEmpty } from "../../utils/validation/email.js";
import { URL_RESOURCE } from "../../utils/constants.js";

const diagnoses = []

$(document).on('click', '#logout-a', () => {
    logoutDoctor();
})

$(document).ready(async () => {
    await setAuthorizedHeader()
    let inspectionId = window.location.href.split('inspection/')[1]
    let result = await getInspectionById(inspectionId);
    console.log(result)

    if (result.doctor.id === localStorage.getItem('doctorId')) {
        $('#edit-inspection-btn').removeClass('d-none');
    }
    $('#span-gender').html(result.patient.gender === 'Male' ? 'Мужской' : 'Женский')
    $('#span-bday').html(tranformDate(result.patient.birthday))
    $('#span-doctor').html(result.doctor.name)
    $('#patient-name-span').html('Пациент: ' + result.patient.name)
    $('#patient-name-span').on('click', () => {
        window.location.href = `/patient/${result.patient.id}`
    })
    $('#anamnesis').html(result.anamnesis)
    $('#complaints').html(result.complaints)
    $('#treatment').html(result.treatment)
    $('#h3-date').html('Амбулаторный осмотр от ' + tranformDateWithTime(result.date).slice(0, 16))

    for (let i = 0; i < result.diagnoses.length; i++) {

        $('#prev-diagnosis').append(
            await renderInnerDiagnosisCard(result.diagnoses[i])
        )
    }
    for (let i = 0; i < result.consultations.length; i++) {
        $('.consultation-info').append(
            await renderInnerConsultation(result.consultations[i].speciality.name, result.consultations[i])
        )
    }
    $('#conclusion-field').append(
        renderConclusion(result)
    )
    //при загрузке страницы делать запрос api/consultation/:id
})

$('#edit-inspection-btn').on('click', async () => {
    let inspectionId = window.location.href.split('inspection/')[1]
    let result = await getInspectionById(inspectionId);
    $('#inspection-edit-modal').load(
        $('#complaint-text').val(result.complaints),
        $('#disease-text').val(result.anamnesis),
        $('#recommendation-text').val(result.treatment),
        $('#conclusion-type').val(result.conclusion)
    )

})

$('#conclusion-type').on('click', async () => {
    let inspectionId = window.location.href.split('inspection/')[1]
    let result = await getInspectionById(inspectionId);
    switch ($('#conclusion-type').val()) {
        case "Recovery":
            $('.datetime-info').addClass('d-none')
            break;
        case "Disease":
            $('.datetime-info').removeClass('d-none')
            $('#conclusion-date').html(NEXTDATE_LABEL)
            if (result.nextVisitDate) {
                $('#conclusion-datetime').val(transformDateFromJSON(result.nextVisitDate))
            } else {
                $('#conclusion-datetime').val('')
            }
            break;
        case "Death":
            $('.datetime-info').removeClass('d-none')
            $('#conclusion-date').html(DEATH_LABEL)
            if (result.deathDate) {
                $('#conclusion-datetime').val(transformDateFromJSON(result.deathDate))
            } else {
                $('#conclusion-datetime').val('')
            }
            break;
    }
})

const checkFields = () => {
    if (notEmpty($('#complaint-text').val()) && notEmpty($('#disease-text').val()) && notEmpty($('#recommendation-text').val()) && (diagnoses.length !== 0)) {
        $('#complaint-text').removeClass('is-invalid')
        $('#disease-text').removeClass('is-invalid')
        $('#recommendation-text').removeClass('is-invalid')
        $('#conclusion-type').removeClass('is-invalid')

        $('#diagnosis-description-text-label').addClass('d-none');
        $('#complaint-text-label').addClass('d-none')
        $('#disease-text-label').addClass('d-none')
        $('#recommendation-text-label').addClass('d-none')

        return true
    } else {
        if (!notEmpty($('#complaint-text').val())) {
            $('#complaint-text').addClass('is-invalid')
            $('#complaint-text-label').removeClass('d-none')
            $('#complaint-text-label').html(EMPTY_FIELD_ERROR)
        }
        if (!notEmpty($('#disease-text').val())) {
            $('#disease-text').addClass('is-invalid')
            $('#disease-text-label').removeClass('d-none')
            $('#disease-text-label').html(EMPTY_FIELD_ERROR)
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
                    icdDiagnosisId: $('#diagnosis-select-2').val(),
                    description: $('#diagnosis-description-text').val(),
                    type: $('#diagnosis-type').val()
                })
                $('#prev-diagnosis-edit').append(
                    await renderInnerDiagnosisCard(
                        {
                            name: $('#diagnosis-select-2 option:selected').text(),
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
                icdDiagnosisId: $('#diagnosis-select-2').val(),
                description: $('#diagnosis-description-text').val(),
                type: $('#diagnosis-type').val()
            })
            $('#prev-diagnosis-edit').append(
                await renderInnerDiagnosisCard(
                    {
                        name: $('#diagnosis-select-2 option:selected').text(),
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

$('#remove-diagnosis').on('click', async () => {
    diagnoses.pop();
    if (diagnoses.length === 0) {
        $('#remove-diagnosis').addClass('d-none')
    }
    $('#prev-diagnosis-edit').children().last().remove()
})

$('#save-btn').on('click', async () => {
    let inspectionId = window.location.href.split('inspection/')[1]
    if (checkFields()) {
        if ($('#conclusion-type').val() === 'Recovery') {
            
            const result = await editInspection(inspectionId, {
                anamnesis: $('#disease-text').val(),
                complaints: $('#complaint-text').val(),
                treatment: $('#recommendation-text').val(),
                conclusion: $('#conclusion-type').val(),
                nextVisitDate: null,
                deathDate: null,
                diagnoses: diagnoses
            })
            console.log(result)
        }
        else if ($('#conclusion-type').val() === 'Disease') {

            if (!nextDateIsValid($('#conclusion-datetime').val())) {
                $('#conclusion-date-label').removeClass('d-none')
                $('#conclusion-datetime').addClass('is-invalid')
                $('#conclusion-date-label').html('Укажите корректную дату')

            } else {
                const result = await editInspection(inspectionId, {
                    anamnesis: $('#disease-text').val(),
                    complaints: $('#complaint-text').val(),
                    treatment: $('#recommendation-text').val(),
                    conclusion: $('#conclusion-type').val(),
                    nextVisitDate: $('#conclusion-datetime').val(),
                    deathDate: null,
                    diagnoses: diagnoses
                })
                console.log(result)
                $('#conclusion-date-label').addClass('d-none')
                $('#conclusion-datetime').removeClass('is-invalid')
            }
        } else {

            const result = await editInspection(inspectionId, {
                anamnesis: $('#disease-text').val(),
                complaints: $('#complaint-text').val(),
                treatment: $('#recommendation-text').val(),
                conclusion: $('#conclusion-type').val(),
                nextVisitDate: null,
                deathDate: $('#conclusion-datetime').val(),
                diagnoses: diagnoses
            })
            console.log(result)
        }
    } else {
        console.log('error')
    }
})

$('.single-select').select2({
    dropdownParent: $('#exampleModal'),
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