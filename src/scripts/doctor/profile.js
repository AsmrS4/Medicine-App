import { logoutDoctor } from '../../api/doctor/logout.js';
import { getDoctorProfile, updateDoctorProfile } from './doctor.js'

getDoctorProfile();
updateDoctorProfile();

$(document).on('click', '#logout-a', () => {
    logoutDoctor();
})