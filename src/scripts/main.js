// import Cookies from "js-cookie";
// window.Cookies = Cookies
window.addEventListener('DOMContentLoaded', () => {

  // Toggle naviation menu
  const mobileNavButton = document.getElementById('mobileNavButton')
    
  mobileNavButton.addEventListener('click', function () {
    const mainNavElement = document.getElementById('main-nav');
    mainNavElement.classList.toggle('hidden');
  });
})
