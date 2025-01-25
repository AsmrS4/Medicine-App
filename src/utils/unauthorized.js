export const setUnauthorizedHeader = async (token) => {
    if (!token) {
        $('.container-fluid.custom').addClass('unauth');
        $('.navbar-nav').addClass('d-none');
        $('.nav-link.overflowed').addClass('disabled');
        $('.nav-username').html('Вход');
    }
}

export const setAuthorizedHeader = async (name = null) => {
    const token = localStorage.getItem('token')
    if (token) {
        let username = (name === null) ? localStorage.getItem('username') : name
        $('.container-fluid.custom').removeClass('unauth')
        $('.navbar-nav').removeClass('d-none');
        $('.nav-link.overflowed').removeClass('disabled');
        $('.nav-username').html(username);
    }
}

export default { setAuthorizedHeader, setUnauthorizedHeader }