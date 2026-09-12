import { redis } from "../../src/config/connectRedis"
import { deleteUserCache } from "../../src/lib/helpers/deleteCache"
import Note from "../../src/models/NoteModel"
import User from "../../src/models/UserModel"
import { userSchema, updateUserSchema } from "../../src/schemas/userSchema"
import { createNewUser, deleteUser, getAllUsers, getSingleUser, updateUser } from "../../src/controllers/userControllers"
import bcrypt from "bcryptjs"

vi.mock("../../src/models/NoteModel")
vi.mock("../../src/models/UserModel")
vi.mock("../../src/schemas/userSchema", () =>  ({
    userSchema: {
        safeParse: vi.fn(),
    },
    updateUserSchema: {
        safeParse: vi.fn(),
    },
}))
vi.mock("../../src/lib/helpers/deleteCache", () => ({
    deleteUserCache: vi.fn()
}))
vi.mock("../../src/config/connectRedis", () => ({
    redis: {
        get: vi.fn(),
        set: vi.fn(),
        del: vi.fn()
    }
}))
vi.mock("bcryptjs", () => ({
    default: {
        hash: vi.fn(),
        compare: vi.fn()
    }
}))

const Users = [
    {
        username: "mk",
        _id: "123",
        email: "mk@gmail.com",
        // password: "hashed",
        status: "Active",
        role: "Admin"
    }
]

describe("user controller", () => {

    let req : any;
    let res : any;

    beforeEach(() => {
        req = {
            body: {},
            query: {}
        }

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            send: vi.fn()
        }
        vi.clearAllMocks()
    })

    it("will get all users", async () => {
        req = {
            query: {},
        }
        vi.mocked(redis.get).mockResolvedValue(null)

        const execMock = vi.fn().mockResolvedValue(Users)

        const leanMock = vi.fn().mockReturnValue({
            exec: execMock
        })

        const selectMock = vi.fn().mockReturnValue({
            lean: leanMock
        })

        vi.mocked(User.find).mockReturnValue({
            select: selectMock
        } as any)
        
        await getAllUsers(req, res)

        expect(redis.get).toHaveBeenCalledWith('users?status=undefined&search=undefined')

        expect(redis.set).toHaveBeenCalledWith('users?status=undefined&search=undefined', JSON.stringify(Users), {EX: 120})

        expect(selectMock).toHaveBeenCalledWith("-password")
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({success: true, users: Users})

    })

    it("will get single user successfully", async () => {
        req = {
            params: {
                id: "123"
            }
        }

        vi.mocked(redis.get).mockResolvedValue(null)
        const execMock = vi.fn().mockResolvedValue(Users[0])
        const leanMock = vi.fn().mockReturnValue({
            exec: execMock
        })
        const selectMock = vi.fn().mockReturnValue({
            lean:leanMock
        })
        vi.mocked(User.findById).mockReturnValue({
            select: selectMock
        } as any)

        await getSingleUser(req, res)

        expect(selectMock).toHaveBeenCalledWith("-password")
        expect(redis.get).toHaveBeenCalledWith('user?id=123')

        expect(redis.set).toHaveBeenCalledWith("user?id=123", JSON.stringify(Users[0]), {EX:120})

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            user: Users[0]
        });
    })  

    it("will not get single user if id not given and send status of 400", async () => {
          req = {
            params: {
                id: ""
            }
        }

        await getSingleUser(req, res)

        expect(Note.findById).not.toHaveBeenCalled();

        expect(redis.get).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({success:false, message:"Id is required"})
    })

    it("will not get single note if user not found and send status of 404", async () => {
          req = {
            params: {
                id: "456"
            }
        }

        vi.mocked(redis.get).mockResolvedValue(null)
        const execMock = vi.fn().mockResolvedValue(null)
        const leanMock = vi.fn().mockReturnValue({
            exec: execMock
        })
        const selectMock = vi.fn().mockReturnValue({
            lean:leanMock
        })
        vi.mocked(User.findById).mockReturnValue({
            select:selectMock
        } as any)

        await getSingleUser(req, res)

        expect(selectMock).toHaveBeenCalledWith("-password")
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({message: "No user found with this id", success:false})
    })

    it("will create new user successfully ", async () => {
        req = {
            body: {
                role: "Employee",
                email: "immk@gmail.com",
                password: "1234",
                username: "immk"
            }
        }  

        vi.mocked(userSchema.safeParse).mockReturnValue({
            success: true,
            data: {
                role: "Employee",
                email: "immk@gmail.com",
                password: "1234",
                username: "immk"
            }
        })
        vi.mocked(bcrypt.hash).mockResolvedValue("123456789" as never)

        vi.mocked(User.create).mockResolvedValue({
            role: "Employee",
            email: "immk@gmail.com",
            password: "1234",
            username: "immk",
            status: "Active",
            _id: "456",
            createdAt: "09-09-2026",
            updatedAt: "09-09-2026"
        } as any)

        await createNewUser(req, res)
        expect(User.create).toHaveBeenCalledWith({
            username: "immk",
            password: "123456789",
            email: "immk@gmail.com",
            role: "Employee"
        })
        expect(deleteUserCache).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({success: true, message: "New User created", user: {
            id: "456",
            username: "immk",
            email: "immk@gmail.com",
            role: "Employee",
        }})
    })

    it("will not create new user and send status of 400", async () => {
          req = {
            body: {
                role: "",
                email: "immk@gmail.com",
                password: "1234",
                username: "immk"
            }
        }  

        await createNewUser(req, res)
        expect(User.create).not.toHaveBeenCalled()
        expect(deleteUserCache).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({success: false, message: "All field are required, Please fill al fields"})

    })

    it("will not create new user and give zod error", async () => {
         req = {
            body: {
                role: "Employee",
                email: "immk",
                password: "1234",
                username: "immk"
            }
        }  

        vi.mocked(userSchema.safeParse).mockReturnValue({
            success: false,
            error: {issues: []}
        } as any)

        await createNewUser(req, res)
        expect(User.create).not.toHaveBeenCalled()
        expect(deleteUserCache).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({success: false, message: "Zod error, please enter correct field data", errors: {issues:[]}})
    })

    it("should return 409 when username or email already exists while creating new user", async () => {

        req = {
            body:{
                username:"mussadiq",
                email:"test@gmail.com",
                password:"123456"
            }
        }


        const duplicateError = {
            code:11000
        }


        vi.mocked(User.create)
            .mockRejectedValue(duplicateError)


        await createNewUser(req, res)


        expect(User.create).toHaveBeenCalled()

        expect(res.status)
            .toHaveBeenCalledWith(409)

        expect(res.json)
            .toHaveBeenCalledWith({
                success:false,
                message:"Username or email already exists"
            })

    })

    it("will update current user successfully", async () => {
        req = {
            params: {
                id: "123"
            },
            body: {
                username: "mussadiq",
                status: "InActive"
            }
        }  

        vi.mocked(updateUserSchema.safeParse).mockReturnValue({
            success: true,
            data: {
                username: "mussadiq",
                status: "InActive"
            }
        })
        
        vi.mocked(User.findByIdAndUpdate).mockResolvedValue({
            _id: "123",
            username: "mussadiq",
            status: "InActive",
            email: "mussadiq@gmail.com",
            role: "Admin",
        })
        
        await updateUser(req, res)

        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
            "123",
            {
                username: "mussadiq",
                status: "InActive"
            },
            {
                new: true,
                runValidators: true
            }
        )

        expect(deleteUserCache).toHaveBeenCalled()

        expect(redis.del).toHaveBeenCalledWith(`usersIds`)
        expect(redis.del).toHaveBeenCalledWith(`user?id=123`)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({success: true, message: "User updated successfully", user: {
            id: "123",
            username: "mussadiq",
            status: "InActive",
            email: "mussadiq@gmail.com",
            role: "Admin",
            }})
    })
    
    it("will not update current user and send status of 400 if no id is given", async () => {
           req = {
            params: {
                id: ""
            },
            
        }
        
        await updateUser(req, res)

        expect(deleteUserCache).not.toHaveBeenCalled()

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({success: false, message: "No id was passed in params"})
    })
    
    it("will not update current user if user is not found and send status of 404", async () => {
           req = {
            params: {
                id: "123"
            },
            body: {
                status: "InActive"
            }
        }  

        vi.mocked(updateUserSchema.safeParse).mockReturnValue({
            success: true,
            data: {
                status: "InActive"
            }
        })
        
        vi.mocked(User.findByIdAndUpdate).mockResolvedValue(null)
        
        await updateUser(req, res)

        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
            "123" ,
            {
                status: "InActive"
            },
            {
                new: true,
                runValidators: true
            }
        )

        expect(deleteUserCache).not.toHaveBeenCalled()

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({success: false, message: "No user found with this id"})
    })
    it("will not update current note if zod error and send status of 400", async () => {
           req = {
            params: {
                id: "123"
            },
            body: {
                status: "done"
            }
            }  

        vi.mocked(updateUserSchema.safeParse).mockReturnValue({
            success: false,
            error: {issues: []}
        } as any)
        
        await updateUser(req, res)

        expect(deleteUserCache).not.toHaveBeenCalled()

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({success: false, message: "Zod error, please enter correct field data", errors: {issues: []}})
    })

    it("should return 409 when username or email already exists when updating user", async () => {

        req = {
            params: {
                id: "123"
            },
            body:{
                username:"mussadiq",
                email:"test@gmail.com",
            }
        }


        const duplicateError = {
            code:11000
        }


        vi.mocked(User.findByIdAndUpdate)
            .mockRejectedValue(duplicateError)


        await updateUser(req, res)


        expect(User.findByIdAndUpdate).toHaveBeenCalled()

        expect(res.status)
            .toHaveBeenCalledWith(409)

        expect(res.json)
            .toHaveBeenCalledWith({
                success:false,
                message:"Username or email already exists"
            })

    })

    it("will delete note successfully", async () => {
        req = {
            params: {
                id: "123"
            },
        }

        vi.mocked(Note.exists).mockResolvedValue(null)
        vi.mocked(User.findByIdAndDelete).mockResolvedValue({
            id: "123"
        })
        await deleteUser(req, res)

        expect(User.findByIdAndDelete).toHaveBeenCalledWith( "123" )
        expect(deleteUserCache).toHaveBeenCalled()
        expect(redis.del).toHaveBeenCalledWith("user?id=123")
        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.send).toHaveBeenCalled()

    })

    it("will not delete user if user is not found and send status of 404", async () => {
        req = {
            params: {
                id: "123"
            },
           
        }

        vi.mocked(Note.exists).mockResolvedValue(null)
        vi.mocked(User.findByIdAndDelete).mockResolvedValue(null)
        await deleteUser(req, res)

        expect(User.findByIdAndDelete).toHaveBeenCalledWith( "123" )
        expect(deleteUserCache).not.toHaveBeenCalled()
        expect(redis.del).not.toHaveBeenCalledWith("user?id=123")
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({success: false, message: "no user found with this id"})
    })
    it("will not delete users if id is not given and send status of 400", async () => {
        req = {
            params: {
                id: ""
            },
        }

        await deleteUser(req, res)

        expect(deleteUserCache).not.toHaveBeenCalled()

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({success:false, message: "No id was passed in params"})
    })

    it("will not delete if user have notes", async () => {
        req = {
            params: {
                id: "123"
            },
        }

        vi.mocked(Note.exists).mockResolvedValue({
            _id: "123"
        } as any)

    
        await deleteUser(req, res)

        expect(Note.exists).toHaveBeenCalledWith({ noteFor: "123" })
        expect(deleteUserCache).not.toHaveBeenCalled()
        expect(redis.del).not.toHaveBeenCalledWith("user?id=123")
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'User has assigned notes' })
    })
})