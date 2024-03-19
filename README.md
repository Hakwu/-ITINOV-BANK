# Banque Itinov

## Pour lancer le projet

1. Dans le dossier `Banque_Itinov`, exécutez la commande suivante pour démarrer l'instance Docker :
    ```
    docker compose up -d
    ```

2. Une fois l'instance Docker mise en place, veuillez compléter le fichier de configuration `application.properties` de l'application Spring :
    ```
    spring.data.mongodb.host=IP_LOCALHOST
    ```

3. Vous pouvez maintenant lancer le backend du projet toujours dans le dossier `Banque_Itinov`.

4. Une fois le backend lancé, rendez-vous dans le dossier `Front_Itinov`, puis exécutez les commandes suivantes pour installer les dépendances et démarrer l'application frontend :
    ```
    npm install
    npm run start
    ```

5. Le projet est maintenant complètement initialisé et vous pouvez commencer à l'utiliser.

## Technologies Utilisées

- Base de données : Docker : image MongoDB + image Mongo-Express - port 8081
- Front-end : React.js - port3000
- Back-end : Java Spring Boot - port 8080

---

N'oubliez pas de remplacer `IP_LOCALHOST` par l'adresse IP locale de votre instance Docker MongoDB. Assurez-vous également d'avoir Docker installé sur votre système avant de démarrer le projet.

Ce README fournit des instructions de base pour démarrer le projet, ainsi que des informations sur les technologies utilisées. N'hésitez pas à me recontacter s'il y a besoin.

En vous remerciant pour votre temps.
