class Byes {
   /**
    * Une classe pour gérer les Byes
    * @param {Array} liste_byes - Une liste de liste des sortants à chaque Round
    * @param {number} nbTours - Nombre de tours
    */
   constructor(liste_byes, nbTours) {
      this.noeuds = [...liste_byes];
      for (let i = 0; i < this.noeuds.length; i++) {
         this.noeuds[i].unshift(i);
      }
      this.matriceAdj = [this.noeuds.pop()];
      this.nbTours = nbTours;
      this.poids = 0;
      //this.matCout = [0, 100, 20, 5, 4, 3, 2, 1, 1.5, 1.25, 1.15, 1.1, 1.05, 1, 0.95, 0.9, 0.85, 0.8, 0.75];
      this.matCout = [0, 100, 20, 7, 5, 4, 3, 2, 1.5, 1.25, 1.15, 1.1, 1.05, 1, 0.95, 0.9, 0.85, 0.8, 0.75];
      for (let i = 1; i < 51; i++) {
         this.matCout.push(0.75 - i / 80);
      }
      this.frequence = {}; // Nombre d'apparitions de chaque joueur
      this.positions = {}; // Positions de chaque joueur
   }

   /**
    * 
    * @param {Array} noeuds - Liste des sortants à chaque Round 
    */
   updateFrequence(noeuds) {
      this.frequence = {};
      this.positions = {};
      for (let i = 0; i < noeuds.length; i++) {
         for (let elem of noeuds[i].slice(1)) {
            if (!this.frequence[elem]) {
               this.frequence[elem] = 0;
               this.positions[elem] = [];
            }
            this.frequence[elem]++;
            this.positions[elem].push(i);
         }
      }
   }

   /**
    * Calcule le coût de la liste des sortants
    * @param {Array} noeuds - Liste des sortants à chaque Round
    * 
    * @return {number} - Le coût de la liste des sortants
    */
   cout(noeuds) {
      let couttotal = 0;
      this.updateFrequence(noeuds);
      for (let i = 0; i < noeuds.length; i++) {
         for (let j = i + 1; j < noeuds.length; j++) {
            const nbcommuns = noeuds[i].slice(1).filter(x => noeuds[j].slice(1).includes(x)).length;
            couttotal += nbcommuns * (this.matCout[j - i] + this.matCout[j]);
         }
      }
      for (let elem in this.frequence) {
          if (this.positions[elem].length === 1) {
            couttotal -= 100; // Bonification pour les joueurs apparaissant une seule fois
          }
         for (let i = 0; i < this.positions[elem].length - 1; i++) {
            const dist = this.positions[elem][i + 1] - this.positions[elem][i];
            const bonification = Math.min(dist * dist, 100); // Bonification pour les répétitions éloignées, avec un maximum de 100
            couttotal -= bonification; // Appliquer la bonification
         }
      }
      // Pénalité pour répartition des apparitions : plus un joueur apparaît près de nbTours, plus la pénalité est forte
      const players = Object.keys(this.frequence);
      // Calcul de la moyenne d'apparitions attendue
      const moyenne = (noeuds[0].length * this.nbTours) / players.length;
      for (const player of players) {
         const freq = this.frequence[player];
         let penalty = 0;
         const ecart = Math.abs(freq - moyenne);
         if (ecart>=0) {
            penalty = 300 * (ecart) / (this.nbTours - moyenne);
         }
         // Ajout de la pénalité (plus le coût, plus c'est mauvais)
         couttotal += penalty;
      }

      return couttotal;
   }

   coutInsertion(noeud, position, noeuds) {
      const matTemp = [...noeuds];
      matTemp.splice(position, 0, noeud);
      return this.cout(matTemp);
   }

   meilleureInsertion(noeud, noeuds) {
      let posTemp = 0;
      let coutTemp = Infinity;
      for (let i = 0; i <= noeuds.length; i++) {
         const coutCalc = this.coutInsertion(noeud, i, noeuds);
         if (coutCalc < coutTemp) {
            posTemp = i;
            coutTemp = coutCalc;
         }
      }
      return [posTemp, coutTemp];
   }

   calculeMeilleureInsertion(noeuds) {
      if (noeuds.length === 0) {
         throw new Error("Aucun noeud à insérer.");
      }
      
      let posMeilleur = 0;
      let coutMeilleur = Infinity;
      let noeudMeilleur = null;

      for (let i = 0; i < noeuds.length; i++) {
         const [position, poids] = this.meilleureInsertion(noeuds[i], this.matriceAdj);
         if (poids < coutMeilleur) {
            posMeilleur = position;
            coutMeilleur = poids;
            noeudMeilleur = noeuds[i];
         }
      }
      // Si plusieurs noeuds ont le même coût et que aucun n'est sélectionné, renvoyer par défaut le premier
      if (noeudMeilleur === null) {
         noeudMeilleur = noeuds[0];
         [posMeilleur, coutMeilleur] = this.meilleureInsertion(noeudMeilleur, this.matriceAdj);
      }

      return [noeudMeilleur, posMeilleur, coutMeilleur];
   }

   insererNoeud(noeud) {
      const [position, _] = this.meilleureInsertion(noeud, this.matriceAdj);
      this.matriceAdj.splice(position, 0, noeud);
   }

   // organiser() {
   //    while (this.noeuds.length > 0) {
   //       const [noeudMeilleur, posMeilleur, _] = this.calculeMeilleureInsertion(this.noeuds);
   //       this.noeuds = this.noeuds.filter(n => n !== noeudMeilleur);
   //       this.matriceAdj.splice(posMeilleur, 0, noeudMeilleur);
   //    }
   // }

   organiser() {
      let tours = 0;
      // Limiter le nombre de tours à this.nbTours
      while (this.noeuds.length > 0 && tours < this.nbTours) {
         const [noeudMeilleur, posMeilleur, _] = this.calculeMeilleureInsertion(this.noeuds);
         this.noeuds = this.noeuds.filter(n => n !== noeudMeilleur);
         this.matriceAdj.splice(posMeilleur, 0, noeudMeilleur);
         tours++;
      }
   }


}