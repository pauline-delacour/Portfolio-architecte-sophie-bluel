
async function userConnect(email, password){
    const body = {
        email: email,
        password: password
    }
    console.log(password)
    const jsonBody = JSON.stringify(body)
    const response = await fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: jsonBody
    });
    if (!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`)
        return false
    } 
    const userConnect = await response.json();
    window.localStorage.setItem('AuthToken', userConnect.token);
    
    return true ;
} 

document.querySelector('.login-connexion').addEventListener('submit', async function(event){
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const formulaire = document.querySelector('.login-connexion');
    const messageErreur = document.createElement("span");
    messageErreur.innerText = "Erreur dans l'identifiant ou le mot de passe";
    formulaire.appendChild(messageErreur);

        try {
           const connexion = await userConnect(email, password); 
            
            if(connexion){
            window.location.href ='./index.html'
            }
        } catch(error) {
            messageErreur
            console.log('echec de connexion')
        }
});

