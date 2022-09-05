//On récupère les information du photographe
var photographer_id;
var paramString = window.location.href.split('?')[1];
var queryString = new URLSearchParams(paramString);
var display_menu_trier_par = false;
var n=0;

for (let param of queryString.entries()) {
    photographer_id = param[1];
}
/*On récupère les infos des photographes */
var xhttp = new XMLHttpRequest();

xhttp.open("GET", "./data/photographers.json", false);
xhttp.send();
var photographer_infos;
const response = JSON.parse(xhttp.responseText);
response["photographers"].forEach( p => {
    if(p.id == photographer_id){
      photographer_infos = p;
    }});

/*On charge le contenu de la page */

/*Le nom du photographe dans le modal */
document.querySelector(".modal-photographer-name").textContent = photographer_infos["name"];

/*Bloc/Header informations */
const contact_button = document.querySelector('.contact_button');
const photograph_header = document.querySelector('.photograph-header');
const div_infos = document.createElement('div');
const div_button = document.createElement('div');
const div_photo = document.createElement('div');

/*Création du contenu informations */
const name_container = document.createElement('h1');
name_container.textContent = photographer_infos["name"];
const location_container = document.createElement('div');
location_container.textContent = photographer_infos['city']+", "+photographer_infos["country"];
const tagline_container = document.createElement('div');
tagline_container.textContent = photographer_infos['tagline'];

/*Création du contenu photo de profil */
const photo_container = document.createElement("img");

photo_container.setAttribute("src","./assets/photographers/"+photographer_infos['portrait']);
photo_container.setAttribute("alt",photographer_infos['name']);

div_infos.appendChild(name_container);
div_infos.appendChild(location_container);
div_infos.appendChild(tagline_container);
div_button.appendChild(contact_button);
div_photo.appendChild(photo_container);
photograph_header.appendChild(div_infos);
photograph_header.appendChild(div_button);
photograph_header.appendChild(div_photo);

console.log(response["media"]);


/* La galerie d'images */
//Ces variables permettront de faire tourner les images dans l'éventail d'image
var gallery_images = [];
var current_img = 0;
var total_likes = 0;
var gallery = [];
var gallery_sorted_by_date = [];
var gallery_sorted_by_title = [];
var gallery_sorted_by_popularity = [];
const gallery_container = document.createElement('div');
gallery_container.setAttribute("class","gallery_container");

/*On parcoure l'ensemble des données d'image */
for(let i=0;i<response['media'].length;i++){
    /*Si l'id du photographe de l'image correspond à l'id du photographe courant*/
    if(photographer_id == response["media"][i]["photographerId"]){
        gallery.push(response["media"][i]);
        /*On récupère les infos dont on a besoin et on les met dans un objet qu'on met dans un tableau */
        /*On a besoin du title, de l'url de l'image, et du nombre de like*/
        /*La position de l'image dans le tableau sera l'ordre dans lequel elle sera affichée */
        let image_e = imageFactory(response["media"][i],(gallery.length-1));
        gallery_container.appendChild(image_e.getUserCardDOM());
        // console.log("image_e");
        total_likes+=response["media"][i].likes;
    }
}

document.querySelector("main").appendChild(gallery_container);

/* Le petit bloc d'infos*/
document.querySelector('.total_likes').textContent = total_likes;
document.querySelector('.price_container').textContent = photographer_infos['price'];

document.querySelector("button[aria-label='Next image']").onkeydown = function unf(e){if(e.code == "Enter"){next_img()}};
document.querySelector("button[aria-label='Previous image']").onkeydown = function unf(e){if(e.code == "Enter"){previous_img()}};
document.querySelector("button[aria-label='Close dialog']").onkeydown = function unf(e){if(e.code == "Enter"){close_imgPopup()}};

/* POur afficher la popup d'images */
function display_imgPopup(e){
    if(e.src.indexOf("mp4") < 0){
        document.querySelector(".img-popup_img-container > img").style.cssText = " ";
        document.querySelector(".img-popup_img-container > video").style.cssText = "display:none";
        document.querySelector(".img-popup_img-container > img").setAttribute('src',e.src);
        document.querySelector(".img-popup_container").style.display = 'flex';
    }else{
        document.querySelector(".img-popup_img-container > img").style.cssText = "display:none";
        document.querySelector(".img-popup_img-container > video").style.cssText = " ";
        document.querySelector(".img-popup_img-container > video").setAttribute('src',e.src);
        document.querySelector(".img-popup_img-container > img").setAttribute('src',"");
        document.querySelector(".img-popup_container").style.display = 'flex';
    }
    current_img = parseInt(e.dataset.position);
}

/*Pour fermer la popup d'images */
function close_imgPopup(){
    document.querySelector(".img-popup_container").style.display = 'none';
}

function previous_img(){
    console.log("Dans la fonction previous");
    if(current_img > 0){
        current_img--;
        if(gallery[current_img].image){
            document.querySelector(".img-popup_img-container > img").style.cssText = " ";
            document.querySelector(".img-popup_img-container > video").style.cssText = "display:none";
            document.querySelector(".img-popup_img-container > img").setAttribute('src',"assets/images/"+gallery[current_img].image);
        }else{
            document.querySelector(".img-popup_img-container > img").style.cssText = "display:none";
            document.querySelector(".img-popup_img-container > video").style.cssText = " ";
            document.querySelector(".img-popup_img-container > video").setAttribute('src',"assets/images/"+gallery[current_img].video);
        }
    }
}
function next_img(){
    console.log('Dans la fonction next_img');
    if(current_img < gallery.length-1){
        current_img++;
        if(gallery[current_img].image){
            document.querySelector(".img-popup_img-container > img").style.cssText = " ";
            document.querySelector(".img-popup_img-container > video").style.cssText = "display:none";
            document.querySelector(".img-popup_img-container > img").setAttribute('src',"assets/images/"+gallery[current_img].image);
        }else{
            document.querySelector(".img-popup_img-container > img").style.cssText = "display:none";
            document.querySelector(".img-popup_img-container > video").style.cssText = " ";
            document.querySelector(".img-popup_img-container > video").setAttribute('src',"assets/images/"+gallery[current_img].video);
        }
    }
}

function display_trier_par_menu(e,action){
    if(action == 'c'){
        document.querySelector(".tri-option-list").dataset.openTrierMenu = "false";
        document.querySelector("#close-trier-menu-arrow").style.cssText = "display:none";
        document.querySelector("#open-trier-menu-arrow").style.cssText = "display:inline";
        console.log("close demande");
    }else{
        document.querySelector(".tri-option-list").dataset.openTrierMenu = "true";        
        document.querySelector("#open-trier-menu-arrow").style.cssText = "display:none";
        document.querySelector("#close-trier-menu-arrow").style.cssText = "display:inline";
        console.log("open demande");
    }
    
}

function getMinDate(tab){
    let min = tab[0];
    let pos = 0;
    let d1 = new Date(tab[0].date);
    console.log("length"+(tab.length-2));
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
function getMinTitle(tab){
    let min = tab[0];
    let arr = tab[0].title;
    let pos = 0;
    for(let i = 1; i < tab.length ;i++){
        let y = 0;
        let arr2 = tab[i].title;
        console.log(arr);
        console.log(arr2);
        while((y < arr.length) && (y < arr2.length)){
                // console.log("min = "+ arr[y] );console.log("->" +(arr[y].charCodeAt(y)) );console.log("y = "+y);
                // console.log("other = "+ arr2[y]);console.log("->" +arr2[y].charCodeAt(y) );

            if(arr.charCodeAt(y) < (arr2.charCodeAt(y))){
                console.log(arr + "wins !");
                console.log(y + ": y");
                break;
            }            
            else if(arr2.charCodeAt(y) < arr.charCodeAt(y)){
                min = tab[i];
                arr = tab[i].title;
                pos = i;
                console.log(arr2 + "wins !");
                console.log(y + ": y");
                break;
            }            
            y++;
        }
    }
    tab.splice(pos,1);
    return {"min":min,"tab":tab};
}
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
                console.log(gallery_sorted_by_popularity);
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
    gallery.forEach((e,y) => {
        console.log(y);
        let image_e = imageFactory(e,y);
        gallery_container.appendChild(image_e.getUserCardDOM());
    })
}

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

sort_img_by("p");
document.querySelector(".option1 button").onclick = function fonc(){sort_img_by("p")};
document.querySelector(".option2 button").onclick = function(){
    sort_img_by("d");
}
document.querySelector(".option3 button").onclick = function(){
    sort_img_by("t");
}

