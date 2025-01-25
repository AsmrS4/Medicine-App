import { getSpecialties } from "../api/dictionary/dictionary.js";
import { tranformDate, tranformDateWithTime } from "./converter/converter.js"

export const renderCard = (data) => {
    let gender = data.gender === 'Male' ? 'Мужской' : 'Женский';
    let bday = tranformDate(data.birthday) === null ? 'Не указано' : tranformDate(data.birthday);
    return (
        `
    <div class="card custom patient-card">
        <a href="/patient/${data.id}">
            <div class="card-head patient-name fw-bolder" id="${data.id}">${data.name}</div>
        </a>
        <div class="card-body">
            <div class="card-info">
                <span class="card-info__item">Пол:
                    <span class="bold">${gender}</span>
                </span>
                <span class="card-info__item">Дата рождения:
                    <span class="bold">${bday}</span>
                </span>
            </div>
        </div>
    </div>`
    )
}

export const renderInnerDiagnosisCard = async (data) => {
    let type = ""
    let code = ''
    if (data?.code) {
        code = `(${data.code})`
    }
    switch (data.type) {
        case "Main":
            type = "Основной"
            break;
        case "Concomitant":
            type = "Сопутствующий"
            break;
        case "Complication":
            type = "Осложнение"
            break;
    }

    return (`
        <div class="card custom">
            <div class="fw-bolder mb-2">
                <span>${code} ${data.name}</span>
            </div>
            <div class="card-body inner-card">
                <div class="card-info">
                    <label class="form-check-label">Тип в осмотре:
                        <span class="bold">${type}</span>
                    </label>
                    <label class="form-check-label">Расшифровка:
                        <span class="bold">${data.description}</span>
                    </label>
                </div>
            </div>
        </div>
    `)
}

export const renderInnerConsultation = async (name, data) => {
    return (`
        <div class="card custom">
            <div class="fw-bolder mb-2">
                <span>Консультант: ${name}</span>
            </div>
            <div class="card-body inner-card">
                <div class="card-info">
                    <label class="form-check-label">Специализация консультанта:
                        ${data.speciality.name}
                    </label>
                </div>
            </div>
        </div>
    `)
}

export const renderInnerConsultationCard = async (data) => {

    let result = await getSpecialties();
    let specList = result.specialties

    let speciality = specList.find(el => {
        return el.id === data.specialityId
    })

    return (`
        <div class="card custom">
            <div class="card-body inner-card">
                <div class="card-info light">
                    <label class="form-check-label">Специализация консультанта:
                        <span class="bold"> ${speciality.name}</span>
                    </label>
                    <label class="form-check-label">Комментарий:
                        <span class="bold"> ${data.comment.content}</span>
                    </label>
                </div>
            </div>
        </div>
    `)
}

export const renderEmptyResult = () => {
    return (
        `
        <div class="nothing">
            <h2 class="nothing-text">Ничего не найдено</h2>
        </div>
        `
    )
}

export const renderInspectionCard = (data) => {
    let inspectionDate = tranformDate(data.date) === null ? 'Не указано' : tranformDate(data.date);
    let conclusion = "";
    let death = "";
    let addInspectionTemplate = "";

    if (!data.hasNested) {
        addInspectionTemplate = `
        <li class="detail" id="li-add-inspection-btn">
            <a class="detail" href="/inspection/create">
                <img src="../images/edit-icon.svg" alt="">
                <span>Добавить осмотр</span>
            </a>    
        </li>`
    }

    switch (data.conclusion) {
        case "Recovery":
            conclusion = "выздоровление"
            break;
        case "Disease":
            conclusion = "болезнь"
            break;
        case "Death":
            conclusion = "смерть"
            death = "is-dead"
            addInspectionTemplate = ""
            break;
    }

    return (
        `
        <div class="card custom ${death}">    
            <div class="card-head consultation-name fw-bolder" id="${data.id}">
                <div class="card-details">
                    <div class="inspection-date">${inspectionDate}</div>
                    <span>Амбулаторный осмотр</span>
                </div>
                <div class="card-details">
                    ${addInspectionTemplate}
                    <li class="detail" id="li-details-btn">
                        <a class="detail" href="/inspection/${data.id}">
                            <img src="../images/search-icon.svg" alt="детали">
                            <span>Детали осмотра</span>
                        </a>
                    </li>
                </div>
            </div>
            
            <div class="card-body">
                <div class="card-info">
                    <span class="card-info__item">Заключение:
                        <span class="bold">${conclusion}</span>
                    </span>
                    <span class="card-info__item">Основной диагноз:
                        <span class="bold">${data.diagnosis.name} (${data.diagnosis.code})</span>
                    </span>
                    <span class="card-info__item last">Медицинский работник:
                        <span class="bold">${data.doctor}</span>
                    </span>
                </div>
            </div>
        </div>
        `
    )
}

export const renderGroupedInspectionCard = (data) => {
    let inspectionDate = tranformDate(data.date) === null ? 'Не указано' : tranformDate(data.date);
    let conclusion = "";
    let death = "";
    let addInspectionTemplate = "";

    if (!data.hasNested) {
        addInspectionTemplate = `
        <li class="detail" id="li-add-inspection-btn">
            <a class="detail" href="/inspection/create">
                <img src="../images/edit-icon.svg" alt="">
                <span>Добавить осмотр</span>
            </a>    
        </li>`
    }

    switch (data.conclusion) {
        case "Recovery":
            conclusion = "выздоровление"
            break;
        case "Disease":
            conclusion = "болезнь"
            break;
        case "Death":
            conclusion = "смерть"
            death = "is-dead"
            addInspectionTemplate = ""
            break;
    }

    return (
        `
        <div class="card custom ${death}">    
            <div class="card-head consultation-name fw-bolder" id="${data.id}">
                <div class="card-details">
                    <div class="show-inner" id="${data.id}">
                        <img src="../images/plus-icon.svg" id="${data.id}" alt="детали">
                    </div>
                    <div class="inspection-date">${inspectionDate}</div>
                    
                    <span>Амбулаторный осмотр</span>
                </div>
                <div class="card-details">
                    ${addInspectionTemplate}
                    <li class="detail" id="li-details-btn">
                        <a class="detail" href="/inspection/${data.id}">
                            <img src="../images/search-icon.svg" alt="детали">
                            <span>Детали осмотра</span>
                        </a>
                    </li>
                </div>
            </div>
            
            <div class="card-body">
                <div class="card-info">
                    <span class="card-info__item">Заключение:
                        <span class="bold">${conclusion}</span>
                    </span>
                    <span class="card-info__item">Основной диагноз:
                        <span class="bold">${data.diagnosis.name} (${data.diagnosis.code})</span>
                    </span>
                    <span class="card-info__item last">Медицинский работник:
                        <span class="bold">${data.doctor}</span>
                    </span>
                </div>
            </div>
            <div class="grouped-card-holder" id="${data.id}">          
            </div>
        </div>
        `
    )
}

export const renderConsultationCard = async (data) => {
    let inspectionDate = tranformDate(data.date) === null ? 'Не указано' : tranformDate(data.date);
    let conclusion = "";
    let death = "";

    switch (data.conclusion) {
        case "Recovery":
            conclusion = "выздоровление"
            break;
        case "Disease":
            conclusion = "болезнь"
            break;
        case "Death":
            conclusion = "смерть"
            death = "is-dead"
            break;
    }

    return (
        `
        <div class="card custom ${death}">
            <div class="card-head consultation-name fw-bolder" id="${data.id}">
                <div class="card-details">
                    <div class="inspection-date">${inspectionDate}</div>
                    <span>Амбулаторный осмотр</span>
                </div>
                <div class="card-details">
                    <li class="detail" id="li-details-btn">
                        <a class="detail" href="/inspection/${data.id}">
                            <img src="../images/search-icon.svg" alt="детали">
                            <span>Детали осмотра</span>
                        </a>
                    </li>
                </div>
            </div>

            <div class="card-body">
                <div class="card-info">
                    <span class="card-info__item">Заключение:
                        <span class="bold">${conclusion}</span>
                    </span>
                    <span class="card-info__item">Основной диагноз:
                        <span class="bold">${data.diagnosis.name} (${data.diagnosis.code})</span>
                    </span>
                    <span class="card-info__item last">Медицинский работник:
                        <span class="bold">${data.doctor}</span>
                    </span>
                </div>
            </div>
        </div>
        `
    )
}

export const renderGroupedConsultationCard = async (data) => {
    let inspectionDate = tranformDate(data.date) === null ? 'Не указано' : tranformDate(data.date);
    let conclusion = "";
    let death = "";
    let template = `
    <div class="show-inner" id="${data.id}">
        <img src="../images/plus-icon.svg" id="${data.id}" alt="детали">
    </div>
    `

    switch (data.conclusion) {
        case "Recovery":
            conclusion = "выздоровление"
            break;
        case "Disease":
            conclusion = "болезнь"
            break;
        case "Death":
            conclusion = "смерть"
            death = "is-dead"
            break;
    }

    return (
        `
        <div class="card custom ${death}">
            <div class="card-head consultation-name fw-bolder" id="${data.id}">
                <div class="card-details">
                    ${template}
                    <div class="inspection-date">${inspectionDate}</div>
                    <span>Амбулаторный осмотр</span>
                </div>
                <div class="card-details">
                    <li class="detail" id="li-details-btn">
                        <a class="detail" href="/inspection/${data.id}">
                            <img src="../images/search-icon.svg" alt="детали">
                            <span>Детали осмотра</span>
                        </a>
                    </li>
                </div>
            </div>

            <div class="card-body">
                <div class="card-info">
                    <span class="card-info__item">Заключение:
                        <span class="bold">${conclusion}</span>
                    </span>
                    <span class="card-info__item">Основной диагноз:
                        <span class="bold">${data.diagnosis.name} (${data.diagnosis.code})</span>
                    </span>
                    <span class="card-info__item last">Медицинский работник:
                        <span class="bold">${data.doctor}</span>
                    </span>
                </div>
            </div>
            <div class="grouped-card-holder" id="${data.id}">          
            </div>
        </div>
        
        `
    )
}

export const renderNestedConsultation = (data) => {
    let inspectionDate = tranformDate(data.date) === null ? 'Не указано' : tranformDate(data.date);
    let conclusion = "";
    let death = "";

    switch (data.conclusion) {
        case "Recovery":
            conclusion = "выздоровление"
            break;
        case "Disease":
            conclusion = "болезнь"
            break;
        case "Death":
            conclusion = "смерть"
            death = "is-dead"
            break;
    }
    return (
        `
        <div class="wrapper">
        <div class = "separator">
        </div>
        <div class="card custom inner-item mb-1 me-1 ">
        <div class="card-head consultation-name fw-bolder" id="${data.id}">
            <div class="card-details">
                <div class="show-inner" id="${data.id}">
                    <img src="../images/plus-icon.svg" id="${data.id}" alt="детали">
                </div>
                <div class="inspection-date">${inspectionDate}</div>
                <span>Амбулаторный осмотр</span>
            </div>
            <div class="card-details">
                <li class="detail" id="li-details-btn">
                    <a class="detail" href="/inspection/${data.id}">
                        <img src="../images/search-icon.svg" alt="детали">
                        <span>Детали осмотра</span>
                    </a>
                </li>
            </div>
        </div>

        <div class="card-body">
            <div class="card-info">
                <span class="card-info__item">Заключение:
                    <span class="bold">${conclusion}</span>
                </span>
                <span class="card-info__item">Основной диагноз:
                    <span class="bold">${data.diagnosis.name} (${data.diagnosis.code})</span>
                </span>
                <span class="card-info__item last">Медицинский работник:
                    <span class="bold">${data.doctor}</span>
                </span>
            </div>
        </div>
        <div class="grouped-card-holder" id="${data.id}">          
        </div>
    </div>
        </div>
        `)
}

export const renderNestedInspection = (data) => {
    let inspectionDate = tranformDate(data.date) === null ? 'Не указано' : tranformDate(data.date);
    let conclusion = "";
    let death = "";
    let addInspectionTemplate = ''
    let showInner = ''
    if (!data.hasNested) {
        if (data.conclusion !== 'Death') {
            addInspectionTemplate = `
        <li class="detail" id="li-add-inspection-btn">
            <a class="detail" href="/inspection/create">
                <img src="../images/edit-icon.svg" alt="">
                <span>Добавить осмотр</span>
            </a>    
        </li>`
        }
    }
    if(data.hasChain) {
        showInner = `<div class="show-inner" id="${data.id}">
        <img src="../images/plus-icon.svg" id="${data.id}" alt="детали">
    </div>`
    }
    switch (data.conclusion) {
        case "Recovery":
            conclusion = "выздоровление"
            break;
        case "Disease":
            conclusion = "болезнь"
            break;
        case "Death":
            conclusion = "смерть"
            death = "is-dead"
            break;
    }
    return (
        `
        <div class="wrapper">
        <div class = "separator">
        </div>
        <div class="card custom ${death} inner-item mb-1 me-1 ">
        <div class="card-head consultation-name fw-bolder" id="${data.id}">
            <div class="card-details">
                ${showInner}
                <div class="inspection-date">${inspectionDate}</div>
                <span>Амбулаторный осмотр</span>
            </div>
            <div class="card-details">
                ${addInspectionTemplate}
                <li class="detail" id="li-details-btn">
                    <a class="detail" href="/inspection/${data.id}">
                        <img src="../images/search-icon.svg" alt="детали">
                        <span>Детали осмотра</span>
                    </a>
                </li>
            </div>
        </div>

        <div class="card-body">
            <div class="card-info">
                <span class="card-info__item">Заключение:
                    <span class="bold">${conclusion}</span>
                </span>
                <span class="card-info__item">Основной диагноз:
                    <span class="bold">${data.diagnosis.name} (${data.diagnosis.code})</span>
                </span>
                <span class="card-info__item last">Медицинский работник:
                    <span class="bold">${data.doctor}</span>
                </span>
            </div>
        </div>
        <div class="grouped-card-holder" id="${data.id}">          
        </div>
    </div>
        </div>
        `)
}

export const renderConclusion = (data) => {
    let conclusion = ''
    let next = ''
    let span = ''
    let hidden = ''
    switch (data.conclusion) {
        case "Recovery":
            conclusion = "Выздоровление"
            hidden = 'd-none'
            break;
        case "Disease":
            conclusion = "Болезнь"
            span = 'Дата следующего визита'
            next = tranformDateWithTime(data.nextVisitDate)
            break;
        case "Death":
            conclusion = "Смерть"
            span = 'Дата и время смерти'
            next = tranformDateWithTime(data.deathDate)
            break;
    }
    return (
        `<div class="card custom">
        <div class="fw-bolder mb-2">
            <span id="conclusion-span">${conclusion}</span>
        </div>
        <div class="card-body inner-card">
            <div class="card-info ${hidden}">
                <label class="form-check-label">${span}
                    <span class="bold">${next}</span>
                </label>
            </div>
        </div>
    </div>`

    )
}

export const renderTableHeader = async (data) => {
    $('#table-heads').html('')
    $('#table-heads').append(
        `<th class="num" scope="col">№</th>
        <th class="patient-name-col" scope="col">ФИО</th>`
    )
    for (let i = 0; i < data.icdRoots.length; i++) {

        $('#table-heads').append(
            `<th class="code-col" scope="col" id="${data.icdRoots[i]}">${data.icdRoots[i]}</th>`
        )
    }
}

export const renderTableBody = async (data) => {
    $('#table-body').html('')
    
    for (let i = 0; i < data.records.length; i++) {
        let patientVisits = data.records[i].visitsByRoot
        $('#table-body').append(
            `
            <tr class="report-row" id="row${i}">
                <td class="num" scope="row">${i + 1}</td>
                <td class="patient-name-col">${data.records[i].patientName}</td>
            </tr>`
        )
        for (let j = 0; j < data.filters.icdRoots.length; j++) {
            let roots = Object.keys(patientVisits);
            let found = roots.find(root => {
                return root === data.filters.icdRoots[j]
            })
            if(found) {
                $(`#row${i}`).append(`<td class="item">${patientVisits[found]}</td>`)
            }else {
                $(`#row${i}`).append(`<td class="item">0</td>`)
            }
        }
    }
    $('#table-body').append(
        `
        <tr class="report-row" id="row-last">
            <td class="num" scope="row"></td>
            <td class="patient-name-col">Итого:</td>
        </tr>`
    )
    console.log(data.summaryByRoot)
    for (let i = 0; i < Object.keys(data.summaryByRoot).length; i++) {
        
        $(`#row-last`).append(`<td class="item">${Object.values(data.summaryByRoot)[i]}</td>`)
    }
}

export default { renderConsultationCard, renderGroupedConsultationCard }