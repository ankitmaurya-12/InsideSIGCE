const approvedBtn = document.getElementById("ApprovedNewsBtn")
const pendingBtn = document.getElementById("PendingNewsBtn")
const approvedNewsContainer = document.getElementById("approvedNewsContainer");
const pendingNewsContainer = document.getElementById("pendingNewsContainer");

// approvedBtn.addEventListener("click",function(e){
//     console.log("hi")
//     if(approvedNewsContainer.style.display=="none"){
//         approvedNewsContainer.style.display='block'
//         pendingNewsContainer.style.display='none'

//     }else{
//         approvedNewsContainer.style.display='none'
//         pendingNewsContainer.style.display='block'

//     }
// })
pendingBtn.addEventListener("click",function(e){
    console.log("hi")
    if(approvedNewsContainer.style.display=="none"){
        approvedNewsContainer.style.display = 'none'
        pendingNewsContainer.style.display = 'block'

    }else{
        pendingNewsContainer.style.display='block'
        approvedNewsContainer.style.display='none'

    }
})
approvedBtn.addEventListener("click",function(e){
    console.log("hi")
    if(approvedNewsContainer.style.display=="none"){
        pendingNewsContainer.style.display = 'none'
        approvedNewsContainer.style.display = 'block'

    }else{
        approvedNewsContainer.style.display='block'
        pendingNewsContainer.style.display='none'

    }
})