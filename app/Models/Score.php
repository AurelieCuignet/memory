<?php

namespace App\Models;

use App\Utils\Database;
use JsonSerializable;
use PDO;

/**
 * Un modèle représente une table (un entité) dans la BDD
 *
 * Un objet issu de cette classe réprésente un enregistrement dans cette table
 */
class Score implements JsonSerializable
{
    // Les propriétés représentent les champs
    // Attention il faut que les propriétés aient le même nom (précisément) que les colonnes de la table

    /**
     * @var int
     */
    protected $id;
    /**
     * @var int
     */
    protected $difficulty;
    /**
     * @var string
     */
    protected $created_at;
    /**
     * @var string
     */
    protected $username;
    /**
     * @var int
     */
    protected $total_time;

    public function jsonSerialize() {
        return [
            'id' => $this->getId(),
            'difficulty' => $this->getDifficulty(),
            'total_time' => $this->getTotalTime(),
            'username' => $this->getUsername()
        ];
    }
    /**
     * Méthode permettant de récupérer tous les enregistrements de la table score
     *
     * @return Score[]
     */
    static public function findAll()
    {
        $pdo = Database::getPDO();
        $sql = '
            SELECT * FROM `score`
            ORDER BY total_time ASC, difficulty DESC
        ';
        $pdoStatement = $pdo->query($sql);
        $results = $pdoStatement->fetchAll(PDO::FETCH_CLASS, 'App\Models\Score');

        return $results;
    }

    
    public function insert()
    {
        // Récupération de l'objet PDO représentant la connexion à la DB
        $pdo = Database::getPDO();

        $sql = "
            INSERT INTO `score` (username, total_time, difficulty)
            VALUES (:username, :total_time, :difficulty)
        ";

        $pdoStatement = $pdo->prepare($sql);
        $isNameBound = $pdoStatement->bindValue(':username', $this->username, PDO::PARAM_STR);
        $isNameBound = $pdoStatement->bindValue(':total_time', $this->total_time, PDO::PARAM_STR);
        $isNameBound = $pdoStatement->bindValue(':difficulty', $this->difficulty, PDO::PARAM_STR);
        $insertedRows = $pdoStatement->execute();


        // Execution de la requête d'insertion

        // Si au moins une ligne ajoutée
        if ($insertedRows > 0) {
            // Alors on récupère l'id auto-incrémenté généré par MySQL
            $this->id = $pdo->lastInsertId();

            // On retourne VRAI car l'ajout a parfaitement fonctionné
            return true;
            // => l'interpréteur PHP sort de cette fonction car on a retourné une donnée
        }

        // Si on arrive ici, c'est que quelque chose n'a pas bien fonctionné => FAUX
        return false;
    }

    

    /**
     * Get the value of id
     *
     * @return  int
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * Get the value of difficulty
     *
     * @return  int
     */
    public function getDifficulty(): ?int
    {
        return $this->difficulty;
    }

    /**
     * Get the value of created_at
     *
     * @return  string
     */
    public function getCreatedAt(): string
    {
        return $this->created_at;
    }
    /**
     * Get the value of username
     *
     * @return  string
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * Get the value of total_time
     *
     * @return  string
     */
    public function getTotalTime()
    {
        return $this->total_time;
    }

    /**
     * Set the value of username
     *
     * @param  string  $username
     */
    public function setUsername(string $username)
    {
        $this->username = $username;
    }


    /**
     * Set the value of total_time
     *
     * @param  string  $total_time
     */
    public function setTotalTime(string $total_time)
    {
        $this->total_time = $total_time;
    }

    /**
     * Set the value of difficulty
     *
     * @param  string  $total_time
     */
    public function setDifficulty(string $difficulty)
    {
        $this->difficulty = $difficulty;
    }


    
}
