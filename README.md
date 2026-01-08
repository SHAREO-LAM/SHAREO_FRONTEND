# Shareo - Frontend

Frontend de l'application **Shareo**, développé en Vue 3 avec TypeScript.  
Cette application utilise **SCSS**, **PrimeVue** pour l'UI, **Pinia** pour la gestion d'état, et **Axios** pour les appels API.  
Les tests end-to-end sont réalisés avec **Playwright**.

---

## Table des matières

- [Technologies](#technologies)  
- [Installation](#installation)  
- [Structure du projet](#structure-du-projet)  
- [Configuration des variables d'environnement](#configuration-des-variables-denvironnement)  
- [Plugins](#plugins)  
- [Stores](#stores)  
- [Services](#services)  
- [Tests E2E](#tests-e2e)  
- [Scripts](#scripts)  
- [Conventions](#conventions)  

---

## Technologies

- [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)  
- [Vite](https://vitejs.dev/)  
- [PrimeVue](https://www.primefaces.org/primevue/)  
- [Pinia](https://pinia.vuejs.org/)  
- [Axios](https://axios-http.com/)  
- [Playwright](https://playwright.dev/) pour les tests end-to-end  

---

## Installation

1. Cloner le projet :  
```bash
git clone <repository-url>
cd shareo-frontend
```

2. Installer kes dépendances :
```bash
npm install
```

3. Créer le fichier .env à la racine (exemple minimal) :
```bash
VITE_API_BASE_URL=https://api.monapp.com
VITE_API_TIMEOUT_MS=5000
```

4. Lancer le serveur de développement :
```bash
npm run dev
```



## Récapitulatif Technique du Projet

---

### Plugins & UI

Ce projet utilise **PrimeVue** pour la bibliothèque de composants UI.

* **Composants de base** : Nombreux composants (Boutons, Inputs, Dialogues, Tables, etc.) sont enregistrés **globalement** pour une utilisation aisée.
    ```javascript
    // Extrait du Plugin PrimeVue
    app.component('Button', Button)
    // ... plusieurs autres composants
    app.component('Toast', Toast)
    ```
* **Notifications** : Le `ToastService` est employé pour les **notifications globales**.
* **Styling** : Le style principal repose sur **SCSS**, avec une personnalisation limitée de certains composants PrimeVue.

---

### Gestion d'État (Stores)

L'état global est géré via **Pinia**. Les stores sont organisés par domaine métier :

* `userStore.ts` : Gestion des **utilisateurs** et des **permissions**.
* `authStore.ts` : Gestion de l'**authentification**.

**Exemple d'utilisation :**
```javascript
import { useUserStore } from '@/store/userStore'
const userStore = useUserStore()
userStore.fetchUsers()
```

### Tests & Scripts

Tests E2E
Outil : Playwright est utilisé pour les tests de bout en bout.

Exécution :

```bash
npm run test:e2e
```