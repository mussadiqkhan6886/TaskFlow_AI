import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Notes API",
            version: "1.0.0",
            description: "API documentation for Notes Management System",
        },
        servers: [
            {
                url: "http://localhost:4000",
            },
        ],
         components: {
            securitySchemes: {

                accessTokenCookie: {
                    type: "apiKey",
                    in: "cookie",
                    name: "accessToken",
                    description:
                        "JWT access token stored in HTTP-only cookie",
                },
                refreshTokenCookie: {
                    type: "apiKey",
                    in: "cookie",
                    name: "refreshToken",
                    description:
                        "JWT refresh token stored in HTTP-only cookie",
                },

            },

            schemas: {

                User: {
                    type: "object",
                    required: [
                        "username",
                        "password",
                        "email",
                        "role"
                    ],
                    properties: {
                        id: {
                            type: "string",
                            example: "65f123abc456",
                        },

                        username: {
                            type: "string",
                            example: "admin",
                        },

                        email: {
                            type:"string",
                            example: "admin@gmail.com"
                        },

                        role: {
                            type: "string",
                            enum: [
                                "Admin",
                                "Manager",
                                "Employee",
                            ],
                            example: "Manager",
                        },

                        status: {
                            type: "string",
                            enum: [
                                "Active",
                                "InActive",
                            ],
                            example: "Active",
                        },
                    },
                },

                Note: {
                    type: "object",
                    required: [
                        "noteFor",
                        "title",
                        "description",
                        "priority"
                    ],
                    properties: {
                        id: {
                            type: "string",
                            example: "12345677"
                        },
                        noteFor: {
                            type: "string",
                            example: "1234567"
                        },
                        title: {
                            type: "string",
                            example: "crud"
                        },
                        description: {
                            type: "string",
                            example: "complete crud"
                        },
                        priority:{
                            type: "string",
                            enum: ["High", "Medium", "Low"],
                            example: "High"
                        },
                        status: {
                            type: "string",
                            enum: ["Completed", "Pending", "Working"],
                            example: "Pending"
                        }
                    }
                },

                LoginRequest: {
                    type: "object",
                    required:
                    [
                        "username",
                        "password",
                    ],

                    properties: {

                        username: {
                            type: "string",
                            example: "admin",
                        },

                        password: {
                            type: "string",
                            example: "password123",
                        },
                    },
                },
                CreateNoteRequest: {
                    type: "object",

                    required: [
                        "noteFor",
                        "title",
                        "description",
                        "priority"
                    ],

                    properties: {

                        noteFor: {
                        type: "string",
                        example: "65f123abc456"
                        },

                        title: {
                        type: "string",
                        example: "Fix login bug"
                        },

                        description: {
                        type: "string",
                        example: "Update refresh token logic"
                        },

                        priority: {
                        type: "string",
                        enum: [
                            "High",
                            "Medium",
                            "Low"
                        ],
                        example: "High"
                        }

                    }
                    }
            },
        },
    },

    apis: [
        "./src/routes/*.ts",
        "./src/controllers/*.ts",
    ],
};

export const swaggerSpec = swaggerJsdoc(options);