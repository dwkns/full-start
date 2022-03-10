import Alpine from 'alpinejs'
import Cookies from "js-cookie";

// import our webcomponent
import {MyElement} from '../../src/lib/components/my-elements';
// Then use it in the HTML with <my-element></my-element>



window.Cookies = Cookies
window.Alpine = Alpine
Alpine.start()

window.addEventListener('DOMContentLoaded', () => {
console.log('DOMContentLoaded');
})
