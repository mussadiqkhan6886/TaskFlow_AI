import { screen } from "@testing-library/react";
import { getAllNotes } from "@/server/note";
import { requiredRole } from "@/lib/helpers/authPage";
import NotesPage from "@/app/(admin)/admin/dashboard/notes/page";
import { renderWithQuery } from "@/lib/helpers/renderWithQuery";

vi.mock("@/server/note", () => ({
  getAllNotes: vi.fn(),
}));


vi.mock("@/lib/helpers/authPage", () => ({
  requiredRole: vi.fn(),
}));


vi.mock("@/lib/helpers/formatDate", () => ({
  formatDate: vi.fn(() => "08 Sep 2026"),
}));


vi.mock("@/components/NoteQuery", () => ({
  default: () => (
    <div data-testid="note-query">
      Note Filter
    </div>
  ),
}));


vi.mock("@/components/DeleteNote", () => ({
  default: ({id}: {id:string}) => (
    <button data-testid={`delete-${id}`}>
      Delete
    </button>
  ),
}));


describe("Notes Page", () => {

  it("renders notes", async () => {


    vi.mocked(requiredRole)
      .mockResolvedValue({
        _id:"1",
        username: "mussadiq",
        role:"Admin"
      });



    vi.mocked(getAllNotes)
      .mockResolvedValue([
        {
            noteFor: "456",
          _id:"123",
          title:"Redis Cache",
          description:"Learn redis caching",
          priority:"High",
          status:"Completed",
          createdAt:"2026-09-08"
        }
      ]);


    const ui = await NotesPage({
      searchParams: Promise.resolve({})
    });


    renderWithQuery(ui);


    expect(
      screen.getByText("Technotes")
    ).toBeInTheDocument();



    expect(
      screen.getByText("Redis Cache")
    ).toBeInTheDocument();



    expect(
      screen.getByText("Learn redis caching")
    ).toBeInTheDocument();



    expect(
      screen.getByText("High")
    ).toBeInTheDocument();



    expect(
      screen.getByText("Completed")
    ).toBeInTheDocument();



    expect(
      screen.getByTestId("delete-123")
    ).toBeInTheDocument();


  });



  it("shows no notes message when notes array is empty", async()=>{

    vi.mocked(requiredRole)
      .mockResolvedValue({
        _id:"1",
        username: "mussadiq",
        role:"Employee"
      });



    vi.mocked(getAllNotes)
      .mockResolvedValue([]);



    const ui = await NotesPage({
      searchParams: Promise.resolve({})
    });


    renderWithQuery(ui);


    expect(
      screen.getByText("No Notes")
    ).toBeInTheDocument();


  });




  it("does not show delete button for employee", async()=>{


    vi.mocked(requiredRole)
      .mockResolvedValue({
        _id:"1",
        username: "mussadiq",
        role:"Employee"
      });



    vi.mocked(getAllNotes)
      .mockResolvedValue([
        {
            noteFor: "456",
          _id:"123",
          title:"JWT",
          description:"Authentication",
          priority:"Medium",
          status:"Pending",
          createdAt:"2026-09-08"
        }
      ]);


    const ui = await NotesPage({
      searchParams: Promise.resolve({})
    });


    renderWithQuery(ui);



    expect(
      screen.queryByTestId("delete-123")
    ).not.toBeInTheDocument();


  });




  it("passes filters to getAllNotes", async()=>{


    vi.mocked(requiredRole)
      .mockResolvedValue({
        role:"Admin",
        _id: "123",
        username: "mk"
      });



    vi.mocked(getAllNotes)
      .mockResolvedValue([]);



    await NotesPage({
      searchParams: Promise.resolve({
        status:"Completed",
        priority:"High"
      })
    });



    expect(getAllNotes)
      .toHaveBeenCalledWith(
        "Completed",
        "High"
      );


  });



  it("checks user roles", async()=>{


    vi.mocked(requiredRole)
      .mockResolvedValue({
        role:"Manager",
        _id: "123",
        username: "mk"
      });


    vi.mocked(getAllNotes)
      .mockResolvedValue([]);



    await NotesPage({
      searchParams: Promise.resolve({})
    });



    expect(requiredRole)
      .toHaveBeenCalledWith([
        "Employee",
        "Admin",
        "Manager"
      ]);

  });

});