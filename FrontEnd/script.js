let works = []; 
/**
 * fonction qui permet de faire appel a l'API et qui retourne les élements works dans un fichier format JSON
 */
async function getWorks(){
    const reponse = await fetch('http://localhost:5678/api/works');
    const works = await reponse.json();
    return works;
}
/**
 * fonction qui permet de creer les élements que compose la gallery qui contient les works et qui sont insérés dans le DOM
 */

async function insertWorksInTheDom(){
        works = await getWorks();

    const worksContainer = document.querySelector(".gallery");
    for (let i = 0; i < works.length; i++){
        const article = works[i];
        
        const figureElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = article.imageUrl;
        const titreElement = document.createElement("figcaption");
        titreElement.innerText = article.title;
        figureElement.appendChild(imageElement);
        figureElement.appendChild(titreElement);
        worksContainer.appendChild(figureElement);
    }
}
insertWorksInTheDom();

/**
 * fonction qui permet de faire appel a l'API et qui retourne les élements categories dans un fichier format Json
 */
async function getCategories(){
    const reponse = await fetch('http://localhost:5678/api/categories');
    const categories = await reponse.json();
    return categories;
}
/**
 * Fonction qui permet de creer les éléments que compose les filtres qui contient les categories et qui sont inséré dans le DOM
 */
async function insertCategoriesInTheDom(){
    const categories = await getCategories();
    const divFiltre = document.querySelector(".filtre");
    const buttonTous = document.createElement("button");
    buttonTous.innerText = 'Tous';
    buttonTous.setAttribute('id', 'boutonTous');
    buttonTous.addEventListener("click", (event) => {
        filterCategorie(null);
    })
    divFiltre.appendChild(buttonTous); 

    for (let i = 0; i < categories.length; i++){
        const filtre = categories[i];

        const buttonElement = document.createElement("button")
        buttonElement.innerText = filtre.name;
        buttonElement.setAttribute('categoryId', filtre.id)
        divFiltre.appendChild(buttonElement);
        buttonElement.addEventListener("click", (event) => {
            //console.log(event.target.innerText)
            //console.log(event.target.getAttribute("categoryId"))
            const catId = event.target.getAttribute("categoryId");    
            filterCategorie(catId);
        })
    }
}

function filterCategorie(catId){
    //console.log(catId)
   // console.log(works)
   let filtrerWork;
    if (catId == null){
        filtrerWork = works
    } else {
        filtrerWork = works.filter(function(work){
            if (work.categoryId == catId){
                return true
            } else {
                return false
            }
     })
    }
    
   document.querySelector(".gallery").innerHTML = "";
   console.log(filtrerWork)

   const worksContainer = document.querySelector(".gallery");
   for (let i = 0; i < filtrerWork.length; i++){
       const article = filtrerWork[i];
       
       const figureElement = document.createElement("figure");
       const imageElement = document.createElement("img");
       imageElement.src = article.imageUrl;
       const titreElement = document.createElement("figcaption");
       titreElement.innerText = article.title;
       figureElement.appendChild(imageElement);
       figureElement.appendChild(titreElement);
       worksContainer.appendChild(figureElement);
   }

    works.forEach((element) => {
        //console.log(element)
        //console.log(element.categoryId)
        if (element.categoryId == catId){
            console.log(`element à afficher ${element.id}`)
        } else {
            console.log(`element à masquer ${element.id}`)
        }

    })
}

insertCategoriesInTheDom();

function testButton(){
    const element = document.getElementById("introduction");
    const button = document.createElement('button');
    console.log(element)
    button.innerText = 'Bouton Test';
    element.appendChild(button);
    button.addEventListener("click", () => {
        console.log(works)
    })
}
document.addEventListener('DOMContentLoaded', function () {
testButton();
})
  











