<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <link rel="stylesheet" href="assets/css/reset.css">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <title>Memory Game</title>
</head>
<body>
    <header>
        <h1 id="main-title">Jeu de mémoire</h1>
    </header>
    <main id="main">
        <section id="settings">
            <form class="form">
                <label for="username">Pseudo</label>
                <input type="text" name="username" id="username">
                <p>Lettres non accentuées et/ou chiffres, de 3 à 20 caractères.</p>
                <label for="difficulty">Difficulté</label>
                <select id="difficulty" name="difficulty">
                    <option value="">Par défaut</option>
                    <option value="1">Ultra facile</option>
                    <option value="2">Facile</option>
                    <option value="3">Normal</option>
                    <option value="4">Difficile</option>
                    <option value="5">Cauchemar</option>
                </select>
                <button>Lancer une partie</button>
            </form>
            <aside id="scores">
                <h2>Meilleurs scores <span>mm:ss.ms (difficulté)</span></h2>
                <ul></ul>
            </aside>
        </section>
        
        <section id="board">
        </section>
        <footer id="timer">
            <div class="progressbar">
                <div class="filler" style="width: 0%"></div>
            </div>    
        </footer>
    </main>
    
    <footer>
        <div id="message">        
        </div>
        <button id="playagain">Rejouer</button>
    </footer> 
    <template id="newCard">
        <div class="card" data-active="1" data-index=""></div>
    </template>
    <script src="../../assets/js/utils.js"></script>
    <script src="../../assets/js/api.js"></script>
    <script src="../../assets/js/app.js"></script>
</body>
</html>