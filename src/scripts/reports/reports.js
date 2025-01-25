import { logoutDoctor } from "../../api/doctor/logout.js";
import { setAuthorizedHeader } from "../../utils/unauthorized.js";
import { URL_RESOURCE } from "../../utils/constants.js";
import { renderTableHeader, renderTableBody } from "../../utils/render.js";
import { getVisits } from "../../api/reports/reports.js";

$(document).on('click', '#logout-a', () => {
    logoutDoctor();
})

$(document).ready(async () => {
    await setAuthorizedHeader();
})

const compareDates = async (data) => {
    return data.start <= data.end
}

$('#save-report-btn').on('click', async () => {
    $('#start-date').removeClass('is-invalid');
    $('#end-date').removeClass('is-invalid');

    if (await compareDates({
        start: $('#start-date').val(),
        end: $('#end-date').val()
    }) && ($('#start-date').val() && $('#end-date').val())) {
        const result = await getVisits({
            start: $('#start-date').val(),
            end: $('#end-date').val(),
            icdRoots: $('.multiple-select').val()
        })
        if (result.records.length) {
            $('.report-container').removeClass('d-none')
            $('.nothing').addClass('d-none')
            await renderTableHeader(result.filters)
            await renderTableBody(result)
        } else {
            $('.report-container').addClass('d-none')
            $('.nothing').removeClass('d-none')
        }

    } else {
        $('#start-date').addClass('is-invalid');
        $('#end-date').addClass('is-invalid')
    }
})

$('.multiple-select').select2({
    ajax: {
        url: URL_RESOURCE + 'dictionary/icd10/roots',
        dataType: 'json',

        processResults: function (data) {
            console.log(data)
            let icd10Roots = [];
            data.forEach(el => {
                icd10Roots.push({
                    id: el.id,
                    text: (`(${el.code}) ${el.name}`),
                    code: el.code
                })
            });

            return {
                results: icd10Roots
            };
        },
    },
    templateSelection: icd10ChoiceTemplate,
    placeholder: "Выбрать",
    multiple: true,
    closeOnSelect: false
})

function icd10ChoiceTemplate(data) {
    const $template = $(
        `<span class="icd10-span" id="${data.id}">${data.code}</span>`
    )
    return $template
}