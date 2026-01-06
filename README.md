# Raccourcis développeur

Une extension de navigateur Chrome/Edge offrant une collection complète d'outils pratiques pour les développeurs. Tous les outils sont accessibles directement depuis la barre d'outils de votre navigateur.

## 🚀 Fonctionnalités

### 📋 Outils disponibles

1. **UUID Generator**
   - Génération d'UUID v4 (aléatoire)
   - Génération d'UUID v1 (basé sur le temps)
   - Génération multiple (5 UUIDs à la fois)
   - Copie en un clic

2. **JSON Formatter**
   - Formatage JSON avec indentation
   - Minification JSON
   - Validation JSON avec messages d'erreur détaillés

3. **Base64 Encoder/Decoder**
   - Encodage de texte en Base64
   - Décodage de Base64 en texte
   - Support des caractères Unicode

4. **Color Picker**
   - Sélecteur de couleur visuel
   - Saisie manuelle HEX et RGB
   - Conversion automatique HEX ↔ RGB
   - **Pipette de couleur** : capturez les couleurs directement depuis les pages web
   - Aperçu en temps réel

5. **URL Encoder/Decoder**
   - Encodage d'URL
   - Décodage d'URL
   - Support des caractères spéciaux

6. **Hash Generator**
   - MD5
   - SHA-1
   - SHA-256
   - SHA-512
   - Copie rapide du hash généré

7. **Timestamp Converter**
   - Conversion Timestamp Unix → Date
   - Conversion Date → Timestamp Unix
   - Affichage UTC et locale
   - Utilisation de l'heure actuelle

8. **Password Generator**
   - Longueur personnalisable (4-128 caractères)
   - Options : majuscules, minuscules, chiffres, symboles
   - Exclusion des caractères similaires (i, l, 1, L, o, 0, O)

9. **Regex Tester**
   - Test d'expressions régulières
   - Support des flags (g, i, m, etc.)
   - Affichage des correspondances avec positions
   - Détection des groupes de capture

10. **Base Converter**
    - Conversion entre bases : Binaire, Octal, Décimal, Hexadécimal
    - Support BCD (Binary Coded Decimal)
    - Affichage simultané dans toutes les bases

11. **Diff Checker**
    - Comparaison de deux textes
    - Affichage des différences ligne par ligne
    - Format diff standard

12. **Minifier**
    - Minification CSS
    - Minification HTML
    - Suppression des commentaires et espaces inutiles

13. **HTML Formatter**
    - Formatage HTML avec indentation
    - Structure lisible

14. **Lorem Ipsum Generator**
    - Génération par paragraphes, mots, phrases ou caractères
    - Quantité personnalisable

## 📦 Installation

### Depuis le code source

1. Clonez ou téléchargez ce dépôt
2. Ouvrez Chrome/Edge et allez dans `chrome://extensions/` (ou `edge://extensions/`)
3. Activez le **Mode développeur** (en haut à droite)
4. Cliquez sur **Charger l'extension non empaquetée**
5. Sélectionnez le dossier du projet

## 🎨 Interface

- **Design moderne** avec dégradés bleus
- **Navigation par onglets** avec défilement horizontal
- **Interface responsive** et intuitive
- **Notifications** pour les actions réussies/échouées
- **Copie en un clic** pour tous les résultats

## 🔧 Structure du projet

```
Raccourcis développeur/
├── manifest.json          # Configuration de l'extension
├── popup.html             # Interface utilisateur
├── popup.js               # Logique principale
├── content.js             # Script de contenu (pipette de couleur)
├── styles.css             # Styles de l'interface
└── icons/                 # Dossier des icônes
    ├── icon.svg
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 🛠️ Technologies utilisées

- **Manifest V3** (dernière version des extensions Chrome)
- **JavaScript vanilla** (pas de dépendances)
- **HTML5/CSS3**
- **Web Crypto API** (pour les hash)
- **EyeDropper API** (pour la pipette de couleur native)
- **Chrome Storage API** (pour la communication entre popup et content script)

## 📝 Permissions

L'extension nécessite les permissions suivantes :

- `activeTab` : Pour accéder à l'onglet actif (pipette de couleur)
- `storage` : Pour stocker temporairement les couleurs capturées
- `<all_urls>` : Pour injecter le content script sur toutes les pages

**Note** : Aucune donnée n'est collectée ou envoyée à l'extérieur. Tous les traitements sont effectués localement dans votre navigateur.

## 🎯 Utilisation

1. Cliquez sur l'icône de l'extension dans la barre d'outils
2. Naviguez entre les onglets pour accéder aux différents outils
3. Utilisez les outils selon vos besoins
4. Copiez les résultats avec les boutons de copie ou les raccourcis clavier

### Pipette de couleur

1. Ouvrez l'onglet **Couleurs**
2. Cliquez sur **Activer la pipette**
3. Survolez les éléments de la page pour voir leur couleur
4. Cliquez pour capturer la couleur
5. La couleur sera automatiquement chargée dans l'outil

## 🔒 Confidentialité

- ✅ Aucune collecte de données
- ✅ Aucune connexion réseau
- ✅ Tous les traitements sont locaux
- ✅ Code source ouvert

## 📄 Licence

Ce projet est libre d'utilisation. Vous pouvez le modifier et le distribuer selon vos besoins.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer le code existant
- Améliorer la documentation

## 📧 Support

Pour toute question ou problème, ouvrez une issue sur le dépôt du projet.

---

**Développé avec ❤️ pour les développeurs**

