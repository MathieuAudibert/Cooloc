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
                        "description": "Login OK",
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
                        "description": "CSRF KO"
                    },
                    "400": {
                        "description": "Champs manquants ou Utilisateurs KO ou MDP incorrect"
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
                    "200": {},
                    "400": {
                        "description": "Champs manquants ou mail existant ou car spéciaux KO"
                    },
                    "403": {
                        "description": "CSRF KO"
                    }
                }
            }
        },
        
        "/Colocs/voir/Utilisateurss": {
            "get": {
                "tags": ["Colocs"],
                "summary": "Utilisateurss Colocs",
                "parameters": [
                    {
                        "name": "id_Colocss",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "integer"}
                    },
                    {
                        "name": "role",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string", "enum": ["Colocsataire", "responsable", "admin"]}
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
                        "description": "Utilisateurss Ok",
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
                                                "$ref": "#/components/schemas/Utilisateurs"
                                            }
                                        },
                                        "infos_responsable": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/components/schemas/Utilisateurs"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "Token KO ou CSRF KO ou Role KO"
                    },
                    "404": {
                        "description": "Colocs KO"
                    }
                }
            }
        },
        "/Colocs/voir": {
            "get": {
                "tags": ["Colocs"],
                "summary": "Infos Colocs",
                "parameters": [
                    {
                        "name": "id_Colocss",
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
                        "schema": {"type": "string", "enum": ["Colocsataire", "responsable", "admin"]}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "infos",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Colocs"
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "Token KO ou CSRF KO ou Role KO"
                    },
                    "404": {
                        "description": "Colocs KO"
                    }
                }
            }
        },
        "/Colocs/creer": {
            "post": {
                "tags": ["Colocs"],
                "summary": "Creer Colocs",
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
                                    "role": {"type": "string", "enum": ["Colocsataire", "responsable", "admin"]},
                                },
                                "required": ["nom", "mail", "token", "csrf", "role"]
                            }
                        }
                    }
                },
                "responses": {
                    "201": {
                        "description": "creation Colocs OK",
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
                        "description": "Token KO ou CSRF KO ou Role KO ou Colocs a deja Colocs"
                    },
                    "400": {
                        "description": "Champs manquants ou car spéciaux KO"
                    },
                    "500": {
                        "description": "Erreur interne"
                    }
                }
            }
        },
        "/Colocs/supprimer": {
            "post": {
                "tags": ["Colocs"],
                "summary": "Supprimer Colocs",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id_Colocs": {"type": "integer"},
                                    "mail": {"type": "string"},
                                    "token": {"type": "string"},
                                    "csrf": {"type": "string"}
                                },
                                "required": ["id_Colocs", "mail", "token", "csrf"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "suppression Colocs OK",
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
                        "description": "Token KO ou CSRF KO ou Role KO"
                    },
                    "404": {
                        "description": "Colocs KO"
                    }
                }
            }
        },
        "/Colocs/maj/nom": {
            "put": {
                "tags": ["Colocs"],
                "summary": "Maj (mise a jour) nom Colocs",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id_Colocs": {"type": "integer"},
                                    "nom": {"type": "string"},
                                    "mail": {"type": "string"},
                                    "token": {"type": "string"},
                                    "csrf": {"type": "string"}
                                },
                                "required": ["nom", "id_Colocs", "mail", "token", "csrf"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Maj nom OK",
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
                        "description": "Token KO ou CSRF KO ou Role KO"
                    },
                    "404": {
                        "description": "Colocs KO"
                    }
                }
            }
        },
        
        "/profil/voir": {
            "get": {
                "tags": ["Utilisateurs"],
                "summary": "Voir profil",
                "responses": {
                    "200": {
                        "description": "Profil Utilisateurs OK",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Profil"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/role/maj": {
            "put": {
                "tags": ["Utilisateurs"],
                "summary": "Modifier role",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "role": {"type": "string"},
                                    "mail": {"type": "string"},
                                    "token": {"type": "string"},
                                    "csrf": {"type": "string"},
                                },
                                "required": ["role", "mail", "token", "csrf"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Maj role OK",
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
                        "description": "Token KO ou CSRF KO ou Role KO"
                    },
                    "400": {
                        "description": "Champs manquant"
                    }
                }
            }
        },
        "/profil/maj": {
            "put": {
                "tags": ["Utilisateurs"],
                "summary": "Modifier profil",
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
                                    "role": {"type": "string", "enum": ["Colocsataire", "responsable", "admin"]},
                                    "id_Utilisateurs": {"type": "string"},
                                    "mail_modifie": {"type": "string"},
                                    "mdp": {"type": "string"},
                                    "role_modifie": {"type": "string"},
                                    "num_telephone": {"type": "string"}
                                },
                                "required": ["nom", "prenom", "mail", "token", "csrf", "id_Utilisateurs", "mail_modifie", "mdp", "role_modifie", "num_telephone"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Maj profil OK",
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
                        "description": "Token KO ou CSRF KO ou Role KO"
                    },
                    "400": {
                        "description": "Champs manquants ou car spéciaux KO"
                    }
                }
            }
        },
        
        "/adm/Utilisateurss/voir": {
            "get": {
                "tags": ["Adm"],
                "summary": "voir Utilisateurss",
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
                        "schema": {"type": "string", "enum": ["admin", "responsable"]}
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
                        "description": "liste Utilisateurss OK",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "integer"},
                                        "data": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/components/schemas/Utilisateurs"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "Token KO ou CSRF KO ou Role KO"
                    }
                }
            }
        },
        "/adm/Utilisateurss/maj": {
            "put": {
                "tags": ["Adm"],
                "summary": "Maj Utilisateurs",
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
                                    "role": {"type": "string", "enum": ["Colocsataire", "responsable", "admin"]},
                                    "id_Utilisateurs": {"type": "integer"},
                                    "id_Utilisateurs_modifie": {"type": "integer"},
                                    "nom": {"type": "string"},
                                    "prenom": {"type": "string"},
                                    "mail_modifie": {"type": "string"},
                                    "mdp": {"type": "string"},
                                    "role_modifie": {"type": "string"},
                                    "num_telephone": {"type": "string"}
                                },
                                "required": ["mail", "token", "csrf", "role", "id_Utilisateurs", "id_Utilisateurs_modifie", "nom", "prenom", "mail_modifie", "mdp", "role_modifie", "num_telephone"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Utilisateurs maj OK",
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
                }
            }
        },
        "/adm/Utilisateurss/supprimer": {
            "post": {
                "tags": ["Adm"],
                "summary": "Supprimer Utilisateurs",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id_Utilisateurs_supprime": {"type": "integer"},
                                    "role": {"type": "string", "enum": ["Colocsataire", "responsable", "admin"]},
                                    "token": {"type": "string"},
                                    "csrf": {"type": "string"},
                                    "mail": {"type": "string"}
                                },
                                "required": ["user_id"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "suppression Utilisateurs OK",
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
                }
            }
        },
        "/adm/logs": {
            "get": {
                "tags": ["Adm"],
                "summary": "logs de l'app",
                "responses": {
                    "200": {
                        "description": "list logs",
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
                    }
                }
            }
        },
        "/adm/logs/supprimer": {
            "post": {
                "tags": ["Adm"],
                "summary": "Supprimer une log",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "log_id": {"type": "integer"}
                                },
                                "required": ["log_id"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Log supprimée"
                    },
                    "403": {
                        "description": "Droits insuffisants"
                    }
                }
            }
        }
    },
    "components": {
        "schemas": {
            "Utilisateurs": {
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
                    "id_Colocs": {"type": "integer", "nullable": True}
                }
            },
            "Colocs": {
                "type": "object",
                "properties": {
                    "id": {"type": "integer"},
                    "nom": {"type": "string"},
                    "date_crea": {"type": "string", "format": "date-time"},
                    "responsable": {"$ref": "#/components/schemas/Utilisateurs"}
                }
            },
            "Profil": {
                "type": "object",
                "properties": {
                    {"$ref": "#/components/schemas/Utilisateurs"}
                }
            },
            "Logs": {
                "type": "object",
                "properties": {
                    "id": {"type": "integer"},
                    "action": {"type": "string"},
                    "date": {"type": "string", "format": "date-time"},
                    "id_utilisateur": {"type": "integer"},
                    "champs": {"type": "object", "additionalProperties": True},
                    "id_utilisateur_modifie": {"type": "integer", "nullable": True},
                }
            }
        }
    }
}