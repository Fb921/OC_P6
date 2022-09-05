    async function getPhotographers() {
        // Penser à remplacer par les données récupérées dans le json
        //Pourquoi const au lieu de var ?
        const photographers1 = [
            {
                "name": "Mimi Keel",
                "id": 243,
                "city": "London",
                "country": "UK",
                "tagline": "Voir le beau dans le quotidien",
                "price": 400,
                "portrait": "MimiKeel.jpg"
                // "portrait": "mimi-keel.png"
            },
            {
                "name": "Ellie-Rose Wilkens",
                "id": 930,
                "city": "Paris",
                "country": "France",
                "tagline": "Capturer des compositions complexes",
                "price": 250,
                "portrait": "EllieRoseWilkens.jpg"
                // "portrait": "ellie-rose-wilkens.png"
            },
        ]
        const photographers2 = [
            {
                "name": "Tracy Galindo",
                "id": 82,
                "city": "Montreal",
                "country": "Canada",
                "tagline": "Photographe freelance",
                "price": 500,
                "portrait": "TracyGalindo.jpg"
                // "portrait": "tracy-galindo.png"
            },
            {
                "name": "Nabeel Bradford",
                "id": 527,
                "city": "Mexico City",
                "country": "Mexico",
                "tagline": "Toujours aller de l'avant",
                "price": 350,
                "portrait": "NabeelBradford.jpg"
                // "portrait": "nabeel-bradford.png"
            },
        ]
        const photographers3 = [
            {
                "name": "Rhode Dubois",
                "id": 925,
                "city": "Barcelona",
                "country": "Spain",
                "tagline": "Je crée des souvenirs",
                "price": 275,
                "portrait": "RhodeDubois.jpg"
                // "portrait": "rhode-dubois.png"
            },
            {
                "name": "Marcel Nikolic",
                "id": 195,
                "city": "Berlin",
                "country": "Germany",
                "tagline": "Toujours à la recherche de LA photo",
                "price": 300,
                "portrait": "MarcelNikolic.jpg"
                // "portrait": "marcel-nikolic.png"
            },
        ]
        // et bien retourner le tableau photographers seulement une fois
        return ({
            photographers: [...photographers1, ...photographers2, ...photographers3]})
    }

    /*Pourquoi async ?*/
    async function displayData(photographers) {
        /*On récupère la section destinée à récupéré les infos des photographes */
        const photographersSection = document.querySelector(".photographer_section");

        /*On rajoute les articles avec les infos des photographes */
        photographers.forEach((photographer) => {
            const photographerModel = photographerFactory(photographer);
            /*Retourne l'article nouvellement créé */
            const userCardDOM = photographerModel.getUserCardDOM();
            photographersSection.appendChild(userCardDOM);
        });
    };

    async function init() {
        // Récupère les datas des photographes
        /*await dans une fonction async permet d'attendre la résolution de la "Promise" (ici getPhotographers())*/
        /* Est ce utile si getPhotographers n'est pas async ? */
        const { photographers } = await getPhotographers();
        displayData(photographers);
    };
    
    init();
    