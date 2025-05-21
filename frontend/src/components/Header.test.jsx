import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";

// Mock the fetch function
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ productId: 1, productName: "Test Product", stockCount: 5 }]),
  })
);

describe("Header component", () => {
  beforeEach(() => {
    sessionStorage.setItem("tabId", "testTab");
    sessionStorage.setItem("testTab-authToken", "dummyToken");
    sessionStorage.setItem("testTab-role", "Customer");
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it("renders Header component", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText("Shipshak.com")).toBeInTheDocument();
  });

  it("navigates to search result on input and shows suggestions", async () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Search products, categories...");
    fireEvent.change(input, { target: { value: "Test" } });

    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });
  });

  it("clears suggestions on outside click", async () => {
    render(
      <MemoryRouter>
        <div>
          <Header />
          <button data-testid="outside-button">Outside</button>
        </div>
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Search products, categories...");
    fireEvent.change(input, { target: { value: "Test" } });

    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });

    fireEvent.mouseDown(screen.getByTestId("outside-button"));

    await waitFor(() => {
      expect(screen.queryByText("Test Product")).not.toBeInTheDocument();
    });
  });
});
