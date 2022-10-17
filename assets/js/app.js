const app = {
    cards: [], // tableau contenant toutes les cartes utilisées pour le jeu courant
    nbPairs: 7, // nombre de paires utilisées (peut être modifié pour une difficulté différente)
    timer: 10000, // temps de jeu en millisecondes (modifiable en fonction de la difficulté)
    cardOne: null,
    cardTwo: null,
    foundPairs: 0, // paires trouvées pendant la partie
    cardTimeoutId: null,
    nbRounds: 0, // cette variable n'est qu'informative (non stockée en BDD), elle pourrait être utilisée pour départager des scores identiques pour la même difficulté
    username: '', 
    startTime: null, // heure de démarrage de la partie
    timerId: null,

    init: function() {
        console.log('initialisation');

        // on crée les listeners sur les boutons
        const beforeGameForm = document.querySelector('#settings form.form');
        beforeGameForm.addEventListener('submit', app.handleSubmit);
         
    },

    handleSubmit: function(event) {
        // on bloque le comportement par défaut du formulaire, pour éviter le rechargement de la page
        event.preventDefault();
    
        // on récupère les infos fournies (username et difficulty)
        const userInput = document.querySelector('#username').value;
        const difficulty = document.querySelector('#difficulty').value; 

        // Le pseudo étant un champ de saisie, cela nécessite des vérifications de sécurité ! (pour éviter les failles XSS et injections SQL par exemple )
        // ici, on limite les caractères utilisables pour un pseudo à l'aide d'une expression régulière
        const regex = new RegExp('^[a-zA-Z0-9]{3,20}$'); // lettres minuscules et majuscules, chiffres, entre 3 et 20 caractères
        
        if(regex.test(userInput)){
            // la fonction test renvoie true si la chaîne testée correspond au pattern, false sinon
            // on peut donc lancer le jeu
            app.initData(userInput, difficulty);
                
        } else {
            alert(`Peux-tu vérifier ton petit nom avant de commencer s'il te plaît ? 🙏\nUniquement majuscules et minuscules non accentuées et chiffres, entre 3 et 20 caractères. Merci 😊`);
        }
        
    },

    initData: function(username, difficulty) {
        // on réinitialise les propriétés du module, au cas où on relance une partie
        app.cards.length = 0; // on vide le tableau de cartes
        document.querySelector('#board').innerHTML = ""; //on vide le plateau de jeu
        app.cardOne = null;
        app.cardTwo = null;
        app.foundPairs = 0;
        app.cardTimeoutId = null;
        app.gameTimeoutId = null,
        app.nbRounds = 0;

        app.difficulty = difficulty;
        app.username = username;

        // on change la largeur de la zone de jeu en fonction de la difficulté
        // pour avoir un rectangle parfait
        const boardSection = document.querySelector('#board');

        switch (difficulty) {
            // timer en millisecondes
            // ultra facile (mode test)
            case "1":
                app.timer = 10000;
                app.nbPairs = 3;
                boardSection.style.maxWidth = "350px";
                break;
            // facile
            case "2":
                app.timer = 90000;
                app.nbPairs = 10;
                boardSection.style.maxWidth = "650px";
                break;
            // difficile
            case "4":
                app.timer = 60000;
                app.nbPairs = 18;
                boardSection.style.maxWidth = "700px";
                break;
            // cauchemar
            case "5":
                app.timer = 10000;
                app.nbPairs = 7;
                boardSection.style.maxWidth = "850px";
                break;
            // difficulté normale / par défaut
            case "3":
            default:
                app.difficulty = "3";
                app.timer = 90000;
                app.nbPairs = 14;
                boardSection.style.maxWidth = "850px";
        }
        
        // on cache le formulaire d'avant jeu
        document.querySelector('#settings').style.display = 'none';

        // on affiche le plateau de jeu et le timer
        document.querySelector('#board').style.display = 'flex';
        document.querySelector('#timer').style.display = 'block';
        // tout est prêt, on peut lancer la partie
        app.startGame();
    },

    startGame: function() {
        app.createCards();
        app.drawBoard();
        app.startTimer(app.timer);
    },

    createCards: function() {
        let isPaired = false; // vaudra true quand on aura créé dans le tableau de cartes une 2e carte avec le même motif
        let patternIndex = 0; // index du motif de la carte dans la bande cards.png (de 0 à 17 dans notre cas)
        
        // Remplissage du tableau de cartes
        // la condition de sortie n'utilise pas l'index de boucle mais compare l'index du pattern au nombre de paires souhaitées (si 14 paires, on a besoin des patterns de 0 à 13)
        for (let i = 0; patternIndex < app.nbPairs; i++) {
    
            // on ajoute la carte au tableau
            //app.cards.push({pattern:patternIndex, card: `card${i}`});
            app.cards.push(patternIndex);
        
            // si on vient de compléter une paire (= créé une 2e carte avec le même motif), isPaired vaut true
            if (isPaired) { 
                // alors on passe au motif suivant
                patternIndex++;
            } 
            // dans tous les cas, on met à jour l'info de paire
            isPaired = !isPaired;
        }

        // lorsque toutes les cartes sont créées, on les mélange
        utils.shuffleArray(app.cards);
    },

    drawBoard: function() {
        // on récupère le div qui contiendra les cartes
        const boardSection = document.querySelector('#board');
        // on parcourt le tableau des cartes pour les ajouter une par une au plateau
        for (let card = 0 ; card < app.cards.length ; card++) {
            // pour chaque carte, on appelle la fonction qui ajoute le noeud au DOM
            app.drawCard(boardSection, card);
        }
        // quand toutes les cartes sont en place, on place un écouteur sur le plateau
        boardSection.addEventListener('mousedown', app.handleBoardClick);
    },

    drawCard: function(board, card) {
        // on duplique le template dans le HTML pour créer la carte
        const cardDiv = document.querySelector("#newCard").content.cloneNode(true);
        const newCardNode = cardDiv.firstElementChild; // pour récupérer le div et pas le DocumentFragment
        // on met à jour l'attribut data-index, qui servira à récupérer dans le tableau de cartes le motif correspondant
        newCardNode.dataset.index = card;
        
        // on ajoute le noeud au DOM
        board.appendChild(newCardNode);
    },

    handleBoardClick: function(evt) {
        // l'écouteur d'événement est placé sur l'élément #board
        // pour récupérer la carte cliquée, on utilise evt.target
        // si on utilisait evt.currentTarget, on récupèrerait l'élément #board
        const clickedCard = evt.target;
        
        if (clickedCard.dataset.active === "1") {
            // on vérifie d'abord qu'il n'y a pas un timeout en cours (si 2 cartes différentes sélectionnées sont en attente d'être masquées)
            // s'il y a un timeout, on force l'exécution de la fonction reinitCards() avant de poursuivre
            if (app.cardTimeoutId) {
                clearTimeout(app.cardTimeoutId);
                app.reinitCards();
            }
            // si la carte est "active", elle peut être sélectionnée, on poursuit
            
            // on peut calculer la position de l'image d'arrière-plan en fonction de la position du motif dans celle-ci
            // on  décale donc l'image de background pour afficher le motif correspond au data-index de la carte
            // En utilisant une notation de chaîne entre backticks ``, on peut utiliser des template literals : 
            // ce qui se trouve à l'intérieur du ${...} est interprété et ce qui se trouve à l'extérieur est affiché tel quel
            // cela permet de faire des opérations directement au sein d'une chaîne à afficher (on s'affranchit d'une variable intermédiaire), 
            // et ça évite de devoir échapper les apostrophes ou les guillemets !
            clickedCard.style.backgroundPositionY = `${app.cards[clickedCard.dataset.index] * -100}px`;

            // en notation "classique", cela donnerait :
            /* const bgPosition = app.cards[clickedCard.dataset.index] * -100;
            clickedCard.style.backgroundPositionY = bgPosition + 'px'; */

            // on  passe la carte en inactif
            clickedCard.dataset.active = "0";

            app.addCardToSelection(clickedCard);
        } else {
            // on arrive dans le else quand on clique sur une carte d'une paire déjà trouvée,
            // ou quand on clique... entre les cartes 😅
            console.log('%c------- CARTE INACTIVE', 'color: crimson; font-size: 15px');
        }

    },

    addCardToSelection: function(clickedCard) {
        // si le premier slot est vide, cela signifie que le joueur n'avait pas encore sélectionné de carte
        // on met la carte dans le premier slot et on ne fait rien de plus
        if (!app.cardOne) {
            app.cardOne = clickedCard;
        } else {
            // nous sommes dans le cas où le joueur sélectionne sa 2e carte. Il faut donc ensuite faire les vérifications
            app.cardTwo = clickedCard;
            app.checkPair();
        }
    },

    checkPair: function() {
        // on met à jour le compteur de tours
        app.nbRounds++;
        utils.displayMessage(`Coups joués : ${app.nbRounds}`);
        // si les deux cartes ont le même motif, alors une paire a été trouvée !
        if(app.cards[app.cardOne.dataset.index] === app.cards[app.cardTwo.dataset.index]) {
            // on laisse les deux cartes face visible
            // on ajoute un point au compteur global (foundPairs)
            app.foundPairs++;
            // on vide les deux slots de sélection
            app.cardOne = null;
            app.cardTwo = null;

            // on vérifie si le jeu est terminé 
            if(app.foundPairs == app.nbPairs) {
                // si (compteur == nbPairs) alors la partie est gagnée
                app.gameEnding('victory');
            }
                // sinon on laisse le joueur poursuivre
        }
            
        // sinon, les deux cartes sont différentes
        else {
            // le setTimeout permet de laisser les cartes affichées, le temps d'être mémorisées (mais pas trop longtemps quand même)
            app.cardTimeoutId = setTimeout(app.reinitCards, 1000);
        }      
    },

     /**
     * Cette fonction gère la fin de jeu et la possibilité de redémarrer une partie
     * @param {String} result  "victory" ou "defeat"
     */
      gameEnding: function(result) {
        
        // si victoire
        if(result === 'victory') {
            // on affiche le temps, le nombre de coups, les félicitations du jury    
            // on récupère le temps de jeu en soustrayant l'heure actuelle à l'heure stockée en début de partie
            // on obtient une durée en millisecondes
            const gameDuration =  Date.now() - app.startTime;
            
            // le timerId contient une valeur tant que le temps n'est pas écoulé, on l'utilise pour arrêter le chrono
            if(app.timerId) clearInterval(app.timerId);
            
            // gameDuration sera stocké en BDD pour afficher ensuite les high scores. 
            // On le stocke sous sa forme de millisecondes, pour pouvoir faire un tri lors de la requête à la BDD
            //todo save score in BDD
            
            // et on formatera le résultat pour l'affichage comme ci-dessous
            utils.displayMessage(`Partie terminée en  <b>${utils.toMinutesAndSeconds(gameDuration)}</b> (${app.nbRounds} coups joués)`);
            alert(`Gagné ! Bravo ${app.username} 🥳`);

        } else {
             // si défaite, on affiche un message Perdu
            utils.displayMessage(`Zut, plus de temps... 😕 <br>On réessaye ? 😁`);
            // on enregistre le score en BDD, en utilisant le timer défini au début, la fonction setInterval() n'étant pas hyper précise...
            // mais finalement, est-ce bien utile d'enregistrer les défaites ? 🤔
            //todo save score in BDD
        }

        //dans tous les cas       
        // on désactive le plateau de jeu (retrait de l'écouteur) pour ne pas pouvoir continuer la partie après la fin du temps
        document.querySelector('#board').removeEventListener('mousedown', app.handleBoardClick);

    },

    /**
     * Cette fonction réinitialise les deux cartes sélectionnées si elles ne sont pas identiques.
     * @param {Element} card1 
     * @param {Element} card2 
     */
    reinitCards: function() {
        // il faut vider l'id du setTimeout, car cette fonction reinitCards() peut être appelée avant que setTimeout() se termine de lui-même
        app.cardTimeoutId = null;
        // on les retourne face cachée (en modifiant la position du background)
        app.cardOne.style.backgroundPositionY = "100px";
        app.cardTwo.style.backgroundPositionY = "100px";
        // on "réactive" l'event en réactivant la carte (data-active repasse à 1)
        app.cardOne.dataset.active = "1";
        app.cardTwo.dataset.active = "1";

        // enfin, on vide les deux slots de sélection
        app.cardOne = null;
        app.cardTwo = null;
    },

    startTimer: async function(timer) {
        app.startTime = Date.now()
        app.fillProgressBar(timer);
    },

    fillProgressBar: function(timer) {
        // On calcule un taux de rafraichissement basé sur le timer, pour que la progression de la barre ne soit pas trop saccadée
        timer = timer/10;

        // on récupère le div qui sert à remplir la barre de progression, et on va modifier sa largeur en fonction du temps qui passe
        const timerBar = document.querySelector('#timer > .progressbar > .filler');
        let width = 0; //largeur initiale du div de remplissage
        let delta; // va stocker la différence entre l'heure actuelle et l'heure à laquelle la partie a démarré
        app.timerId = setInterval(updateBar, 10); // setInterval() permet d'éxécuter du code de manière récurrente, ici toutes les 10 ms
        function updateBar() {
            if (delta >= timer) {
                // lorsque la différence entre la date de début et la date actuelle est égale au temps choisi pour la partie, on met fin à setInterval()
                clearInterval(app.timerId);
                app.gameEnding('defeat');
                alert('Owwwwww 😭');       
            } else {
                delta = Math.floor((Date.now() - app.startTime)/10);
                width = delta*100/timer;
                if (width > 100) width = 100; // sert à éviter que la barre ne dépasse les 100%
                timerBar.style.width = `${width}%`;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', app.init);