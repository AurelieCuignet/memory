const api = {
    apiRootUrl: 'http://memory.local',
    fetchOptions: {
        // --- Toujours défini :
        // La méthode HTTP (GET, POST, etc.)
        method: 'GET',
    
        // --- Bonus (exemples) :
    
        // On utilisera souvent Cross Origin Resource Sharing qui apporte
        // une sécurité pour les requêtes HTTP effectuée avec XHR entre 2
        // domaines différents.
        mode: 'cors',
        // Veut-on que la réponse puisse être mise en cache par le navigateur ?
        // Non durant le développement, oui en production.
        cache: 'no-cache'
        
        // Si on veut envoyer des données avec la requête => décommenter et remplacer data par le tableau de données
        // , body : JSON.stringify(data)
    },
    transformJson: function(response) {
        //console.log("j'ai reçu une réponse mais j'ai besoin d'un objet JS")
        // On sait que la réponse est au format JSON (JavaScript Object Notation),
        // donc on transforme la réponse : conversion texte => objet JS
        return response.json();
    }
}