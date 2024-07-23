/**
 * Authentifie un utilisateur avec email et mot de passe
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {promise <boolean>}
 * @throws {Error}
 */

async function userConnect(email, password) {
  const body = {
    email: email,
    password: password,
  };
  console.log(password);
  const jsonBody = JSON.stringify(body);
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonBody,
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
    return false;
  }
  const userConnect = await response.json();
  //conserve le token dans le localStorage
  window.localStorage.setItem("AuthToken", userConnect.token);

  return true;
}
/**
 * Ajout gestionnaire d'evenement a la soumission du formulaire de connexion 
 * 
 * @event submit
 * @param {event} event 
 * @returns {void}
 */

document.querySelector(".login-connexion").addEventListener("submit", async function (event) {
    event.preventDefault();
    //Email récupéré depuis le champ du formulaire
    const email = document.getElementById("email").value;
    //Mot de passe récupéré depuis le champ du formulaure
    const password = document.getElementById("password").value;
    //formulaire de connexion 
    const formulaire = document.querySelector(".login-connexion");
    //Message d'erreur affiché en cas d'echec de connection 
    let messageErreur = document.querySelector("login-connexion.error-message");
    if (messageErreur) {
      messageErreur.remove();
    }

    try {
      const connexion = await userConnect(email, password);

      if (connexion) {
        // document.querySelector('.js-modal').style.display ='inline';
        window.location.href = "./index.html";
      }
    } catch (error) {
        // Nouveau message d'erreur en cas d'echec de la connection 
      messageErreur = document.createElement("span");
      messageErreur.classList.add("error-message");
      messageErreur.innerText =
        "Erreur dans l'identification ou le mot de passe ";
      formulaire.appendChild(messageErreur);
      console.log("echec de connexion");
    }
  });