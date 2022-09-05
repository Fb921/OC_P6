function photographerFactory(data) {
    const { name, portrait, city, country, tagline, price, id } = data;
    const picture = `assets/photographers/${portrait}`;

    /*Pourquoi créer le contenu de la page en js ?*/
    function getUserCardDOM() {
        /*On crée les éléments et leurs attributs*/
        const article = document.createElement( 'article' );
        const link = document.createElement( 'a' );
        link.setAttribute("href","photographer.html?id="+id);
        const div = document.createElement('div');
        div.setAttribute('class',"article_img-container");
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture);
        img.setAttribute("alt", "Fisheye Home Page");
        const h2 = document.createElement( 'h2' );
        const div1 = document.createElement( 'div' );
        div1.setAttribute("class", "location");
        const div2 = document.createElement( 'div' );
        div2.setAttribute("class", "tagline");
        const div3 = document.createElement( 'div' );
        div3.setAttribute("class", "price");

        /*On injecte du contenu dans ces éléments nouvellement créé*/
        h2.textContent = name;
        div1.textContent = city+", "+country;
        div2.textContent = tagline;
        div3.textContent = price+"€/jour";

        /*On défini la dépendances des éléments les uns des autres*/
        div.appendChild(img);
        link.appendChild(div);
        link.appendChild(h2);
        article.appendChild(link);
        article.appendChild(div1);
        article.appendChild(div2);
        article.appendChild(div3);
        return (article);
    }
    return { name, picture, getUserCardDOM }
}

function imageFactory(data,id) {
    const { title, image, likes, video } = data;
    let picture;
    if(!image){
        picture = `assets/images/${video}`;
    }else{
        picture = `assets/images/${image}`;
    }

    /*Pourquoi créer le contenu de la page en js ?*/
    function getUserCardDOM() {
        let article = document.createElement("article");
        article.setAttribute("class","gallery_element");
        let img_container = document.createElement("div");
        img_container.setAttribute("class","gallery_img-container");
        let img;
        if(picture.indexOf('mp4') > -1){
            img = document.createElement("video");
        }else{
            img = document.createElement("img");
        }
        img.setAttribute('src',picture);
        img.setAttribute('class',"gallery_img");
        img.setAttribute("alt","Lilac breasted roller, closeup view");
        img.setAttribute("contenteditable","true");
        img.setAttribute('data-position',id);
        img.onclick = function(){display_imgPopup(img)};
        img.onkeydown = function unf(e){if(e.code == "Enter"){display_imgPopup(img)}};
        let desc_container = document.createElement('div');
        desc_container.setAttribute("class","desc_container");
        let g_title = document.createElement("div");
        g_title.textContent = title;
        let like_container = document.createElement("div");
        like_container.setAttribute("class","like_container");
        like_container.setAttribute("id","like_container_"+id);
        let number_like = document.createElement("div");
        number_like.textContent = likes;
        //total_likes += likes;
        let heart = document.createElement("div");
        heart.setAttribute('aria-label',"likes");
        heart.setAttribute("id","heart_"+id);
        heart.setAttribute("data-liked","false");
        heart.onclick = function(){addRemoveLike(heart);}
        heart.innerHTML = "<i class='fas fa-heart'></i>";

        like_container.appendChild(number_like);
        like_container.appendChild(heart);
        desc_container.appendChild(g_title);
        desc_container.appendChild(like_container);
        img_container.appendChild(img);
        article.appendChild(img_container);
        article.appendChild(desc_container);
        return (article);
    }
    return { picture, getUserCardDOM }
}