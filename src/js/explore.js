const content = document.querySelector('.news-content');
const image_premiere = document.querySelector('#img-premiere');
const figures = Array.from(document.querySelectorAll('.article-container'));

const allImages = Array.from(document.querySelectorAll('.article-image'));
///toutes les première span des figures
const all_publishing_date = Array.from(document.querySelectorAll('.publishing-date'));
//tous les h2 des figures
const allTitles = Array.from(document.querySelectorAll('.article-title-container'));
//tous les p des figures
const  arcticles_content = Array.from(document.querySelectorAll('.article-content'));
//tous les derniers spans des figcaption contiennent le noms de l'author de l'article
const authors_containers = Array.from(document.querySelectorAll('.author-container'));
//tous les article redirigent vers la page source
const all_articles_links = Array.from(document.querySelectorAll('.article-link'));

async function test(){
    try{
        const response = await fetch("https://newsapi.org/v2/everything?q=tesla&from=2021-03-05&sortBy=publishedAt&apiKey=eb8f28bb793e438db66ba192689a7dba");
        const data = await response.json();
        console.log(data);

        for(let i =0; i < figures.length; i++){
             init_explore_page(i,data);
        }
    }
    catch(err){
        console.log(err);
    }
}

function init_explore_page(i, data){

    allImages[i].src = data.articles[i].urlToImage;
    all_publishing_date[i].textContent = data.articles[i].publishedAt;
    allTitles[i].textContent = data.articles[i].title;
    arcticles_content.textContent = data.articles[i].description;
    authors_containers.textContent = data.articles[i].author;
    all_articles_links[i].href = data.articles[i].url;
}

test();
            