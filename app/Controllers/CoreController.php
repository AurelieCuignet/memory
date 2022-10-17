<?php

namespace App\Controllers;

abstract class CoreController
{
    /**
     * Méthode permettant d'afficher du code HTML en se basant sur les views
     *
     * @param string $viewName Nom du fichier de vue
     * @param array $viewData Tableau des données à transmettre aux vues
     * @return void
     */

    public function show($viewName, $viewData = []) {
        require_once __DIR__ . '/../views/' . $viewName . '.tpl.php';
    }

    /**
     * Permet de renvoyer des données au format JSON
     *
     * @param [type] $data
     * @return void
     */
    public function renderJson($data)
    {
        header('Content-Type: application/json');
        header("Access-Control-Allow-Origin: http://memory.local");
        echo json_encode($data);
    }
}
