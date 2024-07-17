let works = [];
/**
 * fonction qui permet de faire appel a l'API et qui retourne les élements works dans un fichier format JSON
 */
async function getWorks() {
  const reponse = await fetch("http://localhost:5678/api/works");
  const works = await reponse.json();
  return works;
}
/**
 * fonction qui permet de creer les élements que compose la gallery qui contient les works et qui sont insérés dans le DOM
 */

async function insertWorksInTheDom() {
  works = await getWorks();

  const worksContainer = document.querySelector(".gallery");
  for (let i = 0; i < works.length; i++) {
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
async function getCategories() {
  const reponse = await fetch("http://localhost:5678/api/categories");
  const categories = await reponse.json();
  return categories;
}
/**
 * Fonction qui permet de creer les éléments que compose les filtres qui contient les categories et qui sont inséré dans le DOM
 */
async function insertCategoriesInTheDom() {
  const categories = await getCategories();
  const divFiltre = document.querySelector(".filtre");
  const buttonTous = document.createElement("button");
  buttonTous.innerText = "Tous";
  buttonTous.setAttribute("id", "boutonTous");
  buttonTous.addEventListener("click", (event) => {
    filterCategorie(null);
  });
  divFiltre.appendChild(buttonTous);

  for (let i = 0; i < categories.length; i++) {
    const filtre = categories[i];

    const buttonElement = document.createElement("button");
    buttonElement.innerText = filtre.name;
    buttonElement.setAttribute("categoryId", filtre.id);
    divFiltre.appendChild(buttonElement);
    buttonElement.addEventListener("click", (event) => {
      //console.log(event.target.innerText)
      //console.log(event.target.getAttribute("categoryId"))
      const catId = event.target.getAttribute("categoryId");
      filterCategorie(catId);
    });
  }
}

function filterCategorie(catId) {
  //console.log(catId)
  // console.log(works)
  let filtrerWork;
  if (catId == null) {
    filtrerWork = works;
  } else {
    filtrerWork = works.filter(function (work) {
      if (work.categoryId == catId) {
        return true;
      } else {
        return false;
      }
    });
  }

  document.querySelector(".gallery").innerHTML = "";
  console.log(filtrerWork);

  const worksContainer = document.querySelector(".gallery");
  /*for (let i = 0; i < filtrerWork.length; i++){
       
        const article = filtrerWork[i];
       const figureElement = document.createElement("figure");
       const imageElement = document.createElement("img");
       imageElement.src = article.imageUrl;
       const titreElement = document.createElement("figcaption");
       titreElement.innerText = article.title;
       figureElement.appendChild(imageElement);
       figureElement.appendChild(titreElement);
       worksContainer.appendChild(figureElement);
   }*/
  filtrerWork.forEach((element, index) => {
    const article = filtrerWork[index];
    const figureElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = article.imageUrl;
    const titreElement = document.createElement("figcaption");
    titreElement.innerText = article.title;
    figureElement.appendChild(imageElement);
    figureElement.appendChild(titreElement);
    worksContainer.appendChild(figureElement);
    console.log(element);
  });

  works.forEach((element, index) => {
    //console.log(element)
    console.log(index);
    if (element.categoryId == catId) {
      console.log(`element à afficher ${element.id}`);
    } else {
      console.log(`element à masquer ${element.id}`);
    }
  });
}

insertCategoriesInTheDom();

/*function testButton(){
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
})*/

/* Modal galerie */
let modal = null;
/* fonction qui permet d'ouvrir la modal*/
const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-close-modal").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
  afficherWorksModal();
};
/* fonction qui permet d'afficher les images dans la modal */
function afficherWorksModal() {
  const modalGallery = document.querySelector(".modal-gallery");
  document.querySelector(".modal-gallery").innerHTML = "";

  works.forEach((element) => {
    const figureElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = element.imageUrl;

    const iconDelete = document.createElement("span");
    iconDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    iconDelete.classList.add("icon-delete");
    iconDelete.setAttribute("workId", element.id);
    iconDelete.addEventListener("click", (e) => {
      const workId = e.target.parentElement.getAttribute("workId");
      console.log(iconDelete);
      /*e.preventDefault();*/
      deleteImage(workId);
    });

    figureElement.appendChild(imageElement);
    figureElement.appendChild(iconDelete);
    modalGallery.appendChild(figureElement);
  });
}
/* Fonction qui permet de supprimer les photos depuis la modal*/

async function deleteImage(workId) {
  try {
    console.log(workId);
    const token = window.localStorage.getItem("AuthToken");
    console.log(token);
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

/* to-do-list : 
-token qui est dans le local storage
-appeler la fonction afficherWorksModal ( la ou sera supprimé les images )
-appeler la fonction insertWorksInTheDom ( pour également supprimé l'image de mes works)
-utilisation de try catch pour la gestion d'erreur 
-lors du click sur iconDelete, si le workId === categoryId de l'image , sa supprime de la modal mais aussi du dom 
  */

/* fonction qui permet de quitter la modal */
const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-close-modal")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
  modal = null;
};
/* permet de ne pas quitter la modal au click a l'interieur de celle ci */
const stopPropagation = function (e) {
  e.stopPropagation();
};
document.querySelectorAll(".js-modal").forEach((lien) => {
  lien.addEventListener("click", openModal);
});

/* lorsque l'utilisateur est connecté , affichage du handband, du boutton modifier et supprime les fitres */
function loginUser() {
  if (window.localStorage.getItem("AuthToken")) {
    document.querySelector(".js-modal").style.display = "inline";

    const logButton = document.querySelector(".log");
    logButton.textContent = "logout";
    logButton.setAttribute("href", "./index.html");
    logButton.addEventListener("click", function () {
      window.localStorage.removeItem("AuthToken");
    });

    const filtreElement = document.querySelector(".filtre");
    filtreElement.style.display = "none";

    // reste a afficher le handband noir
  }
}
loginUser();
