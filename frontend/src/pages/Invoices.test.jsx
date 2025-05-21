import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import Invoices from "./Invoices";

// Mock useNavigate
vi.mock("react-router-dom", async (mod) => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("Invoices Page", () => {
  it("renders inputs and button", () => {
    render(
      <MemoryRouter>
        <Invoices />
      </MemoryRouter>
    );

    expect(screen.getByText("📄 Filter Invoices by Date Range")).toBeInTheDocument();
    expect(screen.getByLabelText("Start Date:")).toBeInTheDocument();
    expect(screen.getByLabelText("End Date:")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("shows error if dates are missing", () => {
    render(
      <MemoryRouter>
        <Invoices />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Search"));
    expect(screen.getByText("Please select both start and end dates.")).toBeInTheDocument();
  });

  it("navigates when both dates are filled", () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <Invoices />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Start Date:"), { target: { value: "2023-05-01T08:00" } });
    fireEvent.change(screen.getByLabelText("End Date:"), { target: { value: "2023-05-02T17:00" } });
    fireEvent.click(screen.getByText("Search"));

    expect(mockNavigate).toHaveBeenCalledWith("/sales-manager/invoices", {
      state: {
        startDate: "2023-05-01T08:00",
        endDate: "2023-05-02T17:00",
      },
    });
  });
});