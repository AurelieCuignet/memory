<?php

namespace App\Controllers;

use App\Models\Score;

class MainController extends CoreController
{

    /**
     * Méthode s'occupant de la page d'accueil
     *
     * @return void
     */
    public function home()
    {
        /* $scoreList = Score::findAll(); */
        $this->show('home'/* , json_encode($scoreList) */);
        /* header('Content-Type: text/json; charset=UTF-8');

        echo json_encode($scoreList); */
    }

    
}
