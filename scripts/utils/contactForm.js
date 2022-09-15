function displayModal() {
    const modal = document.getElementById("contact_modal");
	modal.style.display = "flex";
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}

document.querySelector('form .contact_button').onclick = function (){
    console.log(document.querySelector('#prenom').value);
    console.log(document.querySelector('#nom').value);
    console.log(document.querySelector('#email').value);
}