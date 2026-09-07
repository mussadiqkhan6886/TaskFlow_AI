import LoginPage from "@/app/(auth)/login/page";
import { renderWithQuery } from "@/lib/helpers/renderWithQuery";
import { login } from "@/server/auth";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
}));

vi.mock("@/server/auth", () => ({
    login: vi.fn(),
}));

describe("Login Page", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render login form", () => {

        renderWithQuery(<LoginPage />);

        expect(
            screen.getByPlaceholderText("Enter your username")
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("Enter your password")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: /Login/i
            })
        ).toBeInTheDocument();

    });

    it("should login successfully", async () => {

        vi.mocked(login).mockResolvedValue({
            message: "Login Successfully"
        });

        renderWithQuery(<LoginPage />);

        const user = userEvent.setup();

        await user.type(
            screen.getByPlaceholderText("Enter your username"),
            "mk"
        );

        await user.type(
            screen.getByPlaceholderText("Enter your password"),
            "mk123"
        );

        await user.click(
            screen.getByRole("button", {
                name: /Login/i
            })
        );

        await waitFor(() => {

            expect(login).toHaveBeenCalledWith({
                username: "mk",
                password: "mk123",
            });

            expect(pushMock)
                .toHaveBeenCalledWith(
                    "/admin/dashboard"
                );

        });

    });

    it("should show error when login fails", async () => {

        vi.mocked(login)
            .mockRejectedValue(
                new Error("Wrong Password")
            );

        renderWithQuery(<LoginPage />);

        const user = userEvent.setup();

        await user.type(
            screen.getByPlaceholderText("Enter your username"),
            "mk"
        );

        await user.type(
            screen.getByPlaceholderText("Enter your password"),
            "wrong"
        );

        await user.click(
            screen.getByRole("button", {
                name: /Login/i
            })
        );

        await waitFor(() => {

            expect(
                screen.getByText("Wrong Password")
            ).toBeInTheDocument();

        });

    });

    it("should show loading state while logging in", async () => {

        vi.mocked(login)
            .mockImplementation(
                () => new Promise(() => {})
            );

        renderWithQuery(<LoginPage />);

        const user = userEvent.setup();

        await user.type(
            screen.getByPlaceholderText("Enter your username"),
            "mk"
        );

        await user.type(
            screen.getByPlaceholderText("Enter your password"),
            "mk123"
        );

        await user.click(
            screen.getByRole("button", {
                name: /Login/i
            })
        );

        await waitFor(() => {

            expect(
                screen.getByText("Logging in...")
            ).toBeInTheDocument();

        });

    });

    it("should allow typing in inputs", async () => {

        renderWithQuery(<LoginPage />);

        const user = userEvent.setup();

        const username =
            screen.getByPlaceholderText("Enter your username");

        const password =
            screen.getByPlaceholderText("Enter your password");

        await user.type(username, "mussadiq");
        await user.type(password, "123456");

        expect(username).toHaveValue("mussadiq");
        expect(password).toHaveValue("123456");

    });

    it("should render back to home link", () => {

        renderWithQuery(<LoginPage />);

        expect(
            screen.getByRole("link", {
                name: /Back to Home/i
            })
        ).toHaveAttribute("href", "/");
    });

});