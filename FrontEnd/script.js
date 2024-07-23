let works = [];
/**
 * Fonction asynchrone , récupére les works depuis une API
 *
 * @returns{Promise} - promesse qui se résout avec les données JSON
 *
 */
async function getWorks() {
  const reponse = await fetch("http://localhost:5678/api/works");
  const works = await reponse.json();
  return works;
}
/**
 * Création des élements que compose la gallery
 *
 */

async function insertWorksInTheDom() {
  // works = await getWorks();
  const worksContainer = document.querySelector(".gallery");
  for (let i = 0; i < works.length; i++) {
    const article = works[i];
    //création élément figure
    const figureElement = document.createElement("figure");
    //création élément image
    const imageElement = document.createElement("img");
    imageElement.src = article.imageUrl;
    //création du titre
    const titreElement = document.createElement("figcaption");
    titreElement.innerText = article.title;
    figureElement.appendChild(imageElement);
    figureElement.appendChild(titreElement);
    worksContainer.appendChild(figureElement);
  }
}
//insertWorksInTheDom();

/**
 * fonction asynchrone, récupére Catégories depuis l'API
 *
 * @returns{promise}
 *
 */
async function getCategories() {
  const reponse = await fetch("http://localhost:5678/api/categories");
  const categories = await reponse.json();
  return categories;
}
/**
 * Fonction qui permet de creer les éléments que compose les filtres qui contient les categories et qui sont inséré dans le DOM
 *
 *
 */
async function insertCategoriesInTheDom() {
  const categories = await getCategories();
  const divFiltre = document.querySelector(".filtre");
  //création d'un élément bouton
  const buttonTous = document.createElement("button");
  buttonTous.innerText = "Tous";
  //ajout d'un attribut a l'élement créer précedemment
  buttonTous.setAttribute("id", "boutonTous");
  //ajout d'un ecouteur d'evenement au click sur l'élement créer
  buttonTous.addEventListener("click", (event) => {
    filterCategorie(null);
  });
  divFiltre.appendChild(buttonTous);

  for (let i = 0; i < categories.length; i++) {
    const filtre = categories[i];
    // création d'un élement bouton
    const buttonElement = document.createElement("button");
    buttonElement.innerText = filtre.name;
    // ajout d'un attribut a l'élément créer précedemment
    buttonElement.setAttribute("categoryId", filtre.id);
    divFiltre.appendChild(buttonElement);
    // ajout d'un écouteur d'évênement au click sur le bouton
    buttonElement.addEventListener("click", (event) => {
      //console.log(event.target.innerText)
      //console.log(event.target.getAttribute("categoryId"))
      const catId = event.target.getAttribute("categoryId");
      filterCategorie(catId);
    });
  }
}
/**
 * Fonction qui permet de filtrer les works en fonction de leurs ID
 * @param {number} catId
 */
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

function testButton() {
  const element = document.getElementById("introduction");
  const button = document.createElement("button");
  console.log(element);
  button.innerText = "Bouton Test";
  element.appendChild(button);
  button.addEventListener("click", () => {
    console.log(works);
    postTest();
  });
}
document.addEventListener("DOMContentLoaded", function () {
  testButton();
});

let modal = null;
/**
 *fonction qui permet d'ouvrir la modal
 * @param {e}
 */
const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  modal.addEventListener("click", closeModal);
  modal.querySelectorAll(".js-close-modal").forEach((closeBtn) => {
    closeBtn.addEventListener("click", closeModal);
  });
  modal.querySelectorAll(".js-modal-stop").forEach((wrapper) => {
    wrapper.addEventListener("click", stopPropagation);
  });
  afficherWorksModal();
};
/**
 * fonction qui permet d'afficher les images dans la modal
 */
function afficherWorksModal() {
  const modalGallery = document.querySelector(".modal-gallery");
  document.querySelector(".modal-gallery").innerHTML = "";

  works.forEach((element) => {
    // création d'un élément figure
    const figureElement = document.createElement("figure");
    // création d'un élement image
    const imageElement = document.createElement("img");
    imageElement.src = element.imageUrl;
    //creéation d'un élément span
    const iconDelete = document.createElement("span");
    iconDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    // Ajout d'une class a l'élement créer précedement
    iconDelete.classList.add("icon-delete");
    // Ajout d'un attribut
    iconDelete.setAttribute("workId", element.id);
    // Ajout d'un ecouteur d'evenement au click
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
/**
 * Fonction qui permet de supprimer les photos depuis la modal
 *
 * @param{number} workId -l'identifiant de la photo a supprimer
 * @function
 */

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

/**
 * Fermer la modal actuellement ouverte
 * @param {Event} e
 * @function
 */
const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal.querySelectorAll(".js-close-modal").forEach((closeBtn) => {
    closeBtn.removeEventListener("click", closeModal);
  });
  modal.querySelectorAll(".js-modal-stop").forEach((wrapper) => {
    wrapper.removeEventListener("click", stopPropagation);
  });
  modal = null;
};
/**
 *Empecher de ne pas quitter la modal au click a l'interieur de celle ci
 *@param {Event} e
 */
const stopPropagation = function (e) {
  e.stopPropagation();
};
/**
 * Ajout d'un écouteur d'évenement pour ouvrir la modal sur tous les éléments avec la classe ".js-modal"
 */
document.querySelectorAll(".js-modal").forEach((lien) => {
  lien.addEventListener("click", openModal);
});

/**
 * lorsque l'utilisateur est connecté , affichage du handband, du boutton modifier et supprime les fitres
 *
 *
 */
const loginUser = () => {
  if (window.localStorage.getItem("AuthToken")) {
    //Affiche la modal pour l'edition
    document.querySelector(".js-modal").style.display = "inline";

    //Change le bouton connection en bouton déconnection
    const logButton = document.querySelector(".log");
    logButton.textContent = "logout";
    logButton.setAttribute("href", "./index.html");
    logButton.addEventListener("click", function () {
      window.localStorage.removeItem("AuthToken");
    });

    // Cache les filtres
    const filtreElement = document.querySelector(".filtre");
    filtreElement.style.display = "none";

    // Affiche la bande édition
    const headBand = document.querySelector(".mode-edition");
    headBand.style.display = "flex";
  }
};
loginUser();

/**
 *  Add a new works *
 *
 * To do list :
 * - Lorsque l'on clique sur ajouter une photo => pouvoir ajouter une nouvelle image , un titre et selectionner une catégorie
 * - un formulaire - OK
 * - creer un post
 * - API http://localhost:5678/api/works
 * - utilisation try/catch
 * - application/json
 * - Besoin du token
 * - Content Type : multipart/form-data
 * - image / title / category=
 * - createElement .title
 * - createElement .image
 * - createElement .catergoy=categories
 * - addEventListener au submit( btn ajouter photo)
 * - une fois l'image, le titre et la categorie ajouter, lors du clique du bouton 'valider' il faut que l'image s'ajoute dans la modal gallery mais aussi dans
 * la gallery principale
 */

/**
 * Au clique sur la fleche permet le retour vers la modal gallery photo
 */
const btnRetourArriere = () => {
  //const btnRetour = document.querySelector(".retour-modal-main");
  const btnRetour = document.getElementById("retour");
  console.log(btnRetour)
  const modalMain = document.querySelector(".modal-main");
  const modalFormulaire = document.querySelector(".modal-formulaire");

  btnRetour.addEventListener("click", (event) => {
    console.log(event)
    modalMain.style.display = "flex";
    modalFormulaire.style.display = "none";
  });
};
/**
 * Fonction qui permet de creer un POST
 */
/*document.getElementById('add-photo-form').addEventListener("submit", async () => {*/
const postTest = async () => {
  try {
    const token = window.localStorage.getItem("AuthToken");
    console.log(token);
    const jsonBody = body.JSON.strignify(body);
    const response = await fetch("http://localhost:5678/api/works", {
      METHOD: "POST",
      headers: { Accept: "application/json", Authorization: `bearer ${token}` },
      body: jsonBody,
    });
    console.log(response)
  } catch (error) {
    console.log("Erreur lors du chargement des données", error);
  }
};

/**
 * fonction au chargement de la page
 */
document.addEventListener("DOMContentLoaded", async () => {
  works = await getWorks();
  insertWorksInTheDom();
  const photoButton = document.querySelector(".photo-btn");
  const modalMain = document.querySelector(".modal-main");
  const modalFormulaire = document.querySelector(".modal-formulaire");

  photoButton.addEventListener("click", () => {
    modalMain.style.display = "none";
    modalFormulaire.style.display = "flex";
    
  });
  btnRetourArriere();
});