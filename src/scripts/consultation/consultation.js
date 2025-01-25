import { logoutDoctor } from "../../api/doctor/logout.js";
import { setAuthorizedHeader } from "../../utils/unauthorized.js";
import { URL_RESOURCE } from "../../utils/constants.js";
import { getConsultations } from "../../api/consultation/consultation.js";
import { setPage, setNumber } from "../../utils/pagination.js";
import { renderConsultationCard, renderGroupedConsultationCard, renderNestedConsultation } from "../../utils/render.js";
import { getNestedConsultations } from "../../api/inspection/inspection.js";

$(document).on('click', '#logout-a', () => {
    logoutDoctor();
})

$(document).ready(
    await setAuthorizedHeader()
)

const showConsultations = (page = 1) => {
    $(document).on('click', '#search-btn', async () => {
        let isGrouped = $('#inspection-grouped').val();
        const result = await getConsultations(
            {
                icdRoots: $('#diagnosis-select').val(),
                grouped: isGrouped,
                size: $('#count-select').val(),
                page: page
            }
        )

        if (result) {
            $('.consultation-card-holder').html('')
            if (result.inspections.length === 0) {
                $('.nothing').removeClass('d-none')
            } else {
                $('.nothing').addClass('d-none')
                let item = null

                for (let i = 0; i < result.inspections.length; i++) {
                    if ($('#inspection-grouped option:last').prop('selected')) {
                        console.log('here1')

                        item = await renderGroupedConsultationCard(result.inspections[i])
                    }
                    else if ($('#inspection-grouped option:first').prop('selected')) {
                        console.log('here2')

                        item = await renderConsultationCard(result.inspections[i])
                    }
                    $('.consultation-card-holder').append(
                        item
                    )
                }
            }
            setPage(result.pagination.current, result.pagination.count);
        }
    })
}

$(document).on('click', '.show-inner', async (e) => {
    if ($(`#${e.target.id}.show-inner`).hasClass('clicked')) {
        $(`#${e.target.id}.show-inner`).removeClass('clicked')
        $(`#${e.target.id}.show-inner`).html('')
        $(`#${e.target.id}.show-inner`).append(`<img src="../images/plus-icon.svg" id="${e.target.id}" alt="детали">`)

        $(`#${e.target.id}.grouped-card-holder`).html('')
    } else {
        $(`#${e.target.id}.show-inner`).addClass('clicked')
        $(`#${e.target.id}.show-inner`).html('')
        $(`#${e.target.id}.show-inner`).append(`<img src="../images/minus-icon.svg" id="${e.target.id}" alt="детали">`)
        let result = await getNestedConsultations(e.target.id);
        for (let i = 0; i < result.length; i++) {
            $(`#${e.target.id}.grouped-card-holder`).append(
                renderNestedConsultation(result[i])
            )
        }
    }

})

$(document).on('click', 'a.page-link', async (e) => {
    await setNumber(e.target.id)
    const result = await getConsultations(
        {
            icdRoots: $('#diagnosis-select').val(),
            grouped: $('#inspection-grouped').val(),
            size: $('#count-select').val(),
            page: localStorage.getItem('page')
        }
    )
    if (result) {
        $('.consultation-card-holder').html('')
        if (result.inspections.length === 0) {
            $('.nothing').removeClass('d-none')
        } else {
            $('.nothing').addClass('d-none')
            let item = null
            for (let i = 0; i < result.inspections.length; i++) {
                if ($('#inspection-grouped option:last').prop('selected')) {
                    console.log('here1')

                    item = await renderGroupedConsultationCard(result.inspections[i])
                }
                else if ($('#inspection-grouped option:first').prop('selected')) {
                    console.log('here2')

                    item = await renderConsultationCard(result.inspections[i])
                }
                $('.consultation-card-holder').append(
                    item
                )
            }
        }

        setPage(result.pagination.current, result.pagination.count);
    }

})

function icd10ChoiceTemplate(data) {
    const $template = $(
        `<span class="icd10-span" id="${data.id}">${data.code}</span>`
    )
    return $template
}

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

export default showConsultations();