import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithQuery } from "@/lib/helpers/renderWithQuery"
import SummarizeButton from "@/components/SummarizeButton";
import { generateAi } from "@/server/ai";
import { toast } from "sonner";

const renderComponent = () => {
    renderWithQuery(<SummarizeButton
                action="summary"
                noteId="123"
                description=""
            />)
};

vi.mock("@/server/ai", () => ({
    generateAi: vi.fn(),
}));

vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        loading: vi.fn(),
    },
}));

describe("summarize button", () => {
    it("renders summarize button", () => {

    renderComponent();

    expect(
        screen.getByRole("button", {
            name: /summarize/i,
        })
    ).toBeInTheDocument();

    });

    it("calls generateAi when clicked", async () => {

        vi.mocked(generateAi)
            .mockResolvedValue("Summary");

        renderComponent();

        await userEvent.click(
            screen.getByRole("button")
        );

        await waitFor(() => {

            expect(generateAi).toHaveBeenCalledWith({
                action: "summary",
                noteId: "123",
                description: "",
            });

        });

    });

    it("shows loading toast", async () => {

        vi.mocked(generateAi)
            .mockResolvedValue("Summary");

        renderComponent();

        await userEvent.click(
            screen.getByRole("button")
        );

        expect(toast.loading)
            .toHaveBeenCalledWith(
                "Ai is thinking...",
                { id: "ai" }
            );

    });
    it("shows success toast", async () => {

        vi.mocked(generateAi)
            .mockResolvedValue("Summary");

        renderComponent();

        await userEvent.click(
            screen.getByRole("button")
        );

        await waitFor(() => {

            expect(toast.success)
                .toHaveBeenCalledWith(
                    "Summary generated",
                    { id: "ai" }
                );

        });

    });
    it("shows error toast", async () => {

        vi.mocked(generateAi)
            .mockRejectedValue(
                new Error("AI busy")
            );

        renderComponent();

        await userEvent.click(
            screen.getByRole("button")
        );

        await waitFor(() => {

            expect(toast.error)
                .toHaveBeenCalledWith(
                    "AI busy",
                    { id: "ai" }
                );

        });

    });
    it("disables button while generating", async () => {

        vi.mocked(generateAi)
            .mockImplementation(
                () =>
                    new Promise(() => {})
            );

        renderComponent();

        const button =
            screen.getByRole("button");

        await userEvent.click(button);

        expect(button).toBeDisabled();

    });
})
