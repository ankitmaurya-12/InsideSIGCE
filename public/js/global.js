console.log("Golbal")
// const API_KEY="e4fc72735a3743afae298a92b13d3dd0"
const API_KEY="c587ccfb961b491ea8f012aeed33449d"
let category="health";

newscontainer=document.getElementById("news-container")

// default 
const xhr = new XMLHttpRequest();
xhr.open('GET', `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=${API_KEY}`, true);
xhr.send();



let SportNews=document.getElementById("Sport-news").addEventListener('click',()=>{
let category="sports"
console.log(category)
xhr.open('GET', `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=${API_KEY}`, true);
xhr.send();
});


let TechnologyNews=document.getElementById("Technology-news").addEventListener('click',()=>{
    let category="technology"
    console.log(category)
    xhr.open('GET', `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=${API_KEY}`, true);
    xhr.send();
    });


let BusinessNews=document.getElementById("Bussiness-news").addEventListener('click',()=>{
    let category="business"
    console.log(category)
    xhr.open('GET', `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=${API_KEY}`, true);
    xhr.send();
    });
let EntertainmentNews=document.getElementById("Entertainment-news").addEventListener('click',()=>{
    let category="entertainment"
    console.log(category)
    xhr.open('GET', `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=${API_KEY}`, true);
    xhr.send();
    
    });
    




// console.log(API_KEY)

console.log("welcome");
// for wait or loading 
let wait=document.getElementById('wait').addEventListener('progress',waitfunc());
function waitfunc(){
    let wait = document.getElementById('wait');
    // alert("Video progress");
    wait.innerHTML="<h1>please wait....</h1>"
}


//  when data is loaded 

xhr.onload = function () {
    if (this.status == 200) {
        let json = JSON.parse(this.responseText);
        let articles = json.articles;
        let newsHtml = "";
        console.log(articles)
        articles.forEach(function (element, index) {
            let date = new Date(element.publishedAt)
            let formatteddate= date.toLocaleDateString() 
            console.log(formatteddate)
            let news =  `<div class="news">

        
            <div class="title center">
                <h2>Breaking News:${index+1} </h2>
            </div>
            <div class="news-container">

                <div class="image"><img src="${element['urlToImage']}" ></div>
                <div class="news-title"><b>${element["title"]}</b></div>
                <div class="card-body news-title"> 

                <b>Author : ${element["author"]}</b>
                <b>Date :${formatteddate}</b>
            </div>

                <div class="card-body">
                <button class="read-more"> <a href="${element['url']}" target="_blank">Read more
                        here</a> </button></div>
    
    
            </div>
        </div>`
            newsHtml += news; 
    })
    // topNewsContainer.innerHTML = newsHtml;
    newscontainer.innerHTML=newsHtml
} else {

    console.log("Some error occured")
}
wait = document.getElementById('wait').style.display='none';
}





// console.log(topNewsContainer)


// xhr.open('GET', 'https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=e4fc72735a3743afae298a92b13d3dd0', true);





