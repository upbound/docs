// Registers event listeners to nav elements in mobile view
// Enables icon swapping from nav icon to "X" to close.

function iconSwitch(navToggle){
    navToggle.getElementsByClassName("nav-open-icon")[0].classList.toggle("invisible");
    navToggle.getElementsByClassName("nav-close-icon")[0].classList.toggle("invisible");

}

function buildEventListeners(){
    var leftToggle = document.getElementById("left-nav-toggle");
    var rightToggle = document.getElementById("right-nav-toggle");
    leftToggle.addEventListener("click", function(){ iconSwitch(this) }, true)
    rightToggle.addEventListener("click", function(){ iconSwitch(this) }, true)
}

window.onload = buildEventListeners();

