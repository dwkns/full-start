import Alpine from 'alpinejs'
import Cookies from "js-cookie";
console.log('JS is working');

window.Cookies = Cookies

window.addEventListener('DOMContentLoaded', () => {
  window.Alpine = Alpine // Add Alpine to the Global Scope.
  Alpine.start() // Start Alpine — not strictly necessary. It starts automatically. 
})
