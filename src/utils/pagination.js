export const setNumber = async (ind) => {
    localStorage.setItem('page', ind);
    console.log(localStorage.getItem('page'))
}
export const setPage = async(current, count) => {
    $(".pagination").html('')
    for (let i = Math.max(1, current - 1); i <= Math.min(count, current + 2); i++) {
        $(".pagination").append(`<li class="page-item"><a class="page-link" id="${i}">${i}</a></li>`);
    }
    $(`#${current}`).addClass("active");
}



