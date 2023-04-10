// Registers event listeners to nav elements in mobile view
// Enables icon swapping from nav icon to "X" to close.

function iconSwitch(navToggle){
    navToggle.getElementsByClassName("nav-open-icon")[0].classList.toggle("invisible");
    navToggle.getElementsByClassName("nav-close-icon")[0].classList.toggle("invisible");

}

function iconHide(navToggle){
    navToggle.getElementsByClassName("nav-open-icon")[0].classList.add("invisible");
    navToggle.getElementsByClassName("nav-close-icon")[0].classList.add("invisible");
}

function iconDefault(navToggle){
    navToggle.getElementsByClassName("nav-open-icon")[0].classList.remove("invisible");
    navToggle.getElementsByClassName("nav-close-icon")[0].classList.add("invisible");
}

function buildEventListeners(){
    var leftOffcanvas = document.getElementById("left-nav-offcanvas");
    var rightOffcanvas = document.getElementById("right-nav-offcanvas");
    var leftToggle = document.getElementById("left-nav-toggle");
    var rightToggle = document.getElementById("right-nav-toggle");

    leftOffcanvas.addEventListener('show.bs.offcanvas', event => {
        iconSwitch(leftToggle)
        iconHide(rightToggle)
    })

    leftOffcanvas.addEventListener('hide.bs.offcanvas', event => {
        iconSwitch(leftToggle)
        iconDefault(rightToggle)
    })

    rightOffcanvas.addEventListener('show.bs.offcanvas', event => {
        iconSwitch(rightToggle)
        iconHide(leftToggle)
    })

    rightOffcanvas.addEventListener('hide.bs.offcanvas', event => {
        iconSwitch(rightToggle)
        iconDefault(leftToggle)
    })


}

window.onload = buildEventListeners();

