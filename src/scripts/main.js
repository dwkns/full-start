import Alpine from 'alpinejs'
import Cookies from "js-cookie";


window.Cookies = Cookies
window.Alpine = Alpine
Alpine.start()

window.addEventListener('DOMContentLoaded', () => {
console.log('DOMContentLoaded');
})
