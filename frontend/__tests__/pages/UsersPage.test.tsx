import { render, screen } from "@testing-library/react";
import { requiredRole } from "@/lib/helpers/authPage";
import { getAllUsers } from "@/server/user";
import UsersPage from "@/app/(admin)/admin/dashboard/users/page";

vi.mock("@/server/user", () => ({
  getAllUsers: vi.fn(),
}));


vi.mock("@/lib/helpers/authPage", () => ({
  requiredRole: vi.fn(),
}));

vi.mock("@/components/Search", () => ({
  default: () => (
    <div data-testid="user-search">
      User Search
    </div>
  ),
}));


vi.mock("@/components/DeleteUser", () => ({
  default: ({id}: {id:string}) => (
    <button data-testid={`delete-${id}`}>
      Delete
    </button>
  ),
}));


describe("Users Page", () => {

  it("renders users", async () => {


    vi.mocked(requiredRole)
      .mockResolvedValue({
        _id:"1",
        username: "mussadiq",
        role:"Admin"
      });



    vi.mocked(getAllUsers)
      .mockResolvedValue([
        {
            _id: "123",
            username: "mk",
            email: "mk@gmail.com",
            status: "Active",
            password: "mk123",
            role: "Employee",
            createdAt: "01-02-2026"
        }
      ]);


    const ui = await UsersPage({
      searchParams: Promise.resolve({})
    });


    render(ui);


    expect(
      screen.getByText("mk")
    ).toBeInTheDocument();



    expect(
      screen.getByText("mk@gmail.com")
    ).toBeInTheDocument();



    expect(
      screen.getByText("Employee")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("delete-123")
    ).toBeInTheDocument();


  });



  it("shows no users found message when users array is empty", async()=>{

    vi.mocked(requiredRole)
      .mockResolvedValue({
        _id:"1",
        username: "mussadiq",
        role:"Employee"
      });



    vi.mocked(getAllUsers)
      .mockResolvedValue([]);



    const ui = await UsersPage({
      searchParams: Promise.resolve({})
    });


    render(ui);


    expect(
      screen.getByText("No users found")
    ).toBeInTheDocument();


  });




  it("does not show delete button for  managers", async()=>{

    vi.mocked(requiredRole)
      .mockResolvedValue({
        _id:"1",
        username: "mussadiq",
        role:"Manager"
      });



    vi.mocked(getAllUsers)
      .mockResolvedValue([
       {
            _id: "123",
            username: "mk",
            email: "mk@gmail.com",
            status: "Active",
            password: "mk123",
            role: "Employee",
            createdAt: "01-02-2026"
        }
      ]);


    const ui = await UsersPage({
      searchParams: Promise.resolve({})
    });


    render(ui);



    expect(
      screen.queryByTestId("delete-123")
    ).not.toBeInTheDocument();


  });




  it("passes filters to getAllUsers", async()=>{


    vi.mocked(requiredRole)
      .mockResolvedValue({
        role:"Admin",
        _id: "123",
        username: "mk"
      });



    vi.mocked(getAllUsers)
      .mockResolvedValue([]);



    await UsersPage({
      searchParams: Promise.resolve({
        search:"mk",
        status:"Active"
      })
    });



    expect(getAllUsers)
      .toHaveBeenCalledWith(
        "mk",
        "Active"
      );


  });



  it("checks user roles", async()=>{


    vi.mocked(requiredRole)
      .mockResolvedValue({
        role:"Manager",
        _id: "123",
        username: "mk"
      });


    vi.mocked(getAllUsers)
      .mockResolvedValue([]);



    await UsersPage({
      searchParams: Promise.resolve({})
    });



    expect(requiredRole)
      .toHaveBeenCalledWith([
        "Manager",
        "Admin"
      ]);

  });
  it("blocks unauthorized users", async()=>{

    vi.mocked(requiredRole)
    .mockRejectedValue(
        new Error("Unauthorized")
    );


    await expect(
    UsersPage({
        searchParams: Promise.resolve({})
    })
    )
    .rejects
    .toThrow("Unauthorized");

    });
});