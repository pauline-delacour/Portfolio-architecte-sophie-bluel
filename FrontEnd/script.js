async function getWorks(){
    const reponse = await fetch('http://localhost:5678/api/works');
    const works = await reponse.json();
    return works;
}


async function insertWorksInTheDom(){
    const works = await getWorks();
    for (let i = 0; i < works.length; i++){
        const article = works[i];
        
        const worksContainer = document.querySelector(".gallery");
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

