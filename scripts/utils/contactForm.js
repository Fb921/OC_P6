function displayModal() {
    const modal = document.getElementById("contact_modal");
	modal.style.display = "flex";
    console.log("In displayModal()");
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}
