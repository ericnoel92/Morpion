// On charge les informations utiles
const statut = document.querySelector("h2");
let jeuActif = true;
let joueurActif = "X";
let etatJeu = ["", "", "", "", "", "", "", "", ""];
let scoreX = 0; // Initialisation du score du joueur X
let scoreO = 0; // Initialisation du score du joueur O
let modeJeu = ""; // Initialisation du mode de jeu
let symboleAmi = ""; // Initialisation du symbole de l'ami
let difficulte = ""; // Initialisation de la difficulté

// On définit les conditions de victoire
const conditionsVictoire = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Messages
const gagne = () => `Le joueur ${joueurActif} a gagné`;
const egalite = () => "Egalité";
const tourJoueur = () => `C'est au tour du joueur ${joueurActif}`;

// On affiche quel joueur commence
statut.innerHTML = tourJoueur();

// On met en place les écouteurs d'évènements
document.querySelectorAll(".case").forEach(cell => cell.addEventListener("click", gestionClicCase));
document.querySelector("#recommencer").addEventListener("click", recommencer);
document.getElementById("jouerContreOrdinateur").addEventListener("click", choisirModeJeu);
document.getElementById("jouerContreAmi").addEventListener("click", choisirModeJeu);
document.getElementById("difficulteNormale").addEventListener("click", choisirDifficulte);
document.getElementById("difficulteDifficile").addEventListener("click", choisirDifficulte);

/**
 * Cette fonction gère le clic sur les cases du jeu
 */
function gestionClicCase() {
    const indexCase = parseInt(this.dataset.index);
    
    if (etatJeu[indexCase] !== "" || !jeuActif) {
        return;
    }

    etatJeu[indexCase] = joueurActif;
    this.innerHTML = joueurActif;

    verifGagne();

    // Si le mode de jeu est "ami", changez le joueur actif pour votre ami à chaque clic
    if (modeJeu === "ami") {
        joueurActif = joueurActif === "X" ? symboleAmi : "X";
    }

    // Si le jeu est toujours en cours et que le mode de jeu est "ordinateur", laissez l'ordinateur jouer
    if (jeuActif && modeJeu === "ordinateur" && joueurActif === "O") {
        jouerOrdinateur();
    }
}

/**
 * Cette fonction gère le tour de l'ordinateur
 */
function jouerOrdinateur() {
    let indexCase;
    if (difficulte === "difficile") {
        // Implémentez ici la logique pour la difficulté difficile
    } else {
        // Pour la difficulté normale, l'ordinateur peut jouer de manière aléatoire
        do {
            indexCase = Math.floor(Math.random() * 9);
        } while (etatJeu[indexCase] !== "");
    }

    etatJeu[indexCase] = "O";
    document.querySelector(`.case[data-index="${indexCase}"]`).innerHTML = "O";

    verifGagne();
}

/**
 * Cette fonction vérifie si le joueur a gagné
 */
function verifGagne() {
    let tourGagnant = false;

    for (let conditionVictoire of conditionsVictoire) {
        let val1 = etatJeu[conditionVictoire[0]];
        let val2 = etatJeu[conditionVictoire[1]];
        let val3 = etatJeu[conditionVictoire[2]];

        if (val1 === "" || val2 === "" || val3 === "") {
            continue;
        }

        if (val1 === val2 && val2 === val3) {
            tourGagnant = true;
            break;
        }
    }

    if (tourGagnant) {
        statut.innerHTML = gagne();
        jeuActif = false;

        // Mise à jour du score
        if (joueurActif === "X") {
            scoreX++;
            document.getElementById("scoreX").innerHTML = `Score X: ${scoreX}`;
        } else {
            scoreO++;
            document.getElementById("scoreO").innerHTML = `Score O: ${scoreO}`;
        }
    } else if (etatJeu.includes("") === false) {
        statut.innerHTML = egalite();
        jeuActif = false;
    } else {
        joueurActif = joueurActif === "X" ? "O" : "X";
        statut.innerHTML = tourJoueur();
    }
}

/**
 * Cette fonction réinitialise le jeu
 */
function recommencer() {
    joueurActif = "X";
    jeuActif = true;
    etatJeu = ["", "", "", "", "", "", "", "", ""];
    statut.innerHTML = tourJoueur();
    document.querySelectorAll(".case").forEach(cell => cell.innerHTML = "");
    
    // Recharge automatiquement la page
    location.reload();
}

/**
 * Cette fonction gère le choix du mode de jeu
 */
function choisirModeJeu(event) {
    modeJeu = event.target.id === "jouerContreOrdinateur" ? "ordinateur" : "ami";
    
    // Mettez à jour l'interface utilisateur en fonction du mode de jeu choisi
    if (modeJeu === "ordinateur") {
        // Désactivez le bouton "Jouer contre un ami"
        document.getElementById("jouerContreAmi").disabled = true;
    } else {
        // Désactivez le bouton "Jouer contre l'ordinateur"
        document.getElementById("jouerContreOrdinateur").disabled = true;

        // Demandez à votre ami de choisir son symbole
        symboleAmi = prompt("Veuillez choisir votre symbole (X ou O)").toUpperCase();
    }

    // Vous pouvez également ajouter d'autres actions en fonction du mode de jeu choisi, par exemple initialiser une variable globale pour stocker le mode de jeu.
}

/**
 * Cette fonction gère le choix de la difficulté
 */
function choisirDifficulte(event) {
    difficulte = event.target.id === "difficulteDifficile" ? "difficile" : "normale";
    
    // Ajoutez ici d'autres actions en fonction de la difficulté choisie, par exemple ajustez le comportement de l'ordinateur.
}
