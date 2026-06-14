import { useState, useEffect, useCallback } from "react";

const ALL_QUESTIONS = [
  // ── JAVASCRIPT FONDAMENTAL (Q1–20) ──
  {
    id: 1, topic: "JS",
    q: "Qu'affiche ce code ?\n```js\nvar x = 10;\nfunction f() { var x = 5; document.write(x); }\nf(); document.write(x);\n```",
    opts: ["10 puis 5", "5 puis 10", "5 puis 5", "10 puis 10"],
    ans: 1,
    exp: "var x dans f() est locale → f() affiche 5. Ensuite la variable globale x=10 est affichée."
  },
  {
    id: 2, topic: "JS",
    q: "Que produit `'10' + 5` en JavaScript ?",
    opts: ["15", "NaN", "'105'", "'10 5'"],
    ans: 2,
    exp: "Quand l'un des opérandes de + est une chaîne, JS fait une concaténation."
  },
  {
    id: 3, topic: "JS",
    q: "Laquelle de ces déclarations est INVALIDE ?",
    opts: ["var _montant = 100;", "var montantTotal = 200;", "var 2prix = 50;", "var PRIX_TTC = 75;"],
    ans: 2,
    exp: "Un nom de variable ne peut pas commencer par un chiffre."
  },
  {
    id: 4, topic: "JS",
    q: "Parmi ces mots, lequel est un mot réservé JavaScript ?",
    opts: ["valeur", "calcul", "total", "return"],
    ans: 3,
    exp: "`return` est un mot-clé réservé. Les utiliser comme noms de variables provoque une erreur de syntaxe."
  },
  {
    id: 5, topic: "JS",
    q: "Que valent `'15' == 15` et `'15' === 15` ?",
    opts: ["true / true", "false / false", "true / false", "false / true"],
    ans: 2,
    exp: "== compare avec coercition (true), === compare valeur ET type (false car string ≠ number)."
  },
  {
    id: 6, topic: "JS",
    q: "Que vaut `true + 5` en JavaScript ?",
    opts: ["'true5'", "NaN", "5", "6"],
    ans: 3,
    exp: "`true` est converti en 1 lors d'une opération arithmétique. 1 + 5 = 6."
  },
  {
    id: 7, topic: "JS",
    q: "Avec `note=14, absence=5, projet=true`, et les règles du cours, quel est le résultat ?",
    opts: ["Admis", "Rattrapage", "Ajourné", "Erreur"],
    ans: 1,
    exp: "note≥12 mais absence>3 → la 2e condition de Rattrapage est vérifiée."
  },
  {
    id: 8, topic: "JS",
    q: "Que s'affiche-t-il ?\n```js\nvar x = 0;\nwhile(x < 10) { if(x == 3) break; x++; }\ndocument.write(x);\n```",
    opts: ["10", "4", "3", "0"],
    ans: 2,
    exp: "break quitte la boucle avant que x++ ne s'exécute, donc x vaut 3."
  },
  {
    id: 9, topic: "JS",
    q: "Que s'affiche-t-il ?\n```js\nfor(var i=0; i<5; i++) { if(i==2) continue; document.write(i+' '); }\n```",
    opts: ["0 1 2 3 4", "0 1 3 4", "0 1 2 4", "2 3 4"],
    ans: 1,
    exp: "continue saute l'itération i=2 mais continue la boucle. Le 2 n'est pas affiché."
  },
  {
    id: 10, topic: "JS",
    q: "Dans `for(var i in joueurs)`, que représente `i` ?",
    opts: ["Les valeurs du tableau", "Les indices du tableau", "La longueur du tableau", "undefined"],
    ans: 1,
    exp: "for...in itère sur les clés (indices) du tableau. joueurs[i] donne les valeurs."
  },
  {
    id: 11, topic: "JS",
    q: "Que vaut `typeof null` en JavaScript ?",
    opts: ["'null'", "'undefined'", "'object'", "'boolean'"],
    ans: 2,
    exp: "C'est un bug historique de JS : `typeof null` retourne 'object'."
  },
  {
    id: 12, topic: "JS",
    q: "Quelle est la valeur de `0.1 + 0.2 === 0.3` ?",
    opts: ["true", "false", "undefined", "NaN"],
    ans: 1,
    exp: "Les nombres flottants IEEE 754 donnent 0.30000000000000004, donc !== 0.3 → false."
  },
  {
    id: 13, topic: "JS",
    q: "Que retourne `Boolean('')` ?",
    opts: ["true", "false", "undefined", "'false'"],
    ans: 1,
    exp: "Les valeurs falsy en JS : false, 0, '', null, undefined, NaN. Une chaîne vide est falsy."
  },
  {
    id: 14, topic: "JS",
    q: "Quelle est la différence entre `null` et `undefined` ?",
    opts: [
      "Il n'y a aucune différence",
      "`null` est une absence intentionnelle, `undefined` signifie qu'une variable n'a pas été initialisée",
      "`undefined` est une absence intentionnelle, `null` signifie non déclaré",
      "Les deux provoquent une erreur d'accès"
    ],
    ans: 1,
    exp: "`null` est assigné volontairement. `undefined` est l'état par défaut d'une variable non initialisée."
  },
  {
    id: 15, topic: "JS",
    q: "Que vaut `'5' - 2` ?",
    opts: ["'52'", "'5-2'", "NaN", "3"],
    ans: 3,
    exp: "L'opérateur `-` n'effectue pas de concaténation. '5' est converti en 5, donc 5 - 2 = 3."
  },
  {
    id: 16, topic: "JS",
    q: "Qu'est-ce que le hoisting en JavaScript ?",
    opts: [
      "La fermeture d'une fonction",
      "Le déplacement des déclarations var et function en haut de leur portée avant exécution",
      "L'héritage entre objets",
      "La coercition de type"
    ],
    ans: 1,
    exp: "Le hoisting hisse les déclarations var/function au sommet de leur contexte. Les initialisations ne sont pas hoistées."
  },
  {
    id: 17, topic: "JS",
    q: "Que fait l'opérateur `??` (nullish coalescing) ?",
    opts: [
      "Renvoie le premier opérande si falsy",
      "Renvoie le second opérande si le premier est null ou undefined",
      "Compare deux valeurs strictement",
      "Crée un nouveau scope"
    ],
    ans: 1,
    exp: "`a ?? b` retourne b uniquement si a est null ou undefined (contrairement à || qui teste toute valeur falsy)."
  },
  {
    id: 18, topic: "JS",
    q: "Quelle est la différence entre `let` et `var` ?",
    opts: [
      "Aucune différence",
      "`let` a une portée de bloc, `var` a une portée de fonction/globale",
      "`var` a une portée de bloc, `let` une portée globale",
      "`let` est plus lent à l'exécution"
    ],
    ans: 1,
    exp: "`let` et `const` (ES6) ont une portée de bloc {}. `var` a une portée de fonction ou globale."
  },
  {
    id: 19, topic: "JS",
    q: "Que retourne `[1,2,3].includes(2)` ?",
    opts: ["1", "true", "false", "2"],
    ans: 1,
    exp: "`Array.prototype.includes()` retourne un booléen indiquant si l'élément est présent."
  },
  {
    id: 20, topic: "JS",
    q: "Qu'est-ce qu'une arrow function ?",
    opts: [
      "Une fonction déclarée avec function",
      "Une syntaxe raccourcie `() => {}` qui n'a pas son propre `this`",
      "Une fonction immédiatement invoquée",
      "Une méthode d'objet uniquement"
    ],
    ans: 1,
    exp: "Les arrow functions (`=>`) ont une syntaxe courte et héritent `this` du contexte parent."
  },

  // ── OOP (Q21–35) ──
  {
    id: 21, topic: "OOP",
    q: "Que retourne `[12, 5, 8, 130, 44].filter(v => v >= 10)` ?",
    opts: ["[5, 8]", "3", "12", "[12, 130, 44]"],
    ans: 3,
    exp: "filter() retourne un nouveau tableau avec seulement les éléments satisfaisant la condition."
  },
  {
    id: 22, topic: "OOP",
    q: "Quelle est la différence entre `pop()` et `shift()` ?",
    opts: [
      "pop() ajoute en fin, shift() ajoute en début",
      "pop() supprime le dernier élément, shift() supprime le premier",
      "pop() supprime le premier, shift() supprime le dernier",
      "Les deux suppriment tous les éléments"
    ],
    ans: 1,
    exp: "pop() = LIFO (dernier). shift() = FIFO (premier). Leurs inverses : push() et unshift()."
  },
  {
    id: 23, topic: "OOP",
    q: "Dans `class Dog extends Animal { constructor(n,b){ super(n); } }`, que fait `super(n)` ?",
    opts: [
      "Appelle une méthode statique",
      "Crée une copie de Animal",
      "Appelle le constructeur parent Animal en passant n",
      "Empêche l'héritage des méthodes"
    ],
    ans: 2,
    exp: "super() invoque le constructeur de la classe parente. Obligatoire avant d'utiliser `this` dans une sous-classe."
  },
  {
    id: 24, topic: "OOP",
    q: "Que représente `this` dans une méthode d'objet ?",
    opts: [
      "Une variable locale",
      "L'objet global window",
      "L'objet qui appelle la méthode",
      "Le prototype de l'objet"
    ],
    ans: 2,
    exp: "Dans une méthode, `this` fait référence à l'objet qui appelle cette méthode."
  },
  {
    id: 25, topic: "OOP",
    q: "Que fait `[1,4,9].map(n => Math.sqrt(n))` ?",
    opts: [
      "Filtre les éléments",
      "Retourne [1, 2, 3]",
      "Modifie le tableau original",
      "Retourne la somme"
    ],
    ans: 1,
    exp: "map() retourne un nouveau tableau en appliquant la fonction à chaque élément. √1=1, √4=2, √9=3."
  },
  {
    id: 26, topic: "OOP",
    q: "Que retourne `['ant','bison','camel'].indexOf('bison')` ?",
    opts: ["0", "1", "2", "-1"],
    ans: 1,
    exp: "indexOf retourne la position de la première occurrence. 'bison' est à l'index 1."
  },
  {
    id: 27, topic: "OOP",
    q: "Que vaut `['Fire','Air','Water'].join('-')` ?",
    opts: ["'Fire Air Water'", "'FireAirWater'", "'Fire-Air-Water'", "['Fire','Air','Water']"],
    ans: 2,
    exp: "join(sep) concatène les éléments avec le séparateur fourni."
  },
  {
    id: 28, topic: "OOP",
    q: "Qu'est-ce que l'encapsulation en POO ?",
    opts: [
      "La capacité d'hériter d'une autre classe",
      "La capacité de stocker des données et méthodes liées dans un seul objet",
      "La capacité d'écrire une méthode qui fonctionne de plusieurs façons",
      "La capacité de stocker un objet dans un autre"
    ],
    ans: 1,
    exp: "L'encapsulation regroupe les données et méthodes liées dans un objet, cachant les détails internes."
  },
  {
    id: 29, topic: "OOP",
    q: "Qu'est-ce que le polymorphisme ?",
    opts: [
      "L'héritage entre classes",
      "La capacité d'écrire une méthode qui fonctionne de différentes façons selon le type",
      "Le regroupement de données dans un objet",
      "La création d'objets à partir d'une classe"
    ],
    ans: 1,
    exp: "Le polymorphisme permet à une méthode d'avoir des comportements différents selon l'objet qui l'appelle."
  },
  {
    id: 30, topic: "OOP",
    q: "Que fait `every()` sur un tableau ?",
    opts: [
      "Retourne true si au moins un élément satisfait la condition",
      "Retourne true si TOUS les éléments satisfont la condition",
      "Retourne un nouveau tableau filtré",
      "Applique une fonction à chaque élément"
    ],
    ans: 1,
    exp: "[12,54,18,130,44].every(v => v>=10) retourne true car tous sont ≥ 10."
  },
  {
    id: 31, topic: "OOP",
    q: "Comment créer un tableau d'objets en JavaScript (ES6) ?",
    opts: [
      "var t = new Array();",
      "const t = [];",
      "const t = [{ id:1, nom:'Ali' }, { id:2, nom:'Sara' }];",
      "Toutes ces réponses sont correctes"
    ],
    ans: 3,
    exp: "Les trois syntaxes sont valides. La littérale est la plus courante en ES6 pour un tableau d'objets."
  },
  {
    id: 32, topic: "OOP",
    q: "Quelle méthode trie un tableau en place ?",
    opts: ["map()", "filter()", "sort()", "reduce()"],
    ans: 2,
    exp: "sort() trie le tableau original en place. Par défaut, il trie en ordre lexicographique."
  },
  {
    id: 33, topic: "OOP",
    q: "Que fait `reduce()` ?",
    opts: [
      "Filtre les éléments",
      "Accumule les éléments en une seule valeur selon une fonction",
      "Retourne les indices des éléments",
      "Crée une copie du tableau"
    ],
    ans: 1,
    exp: "[1,2,3,4].reduce((acc, n) => acc + n, 0) retourne 10 (somme)."
  },
  {
    id: 34, topic: "OOP",
    q: "Que fait l'opérateur spread `...` ?",
    opts: [
      "Détruit un tableau",
      "Étale les éléments d'un itérable (tableau, objet…)",
      "Crée un générateur",
      "Déclare un paramètre optionnel"
    ],
    ans: 1,
    exp: "[...arr1, ...arr2] fusionne deux tableaux. {...obj1, ...obj2} fusionne deux objets."
  },
  {
    id: 35, topic: "OOP",
    q: "Que retourne `Object.keys({ a:1, b:2, c:3 })` ?",
    opts: ["[1, 2, 3]", "['a', 'b', 'c']", "3", "[['a',1],['b',2],['c',3]]"],
    ans: 1,
    exp: "Object.keys() retourne un tableau des noms de propriétés énumérables de l'objet."
  },

  // ── DOM (Q36–50) ──
  {
    id: 36, topic: "DOM",
    q: "Quelle méthode trouve un élément HTML par son attribut `id` ?",
    opts: [
      "document.getElementByName('demo')",
      "document.getElementsById('demo')",
      "document.findElement('demo')",
      "document.getElementById('demo')"
    ],
    ans: 3,
    exp: "getElementById (sans 's') retourne l'élément unique correspondant à l'id."
  },
  {
    id: 37, topic: "DOM",
    q: "Que fait `element.innerHTML = 'Bonjour!'` ?",
    opts: [
      "Affiche une boîte de dialogue",
      "Crée un nouvel élément",
      "Supprime l'élément",
      "Remplace le contenu HTML interne de l'élément"
    ],
    ans: 3,
    exp: "innerHTML lit ou modifie le contenu HTML interne d'un élément."
  },
  {
    id: 38, topic: "DOM",
    q: "Que fait `document.body.appendChild(e)` ?",
    opts: [
      "Crée l'élément e en mémoire",
      "Remplace tout le contenu du body",
      "Supprime le dernier enfant",
      "Ajoute e comme dernier enfant du body"
    ],
    ans: 3,
    exp: "appendChild() insère un nœud comme dernier enfant d'un élément parent."
  },
  {
    id: 39, topic: "DOM",
    q: "Quel événement se déclenche quand le curseur survole un élément ?",
    opts: ["onclick", "onmousedown", "onmouseup", "onmouseover"],
    ans: 3,
    exp: "onmouseover se déclenche quand le curseur entre dans la zone d'un élément."
  },
  {
    id: 40, topic: "DOM",
    q: "Pourquoi retourner `false` dans `onsubmit='return validerForm()'` ?",
    opts: [
      "Pour signaler que la validation a réussi",
      "Pour effacer les champs",
      "Pour rediriger l'utilisateur",
      "Pour empêcher la soumission native du formulaire"
    ],
    ans: 3,
    exp: "Retourner false dans onsubmit annule l'envoi du formulaire, permettant la validation côté client."
  },
  {
    id: 41, topic: "DOM",
    q: "Que fait `style.color = 'red'` ?",
    opts: [
      "Ajoute une classe CSS 'red'",
      "Change la couleur de fond en rouge",
      "Change la couleur du texte en rouge",
      "Supprime tous les styles"
    ],
    ans: 2,
    exp: "style.color correspond à la propriété CSS `color` (couleur du texte). Pour le fond : style.backgroundColor."
  },
  {
    id: 42, topic: "DOM",
    q: "Comment sélectionner tous les éléments avec la classe 'card' ?",
    opts: [
      "document.getElementById('card')",
      "document.querySelectorAll('.card')",
      "document.getElementByClass('card')",
      "document.selectAll('card')"
    ],
    ans: 1,
    exp: "querySelectorAll('.card') retourne une NodeList de tous les éléments ayant la classe 'card'."
  },
  {
    id: 43, topic: "DOM",
    q: "Que fait `element.classList.add('active')` ?",
    opts: [
      "Supprime la classe 'active'",
      "Remplace toutes les classes par 'active'",
      "Ajoute la classe 'active' à l'élément",
      "Vérifie si l'élément a la classe 'active'"
    ],
    ans: 2,
    exp: "classList.add() ajoute une classe CSS sans supprimer les existantes."
  },
  {
    id: 44, topic: "DOM",
    q: "Que fait `e.preventDefault()` dans un gestionnaire d'événement ?",
    opts: [
      "Arrête la propagation de l'événement",
      "Empêche le comportement par défaut du navigateur",
      "Supprime l'élément du DOM",
      "Déclenche l'événement manuellement"
    ],
    ans: 1,
    exp: "preventDefault() empêche l'action par défaut (ex: suivre un lien, soumettre un formulaire)."
  },
  {
    id: 45, topic: "DOM",
    q: "Quelle méthode permet d'ajouter un écouteur d'événement ?",
    opts: [
      "element.on('click', fn)",
      "element.addEvent('click', fn)",
      "element.addEventListener('click', fn)",
      "element.listen('click', fn)"
    ],
    ans: 2,
    exp: "addEventListener est la méthode standard pour attacher des gestionnaires d'événements."
  },
  {
    id: 46, topic: "DOM",
    q: "Que retourne `document.querySelector('p')` ?",
    opts: [
      "Tous les éléments <p>",
      "Le premier élément <p> trouvé",
      "Une NodeList de tous les <p>",
      "undefined"
    ],
    ans: 1,
    exp: "querySelector retourne le PREMIER élément correspondant au sélecteur CSS."
  },
  {
    id: 47, topic: "DOM",
    q: "Comment créer un élément `<div>` et l'insérer dans le body ?",
    opts: [
      "document.body.create('div')",
      "const e = document.createElement('div'); document.body.appendChild(e);",
      "document.insertElement('div', body)",
      "document.body.innerHTML += '<div>';"
    ],
    ans: 1,
    exp: "createElement crée l'élément en mémoire, appendChild l'insère dans le DOM."
  },
  {
    id: 48, topic: "DOM",
    q: "Quelle propriété donne le texte d'un élément sans le HTML ?",
    opts: ["innerHTML", "outerHTML", "textContent", "value"],
    ans: 2,
    exp: "textContent retourne uniquement le contenu textuel, sans les balises HTML."
  },
  {
    id: 49, topic: "DOM",
    q: "Que fait `e.stopPropagation()` ?",
    opts: [
      "Empêche le comportement par défaut",
      "Arrête la remontée de l'événement vers les parents",
      "Supprime l'écouteur d'événement",
      "Déclenche l'événement sur le parent"
    ],
    ans: 1,
    exp: "stopPropagation empêche l'événement de remonter (bubbling) vers les éléments parents."
  },
  {
    id: 50, topic: "DOM",
    q: "Comment récupérer la valeur d'un champ `<input>` ?",
    opts: [
      "input.text",
      "input.content",
      "input.value",
      "input.innerHTML"
    ],
    ans: 2,
    exp: "La propriété `.value` contient la valeur actuelle d'un champ de formulaire."
  },

  // ── NPM (Q51–60) ──
  {
    id: 51, topic: "NPM",
    q: "Que signifie NPM ?",
    opts: ["Node Project Manager", "Network Package Module", "New Programming Module", "Node Package Manager"],
    ans: 3,
    exp: "NPM = Node Package Manager. C'est le gestionnaire de paquets officiel de Node.js."
  },
  {
    id: 52, topic: "NPM",
    q: "Quel est le rôle principal de `package.json` ?",
    opts: [
      "Contenir le code compilé",
      "Stocker les modules dans node_modules",
      "Définir métadonnées, dépendances et scripts NPM du projet",
      "Configurer le serveur web"
    ],
    ans: 2,
    exp: "package.json est le fichier de configuration central : nom, version, dépendances, scripts…"
  },
  {
    id: 53, topic: "NPM",
    q: "Quelle est la différence entre `dependencies` et `devDependencies` ?",
    opts: [
      "dependencies pour backend, devDependencies pour frontend",
      "dependencies installées globalement, devDependencies localement",
      "Aucune différence",
      "dependencies nécessaires en production, devDependencies uniquement en développement"
    ],
    ans: 3,
    exp: "devDependencies contient les outils de dev (linters, bundlers, tests). Non déployées en production."
  },
  {
    id: 54, topic: "NPM",
    q: "Que contient le dossier `node_modules` ?",
    opts: [
      "Le code source de l'application",
      "Les fichiers HTML/CSS",
      "Les fichiers de sortie après build",
      "Toutes les dépendances installées du projet"
    ],
    ans: 3,
    exp: "node_modules contient les packages installés. Il n'est généralement pas versionné dans Git."
  },
  {
    id: 55, topic: "NPM",
    q: "Quelle commande initialise un nouveau projet NPM ?",
    opts: ["npm create", "npm start", "npm init", "npm install"],
    ans: 2,
    exp: "`npm init` crée un fichier package.json en posant des questions sur le projet."
  },
  {
    id: 56, topic: "NPM",
    q: "Quelle commande installe un package en devDependency ?",
    opts: [
      "npm install react",
      "npm install --save-dev eslint",
      "npm install --production eslint",
      "npm add --dev=eslint"
    ],
    ans: 1,
    exp: "`npm install --save-dev` (ou -D) ajoute le package dans devDependencies de package.json."
  },
  {
    id: 57, topic: "NPM",
    q: "À quoi sert le fichier `package-lock.json` ?",
    opts: [
      "Lister uniquement les devDependencies",
      "Verrouiller les versions exactes de toutes les dépendances pour une installation reproductible",
      "Configurer les scripts NPM",
      "Bloquer les mises à jour de packages"
    ],
    ans: 1,
    exp: "package-lock.json garantit que toute l'équipe installe exactement les mêmes versions."
  },
  {
    id: 58, topic: "NPM",
    q: "Quel est le bon ordre du cycle NPM décrit en cours ?",
    opts: [
      "install → init → dev → build → deploy",
      "init → install → dev → test → build → deploy",
      "init → dev → install → test → build",
      "install → dev → init → build → test"
    ],
    ans: 1,
    exp: "init → install → dev (développement) → test → build → deploy. C'est le cycle complet NPM."
  },
  {
    id: 59, topic: "NPM",
    q: "À quoi servent les scripts `prebuild` et `postinstall` dans package.json ?",
    opts: [
      "Ce sont des alias pour build et install",
      "Des hooks lifecycle exécutés automatiquement avant/après la commande correspondante",
      "Des commandes à exécuter manuellement",
      "Des scripts de test uniquement"
    ],
    ans: 1,
    exp: "NPM supporte des hooks pre/post : prebuild s'exécute avant `npm run build`, postinstall après `npm install`."
  },
  {
    id: 60, topic: "NPM",
    q: "Quelle commande supprime un package installé ?",
    opts: ["npm delete react", "npm remove react", "npm uninstall react", "npm purge react"],
    ans: 2,
    exp: "`npm uninstall react` supprime le package et le retire de package.json."
  },

  // ── REACT FONDAMENTAUX (Q61–80) ──
  {
    id: 61, topic: "React",
    q: "Qu'est-ce que le JSX ?",
    opts: [
      "Un langage de programmation indépendant",
      "Un framework CSS pour React",
      "Un outil de gestion d'état",
      "Une extension syntaxique de JS permettant d'écrire une syntaxe proche du HTML"
    ],
    ans: 3,
    exp: "JSX est transpilé par Babel en appels React.createElement(). Le navigateur ne comprend pas JSX directement."
  },
  {
    id: 62, topic: "React",
    q: "Syntaxe correcte pour monter un composant en React 18 ?",
    opts: [
      "ReactDOM.render(<App />, document.getElementById('root'))",
      "React.render(<App />, 'root')",
      "ReactDOM.createRoot(document.getElementById('root')).render(<App />)",
      "document.getElementById('root').render(<App />)"
    ],
    ans: 2,
    exp: "React 18 a introduit createRoot. L'ancienne ReactDOM.render est dépréciée."
  },
  {
    id: 63, topic: "React",
    q: "Laquelle est un composant fonctionnel React VALIDE ?",
    opts: [
      "var Bienvenue = { render: <h1>Bonjour</h1> };",
      "const Bienvenue = <h1>Bonjour</h1>;",
      "class Bienvenue extends React.Component { render() { return <h1>Bonjour</h1>; } }",
      "function Bienvenue() { return <h1>Bonjour</h1>; }"
    ],
    ans: 3,
    exp: "Un composant fonctionnel est une fonction JS dont le nom commence par une majuscule et retourne du JSX."
  },
  {
    id: 64, topic: "React",
    q: "Comment passer des données d'un parent vers un enfant React ?",
    opts: [
      "Via des variables globales",
      "Via localStorage",
      "Via les props transmises en attributs JSX",
      "Via des événements DOM"
    ],
    ans: 2,
    exp: "Les props sont le mécanisme de flux unidirectionnel parent → enfant en React."
  },
  {
    id: 65, topic: "React",
    q: "Un composant enfant peut-il modifier directement les props qu'il reçoit ?",
    opts: [
      "Oui, avec setState()",
      "Oui, directement via l'objet props",
      "Oui, mais uniquement dans les composants de classe",
      "Non, les props sont en lecture seule"
    ],
    ans: 3,
    exp: "Les props sont immuables. Pour des données changeantes, il faut utiliser le state."
  },
  {
    id: 66, topic: "React",
    q: "Syntaxe correcte pour le rendu conditionnel en JSX ?",
    opts: [
      "{if (show) <Alert />}",
      "{show then <Alert />}",
      "<Alert if={show} />",
      "{show && <Alert />}"
    ],
    ans: 3,
    exp: "L'opérateur && est la technique standard de rendu conditionnel en JSX. if directement est invalide."
  },
  {
    id: 67, topic: "React",
    q: "Pourquoi fournir une `key` unique à chaque élément d'une liste React ?",
    opts: [
      "Pour appliquer un style CSS différent",
      "Pour lier à une base de données",
      "Pour que React identifie efficacement les éléments modifiés/ajoutés/supprimés",
      "Pour typer avec TypeScript"
    ],
    ans: 2,
    exp: "Les keys permettent à React d'optimiser le re-rendu des listes (algorithme de réconciliation)."
  },
  {
    id: 68, topic: "React",
    q: "Que représente `setCount` dans `const [count, setCount] = useState(0)` ?",
    opts: [
      "La valeur initiale (0)",
      "Un tableau contenant l'état",
      "Une fonction pour mettre à jour count et déclencher un re-rendu",
      "Un hook secondaire"
    ],
    ans: 2,
    exp: "Le setter (setCount) met à jour l'état et déclenche automatiquement un nouveau rendu du composant."
  },
  {
    id: 69, topic: "React",
    q: "Pourquoi `count++` est-il incorrect pour mettre à jour l'état React ?",
    opts: [
      "++ n'est pas supporté en JS moderne",
      "React ne surveille pas les variables directement ; sans setCount, aucun re-rendu n'est déclenché",
      "Cela provoquerait une erreur TypeScript",
      "Cela effacerait count"
    ],
    ans: 1,
    exp: "React détecte les changements uniquement via les setters. Une mutation directe ne déclenche pas de re-rendu."
  },
  {
    id: 70, topic: "React",
    q: "Quand s'exécute `useEffect(() => { ... }, [])` ?",
    opts: [
      "À chaque rendu",
      "Uniquement quand le composant est démonté",
      "Jamais",
      "Une seule fois, après le premier rendu"
    ],
    ans: 3,
    exp: "Le tableau vide [] signifie : aucune dépendance → l'effet ne s'exécute qu'au montage (componentDidMount)."
  },
  {
    id: 71, topic: "React",
    q: "Quel est le rôle de la fonction retournée par `useEffect` ?",
    opts: [
      "Démarrer le timer",
      "Réinitialiser le timer",
      "Retourner une valeur au parent",
      "Nettoyer (cleanup) les ressources quand le composant est démonté"
    ],
    ans: 3,
    exp: "La fonction cleanup évite les fuites mémoire (timers, abonnements, écouteurs non retirés)."
  },
  {
    id: 72, topic: "React",
    q: "Quelle règle sur les Hooks est CORRECTE ?",
    opts: [
      "Ils peuvent être dans des boucles for",
      "Ils peuvent être dans des conditions if",
      "Ils doivent être appelés au niveau supérieur d'un composant fonctionnel",
      "Ils peuvent être utilisés dans les composants de classe"
    ],
    ans: 2,
    exp: "Règle 1 : Hooks au niveau supérieur uniquement. Règle 2 : uniquement dans des composants fonctionnels ou Custom Hooks."
  },
  {
    id: 73, topic: "React",
    q: "Un Custom Hook doit obligatoirement commencer par quel préfixe ?",
    opts: ["hook", "use", "custom", "react"],
    ans: 1,
    exp: "La convention `use` est obligatoire pour que les outils reconnaissent la fonction comme un Hook."
  },
  {
    id: 74, topic: "React",
    q: "React JS a été créé par quelle entreprise ?",
    opts: ["Google", "Twitter", "Meta (Facebook)", "Microsoft"],
    ans: 2,
    exp: "React a été créé par Meta Platforms (anciennement Facebook) et open-sourcé en 2013."
  },
  {
    id: 75, topic: "React",
    q: "La composition en React signifie…",
    opts: [
      "Hériter d'une classe parente",
      "Assembler des composants simples pour construire des UIs complexes",
      "Écrire du CSS dans JS",
      "Utiliser des variables globales entre composants"
    ],
    ans: 1,
    exp: "React privilégie la composition (assembler des composants) plutôt que l'héritage de classe."
  },
  {
    id: 76, topic: "React",
    q: "Que fait `children` dans `function Card({ children }) { return <div>{children}</div>; }` ?",
    opts: [
      "Crée une liste d'enfants HTML",
      "Permet d'injecter du JSX entre les balises ouvrante et fermante du composant",
      "Accède aux props de l'enfant",
      "Définit le nombre d'enfants autorisés"
    ],
    ans: 1,
    exp: "`children` est une prop spéciale qui contient le contenu JSX passé entre les balises du composant."
  },
  {
    id: 77, topic: "React",
    q: "Comment empêcher l'affichage d'un composant React ?",
    opts: [
      "return false;",
      "return undefined;",
      "return null;",
      "return 0;"
    ],
    ans: 2,
    exp: "Retourner `null` dans le render d'un composant supprime son affichage sans erreur."
  },
  {
    id: 78, topic: "React",
    q: "Dans un formulaire React contrôlé, comment lier un input à l'état ?",
    opts: [
      "value={state} seulement",
      "onChange={handler} seulement",
      "value={state} ET onChange={handler}",
      "defaultValue={state}"
    ],
    ans: 2,
    exp: "Un composant contrôlé nécessite value (pour afficher l'état) ET onChange (pour mettre à jour l'état)."
  },
  {
    id: 79, topic: "React",
    q: "Depuis quelle version React les Hooks ont-ils été introduits ?",
    opts: ["React 14", "React 16.3", "React 16.8", "React 18"],
    ans: 2,
    exp: "Les Hooks (useState, useEffect…) ont été introduits dans React 16.8 en février 2019."
  },
  {
    id: 80, topic: "React",
    q: "Que fait `useEffect(() => { ... }, [userId])` ?",
    opts: [
      "S'exécute une seule fois au montage",
      "S'exécute à chaque rendu",
      "S'exécute chaque fois que `userId` change",
      "S'exécute uniquement au démontage"
    ],
    ans: 2,
    exp: "Quand le tableau de dépendances contient [userId], l'effet se relance à chaque changement de userId."
  },

  // ── MIXTE AVANCÉ (Q81–100) ──
  {
    id: 81, topic: "JS",
    q: "Quelle est la syntaxe d'une Immediately Invoked Function Expression (IIFE) ?",
    opts: [
      "function() { }()",
      "(function() { })()",
      "invoke(function() {})",
      "auto function() {}"
    ],
    ans: 1,
    exp: "Une IIFE s'exécute immédiatement après sa définition : `(function() { ... })()`."
  },
  {
    id: 82, topic: "JS",
    q: "Qu'est-ce qu'une closure (fermeture) ?",
    opts: [
      "Une fonction qui ferme le programme",
      "Une fonction qui retourne void",
      "Une fonction qui a accès aux variables de son scope externe même après que ce scope ait terminé",
      "Une boucle infinie"
    ],
    ans: 2,
    exp: "Une closure se souvient du scope lexical dans lequel elle a été créée, même après l'exécution de ce scope."
  },
  {
    id: 83, topic: "OOP",
    q: "Qu'est-ce que le prototype en JavaScript ?",
    opts: [
      "Une copie d'un objet",
      "L'objet parent dont un autre objet hérite des propriétés/méthodes",
      "Une classe abstraite",
      "Un type de tableau"
    ],
    ans: 1,
    exp: "Chaque objet JS a un prototype. Quand une propriété n'est pas trouvée, JS remonte la chaîne de prototypes."
  },
  {
    id: 84, topic: "React",
    q: "Quelle est la différence entre `useEffect` et `useLayoutEffect` ?",
    opts: [
      "Aucune différence",
      "useLayoutEffect s'exécute de façon synchrone après les mutations du DOM, avant la peinture du navigateur",
      "useEffect est réservé aux classes",
      "useLayoutEffect ne supporte pas le cleanup"
    ],
    ans: 1,
    exp: "useLayoutEffect bloque la peinture jusqu'à son exécution. useEffect s'exécute de façon asynchrone après la peinture."
  },
  {
    id: 85, topic: "DOM",
    q: "Qu'est-ce que le DOM ?",
    opts: [
      "Un langage de programmation",
      "Une API qui représente la structure HTML sous forme d'arbre d'objets manipulables",
      "Un framework CSS",
      "Un protocole réseau"
    ],
    ans: 1,
    exp: "Le DOM (Document Object Model) est une représentation en arbre du HTML que JS peut lire et modifier."
  },
  {
    id: 86, topic: "JS",
    q: "Que retourne `fetch('https://api.example.com/data')` ?",
    opts: [
      "Les données directement",
      "Un objet Response",
      "Une Promise qui se résout en un objet Response",
      "null si le réseau est lent"
    ],
    ans: 2,
    exp: "fetch() retourne une Promise. On chaîne .then(res => res.json()) pour obtenir les données JSON."
  },
  {
    id: 87, topic: "React",
    q: "Comment gérer une liste de tâches avec des objets `{ id, text, done }` dans React ?",
    opts: [
      "tasks.push(newTask) puis setState(tasks)",
      "setTasks([...tasks, newTask])",
      "tasks[tasks.length] = newTask",
      "setState({ tasks: tasks.concat })"
    ],
    ans: 1,
    exp: "Il faut créer un NOUVEAU tableau : [...tasks, newTask]. Muter le tableau existant ne déclenche pas de re-rendu."
  },
  {
    id: 88, topic: "NPM",
    q: "Que fait `npm run build` dans un projet React (Vite/CRA) ?",
    opts: [
      "Lance le serveur de développement",
      "Installe les dépendances",
      "Compile et optimise l'application pour la production",
      "Exécute les tests"
    ],
    ans: 2,
    exp: "Le script build transpile, minifie et bundle l'application pour la déployer en production."
  },
  {
    id: 89, topic: "OOP",
    q: "Qu'est-ce que la déstructuration d'objet ?",
    opts: [
      "Supprimer les propriétés d'un objet",
      "Extraire des valeurs d'un objet dans des variables distinctes : `const {a, b} = obj`",
      "Convertir un objet en tableau",
      "Cloner un objet"
    ],
    ans: 1,
    exp: "`const { nom, age } = personne` est plus lisible que `const nom = personne.nom; const age = personne.age;`"
  },
  {
    id: 90, topic: "DOM",
    q: "Qu'est-ce que la délégation d'événements ?",
    opts: [
      "Passer un événement à un composant React",
      "Attacher un écouteur sur un parent pour gérer les événements de ses enfants via le bubbling",
      "Dupliquer un gestionnaire sur plusieurs éléments",
      "Empêcher la propagation d'un événement"
    ],
    ans: 1,
    exp: "La délégation utilise le bubbling : un écouteur sur le parent capte les événements de tous ses enfants."
  },
  {
    id: 91, topic: "JS",
    q: "Quelle est la valeur de `!!0` ?",
    opts: ["0", "1", "true", "false"],
    ans: 3,
    exp: "!! convertit en booléen. 0 est falsy → !0 = true → !!0 = false."
  },
  {
    id: 92, topic: "React",
    q: "Que fait `useCallback` ?",
    opts: [
      "Mémorise le résultat d'un calcul coûteux",
      "Mémorise une fonction pour éviter de la recréer à chaque rendu",
      "Remplace useEffect",
      "Crée un ref mutable"
    ],
    ans: 1,
    exp: "useCallback mémorise une référence de fonction stable entre les rendus, utile pour éviter des re-rendus d'enfants."
  },
  {
    id: 93, topic: "OOP",
    q: "Que fait `JSON.stringify({ a: 1, b: 2 })` ?",
    opts: [
      "Parse une chaîne JSON",
      "Convertit l'objet en chaîne JSON : '{\"a\":1,\"b\":2}'",
      "Clone l'objet",
      "Retourne les clés de l'objet"
    ],
    ans: 1,
    exp: "JSON.stringify convertit un objet JS en chaîne JSON. JSON.parse fait l'inverse."
  },
  {
    id: 94, topic: "NPM",
    q: "Que signifie le `^` dans `\"react\": \"^18.2.0\"` ?",
    opts: [
      "Version exacte uniquement",
      "Compatibilité avec les mises à jour mineures et patches (≥18.2.0 et <19.0.0)",
      "N'importe quelle version de React",
      "Version minimale requise"
    ],
    ans: 1,
    exp: "^ autorise les mises à jour mineure et patch, mais pas les nouvelles versions majeures."
  },
  {
    id: 95, topic: "DOM",
    q: "Que fait `MutationObserver` ?",
    opts: [
      "Observe les changements réseau",
      "Observe les mutations du DOM (ajout/suppression d'éléments, changement d'attributs)",
      "Observe les changements d'état React",
      "Observe les erreurs JavaScript"
    ],
    ans: 1,
    exp: "MutationObserver permet de réagir aux changements dynamiques du DOM de façon asynchrone."
  },
  {
    id: 96, topic: "JS",
    q: "Qu'est-ce que async/await ?",
    opts: [
      "Une syntaxe pour créer des tableaux",
      "Une syntaxe sucre pour écrire du code asynchrone basé sur les Promises de façon synchrone",
      "Un type de boucle",
      "Une méthode de tableau"
    ],
    ans: 1,
    exp: "async/await rend le code asynchrone plus lisible. `await` met en pause l'exécution jusqu'à la résolution d'une Promise."
  },
  {
    id: 97, topic: "React",
    q: "Que fait `useMemo` ?",
    opts: [
      "Mémorise une fonction",
      "Mémorise le résultat d'un calcul coûteux pour éviter de le recalculer à chaque rendu",
      "Crée un état persistant",
      "Gère les effets de bord"
    ],
    ans: 1,
    exp: "useMemo mémorise une valeur calculée. Le calcul ne se relance que si les dépendances changent."
  },
  {
    id: 98, topic: "OOP",
    q: "Que fait `Object.assign({}, obj1, obj2)` ?",
    opts: [
      "Fusionne obj1 et obj2 dans un nouvel objet vide",
      "Compare obj1 et obj2",
      "Supprime les propriétés communes",
      "Clone uniquement obj1"
    ],
    ans: 0,
    exp: "Object.assign copie les propriétés de obj1 et obj2 dans {}, créant une fusion superficielle."
  },
  {
    id: 99, topic: "DOM",
    q: "Qu'est-ce que le virtual DOM de React ?",
    opts: [
      "Une copie du DOM stockée dans une base de données",
      "Une représentation légère en mémoire du DOM réel, utilisée pour optimiser les mises à jour",
      "Un DOM accessible uniquement en HTTPS",
      "Un DOM virtuel créé par le navigateur"
    ],
    ans: 1,
    exp: "React compare le Virtual DOM (avant/après) et ne met à jour que les parties du DOM réel qui ont changé."
  },
  {
    id: 100, topic: "React",
    q: "Quel est l'avantage principal des composants fonctionnels avec Hooks vs composants de classe ?",
    opts: [
      "Ils sont plus lents",
      "Ils ne supportent pas les props",
      "Code plus simple, moins de boilerplate, logique réutilisable via Custom Hooks",
      "Ils ne peuvent pas gérer l'état"
    ],
    ans: 2,
    exp: "Depuis React 16.8, les composants fonctionnels + Hooks sont l'approche recommandée : moins de code, meilleure testabilité."
  }
];

const TOPIC_COLORS = {
  JS:    { bg: "#EEF2FF", text: "#4338CA", border: "#C7D2FE" },
  OOP:   { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
  DOM:   { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  NPM:   { bg: "#FFF1F2", text: "#BE123C", border: "#FECDD3" },
  React: { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
};

function TopicBadge({ topic }) {
  const c = TOPIC_COLORS[topic] || {};
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: 99,
      fontSize: 12,
      fontWeight: 500,
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
      letterSpacing: "0.02em",
    }}>{topic}</span>
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function App() {
  // Dark Mode Logic merged here!
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Quiz State
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState([]);
  const [done, setDone] = useState(false);
  const [topicFilter, setTopicFilter] = useState("Toutes");
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [showExp, setShowExp] = useState({});
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const topics = ["Toutes", "JS", "OOP", "DOM", "NPM", "React"];

  const buildQuiz = useCallback((filter) => {
    let pool = filter === "Toutes" ? ALL_QUESTIONS : ALL_QUESTIONS.filter(q => q.topic === filter);
    const shuffled = shuffle(pool);
    setQuestions(shuffled);
    setCurrent(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setWrong([]);
    setDone(false);
    setReviewMode(false);
    setShowExp({});
    setTimeLeft(shuffled.length * 30);
    setTimerActive(true);
  }, []);

  useEffect(() => {
    if (!timerActive || done) return;
    if (timeLeft <= 0) { setDone(true); setTimerActive(false); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timerActive, timeLeft, done]);

  function handleStart() {
    buildQuiz(topicFilter);
    setStarted(true);
  }

  function handleSelect(idx) {
    if (confirmed) return;
    setSelected(idx);
  }

  function handleConfirm() {
    if (selected === null || confirmed) return;
    setConfirmed(true);
    const q = questions[current];
    if (selected === q.ans) {
      setScore(s => s + 1);
    } else {
      setWrong(w => [...w, { ...q, userAns: selected }]);
    }
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setDone(true);
      setTimerActive(false);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setConfirmed(false);
    }
  }

  function toggleExp(id) {
    setShowExp(e => ({ ...e, [id]: !e[id] }));
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;

  // ── ÉCRAN D'ACCUEIL ──
  if (!started) {
    return (
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <h2 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
            Quiz — Programmation Web 2
          </h2>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              background: "var(--color-background-secondary)",
              border: "1px solid var(--color-border-secondary)",
              color: "var(--color-text-primary)",
              borderRadius: "50%",
              width: 36,
              height: 36,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16
            }}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem", fontSize: 15 }}>
          100 questions couvrant JavaScript, POO, DOM, NPM et React. Choisissez un thème ou testez tout.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1.5rem" }}>
          {topics.map(t => {
            const active = topicFilter === t;
            const c = TOPIC_COLORS[t] || {};
            return (
              <button
                key={t}
                onClick={() => setTopicFilter(t)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 99,
                  border: active ? `2px solid ${c.text || "#4338CA"}` : "1px solid var(--color-border-tertiary)",
                  background: active ? (c.bg || "var(--color-background-info)") : "var(--color-background-primary)",
                  color: active ? (c.text || "var(--color-text-info)") : "var(--color-text-secondary)",
                  fontWeight: active ? 500 : 400,
                  cursor: "pointer",
                  fontSize: 14,
                  transition: "all 0.15s",
                }}
              >{t}</button>
            );
          })}
        </div>

        <div style={{
          background: "var(--color-background-secondary)",
          borderRadius: "var(--border-radius-lg)",
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          fontSize: 14,
          color: "var(--color-text-secondary)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
        }}>
          {[
            { label: "Total questions", val: topicFilter === "Toutes" ? 100 : ALL_QUESTIONS.filter(q => q.topic === topicFilter).length },
            { label: "Temps estimé", val: topicFilter === "Toutes" ? "~50 min" : `~${ALL_QUESTIONS.filter(q => q.topic === topicFilter).length * 0.5} min` },
            { label: "Thèmes", val: "JS · OOP · DOM · NPM · React" },
          ].map(({ label, val }) => (
            <div key={label}>
              <div style={{ fontSize: 12, marginBottom: 2 }}>{label}</div>
              <div style={{ fontWeight: 500, color: "var(--color-text-primary)", fontSize: 15 }}>{val}</div>
            </div>
          ))}
        </div>

        <button onClick={handleStart} style={{
          padding: "10px 32px",
          borderRadius: "var(--border-radius-md)",
          background: "var(--color-background-primary)",
          color: "var(--color-text-primary)",
          border: "1px solid var(--color-border-secondary)",
          fontWeight: 500,
          fontSize: 15,
          cursor: "pointer",
        }}>
          Démarrer le quiz ↗
        </button>
      </div>
    );
  }

  // ── RÉSULTATS ──
  if (done) {
    if (reviewMode) {
      const item = wrong[reviewIdx];
      return (
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "1.5rem 1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
            <button onClick={() => setReviewMode(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", fontSize: 14 }}>
              ← Retour aux résultats
            </button>
            <span style={{ color: "var(--color-text-tertiary)", fontSize: 13 }}>{reviewIdx + 1} / {wrong.length}</span>
          </div>

          <div style={{ marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
            <TopicBadge topic={item.topic} />
            <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>Q{item.id}</span>
          </div>

          <p style={{ fontWeight: 500, marginBottom: "1rem", fontSize: 15, whiteSpace: "pre-wrap", lineHeight: 1.6, color: "var(--color-text-primary)" }}>{item.q}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1rem" }}>
            {item.opts.map((opt, i) => {
              const isCorrect = i === item.ans;
              const isUser = i === item.userAns;
              let bg = "var(--color-background-secondary)";
              let border = "var(--color-border-tertiary)";
              let color = "var(--color-text-primary)";
              if (isCorrect) { bg = "#F0FDF4"; border = "#86EFAC"; color = "#15803D"; }
              if (isUser && !isCorrect) { bg = "#FFF1F2"; border = "#FCA5A5"; color = "#BE123C"; }
              return (
                <div key={i} style={{
                  padding: "10px 14px",
                  borderRadius: "var(--border-radius-md)",
                  border: `1px solid ${border}`,
                  background: bg,
                  fontSize: 14,
                  color,
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}>
                  {isCorrect ? "✓" : isUser ? "✗" : "○"} {opt}
                </div>
              );
            })}
          </div>

          <div style={{
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            borderRadius: "var(--border-radius-md)",
            padding: "10px 14px",
            fontSize: 14,
            color: "#1D4ED8",
            lineHeight: 1.6,
          }}>
            <strong>Explication :</strong> {item.exp}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: "1rem" }}>
            <button onClick={() => setReviewIdx(i => Math.max(0, i - 1))} disabled={reviewIdx === 0} style={{ padding: "8px 16px", borderRadius: "var(--border-radius-md)", border: "1px solid var(--color-border-secondary)", cursor: "pointer", fontSize: 14, background: "var(--color-background-primary)", color: "var(--color-text-primary)" }}>← Précédent</button>
            <button onClick={() => setReviewIdx(i => Math.min(wrong.length - 1, i + 1))} disabled={reviewIdx === wrong.length - 1} style={{ padding: "8px 16px", borderRadius: "var(--border-radius-md)", border: "1px solid var(--color-border-secondary)", cursor: "pointer", fontSize: 14, background: "var(--color-background-primary)", color: "var(--color-text-primary)" }}>Suivant →</button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "1.5rem 1rem" }}>
        <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: "1rem", color: "var(--color-text-primary)" }}>Résultats</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: "1.5rem" }}>
          {[
            { label: "Score", val: `${score} / ${questions.length}` },
            { label: "Pourcentage", val: `${pct}%` },
            { label: "Mention", val: pct >= 85 ? "Excellent" : pct >= 70 ? "Bon" : pct >= 50 ? "Moyen" : "À revoir" },
          ].map(({ label, val }) => (
            <div key={label} style={{
              background: "var(--color-background-secondary)",
              borderRadius: "var(--border-radius-md)",
              padding: "1rem",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>{label}</div>
              <div style={{ fontWeight: 500, fontSize: 20, color: "var(--color-text-primary)" }}>{val}</div>
            </div>
          ))}
        </div>

        <div style={{
          background: "var(--color-background-secondary)",
          borderRadius: "var(--border-radius-md)",
          height: 8,
          marginBottom: "1.5rem",
          overflow: "hidden",
        }}>
          <div style={{
            width: `${pct}%`,
            height: "100%",
            background: pct >= 70 ? "#22C55E" : pct >= 50 ? "#F59E0B" : "#EF4444",
            borderRadius: 99,
            transition: "width 0.6s ease",
          }} />
        </div>

        {wrong.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontWeight: 500, marginBottom: 8, fontSize: 15, color: "var(--color-text-primary)" }}>Questions ratées ({wrong.length})</p>
            {wrong.map((q, i) => (
              <div key={q.id} style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 0",
                borderBottom: "0.5px solid var(--color-border-tertiary)",
              }}>
                <TopicBadge topic={q.topic} />
                <span style={{ fontSize: 14, color: "var(--color-text-secondary)", flex: 1 }}>Q{q.id} — {q.q.length > 60 ? q.q.slice(0, 60) + "…" : q.q}</span>
                <button onClick={() => { setReviewIdx(i); setReviewMode(true); }} style={{
                  fontSize: 12,
                  padding: "4px 10px",
                  borderRadius: "var(--border-radius-md)",
                  border: "1px solid var(--color-border-secondary)",
                  cursor: "pointer",
                  background: "var(--color-background-primary)",
                  color: "var(--color-text-secondary)",
                }}>Voir</button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => { setStarted(false); }} style={{
            padding: "9px 20px",
            borderRadius: "var(--border-radius-md)",
            border: "1px solid var(--color-border-secondary)",
            cursor: "pointer",
            fontSize: 14,
            background: "var(--color-background-primary)",
            color: "var(--color-text-primary)",
          }}>← Accueil</button>
          <button onClick={() => buildQuiz(topicFilter)} style={{
            padding: "9px 20px",
            borderRadius: "var(--border-radius-md)",
            border: "1px solid var(--color-border-secondary)",
            cursor: "pointer",
            fontSize: 14,
            background: "var(--color-background-primary)",
            color: "var(--color-text-primary)",
          }}>Recommencer ↗</button>
        </div>
      </div>
    );
  }

  // ── QUESTION EN COURS ──
  const q = questions[current];
  const progress = ((current) / questions.length) * 100;
  const timerPct = (timeLeft / (questions.length * 30)) * 100;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "1.5rem 1rem" }}>
      {/* En-tête */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
          Question {current + 1} / {questions.length}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{
            fontSize: 13,
            fontWeight: 500,
            color: timeLeft < 60 ? "#EF4444" : "var(--color-text-secondary)",
            fontFamily: "var(--font-mono)",
          }}>
            ⏱ {formatTime(timeLeft)}
          </span>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: 0
            }}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* Barre de progression */}
      <div style={{ background: "var(--color-background-secondary)", borderRadius: 99, height: 4, marginBottom: 4, overflow: "hidden" }}>
        <div style={{ width: `${progress}%`, height: "100%", background: "#818CF8", borderRadius: 99 }} />
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: 99, height: 3, marginBottom: "1rem", overflow: "hidden" }}>
        <div style={{
          width: `${timerPct}%`,
          height: "100%",
          background: timeLeft < 60 ? "#EF4444" : "#34D399",
          borderRadius: 99,
          transition: "width 1s linear",
        }} />
      </div>

      {/* Topic + score */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" }}>
        <TopicBadge topic={q.topic} />
        <span style={{ fontSize: 13, color: "var(--color-text-tertiary)", marginLeft: "auto" }}>
          Score actuel : {score}
        </span>
      </div>

      {/* Question */}
      <p style={{
        fontWeight: 500,
        fontSize: 15,
        lineHeight: 1.65,
        marginBottom: "1rem",
        whiteSpace: "pre-wrap",
        color: "var(--color-text-primary)",
      }}>{q.q}</p>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1rem" }}>
        {q.opts.map((opt, i) => {
          let bg = "var(--color-background-primary)";
          let border = "0.5px solid var(--color-border-tertiary)";
          let color = "var(--color-text-primary)";
          let cursor = "pointer";

          if (!confirmed) {
            if (selected === i) {
              bg = "#EEF2FF";
              border = "2px solid #6366F1";
              color = "#4338CA";
            }
          } else {
            if (i === q.ans) {
              bg = "#F0FDF4";
              border = "1px solid #86EFAC";
              color = "#15803D";
            } else if (i === selected && i !== q.ans) {
              bg = "#FFF1F2";
              border = "1px solid #FCA5A5";
              color = "#BE123C";
            }
            cursor = "default";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              style={{
                padding: "11px 14px",
                borderRadius: "var(--border-radius-md)",
                border,
                background: bg,
                color,
                fontSize: 14,
                textAlign: "left",
                cursor,
                display: "flex",
                alignItems: "center",
                gap: 10,
                transition: "background 0.12s, border 0.12s",
              }}
            >
              <span style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                border: "0.5px solid var(--color-border-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 500,
                background: "var(--color-background-secondary)",
                flexShrink: 0,
                color: "var(--color-text-secondary)",
              }}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
              {confirmed && i === q.ans && (
                <span style={{ marginLeft: "auto", fontSize: 16 }}>✓</span>
              )}
              {confirmed && i === selected && i !== q.ans && (
                <span style={{ marginLeft: "auto", fontSize: 16 }}>✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explication */}
      {confirmed && (
        <div style={{
          background: selected === q.ans ? "#F0FDF4" : "#FFF1F2",
          border: `1px solid ${selected === q.ans ? "#86EFAC" : "#FCA5A5"}`,
          borderRadius: "var(--border-radius-md)",
          padding: "10px 14px",
          fontSize: 14,
          lineHeight: 1.6,
          color: selected === q.ans ? "#15803D" : "#BE123C",
          marginBottom: "1rem",
        }}>
          {selected === q.ans ? "✓ Bonne réponse ! " : "✗ Mauvaise réponse. "}
          <span style={{ color: "var(--color-text-primary)" }}>{q.exp}</span>
        </div>
      )}

      {/* Boutons */}
      <div style={{ display: "flex", gap: 8 }}>
        {!confirmed ? (
          <button
            onClick={handleConfirm}
            disabled={selected === null}
            style={{
              padding: "9px 24px",
              borderRadius: "var(--border-radius-md)",
              border: "1px solid var(--color-border-secondary)",
              background: selected !== null ? "var(--color-background-primary)" : "var(--color-background-secondary)",
              color: selected !== null ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
              fontWeight: 500,
              cursor: selected !== null ? "pointer" : "not-allowed",
              fontSize: 14,
            }}
          >Valider</button>
        ) : (
          <button onClick={handleNext} style={{
            padding: "9px 24px",
            borderRadius: "var(--border-radius-md)",
            border: "1px solid var(--color-border-secondary)",
            background: "var(--color-background-primary)",
            color: "var(--color-text-primary)",
            fontWeight: 500,
            cursor: "pointer",
            fontSize: 14,
          }}>
            {current + 1 >= questions.length ? "Voir les résultats ↗" : "Question suivante →"}
          </button>
        )}
        <button onClick={() => { setStarted(false); setTimerActive(false); }} style={{
          padding: "9px 16px",
          borderRadius: "var(--border-radius-md)",
          border: "1px solid var(--color-border-tertiary)",
          background: "none",
          cursor: "pointer",
          fontSize: 14,
          color: "var(--color-text-tertiary)",
        }}>Quitter</button>
      </div>
    </div>
  );
}