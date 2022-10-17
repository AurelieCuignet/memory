<?php

namespace App\Controllers;

use App\Models\Score;

class ScoreController extends CoreController
{
    /**
     * Méthode gérant la page affichant la liste des catégories
     *
     * @return void
     */
    public function list()
    {
        $scoreList = Score::findAll();

        return $this->renderJson($scoreList);
    }


    /**
     * Ajoute un score à la base de données
     *
     * @return void
     */
    public function add() {
        
        // les infos sont reçues depuis le front au format JSON en POST
        // mais contrairement aux données envoyées par un formulaire, les données au format JSON ne sont pas dans la variable globale $_POST
        // pour les récupérer, on utilise la fonction ci-dessous
        $json = file_get_contents('php://input');
        // (voir https://www.geeksforgeeks.org/how-to-receive-json-post-with-php/ et https://www.php.net/manual/en/wrappers.php.php pour plus d'infos)
        //dump($json);
        $json = json_decode($json);
        if(!empty($json)) {
            $scoreObject = new Score();
            $scoreObject->setUsername(filter_var($json->username, FILTER_SANITIZE_SPECIAL_CHARS));
            $scoreObject->setTotalTime(filter_var($json->total_time, FILTER_VALIDATE_INT));
            $scoreObject->setDifficulty(filter_var($json->difficulty), FILTER_VALIDATE_INT);

            $isInsertOk = $scoreObject->insert();
        } else {

        }

       if($isInsertOk) {
            // on renvoie au front l'enregistrement qui vient d'être créé
            return $this->renderJson($scoreObject);
        } else {
            echo "error";  
        }

    }

    
}