import { fetchHelper } from "@/lib/helpers/fetchHelper"
import { createUser, deleteUser, getAllUsers, getMe, getUser, getUsersId, updateUser } from "@/server/user"

vi.mock("@/lib/helpers/fetchHelper", () => ({
    fetchHelper: vi.fn()
}))

const Users = [
    {
        _id: "123",
        username: "mk",
        password: "456",
        email: "mk@gmail.com",
        status: "Active",
    }
] as UserType[]

describe("user server functions", () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("will get current user only", async () => {
        vi.mocked(fetchHelper).mockResolvedValue({
            user: {
            _id: "123",
            username: "mk",
            role: "Employee"
        }
        })

        const result = await getMe()

        expect(fetchHelper).toHaveBeenCalledWith("users/me")
        expect(result).toEqual({_id: "123", username: "mk", role: "Employee"})
    })

    it("will get all users successfully", async () => {
        vi.mocked(fetchHelper).mockResolvedValue({
            users: Users   
        })

        const result = await getAllUsers("", "Active")

        expect(fetchHelper)
        .toHaveBeenCalledWith(
            "users?search=&status=Active"
        )
        expect(result).toEqual(Users)
    })

    it("will get single user successfully", async () => {
        vi.mocked(fetchHelper).mockResolvedValue({
            user: Users[0]   
        })

        const result = await getUser('456')

        expect(fetchHelper)
        .toHaveBeenCalledWith(
            "users/456"
        )
        expect(result).toEqual(Users[0])
    })

    it("will update user successfully", async () => {
        vi.mocked(fetchHelper).mockResolvedValue({
            user: Users[0]
        })

        const result = await updateUser({id: "678", ...Users[0]})
        
        expect(fetchHelper).toHaveBeenCalledWith("users/678", {
        method:"PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(Users[0])
    })

        expect(result).toEqual(Users[0])
    })

    it("will create new user successfully", async () => {
        vi.mocked(fetchHelper).mockResolvedValue({
            user: {
                username: "immk",
                email: "immk@gmail.com",
                password: "123",
                role: "Manager",
                status: "Active"
            }
        })

        const result = await createUser(
            {
                username: "immk",
                email: "immk@gmail.com",
                password: "123",
                role: "Manager",
                status: "Active"
            }
        )

        expect(fetchHelper).toHaveBeenCalledWith("users", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
                username: "immk",
                email: "immk@gmail.com",
                password: "123",
                role: "Manager",
                status: "Active"
            })
        })

        expect(result).toEqual({
                username: "immk",
                email: "immk@gmail.com",
                password: "123",
                role: "Manager",
                status: "Active"
            })
    })

    it("will delete user successfully", async () => {
        vi.mocked(fetchHelper).mockResolvedValue(undefined)

        const result = await deleteUser("123")
        expect(fetchHelper).toHaveBeenCalledWith("users/123", {
        method:"DELETE"
    })
        expect(result).toEqual(undefined)
    })

    it("will get users ids successfully", async () => {
        vi.mocked(fetchHelper).mockResolvedValue({
            usersId: [{_id:"123", username: "mussadiq"}]
        })

        const result = await getUsersId()
        expect(fetchHelper).toHaveBeenCalledWith(
            "users/ids"
        )
        expect(result).toEqual([{_id: "123", username: "mussadiq"}])
    })

    it("will not get single user and gives error", async () => {
        vi.mocked(fetchHelper).mockRejectedValue(
            new Error("No User Found")  
        )

        await expect(
            getUser("123")
        ).rejects.toThrow("No User Found")

        expect(fetchHelper)
        .toHaveBeenCalledWith(
            "users/123"
        )
    })

    it("will not update user and gives error", async () => {
        vi.mocked(fetchHelper).mockRejectedValue(new Error("something went wrong"))

        expect(await updateUser({id: "456", ...Users[0]})).rejects.toThrow("something went wrong")

        expect(fetchHelper).toHaveBeenCalledWith("users/456", {
        method:"PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(Users[0])
    })

        
    })

    it("will not create new user and gives error", async () => {
        vi.mocked(fetchHelper).mockRejectedValue(new Error("something went wrong"))


        
        expect(await createUser(
            {
                username: "immk",
                password: "immk123",
                email: "immk@gmail.com",
                role: "Employee",
                status: "Active"
            }
        )).rejects.toThrow("something went wrong")
        expect(fetchHelper).toHaveBeenCalledWith("users")
    })

    it("will not delete user and gives error", async () => {
        vi.mocked(fetchHelper).mockRejectedValue(new Error ("something went wrong"))

        expect(await deleteUser("123")).rejects.toThrow("something went wrong")
        expect(fetchHelper).toHaveBeenCalledWith("users/123", {
        method:"DELETE"
        })
    })
})  