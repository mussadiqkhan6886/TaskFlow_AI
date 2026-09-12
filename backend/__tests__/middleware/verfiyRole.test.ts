import { verifyRole } from "../../src/middleware/verifyRole"

describe("verify role", () => {
    let next : any;
    let req : any;
    let res : any;

    beforeEach(() => {
        next = vi.fn()

        req = {
            user: {

            }
        }

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }

        vi.clearAllMocks()
    })
    it("will verify role successfully", () => {

        req.user.role = "Admin"
        verifyRole("Admin", "Manager")(req, res, next)
        
        expect(next).toHaveBeenCalled()
    })
    
    it("will not verify role and gives status of 401", () =>{
        verifyRole("Employee")(req, res, next)
        
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Unauthorized"})
        expect(next).not.toHaveBeenCalled()
    })
    
    it("will not verify role and gives status of 403", () =>{
        req.user.role = "Employee"
        verifyRole("Admin")(req, res, next)
        
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({message: "Forbidden"})
        expect(next).not.toHaveBeenCalled()
    })
})