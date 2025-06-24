swagger_spec = {
    "openapi": "3.0.0",
    "info": {
        "title": "Cooloc",
        "description": "API REST de gestion de collocations",
        "version": "0.0.0"
    },
    "servers": [
        {
            "url": "http://localhost:8000",
            "description": "Serveur python local"
        }
    ],
    "paths": {
        "/login": {
            "post": {
                "tags": ["Authentification"],
                "summary": "Connexion",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "mail": {"type": "string"},
                                    "mdp": {"type": "string"},
                                    "csrf": {"type": "string"}
                                },
                                "required": ["mail", "mdp", "csrf"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Connexion réussie",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "integer"},
                                        "data": {
                                            "type": "object",
                                            "properties": {
                                                "mail": {"type": "string"},
                                                "role": {"type": "string"},
                                                "prenom": {"type": "string"},
                                                "nom": {"type": "string"}
                                            }
                                        },
                                        "token": {"type": "string"},
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "CSRF invalide"
                    },
                    "400": {
                        "description": "Champs manquants ou identifiants incorrects"
                    }
                }
            }
        },
        "/register": {
            "post": {
                "tags": ["Authentification"],
                "summary": "Inscription",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "nom": {"type": "string"},
                                    "prenom": {"type": "string"},
                                    "mail": {"type": "string"},
                                    "mdp": {"type": "string"},
                                    "csrf": {"type": "string"},
                                },
                                "required": ["mail", "mdp", "nom", "prenom", "csrf"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Inscription réussie"
                    },
                    "400": {
                        "description": "Champs manquants ou email déjà existant ou caractères spéciaux non autorisés"
                    },
                    "403": {
                        "description": "CSRF invalide"
                    }
                }
            }
        },
        "/coloc/utilisateurs/voir": {
            "get": {
                "tags": ["Colocation"],
                "summary": "Voir les utilisateurs d'une colocation",
                "parameters": [
                    {
                        "name": "id_coloc",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "integer"}
                    },
                    {
                        "name": "role",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string", "enum": ["colocataire", "responsable", "admin"]}
                    },
                    {
                        "name": "mail",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "csrf",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "token",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Liste des utilisateurs récupérée",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "integer"},
                                        "message": {"type": "string"},
                                        "infos": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/components/schemas/Utilisateur"
                                            }
                                        },
                                        "infos_responsable": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/components/schemas/Utilisateur"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "Token invalide ou CSRF invalide ou rôle insuffisant"
                    },
                    "404": {
                        "description": "Colocation non trouvée"
                    }
                }
            }
        },
        "/coloc/voir": {
            "get": {
                "tags": ["Colocation"],
                "summary": "Voir les informations d'une colocation",
                "parameters": [
                    {
                        "name": "id_coloc",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "integer"}
                    },
                    {
                        "name": "mail",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "csrf",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "token",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "role",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string", "enum": ["colocataire", "responsable", "admin"]}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Informations de la colocation",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Colocation"
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "Token invalide ou CSRF invalide ou rôle insuffisant"
                    },
                    "404": {
                        "description": "Colocation non trouvée"
                    }
                }
            }
        },
        "/coloc/creer": {
            "post": {
                "tags": ["Colocation"],
                "summary": "Créer une colocation",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "mail": {"type": "string"},
                                    "token": {"type": "string"},
                                    "csrf": {"type": "string"},
                                    "nom": {"type": "string"},
                                    "role": {"type": "string", "enum": ["colocataire", "responsable", "admin"]},
                                },
                                "required": ["nom", "mail", "token", "csrf", "role"]
                            }
                        }
                    }
                },
                "responses": {
                    "201": {
                        "description": "Colocation créée avec succès",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "integer"},
                                        "message": {"type": "string"}
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "Token invalide ou CSRF invalide ou rôle insuffisant ou utilisateur déjà dans une colocation"
                    },
                    "400": {
                        "description": "Champs manquants ou caractères spéciaux non autorisés"
                    },
                    "500": {
                        "description": "Erreur interne du serveur"
                    }
                }
            }
        },
        "/coloc/supprimer": {
            "post": {
                "tags": ["Colocation"],
                "summary": "Supprimer une colocation",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id_coloc": {"type": "integer"},
                                    "mail": {"type": "string"},
                                    "token": {"type": "string"},
                                    "csrf": {"type": "string"}
                                },
                                "required": ["id_coloc", "mail", "token", "csrf"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Colocation supprimée avec succès",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "integer"},
                                        "message": {"type": "string"}
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "Token invalide ou CSRF invalide ou rôle insuffisant"
                    },
                    "404": {
                        "description": "Colocation non trouvée"
                    }
                }
            }
        },
        "/coloc/maj/nom": {
            "put": {
                "tags": ["Colocation"],
                "summary": "Modifier le nom d'une colocation",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id_coloc": {"type": "integer"},
                                    "nom": {"type": "string"},
                                    "mail": {"type": "string"},
                                    "token": {"type": "string"},
                                    "csrf": {"type": "string"}
                                },
                                "required": ["nom", "id_coloc", "mail", "token", "csrf"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Nom modifié avec succès",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "integer"},
                                        "message": {"type": "string"}
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "Token invalide ou CSRF invalide ou rôle insuffisant"
                    },
                    "404": {
                        "description": "Colocation non trouvée"
                    }
                }
            }
        },
        "/coloc/utilisateurs/ajouter": {
            "put": {
                "tags": ["Colocation"],
                "summary": "Ajouter des utilisateurs à une colocation",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id_coloc": {"type": "integer"},
                                    "utilisateurs": {
                                        "type": "array",
                                        "items": {"type": "string"}
                                    },
                                    "mail": {"type": "string"},
                                    "token": {"type": "string"},
                                    "csrf": {"type": "string"}
                                },
                                "required": ["id_coloc", "utilisateurs", "mail", "token", "csrf"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Utilisateurs ajoutés avec succès",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "integer"},
                                        "message": {"type": "string"}
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "Token invalide ou CSRF invalide ou rôle insuffisant"
                    },
                    "404": {
                        "description": "Colocation ou utilisateurs non trouvés"
                    }
                }
            }
        },
        "/coloc/utilisateurs/supprimer": {
            "put": {
                "tags": ["Colocation"],
                "summary": "Supprimer des utilisateurs d'une colocation",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id_coloc": {"type": "integer"},
                                    "utilisateurs": {
                                        "type": "array",
                                        "items": {"type": "string"}
                                    },
                                    "mail": {"type": "string"},
                                    "token": {"type": "string"},
                                    "csrf": {"type": "string"}
                                },
                                "required": ["id_coloc", "utilisateurs", "mail", "token", "csrf"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Utilisateurs supprimés avec succès",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "integer"},
                                        "message": {"type": "string"}
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "Token invalide ou CSRF invalide ou rôle insuffisant"
                    },
                    "404": {
                        "description": "Colocation ou utilisateurs non trouvés"
                    }
                }
            }
        },
        "/profil/voir": {
            "get": {
                "tags": ["Utilisateur"],
                "summary": "Voir son profil",
                "parameters": [
                    {
                        "name": "token",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "csrf",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "mail",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Profil récupéré avec succès",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Profil"
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "Token invalide ou CSRF invalide"
                    }
                }
            }
        },
        "/role/maj": {
            "put": {
                "tags": ["Utilisateur"],
                "summary": "Modifier son rôle",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "role": {"type": "string", "enum": ["colocataire", "responsable", "admin"]},
                                    "mail": {"type": "string"},
                                    "token": {"type": "string"},
                                    "csrf": {"type": "string"}
                                },
                                "required": ["role", "mail", "token", "csrf"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Rôle modifié avec succès",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "integer"},
                                        "message": {"type": "string"}
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "Token invalide ou CSRF invalide ou rôle insuffisant"
                    },
                    "400": {
                        "description": "Champs manquants"
                    }
                }
            }
        },
        "/profil/maj": {
            "put": {
                "tags": ["Utilisateur"],
                "summary": "Modifier son profil",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "nom": {"type": "string"},
                                    "prenom": {"type": "string"},
                                    "mail": {"type": "string"},
                                    "token": {"type": "string"},
                                    "csrf": {"type": "string"},
                                    "role": {"type": "string", "enum": ["colocataire", "responsable", "admin"]},
                                    "id_utilisateur": {"type": "integer"},
                                    "mail_modifie": {"type": "string"},
                                    "mdp": {"type": "string"},
                                    "role_modifie": {"type": "string"},
                                    "num_telephone": {"type": "string"}
                                },
                                "required": ["nom", "prenom", "mail", "token", "csrf", "id_utilisateur", "mail_modifie", "mdp", "role_modifie", "num_telephone"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Profil modifié avec succès",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "integer"},
                                        "message": {"type": "string"}
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "Token invalide ou CSRF invalide ou rôle insuffisant"
                    },
                    "400": {
                        "description": "Champs manquants ou caractères spéciaux non autorisés"
                    }
                }
            }
        },
        "/adm/utilisateurs/voir": {
            "get": {
                "tags": ["Administration"],
                "summary": "Voir tous les utilisateurs",
                "parameters": [
                    {
                        "name": "token",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "csrf",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "role",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string", "enum": ["admin"]}
                    },
                    {
                        "name": "mail",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Liste des utilisateurs récupérée",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "integer"},
                                        "data": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/components/schemas/Utilisateur"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "Token invalide ou CSRF invalide ou rôle insuffisant"
                    }
                }
            }
        },
        "/adm/utilisateurs/maj": {
            "put": {
                "tags": ["Administration"],
                "summary": "Modifier un utilisateur",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "mail": {"type": "string"},
                                    "token": {"type": "string"},
                                    "csrf": {"type": "string"},
                                    "role": {"type": "string", "enum": ["colocataire", "responsable", "admin"]},
                                    "id_utilisateur": {"type": "integer"},
                                    "id_utilisateur_modifie": {"type": "integer"},
                                    "nom": {"type": "string"},
                                    "prenom": {"type": "string"},
                                    "mail_modifie": {"type": "string"},
                                    "mdp": {"type": "string"},
                                    "role_modifie": {"type": "string"},
                                    "num_telephone": {"type": "string"}
                                },
                                "required": ["mail", "token", "csrf", "role", "id_utilisateur", "id_utilisateur_modifie", "nom", "prenom", "mail_modifie", "mdp", "role_modifie", "num_telephone"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Utilisateur modifié avec succès",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "integer"},
                                        "message": {"type": "string"}
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "Token invalide ou CSRF invalide ou rôle insuffisant"
                    }
                }
            }
        },
        "/adm/utilisateurs/supprimer": {
            "post": {
                "tags": ["Administration"],
                "summary": "Supprimer un utilisateur",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id_utilisateur_supprime": {"type": "integer"},
                                    "role": {"type": "string", "enum": ["admin"]},
                                    "token": {"type": "string"},
                                    "csrf": {"type": "string"},
                                    "mail": {"type": "string"}
                                },
                                "required": ["id_utilisateur_supprime", "role", "token", "csrf", "mail"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Utilisateur supprimé avec succès",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "integer"},
                                        "message": {"type": "string"}
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "Token invalide ou CSRF invalide ou rôle insuffisant"
                    }
                }
            }
        },
        "/adm/logs": {
            "get": {
                "tags": ["Administration"],
                "summary": "Voir les logs de l'application",
                "parameters": [
                    {
                        "name": "token",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "csrf",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "role",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string", "enum": ["admin"]}
                    },
                    {
                        "name": "mail",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Liste des logs récupérée",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "integer"},
                                        "data": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/components/schemas/Log"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "Token invalide ou CSRF invalide ou rôle insuffisant"
                    }
                }
            }
        },
        "/adm/logs/supprimer": {
            "post": {
                "tags": ["Administration"],
                "summary": "Supprimer un log",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id_log": {"type": "integer"},
                                    "role": {"type": "string", "enum": ["admin"]},
                                    "token": {"type": "string"},
                                    "csrf": {"type": "string"},
                                    "mail": {"type": "string"}
                                },
                                "required": ["id_log", "role", "token", "csrf", "mail"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Log supprimé avec succès",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "integer"},
                                        "message": {"type": "string"}
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "Token invalide ou CSRF invalide ou rôle insuffisant"
                    }
                }
            }
        },
        "/coloc/taches/voir": {
            "get": {
                "tags": ["Taches"],
                "summary": "Voir toutes les tâches de la colocation (non clôturées)",
                "parameters": [
                    {"name": "id_coloc", "in": "query", "required": True, "schema": {"type": "integer"}},
                    {"name": "mail", "in": "query", "required": True, "schema": {"type": "string"}},
                    {"name": "token", "in": "query", "required": True, "schema": {"type": "string"}},
                    {"name": "csrf", "in": "query", "required": True, "schema": {"type": "string"}},
                    {"name": "role", "in": "query", "required": True, "schema": {"type": "string", "enum": ["colocataire", "responsable", "admin"]}}
                ],
                "responses": {
                    "200": {
                        "description": "Liste des tâches récupérée",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "integer"},
                                        "message": {"type": "string"},
                                        "taches": {"type": "array", "items": {"$ref": "#/components/schemas/Tache"}}
                                    }
                                }
                            }
                        }
                    },
                    "403": {"description": "Token ou CSRF invalide ou rôle insuffisant"},
                    "404": {"description": "Colocation ou utilisateur non trouvé"}
                }
            }
        },
        "/coloc/taches/miennes": {
            "get": {
                "tags": ["Taches"],
                "summary": "Voir les tâches attribuées à l'utilisateur connecté",
                "parameters": [
                    {"name": "id_coloc", "in": "query", "required": True, "schema": {"type": "integer"}},
                    {"name": "mail", "in": "query", "required": True, "schema": {"type": "string"}},
                    {"name": "token", "in": "query", "required": True, "schema": {"type": "string"}},
                    {"name": "csrf", "in": "query", "required": True, "schema": {"type": "string"}},
                    {"name": "role", "in": "query", "required": True, "schema": {"type": "string", "enum": ["colocataire", "responsable", "admin"]}}
                ],
                "responses": {
                    "200": {
                        "description": "Liste des tâches récupérée",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "integer"},
                                        "message": {"type": "string"},
                                        "taches": {"type": "array", "items": {"$ref": "#/components/schemas/Tache"}}
                                    }
                                }
                            }
                        }
                    },
                    "403": {"description": "Token ou CSRF invalide ou rôle insuffisant"},
                    "404": {"description": "Colocation ou utilisateur non trouvé"}
                }
            }
        },
        "/coloc/taches/voir_complete": {
            "get": {
                "tags": ["Taches"],
                "summary": "Voir les tâches clôturées (4 dernières)",
                "parameters": [
                    {"name": "id_coloc", "in": "query", "required": True, "schema": {"type": "integer"}},
                    {"name": "mail", "in": "query", "required": True, "schema": {"type": "string"}},
                    {"name": "token", "in": "query", "required": True, "schema": {"type": "string"}},
                    {"name": "csrf", "in": "query", "required": True, "schema": {"type": "string"}},
                    {"name": "role", "in": "query", "required": True, "schema": {"type": "string", "enum": ["colocataire", "responsable", "admin"]}}
                ],
                "responses": {
                    "200": {
                        "description": "Liste des tâches clôturées récupérée",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "integer"},
                                        "message": {"type": "string"},
                                        "taches": {"type": "array", "items": {"$ref": "#/components/schemas/Tache"}}
                                    }
                                }
                            }
                        }
                    },
                    "403": {"description": "Token ou CSRF invalide ou rôle insuffisant"},
                    "404": {"description": "Colocation ou utilisateur non trouvé"}
                }
            }
        },
        "/coloc/taches/creation": {
            "post": {
                "tags": ["Taches"],
                "summary": "Créer une tâche",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "nom": {"type": "string"},
                                    "date_debut": {"type": "string", "format": "date-time"},
                                    "date_fin": {"type": "string", "format": "date-time"},
                                    "priorite": {"type": "string"},
                                    "mail": {"type": "string"},
                                    "token": {"type": "string"},
                                    "csrf": {"type": "string"},
                                    "role": {"type": "string", "enum": ["colocataire", "responsable", "admin"]},
                                    "atribue_a": {"type": ["integer", "null"]}
                                },
                                "required": ["nom", "priorite", "mail", "token", "csrf", "role"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {"description": "Tâche créée avec succès"},
                    "400": {"description": "Champs manquants ou erreur"},
                    "403": {"description": "Token ou CSRF invalide ou rôle insuffisant"}
                }
            }
        },
        "/coloc/taches/attribuer": {
            "put": {
                "tags": ["Taches"],
                "summary": "Attribuer une tâche à un utilisateur",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id_tache": {"type": "integer"},
                                    "attribue_a": {"type": "integer"},
                                    "mail": {"type": "string"},
                                    "token": {"type": "string"},
                                    "csrf": {"type": "string"},
                                    "role": {"type": "string", "enum": ["responsable", "admin"]}
                                },
                                "required": ["id_tache", "attribue_a", "mail", "token", "csrf", "role"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {"description": "Tâche attribuée avec succès"},
                    "400": {"description": "Champs manquants ou utilisateur inexistant"},
                    "403": {"description": "Token ou CSRF invalide ou rôle insuffisant"}
                }
            }
        },
        "/coloc/taches/cloturer": {
            "put": {
                "tags": ["Taches"],
                "summary": "Clôturer une tâche",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id_tache": {"type": "integer"},
                                    "cloture": {"type": "string"},
                                    "mail": {"type": "string"},
                                    "token": {"type": "string"},
                                    "csrf": {"type": "string"},
                                    "role": {"type": "string", "enum": ["responsable", "admin"]}
                                },
                                "required": ["id_tache", "cloture", "mail", "token", "csrf", "role"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {"description": "Tâche clôturée/modifiée avec succès"},
                    "400": {"description": "Champs manquants ou erreur"},
                    "403": {"description": "Token ou CSRF invalide ou rôle insuffisant"}
                }
            }
        },
        "/coloc/taches/modifier": {
            "put": {
                "tags": ["Taches"],
                "summary": "Modifier une tâche (nom)",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id_tache": {"type": "integer"},
                                    "nom": {"type": "string"},
                                    "mail": {"type": "string"},
                                    "token": {"type": "string"},
                                    "csrf": {"type": "string"},
                                    "role": {"type": "string", "enum": ["responsable", "admin"]}
                                },
                                "required": ["id_tache", "nom", "mail", "token", "csrf", "role"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {"description": "Tâche modifiée avec succès"},
                    "400": {"description": "Champs manquants ou erreur"},
                    "403": {"description": "Token ou CSRF invalide ou rôle insuffisant"}
                }
            }
        },
        "/coloc/taches/supprimer": {
            "post": {
                "tags": ["Taches"],
                "summary": "Supprimer une tâche",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id_tache": {"type": "integer"},
                                    "mail": {"type": "string"},
                                    "token": {"type": "string"},
                                    "csrf": {"type": "string"},
                                    "role": {"type": "string", "enum": ["colocataire", "responsable", "admin"]}
                                },
                                "required": ["id_tache", "mail", "token", "csrf", "role"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {"description": "Tâche supprimée avec succès"},
                    "400": {"description": "Champs manquants ou erreur"},
                    "403": {"description": "Token ou CSRF invalide ou rôle insuffisant"}
                }
            }
        }
    },
    "components": {
        "schemas": {
            "Utilisateur": {
                "type": "object",
                "properties": {
                    "id": {"type": "integer"},
                    "mail": {"type": "string"},
                    "nom": {"type": "string"},
                    "prenom": {"type": "string"},
                    "role": {"type": "string"},
                    "mdp": {"type": "string"},
                    "date_creation": {"type": "string", "format": "date-time"},
                    "num_telephone": {"type": "string"},
                    "id_coloc": {"type": "integer", "nullable": True}
                }
            },
            "Colocation": {
                "type": "object",
                "properties": {
                    "id": {"type": "integer"},
                    "nom": {"type": "string"},
                    "date_creation": {"type": "string", "format": "date-time"},
                    "responsable": {"$ref": "#/components/schemas/Utilisateur"}
                }
            },
            "Profil": {
                "type": "object",
                "properties": {
                    "utilisateur": {"$ref": "#/components/schemas/Utilisateur"}
                }
            },
            "Log": {
                "type": "object",
                "properties": {
                    "id": {"type": "integer"},
                    "action": {"type": "string"},
                    "date": {"type": "string", "format": "date-time"},
                    "id_utilisateur": {"type": "integer"},
                    "champs": {"type": "object", "additionalProperties": True},
                    "id_utilisateur_modifie": {"type": "integer", "nullable": True}
                }
            },
            "Tache": {
                "type": "object",
                "properties": {
                    "id": {"type": "integer"},
                    "nom": {"type": "string"},
                    "date_debut": {"type": ["string", "null"], "format": "date-time"},
                    "date_fin": {"type": ["string", "null"], "format": "date-time"},
                    "date_crea": {"type": ["string", "null"], "format": "date-time"},
                    "priorite": {"type": "string"},
                    "cloture": {"type": "boolean"},
                    "createur": {"type": "integer"},
                    "attribue_a": {"type": ["integer", "null"]}
                }
            }
        }
    }
}