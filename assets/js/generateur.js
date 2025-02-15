
class Generateur {
   /**
    * Générateur de rounds de joueurs en double
    * @param {number} N - Nombre de joueurs. 8 par défault.
    * @param {number} nbTerrains - Nombre de terrains disponibles.
    * @param {string} nbTours - Nombre de tours à jouer.
    */
   constructor(N = 8, nbTerrains =  7, nbTours = null) { // N<=56
      this.N = N;
      this.nbTerrains = nbTerrains;      
      this.tableJSON = this.importListeFromJSON(N);
      var {liste, byes} = this.generateTable(this.tableJSON);
      this.liste = liste;
      this.nbTours = nbTours === null ? this.liste.length : nbTours;
      this.byes = byes;
      this.coutbyes = 0;
      if (this.byes.length > 0) {
         this.calculeMeilleureCombinaisonavecByes();
      }
   }

   /**
    * Génère la liste des rounds joueurs en double
    * @return {Array} - liste des rounds 
    */
   generateTable() {
      // const tabfinal = [];
      const seuil = Math.min(4 * this.nbTerrains, Math.floor(this.N/4)*4);
      const listeByes = [];
      const listeJoueurs = [];       
      for (const round in this.tableJSON) {
         const entree = this.tableJSON[round].split(' ');
         const entreeBye = [];
         const entreeJoueurs = [];
         for (let i = 0; i < Math.floor(seuil/2); i++) {
            entreeJoueurs.push([parseInt(entree[2 * i]), parseInt(entree[2 * i + 1])]);
         }
         for (let i = seuil; i < this.N; i++) {
            entreeBye.push(parseInt(entree[i]));
         }
         if (entreeBye.length>0) listeByes.push(entreeBye);
         listeJoueurs.push(entreeJoueurs);
      }
      return { liste: listeJoueurs, byes: listeByes };
      
   }

   /**
    * Importe la première ligne du fichier JSON
    * @param {number} N - Nombre de joueurs. Defaults to 8.
    * @return {string|null} - première ligne du fichier JSON
    */
   importListeFromJSON(N = 8) {
      try {
         // const jsonData = JSON.parse(monficJSON);
         for (var i=0; i<monficJSON.length; i++) {
            if (monficJSON[i].id == N) {
               return monficJSON[i].table;
            }
         }
         return  null;
      } catch (err) {
         console.error(err);
         return null;
      }
   }

   /**
    * Réinitialise la liste des rounds de 4N joueurs en double
    */
   resetListe() {
      var { liste, byes } = this.generateTable(this.tableJSON);
      this.liste = liste;
      this.byes = byes;
      this.coutbyes = 0;
      if (this.byes.length > 0) {
         this.calculeMeilleureCombinaisonavecByes();
      }      
   }

   // /**
   //  * Crée une liste modifiée de Joueurs avec Byes
   //  * @param {number} terrains - Nombre de terrains. Defaults to 1.
   //  */
   // creerListeAvecByes(terrains = 1) {
   //    if (4 * terrains < this.N) {
   //       const listeBye = [];
   //       const listeJoueurs = [];
   //       for (const tour of this.liste) {
   //          const byetemp = [];
   //          for (const paire of tour.slice(2 * terrains, Math.floor(this.N / 2) + 1)) {
   //             byetemp.push(paire[0]);
   //             byetemp.push(paire[1]);
   //          }
   //          listeBye.push(byetemp);
   //          listeJoueurs.push(tour.slice(0, 2 * terrains));
   //       }
   //       this.liste = [...listeJoueurs];
   //       this.byes = [...listeBye];
   //    }
   // }

   /**
    * Calcule la meilleure combinaison de joueurs avec Byes
    * @param {Array|null} byes - Liste de Byes. Defaults to null. Si null, utilise la liste this.byes.
    */
   calculeMeilleureCombinaisonavecByes(byes = null) {
      const mesbyes = byes === null ? new Byes(this.byes, this.nbTours) : new Byes(byes, this.nbTours);
      // Algo standard
      mesbyes.organiser();
      const listebyetemp = [];
      const listejoueurstemp = [];
      for (const adj of mesbyes.matriceAdj) {
         listebyetemp.push(adj.slice(1));
         listejoueurstemp.push(this.liste[adj[0]]);
      }
      this.liste = [...listejoueurstemp];
      this.byes = [...listebyetemp];
      this.coutbyes = mesbyes.poids;
   }

   toString() {
      return JSON.stringify(this.liste);
   }
}
