const utils = {
    
    shuffleArray: function(arr) {
        // l'algo utilisé ici est la version moderne de l'algorithme de mélange de Fisher-Yates
        // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
        // on prend le dernier élément du tableau (i = arr.length - 1)
        // puis on l'intervertit avec un autre élément pris au hasard grâce à Math.random() : la formule utilisée renvoie un chiffre entre 0 et l'élément juste avant celui qu'on est en train de traiter (i)
        // on ne retouche pas aux éléments déjà traités, car i est mis à jour en le décrémentant. Pour un tableau de 28 éléments, i vaudra donc 27, puis 26, 25, etc. Les éléments en fin de tableau après l'index i courant ne sont donc plus intervertis.
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            // la syntaxe ES6 permet d'inverser deux valeurs simplement
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    },

    /**
     * Affiche un message textuel dans un div dédié 
     * @param {string} message 
     * @param {boolean} clear le message entrant écrase le précédent par défaut. Passez l'argument "false" pour empiler les messages dans le div
     */
    displayMessage: function(message, clear = true) {
        const messageDiv = document.querySelector('#message');
        if (!clear) {
            messageDiv.innerHTML += '<br>';
            messageDiv.innerHTML += message;
        } else {
            messageDiv.innerHTML = message;
        }
    },

    /**
     * Convertit une durée exprimée en millisecondes pour l'afficher sous la forme mm:ss.ms
     * @param {number} milliseconds 
     * @returns 
     */
    toMinutesAndSeconds: function(milliseconds) {
        const totalSeconds = milliseconds/1000;
        const mseconds = Math.round((milliseconds % 1000)/10);
        const seconds = Math.floor(totalSeconds % 60);
        const minutes = Math.floor(totalSeconds / 60);
    
        return `${utils.padTo2Digits(minutes)}:${utils.padTo2Digits(seconds)}.${mseconds}`;
    },
    
    /**
     * Rajoute un 0 initial si le chiffre est inférieur à 10
     * @param {number} num 
     * @returns 
     */
    padTo2Digits: function(num) {
        return num.toString().padStart(2, '0');
    }
}