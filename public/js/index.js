



// for make navigation sitcky
let nav=document.querySelector(".container");
// console.log(nav);
function StickyNav(){
    let scrollY=window.scrollY;
    // console.log(scrollY)
    if(scrollY<170){
        
        nav.classList.remove('StickyNav');
    }else{
        nav.classList.add('StickyNav');
    }
}

window.addEventListener('scroll',StickyNav);
// for responsive 
        
        
        
function myFunction(x) {
    let navbarcollapse = document.querySelector(".navbar-collapse");
    let container = document.querySelector(".container")
    if (x.matches) { // If media query matches
        let togglebtn = document.getElementById("navbar-toggler");
        // console.log(togglebtn)
        let navbarcollapse = document.querySelector(".navbar-collapse");
        let container = document.querySelector(".container")
        // console.log(container)
        // console.log(navbarcollapse)
        togglebtn.addEventListener("click", () => {
            if (navbarcollapse.style.display == "none") {

                navbarcollapse.style.display = "block"

                container.style.height = "300px"


            }
            else {
                navbarcollapse.style.display = "none"
                // navbarcollapse.style.width="300px"
                container.style.height = "50px"


            }

        })
    } else {
        navbarcollapse.style.display="flex"
        // navbarcollapse.style.display = "block"
        container.style.height = "50px"
    }
}

var x = window.matchMedia("(max-width: 816px)")
myFunction(x) // Call listener function at run time
x.addListener(myFunction) // Attach listener function on state changes


 // team carousel 
 $('.team .owl-carousel').owlCarousel({
    loop: true,
    margin: 10,
    autoplay: true,
    dots: true,
    nav: false,
    responsiveClass: true,
    responsive:{
        0:{
            items: 1
        }, 
        600:{
            items: 2
        },
        1000:{
            items: 3
        }
    }
});

$('.faq-head').each(function(){
    $(this).click(function(){
                $(this).next().toggleClass('show-faq-content');
        let icon = $(this).children('span').children("i").attr('class');

        if(icon == "fas fa-plus"){
            $(this).children('span').html('<i class = "fas fa-minus"></i>');
        } else {
            $(this).children('span').html('<i class = "fas fa-plus"></i>');
        }
    });
});




// for form submit message 

// let submitBtn= document.getElementById("feedbackForm");
// console.log(submitBtn)
// submitBtn.addEventListener('submit',submitMessage)

// async function submitMessage(event){
//     event.preventDefault()

//     const result = await fetch('/feedback', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             name:name,
//             email:email,
//             message:message,
//         })
//     }).then((res) => res.json())

//     if (result.status === 'ok') {
//         // everythign went fine
        
//         alert('Success')
//     } else {
//         alert(result.error)
//     }
// }

// FeedbackForm=document.getElementById("feedbackForm")

//  function Submit(){
    
        
   
//         // console.log(FeedbackForm);
//         // FeedbackForm.style.display="none"
  
//             e.preventDefalut()
        
         
//     FeedbackForm.innerHTML="<div></div><h1>Your Feedback has been  submitted </h1></div> "
//     FeedbackForm.style.width="50vw"
// }
    
      
   