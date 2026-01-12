# Authentication-security-firebase

# 🔐 Angular 20 + Firebase Authentication & Roles (Zoneless)

> Projet de démonstration **Angular 20 (standalone, zoneless)** 
intégrant **Firebase Authentication**, **Firestore**, et une **gestion complète des rôles** (*user / moderator / admin*) 
avec **sécurité réellement appliquée côté backend (Firestore Rules)**.

---

## ✨ Fonctionnalités

- ✅ Angular **20** (Standalone Components)
- ⚡ **Zoneless Change Detection**
- 🔥 Firebase Authentication (Email / Password)
- 🗄️ Firestore Database
- 👥 Gestion des rôles :
  - **user** → lecture seule
  - **moderator** → création & modification
  - **admin** → tous les droits + gestion des rôles
- 🛡️ Sécurité **enforced par Firestore Rules**
- 🔐 Guards Angular basés sur les rôles
- 🧠 Architecture moderne (DI, Signals, async pipe)

---

## 🧱 Architecture du projet

src/app
├── app.config.ts # Zoneless + Firebase providers
├── app.routes.ts # Routing + role guards
├── firebase.config.ts # Firebase configuration
│
├── auth/
│ ├── auth.service.ts # Firebase Auth + gestion des rôles
│ ├── role.guard.ts # Guard basé sur les rôles
│ ├── login/
│ │ └── login.ts
│ ├── register/
│ │ └── register.ts
│ └── posts/
│ └── posts.ts # UI Posts (role-aware)
│
├── admin/
│ ├── admin.service.ts # Gestion des utilisateurs & rôles
│ └── admin/
│ └── admin.ts # Admin panel
│
├── posts/
│ └── posts.service.ts # Firestore CRUD Posts
│
└── shared/
└── forbidden.ts # Page 403

yaml
Copier le code

---

## 🧪 Modèle de données Firestore

### 🔹 Collection `users`
`users/{uid}`

```json
{
  "email": "user@email.com",
  "role": "user",
  "createdAt": "timestamp"
}
🔹 Collection posts
posts/{postId}

json
Copier le code
{
  "title": "Post title",
  "content": "Post content",
  "updatedBy": "uid",
  "updatedAt": "timestamp"
}
🛡️ Firestore Security Rules
Les rôles sont appliqués côté backend, indépendamment du front-end.

js
Copier le code
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function signedIn() {
      return request.auth != null;
    }

    function role() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }

    function isAdmin() {
      return signedIn() && role() == "admin";
    }

    function isModerator() {
      return signedIn() && (role() == "moderator" || role() == "admin");
    }

    match /users/{uid} {
      allow read: if signedIn() && request.auth.uid == uid;
      allow create: if signedIn()
                    && request.auth.uid == uid
                    && request.resource.data.role == "user";
      allow update, delete: if isAdmin();
    }

    match /posts/{postId} {
      allow read: if signedIn();
      allow create, update: if isModerator();
      allow delete: if isAdmin();
    }
  }
}
🔐 Gestion des rôles
Rôle	Lecture	Création	Modification	Suppression	Admin panel
user	✅	❌	❌	❌	❌
moderator	✅	✅	✅	❌	❌
admin	✅	✅	✅	✅	✅

🚦 Guards Angular (role-based routing)
ts
Copier le code
{
  path: 'admin',
  component: Admin,
  canMatch: [roleGuard(['admin'])]
}
Les utilisateurs non autorisés sont redirigés vers /forbidden.

⚡ Angular Zoneless
Le projet fonctionne sans Zone.js :

ts
Copier le code
providers: [
  provideZonelessChangeDetection(),
  provideRouter(routes),
  provideFirebaseApp(() => initializeApp(firebaseConfig)),
  provideAuth(() => getAuth()),
  provideFirestore(() => getFirestore()),
]
❌ Pas de zone.js

✅ UI réactive via Signals et async pipe

✅ Compatible AngularFire

▶️ Lancer le projet en local
1️⃣ Installer les dépendances



npm install
2️⃣ Configurer Firebase
src/app/firebase.config.ts


export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  appId: "..."
};
3️⃣ Activer Email / Password
Firebase Console → Authentication → Sign-in method → Email/Password

4️⃣ Lancer l’application


ng serve
➡️ http://localhost:4200

🧪 Scénario de test
Créer un compte utilisateur (role = user)

Modifier son rôle en admin via Firestore Console

Se reconnecter → accès à /admin

Créer d’autres comptes

Assigner moderator / user

Tester les permissions CRUD

⚠️ Notes importantes
Les rôles ne sont jamais décidés côté front

Firestore Rules bloquent toute action non autorisée

Le warning AngularFire en console est normal en zoneless + dev

🚀 Évolutions possibles
Custom Claims (Firebase Functions)

Ownership des documents

Audit log des rôles

UI / UX améliorée

Auth Google / OAuth

SSR / Hydration

👤 karl YEGBE
Projet Angular 20 + Firebase
Conçu pour démontrer une authentification sécurisée, scalable et moderne.
