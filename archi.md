```
  
src/app/
├── core/
│   ├── base/                          # Classes de base réutilisables
│   │   ├── base-crud.service.ts       # Service CRUD générique
│   │   ├── base-list.component.ts     # Composant liste générique
│   │   ├── base-form.component.ts     # Composant formulaire générique
│   │   ├── base-detail.component.ts   # Composant détail générique
│   │   └── base.interfaces.ts         # Interfaces de base
│   ├── services/
│   │   ├── action.service.ts          # Gestion des actions par rôle
│   │   └── permission.service.ts      # Gestion des permissions
│   └── interfaces/
│       ├── crud-config.interface.ts   # Configuration CRUD
│       └── action.interface.ts        # Interface des actions

├── shared/
│   ├── components/
│   │   ├── generic-crud/              # Composants CRUD génériques
│   │   │   ├── generic-list/
│   │   │   ├── generic-form/
│   │   │   ├── generic-detail/
│   │   │   └── generic-crud-routing/
│   │   └── action-buttons/            # Boutons d'actions réutilisables
│   └── pipes/
│       └── action-filter.pipe.ts      # Filtre les actions selon les rôles

├── features/
│   ├── enquete/
│   │   ├── models/enquete.model.ts
│   │   ├── services/enquete.service.ts
│   │   ├── config/enquete-crud.config.ts
│   │   ├── components/
│   │   │   ├── enquete-list/          # Hérite de GenericListComponent
│   │   │   ├── enquete-form/          # Hérite de GenericFormComponent
│   │   │   └── enquete-detail/        # Hérite de GenericDetailComponent
│   │   └── enquete.module.ts
│   │
│   ├── demande/                       # Structure identique
│   ├── document/                      # Structure identique
│   ├── source-info/                   # Structure identique
│   ├── conclusion/                    # Structure identique
│   ├── utilisateur/                   # Structure identique
│   └── parametrage/
│       ├── profil/
│       ├── securite/
│       ├── preference/
│       └── app/
│           ├── type-document/
│           └── type-source/

```


 