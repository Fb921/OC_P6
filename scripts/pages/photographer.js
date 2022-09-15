//On récupère les information du photographe

/*On récupère l'id du photographe */
var paramString = window.location.href.split('?')[1];
var queryString = new URLSearchParams(paramString);
var photographer_id = queryString.get('id');
var display_menu_trier_par = false;
var lightBoxOpened = false;
var n=0;

/*On récupère les infos des photographes à partir son id */
var xhttp = new XMLHttpRequest();
xhttp.open("GET", "./data/photographers.json", false);
xhttp.send();

var photographer_infos;
const response = JSON.parse(xhttp.responseText);
/*On charge le contenu de la page */

/*Les informations sur le photographe */
response["photographers"].forEach( p => {
    if(p.id == photographer_id){
      photographer_infos = p;
      const photograph_header = document.querySelector('.photograph-header');
      let contactBtn_container = document.createElement("div");
      let contact_button = document.querySelector('.contact_button');
      contactBtn_container.appendChild(contact_button);
      let infos = photographeInfosFactory(p);
      photograph_header.appendChild(infos.getInfos());
      photograph_header.appendChild(contactBtn_container);
      photograph_header.appendChild(infos.getProfilePic());
    }
});

/* La galerie d'images */
//Ces variables permettront de faire tourner les images dans l'éventail d'image
var current_img = 0, total_likes = 0;
var gallery = [], gallery_sorted_by_date = [], gallery_sorted_by_title = [], gallery_sorted_by_popularity = [];
const gallery_container = document.querySelector(".gallery_container");

/*On parcoure l'ensemble des données d'image */
for(let i=0;i<response['media'].length;i++){
    /*Si l'id du photographe de l'image correspond à l'id du photographe courant*/
    if(photographer_id == response["media"][i]["photographerId"]){
        gallery.push(response["media"][i]);
        total_likes+=response["media"][i].likes;
    }
}

/* Le petit bloc d'infos*/
document.querySelector('.total_likes').textContent = total_likes;
document.querySelector('.price_container').textContent = photographer_infos['price'];

document.querySelector("button[aria-label='Next image']").onkeydown = function unf(e){if(e.code == "Enter"){next_img()}};
document.querySelector("button[aria-label='Previous image']").onkeydown = function unf(e){if(e.code == "Enter"){previous_img()}};
document.querySelector("button[aria-label='Close dialog']").onkeydown = function unf(e){if(e.code == "Enter"){close_imgPopup()}};

/*Fonction implémentant les différentes fonctionnalités */
/*Pour afficher les galeries de l'image*/
function displayGalleryImage(g){
    gallery_container.textContent = " ";
    g.forEach((e,y) => {
        let image_e = imageFactory(e,y);
        gallery_container.appendChild(image_e.getUserCardDOM());
    })
}

/*Pour afficher le menu de tri */
function display_trier_par_menu(e,action){
    if(action == 'c'){
        document.querySelector(".tri-option-list").dataset.openTrierMenu = "false";
        document.querySelector("#close-trier-menu-arrow").style.cssText = "display:none";
        document.querySelector("#open-trier-menu-arrow").style.cssText = "display:inline";
    }else{
        document.querySelector(".tri-option-list").dataset.openTrierMenu = "true";        
        document.querySelector("#open-trier-menu-arrow").style.cssText = "display:none";
        document.querySelector("#close-trier-menu-arrow").style.cssText = "display:inline";
    }    
}

/* Nous donne la date la plus récente */
function getMinDate(tab){
    let min = tab[0];
    let pos = 0;
    let d1 = new Date(tab[0].date);
    for(let i = 1; i < tab.length-1 ;i++){
        let d2 = new Date(tab[i+1].date);
        if(d2 < d1){
            min = tab[i+1];
            d1 = d2;
            pos = i+1;
        }
    }
    tab.splice(pos,1);
    return {"min":min,"tab":tab};
}

/* Nous donne l'image la moins populaire */
function getMinPop(tab){
    let min = tab[0];
    let pos = 0;
    for(let i = 1; i < tab.length ;i++){
        if(min.likes < tab[i].likes){
            min = tab[i];
            pos = i;
        }
    }
    tab.splice(pos,1);
    return {"min":min,"tab":tab};
}

/* Nous donne le titre ayant l'ordre alphabétique le plus petit */
function getMinTitle(tab){
    let min = tab[0];
    let arr = tab[0].title;
    let pos = 0;
    for(let i = 1; i < tab.length ;i++){
        let y = 0;
        let arr2 = tab[i].title;
        while((y < arr.length) && (y < arr2.length)){
            if(arr.charCodeAt(y) < (arr2.charCodeAt(y))){
                break;
            }            
            else if(arr2.charCodeAt(y) < arr.charCodeAt(y)){
                min = tab[i];
                arr = tab[i].title;
                pos = i;
                break;
            }            
            y++;
        }
    }
    tab.splice(pos,1);
    return {"min":min,"tab":tab};
}

/* Pour trier les images de la galerie */
function sort_img_by(s){
    let t = gallery;
    if(s == "d"){
        document.querySelector(".selected-option_text").textContent = "Date";
        let c = document.querySelector('.selected-option_text').dataset.currentTri;
        document.querySelector('#'+c).dataset.selectedTri = "false";
        document.querySelector("#option2").dataset.selectedTri = "true";
        document.querySelector('.selected-option_text').dataset.currentTri = "option2";
        if(gallery_sorted_by_date.length == 0){
            while(t.length > 0){
                let x = getMinDate(t);
                gallery_sorted_by_date.push(x.min);
                t=x.tab;
            }
            gallery = gallery_sorted_by_date;
        }else{
            gallery = gallery_sorted_by_date;
        }
    }else if(s == "p"){
        document.querySelector(".selected-option_text").textContent = "Popularité";
        let c = document.querySelector('.selected-option_text').dataset.currentTri;
        document.querySelector('#'+c).dataset.selectedTri = "false";
        document.querySelector("#option1").dataset.selectedTri = "true";
        document.querySelector('.selected-option_text').dataset.currentTri = "option1";
        if(gallery_sorted_by_popularity.length == 0){
            while(t.length > 0){
                let x = getMinPop(t);
                gallery_sorted_by_popularity.push(x.min);
                t=x.tab;
            }
            gallery = gallery_sorted_by_popularity;
        }else{
            gallery = gallery_sorted_by_popularity;
        }
    }else if(s == "t"){
        document.querySelector(".selected-option_text").textContent = "Titre";
        let c = document.querySelector('.selected-option_text').dataset.currentTri;
        document.querySelector('#'+c).dataset.selectedTri = "false";
        document.querySelector("#option3").dataset.selectedTri = "true";
        document.querySelector('.selected-option_text').dataset.currentTri = "option3";
        if(gallery_sorted_by_title.length == 0){
            while(t.length > 0){
                let x = getMinTitle(t);
                gallery_sorted_by_title.push(x.min);
                t=x.tab;
            }
            gallery = gallery_sorted_by_title;
        }else{
            gallery = gallery_sorted_by_title;
        }
    }
    gallery_container.textContent = " ";
    /*On fait un display de t */
    displayGalleryImage(gallery);
}

sort_img_by("p");
document.querySelector("#option1 > button").onclick = function(){sort_img_by("p")}
document.querySelector("#option2 > button").onclick = function(){sort_img_by("d")}
document.querySelector("#option3 button").onclick = function(){sort_img_by("t")}

/* Pour afficher la popup d'images */
function display_imgPopup(e){
    if(e.src.indexOf("mp4") < 0){
        document.querySelector(".img-popup_img-container > img").style.cssText = " ";
        document.querySelector(".img-popup_img-container > video").style.cssText = "display:none";
        document.querySelector(".img-popup_img-container > img").setAttribute('src',e.src);
        document.querySelector(".img-popup_img-container > img").setAttribute('alt',e.alt);
        document.querySelector(".img-popup_container").style.display = 'flex';
        console.log(e);
    }else{
        document.querySelector(".img-popup_img-container > img").style.cssText = "display:none";
        document.querySelector(".img-popup_img-container > video").style.cssText = " ";
        document.querySelector(".img-popup_img-container > video").setAttribute('src',e.src);
        document.querySelector(".img-popup_img-container > video").setAttribute('alt',e.alt);
        console.log(e);
        document.querySelector(".img-popup_img-container > img").setAttribute('src',"");
        document.querySelector(".img-popup_container").style.display = 'flex';
    }
    current_img = parseInt(e.dataset.position);
    lightBoxOpened =true;
}

/*Pour fermer la popup d'images */
function close_imgPopup(){
    document.querySelector(".img-popup_container").style.display = 'none';
    lightBoxOpened =false;
}

/*Pour afficher l'image précédente dans la lightbox */
function previous_img(){
    if(current_img > 0){
        current_img--;
        if(gallery[current_img].image){
            document.querySelector(".img-popup_img-container > img").style.cssText = " ";
            document.querySelector(".img-popup_img-container > video").style.cssText = "display:none";
            document.querySelector(".img-popup_img-container > img").setAttribute('src',"assets/images/"+gallery[current_img].image);
            document.querySelector(".img-popup_img-container > img").setAttribute('alt',gallery[current_img].title);
        }else{
            document.querySelector(".img-popup_img-container > img").style.cssText = "display:none";
            document.querySelector(".img-popup_img-container > video").style.cssText = " ";
            document.querySelector(".img-popup_img-container > video").setAttribute('src',"assets/images/"+gallery[current_img].video);
            document.querySelector(".img-popup_img-container > video").setAttribute('alt',gallery[current_img].title);
        }
    }
}

/*Pour afficher l'image suivante dans la lightbox */
function next_img(){
    if(current_img < gallery.length-1){
        current_img++;
        if(gallery[current_img].image){
            document.querySelector(".img-popup_img-container > img").style.cssText = " ";
            document.querySelector(".img-popup_img-container > video").style.cssText = "display:none";
            document.querySelector(".img-popup_img-container > img").setAttribute('src',"assets/images/"+gallery[current_img].image);
            document.querySelector(".img-popup_img-container > img").setAttribute('alt',gallery[current_img].title);
        }else{
            document.querySelector(".img-popup_img-container > img").style.cssText = "display:none";
            document.querySelector(".img-popup_img-container > video").style.cssText = " ";
            document.querySelector(".img-popup_img-container > video").setAttribute('src',"assets/images/"+gallery[current_img].video);
            document.querySelector(".img-popup_img-container > video").setAttribute('alt',gallery[current_img].title);
        }
    }
}

/*Pour ajouter ou enlever un like*/
function addRemoveLike(e){
    let index = e.id.split('_');
    index = parseInt(index[index.length-1]);
    if(e.dataset.liked == "false"){
        gallery[index].likes++;
        total_likes++;
        document.querySelector("#heart_"+index).dataset.liked = "true";
    }
    else{
        gallery[index].likes--;
        total_likes--;
        document.querySelector("#heart_"+index).dataset.liked = "false";
    }
    document.querySelector("#like_container_"+index + " > div").textContent = gallery[index].likes;
    document.querySelector(".total_likes").textContent = total_likes;
}

/*Fonctions d'accessibilité*/
/*Pour fermer les modales lorsque l'on clique sur echap*/
window.onkeydown = function closeWindow(e){
    if(e.key == "Escape"){
        close_imgPopup();
        let modal = document.getElementById("contact_modal");
        modal.style.display = "none";
    }
    if(lightBoxOpened){
        if(e.key == "ArrowLeft"){
            previous_img();
        }
        else if(e.key == "ArrowRight"){
            next_img();
        }
    }
}

