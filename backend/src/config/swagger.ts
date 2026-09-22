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
                        type: "string",
                        example: "admin@gmail.com",
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

                CurrentUser: {
                    type: "object",
                    properties: {
                    username: {
                        type: "string",
                        example: "admin",
                    },
                    role: {
                        type: "string",
                        example: "Admin",
                    },
                    },
                },

                CreateUserRequest: {
                    type: "object",
                    required: [
                    "username",
                    "email",
                    "password",
                    "role",
                    ],
                    properties: {
                    username: {
                        type: "string",
                        example: "john",
                    },
                    email: {
                        type: "string",
                        example: "john@gmail.com",
                    },
                    password: {
                        type: "string",
                        example: "password123",
                    },
                    role: {
                        type: "string",
                        enum: [
                        "Admin",
                        "Manager",
                        "Employee",
                        ],
                        example: "Employee",
                    },
                    },
                },

                UpdateUserRequest: {
                    type: "object",
                    properties: {
                    username: {
                        type: "string",
                        example: "johnUpdated",
                    },
                    email: {
                        type: "string",
                        example: "newemail@gmail.com",
                    },
                    password: {
                        type: "string",
                        example: "newpassword123",
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

                UserIds: {
                    type: "object",
                    properties: {
                    id: {
                        type: "string",
                        example: "65f123abc456",
                    },
                    username: {
                        type: "string",
                        example: "john",
                    },
                    },
                },


                Note: {
                    type: "object",
                    properties: {

                    id: {
                        type: "string",
                        example: "65f123abc456",
                    },

                    noteFor: {
                        type: "string",
                        example: "65f123abc456",
                    },

                    title: {
                        type: "string",
                        example: "Fix login bug",
                    },

                    description: {
                        type: "string",
                        example: "Update refresh token logic",
                    },

                    priority: {
                        type: "string",
                        enum: [
                        "High",
                        "Medium",
                        "Low",
                        ],
                        example: "High",
                    },

                    status: {
                        type: "string",
                        enum: [
                        "Completed",
                        "Pending",
                        "Working",
                        ],
                        example: "Pending",
                    },
                    },
                },


                CreateNoteRequest: {
                    type: "object",
                    required: [
                    "noteFor",
                    "title",
                    "description",
                    "priority",
                    ],

                    properties: {

                    noteFor: {
                        type: "string",
                        example: "65f123abc456",
                    },

                    title: {
                        type: "string",
                        example: "Fix login bug",
                    },

                    description: {
                        type: "string",
                        example: "Update refresh token logic",
                    },

                    priority: {
                        type: "string",
                        enum: [
                        "High",
                        "Medium",
                        "Low",
                        ],
                        example: "High",
                    },

                    },
                },


                UpdateNoteRequest: {
                    type: "object",
                    properties: {

                    title: {
                        type: "string",
                        example: "Updated title",
                    },

                    description: {
                        type: "string",
                        example: "Updated description",
                    },

                    priority: {
                        type: "string",
                        enum: [
                        "High",
                        "Medium",
                        "Low",
                        ],
                        example: "Medium",
                    },

                    status: {
                        type: "string",
                        enum: [
                        "Completed",
                        "Pending",
                        "Working",
                        ],
                        example: "Completed",
                    },

                    },
                },


                LoginRequest: {
                    type: "object",
                    required: [
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
                Message: {
    type: "object",
    properties: {
        id: {
            type: "string",
            example: "65f123abc456",
        },

        message: {
            type: "string",
            example: "Hello, how are you?",
            description: "Message content",
        },

        room: {
            type: "string",
            enum: [
                "user-room",
                "staff-room"
            ],
            example: "user-room",
            description: "Chat room identifier",
        },

        senderId: {
            oneOf: [
                {
                    type: "string",
                    example: "65f123abc789",
                },
                {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "65f123abc789",
                        },
                        username: {
                            type: "string",
                            example: "john",
                        },
                        role: {
                            type: "string",
                            example: "Employee",
                        },
                    },
                },
            ],
            description: "Sender user reference",
        },

        sender: {
            type: "object",
            nullable: true,
            properties: {
                id: {
                    type: "string",
                    example: "65f123abc789",
                },
                username: {
                    type: "string",
                    example: "john",
                },
                role: {
                    type: "string",
                    example: "Employee",
                },
            },
            description: "Populated sender information",
        },

        readBy: {
            type: "array",
            description: "Users who have read this message",
            items: {
                type: "object",
                properties: {
                    readerId: {
                        oneOf: [
                            {
                                type: "string",
                                example: "65f123abc789",
                            },
                            {
                                type: "object",
                                properties: {
                                    _id: {
                                        type: "string",
                                        example: "65f123abc789",
                                    },
                                    username: {
                                        type: "string",
                                        example: "admin",
                                    },
                                },
                            },
                        ],
                    },

                    readAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-22T12:35:00.000Z",
                    },
                },
            },
        },

        createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-09-22T12:30:00.000Z",
        },
    },
},
                AIRequest: {
                    type: "object",
                    required: [
                        "action"
                    ],
                    properties: {
                        noteId: {
                            type: "string",
                            example: "65f123abc456",
                            description: "Existing note id. Used when generating AI response from saved note"
                        },
                        action: {
                            type: "string",
                            enum: [
                                "summary",
                                "priority"
                            ],
                            example: "priority",
                            description: "AI operation to perform"
                        },
                        description: {
                            type: "string",
                            example: "Fix authentication issue where refresh token expires incorrectly",
                            description: "Text content for AI generation. Either description or noteId must be provided"
                        }
                    }
                },

                AIResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true
                        },
                        answer: {
                            type: "string",
                            example: "High"
                        }
                    }
                },
            }
        }
    },
    
    apis: [
        "./src/routes/*.ts",
        "./src/controllers/*.ts",
    ],
};

export const swaggerSpec = swaggerJsdoc(options);