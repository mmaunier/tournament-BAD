# Générateur de Matchs de Badminton en Double

Ce projet est un générateur de matchs de badminton en double, conçu pour organiser des tournois de manière efficace et équitable. Il permet de créer des matchs en maximisant le temps de jeu et en générant un maximum de rencontres entre les joueurs.

## Fonctionnalités

- Génération automatique de matchs de badminton en double (Ronde Suisse, **maximum 56 joueurs**).
- On ne joue qu'une fois avec le même joueur et au plus 3 fois (normalement) avec le même adversaire.
- Gestion des "sortants" en fonction du nombre de terrains (on essaye d'approcher le nombre moyen de match).
- Algorithmes avancés pour optimiser la répartition des joueurs (très dépendant du nombre de terrains et du nombre de tours à générer).
- Utilisation d'une base de rotation (fichier _import.js_) pour gagner du temps lors de la fabrication des tours.

## Installation

   Clonez le dépôt :

   ```bash
   git clone https://github.com/mmaunier/tournament-BAD
   cd tournament-BAD
   ```

## Utilisation

   Ouvrez le fichier `index.html` avec votre navigateur pour voir la page d'accueil.

## Dépot Original

   Ce dépôt est un fork du dépôt original [orykami/badminton-tournament](https://github.com/orykami/badminton-tournament). Merci aux auteurs originaux pour leur travail.


## Licence

   Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Todo List du Projet

- [ ] Implémenter la fonction de remplacement de joueurs en cours de tournoi
- [ ] Implémenter l'affichage (sans exportation) du nombre de matchs joués par chaque joueur sur l'ensemble du tournoi 
- [ ] Bug : Empêcher l'échange de joueur en dehors du tournoi 
- [ ] Améliorer le fichier _import.js_
- [x] Bug : Corriger le calcul des handicaps
- [x] Ajouter l'exportation du tournoi vers un fichier .xlsx   