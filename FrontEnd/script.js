let works = [];
let categories = [];
/**
 * FONCTION ASYNCHRONE , RÉCUPÉRE LES WORKS DEPUIS UNE API
 *
 * @returns{Promise} - promesse qui se résout avec les données JSON
 *
 */
const getWorks = async () => {
  const reponse = await fetch("http://localhost:5678/api/works");
  const works = await reponse.json();
  return works;
};
/**
 * CRÉATION DES ÉLÉMENTS QUE COMPORTE LA GALLERY
 */

const insertWorksInTheDom = () => {
  const worksContainer = document.querySelector(".gallery");
  worksContainer.innerHTML = "";
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
};

/**
 * FONCTION ASYNCHRONE, RÉCUPÉRE LES CATEGORIES DEPUIS L'API
 * @returns{promise}
 *
 */
const getCategories = async () => {
  const reponse = await fetch("http://localhost:5678/api/categories");
  const categories = await reponse.json();
  return categories;
};
/**
 * FONCTION QUI PERMET DE CREER LES ÉLÉMENTS FILTRES QUI CONTIENT LES CATÉGORIES ET ENSUITE INSÉRÉ DANS LE DOM
 *
 */
const insertCategoriesInTheDom = () => {
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
};

/**
 * FONCTION QUI PERMET DE FILTRER LES WORLS EN FONCTION DE LEURS ID
 *
 * @param {number} catId
 */
const filterCategorie = (catId) => {
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

let modal = null;
/**
 *FONCTION QUI PERMET D'OUVRIR LA MODAL
 * @param {e}
 */
const openModal = (e) => {
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
 * FONCTION QUI PERMET D'AFFICHER LES PHOTOS DANS LA MODAL
 *
 */
const afficherWorksModal = () => {
  const modalGallery = document.querySelector(".modal-gallery");
  // remise a 0 de la modal
  document.querySelector(".modal-gallery").innerHTML = "";

  works.forEach((element) => {
    // création d'un élément figure
    const figureElement = document.createElement("figure");
    // création d'un élement image
    const imageElement = document.createElement("img");
    imageElement.src = element.imageUrl;
    // création d'un élément span
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
      e.preventDefault();
      deleteImage(workId);
    });

    figureElement.appendChild(imageElement);
    figureElement.appendChild(iconDelete);
    modalGallery.appendChild(figureElement);
  });
};
/**
 * FONCTION QUI PERMET DE SUPPRIMER LES PHOTOS DEPUIS LA MODAL
 *
 * @param{number} workId -l'identifiant de la photo a supprimer
 * @function
 */

const deleteImage = async (workId) => {
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
    works = await getWorks();
    insertWorksInTheDom();
    afficherWorksModal();
  } catch (error) {
    console.log(error);
  }
};

/**
 * FERMER LA MODAL
 * @param {Event} e
 * @function
 */
const closeModal =  (e) => {
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
  resetForm();
};
/**
 *EMPECHER DE QUITTER LA MODAL AU CLICK A L'INTERIEUR
 *
 *@param {Event} e
 */
const stopPropagation = (e) => {
  e.stopPropagation();
};
/**
 * AJOUT D'UN ÉCOUTEUR D'ÊVENEMENT POUR OUVRIR LA MODAL SUR TOUS LES ÉLEMENTS AVEC LA CLASSE ".js-modal"
 *
 */
document.querySelectorAll(".js-modal").forEach((lien) => {
  lien.addEventListener("click", openModal);
});

/**
 *LORSQUE L'UTILISATEUR EST CONNECTÉ, AFFICHAGE DU HEADBAND, DU BOUTON MODIFIER ET CACHE LES FILTRES
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
    // nav bar
    const navbar = document.querySelector("nav ul");
    const styleh1 = document.querySelector("h1");
    navbar.style.paddingTop = "30px";
    styleh1.style.paddingTop = "30px";
  }
};

/**
 * AJOUTER UNE PHOTO DEPUIS LA MODAL GALLERY
 */
const ajoutNewPhoto = () => {
  const photoButton = document.querySelector(".photo-btn");
  const modalMain = document.querySelector(".modal-main");
  const modalFormulaire = document.querySelector(".modal-formulaire");

  photoButton.addEventListener("click", () => {
    modalMain.style.display = "none";
    modalFormulaire.style.display = "flex";
    resetForm();
  });
};

/**
 * CLICK SUR LA FLECHE QUI PERMET UN RETOUR A LA MODAL GALLERY
 */
const btnRetourArriere = () => {
  const btnRetour = document.getElementById("retour");
  console.log(btnRetour);
  const modalMain = document.querySelector(".modal-main");
  const modalFormulaire = document.querySelector(".modal-formulaire");

  btnRetour.addEventListener("click", (event) => {
    console.log(event);
    //Affiche la modal principal
    modalMain.style.display = "flex";
    //cache le formulaire de la modal
    modalFormulaire.style.display = "none";
  });
};

/**
 * MENU DEROULANT CATEGORIES
 */
const menuObjet = async () => {
  //récupere la div
  const divSelect = document.getElementById("selectCategory");
  const select = document.getElementById("category");

  //Appelle de la fonction asynchrone getCategorie pour récupérer les categories
  const categories = await getCategories();
  //Création et ajout d'un bouton vide au début du menu déroulant
  const emptyOption = document.createElement("option");
  select.appendChild(emptyOption);
  divSelect.appendChild(select);
  //Parcourt chaque categorie récupéré et création d'une option
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.innerText = category.name;
    option.setAttribute("value", category.id);
    select.appendChild(option);
  });
};
/**
 * AFFICHAGE DE L'IMAGE SELECTIONNÉ
 */
const afficherImageFormulaire = () => {
  const image = document.getElementById("image");
  image.addEventListener("change", function (event) {
    //récupere le premier fichier sélectionné par l'utilisateur
    const file = event.target.files[0];
    //Vérifie si un fichier a bien été sélectioné
    if (file) {
      //creer une nouvelle instance de FileReader pour lire le contenue du fichier
      const reader = new FileReader();
      //définit une fonction à éxéciter lorsque le ficher est chargé
      reader.onload = function (e) {
        const preview = document.getElementById("preview");
        //met a jour la source de l'element preview avec le resultat de la lecture
        preview.src = e.target.result;
        //Affiche l'element en modifiant sont style
        preview.style.display = "block";
        //Element selectionner qui seront à masqué
        const addPhoto = document.querySelector(".style-addphoto");
        const iconePhoto = document.getElementById("icone-photo");
        const span = document.querySelector(".extension-image");
        const messageError = document.getElementById("image-error");
        //Masque les élements
        addPhoto.style.display = "none";
        iconePhoto.style.display = "none";
        span.style.display = "none";
        messageError.style.display = "none";
      };
      //lit le contenue du fichier en tant qu'URL de données
      reader.readAsDataURL(file);
    }
  });
};
/**
 * VERIFICATION DES CHAMPS DU FORMULAIRE
 *
 */
const checkFormValid = () => {
  // Récupere les élements du formulaire à vérifier
  const imageInput = document.getElementById("image");
  const file = imageInput.files[0];
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");

  const imageError = document.getElementById("image-error");

  if (!file) {
    if (titleInput.value !== "" || categorySelect.value !== "")
      imageError.style.display = "inline";
  } else {
    //Définit le type d'images valides
    const validImageExtension = ["image/jpeg", "image/jpg", "image/png"];
    //Taille maximal du fichier 4Mo
    const maxSize = 4 * 1024 * 1024;
    //Type du fichier selectionné
    const fileType = file.type;
    //Taille du fichier selectionné
    const fileSize = file.size;

    //Vérifie si le fichier a un type valide et une taille inferieur ou égale a 4Mo
    const fileValid = validImageExtension.includes(fileType) && fileSize <= maxSize;
    //Vérifie si le champ du titre n'est pas vide
    const titleValid = titleInput.value !== "";
    //Vérifie si une catégorie est selectionné
    const categoryValid = categorySelect.value !== "";

    if (fileValid) {
      if (titleValid && categoryValid) {
        checkImage(); //Si tous les champs sont remplis, applique la modification de couleur du bouton
      }
    } else {
      imageError.style.display = "inline";
    }
  }
};

/**
 * MODIFICATION DU STYLE DU BOUTON SI LES ÉLEMENTS DU FORMULAIRE SONT VALIDE
 */

const checkImage = () => {
  const colorButton = document.getElementById("valid-image");
  colorButton.style.backgroundColor = "#1D6154";
};

/**
 * RESET DU FORMULAIRE APRÉS AJOUT D'UNE IMAGE
 */
const resetForm = () => {
  //Récupére le formulaire
  const form = document.getElementById("add-photo");
  //Réinitialisation du formualire
  form.reset();

  const preview = document.getElementById("preview");
  if (preview) {
    preview.style.display = "none";
    preview.src = "#";
  }

  const icon = document.getElementById("icone-photo");
  if (icon) {
    icon.style.display = "flex";
  }
  const span = document.querySelector(".extension-image");
  if (span) {
    span.style.display = "inline";
  }
  const label = document.querySelector(".style-addphoto");
  if (label) {
    label.style.display = "flex";
  }
  const errorMessage = document.getElementById("image-error");
  if (errorMessage) {
    errorMessage.style.display = "none";
  }
  const bouton = document.getElementById("valid-image");
  if (bouton) {
    bouton.style.backgroundColor = "#B3B3B3";
  }
};
/**
 * AJOUT ECOUTEURS D'EVENEMENTS AUX ELEMENTS DU FORMULAIRE
 */
const listenerForElement = () => {
  document.getElementById("image").addEventListener("change", checkFormValid);
  document.getElementById("title").addEventListener("input", checkFormValid);
  document
    .getElementById("category")
    .addEventListener("change", checkFormValid);
};
/**
 * VALIDATION D'AJOUT D'IMAGE => RETOUR VERS LA MODAL GALLERY
 */

const validationPhoto = () => {
  const modalMain = document.querySelector(".modal-main");
  const modalFormulaire = document.querySelector(".modal-formulaire");
  //Affiche la modal principal
  modalMain.style.display = "flex";
  //cache le formulaire de la modal
  modalFormulaire.style.display = "none";
};

/**
 * FONTION QUI CREER UN POST VERS L'API
 */

const postPhoto = () => {
  const form = document.getElementById("add-photo");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    try {
      const token = window.localStorage.getItem("AuthToken");
      console.log(token);
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log(response);
      works = await getWorks();
      insertWorksInTheDom();
      afficherWorksModal();
      validationPhoto();
    } catch (error) {
      console.log("Erreur lors du chargement des données", error);
    }
  });
};
/**
 * AU CHARGEMENT DE LA PAGE
 */
document.addEventListener("DOMContentLoaded", async () => {
  works = await getWorks();
  categories = await getCategories();
  insertCategoriesInTheDom();
  insertWorksInTheDom();
  btnRetourArriere();
  await menuObjet();
  ajoutNewPhoto();
  afficherImageFormulaire();
  listenerForElement();
  postPhoto();
});
loginUser();
