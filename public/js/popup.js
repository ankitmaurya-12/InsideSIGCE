// const dissmissBtn = document.getElementById("dissmissBtn");
// const errorBox =document.getElementById("errorBox");

// dissmissBtn.addEventListener('click',function(e){
//   errorBox.style.display='none'
// })

// const hideAlert = setTimeout(toggleError, 2000);
// function toggleError() {
//     errorBox.style.display ='none'
//   }


const dismissBtn = document.getElementById("dismissBtn");
const errorBox =document.getElementById("errorBox");

dismissBtn.addEventListener('click',function(e){
  errorBox.style.display='none'
})

const hideAlert = setTimeout(toggleError, 3000);
function toggleError() {
    errorBox.style.display ='none'
  }