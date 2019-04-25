# GsAdmin

Un projet  [Angular CLI](https://github.com/angular/angular-cli) version 7.3.6.

###### Présentation
** GeneSiS admin ** permet d'administrer * * GeneSiS engine * * qui permet de créer des mocks de services.

> Plus de détail sur [Gs-engine](https://github.com/ChamsII/gs_engine)


## Installation

```Shell
mkdir genesis
cd genesis
git clone https://github.com/ChamsII/gs_admin.git
cd gs_admin
npm install
```

## Configuration

L'admin peut re configuré en modifiant le fichier agents.json

```JSON
{
    "agents": [
        {
            "id": 1,
            "name": "fervent_fermat",
            "hostname": "localhost",
            "admin_port": "9085",
            "agent_port": "9876",
            "docker": true
        },
        {
            "id": 2,
            "name": "frosty_knuth",
            "hostname": "localhost",
            "admin_port": "9085",
            "agent_port": "9877",
            "docker": true
        }
    ]
}
```


## Development server

Exécutez `ng serve` pour un serveur de développement. Accédez à `http://localhost:4200/`. L'application sera automatiquement rechargée si vous modifiez l'un des fichiers source.

## Build

Exécutez `ng build` pour construire le projet. Les artefacts de construction seront stockés dans le répertoire `dist/`. Utilisez l'indicateur `--prod` pour une version de production.


