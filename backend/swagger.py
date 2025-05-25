swagger_spec = {
    "openapi": "3.0.0",
    "info": {
        "title": "Cooloc API",
        "description": "API REST de gestion de collocations",
        "version": "1.0.0"
    },
    "servers": [
        {
            "url": "http://localhost:8000",
            "description": "API Python locale"
        }
    ],
    "paths": {
        "/login": {
            "post": {
                "summary": "Login",
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
                                        "data": {"type": {
                                            "type": "object",
                                            "properties": {
                                                "mail": {"type": "string"},
                                                "role": {"type": "string"},
                                                "prenom": {"type": "string"},
                                                "nom": {"type": "string"}
                                            }
                                        }},
                                        "token": {"type": "string"},
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "Csrf KO",
                    },
                    "400": {
                        "description": "Champs manquants ou utilisateur KO",
                    }
                }
            }
        },
        "/register": {
            "post": {
                "summary": "Register",
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
                                    "mdp": {"type": "string"}
                                },
                                "required": ["mail", "mdp", "nom", "prenom"]
                            }
                        }
                    }
                },
                "responses": {
                    "201": {
                        "statut": "200"
                    },
                    "400": {
                        "description": "Champs manquants ou mail existant"
                    },
                    "403": {
                        "description": "CSRF KO"
                    }
                }
            }
        },
        "/candidature/voir": {
            "get": {
                "summary": "Voir les candidatures pour une coloc en particulier",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "token": {"type": "string"},
                                    "csrf": {"type": "string"},
                                    "mail": {"type": "string"},
                                    "role": {"type": "string"}
                                },
                                "required": ["token", "csrf", "mail", "role"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Candidatures OK",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "integer"},
                                        "message": {"type": "string"},
                                        "data": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/components/schemas/Candidature"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "CSRF KO",
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
    }
}