import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SetPricePage from "./SetPrice";

const mockProducts = [
  { productId: 1, productName: "Product A", price: 0 },
  { productId: 2, productName: "Product B", price: 0 },
];

beforeEach(() => {
  global.fetch = vi.fn((url, options) => {
    if (url.includes("/products/new")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      });
    }

    if (url.includes("/setPrice/")) {
      return Promise.resolve({ ok: true });
    }

    return Promise.reject("Unknown endpoint");
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("SetPricePage", () => {
  it("renders product table after fetch", async () => {
    render(
      <MemoryRouter>
        <SetPricePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Set Prices for New Products/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
      expect(screen.getByText("Product B")).toBeInTheDocument();
    });
  });

  it("updates price input and submits", async () => {
    render(
      <MemoryRouter>
        <SetPricePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
    });

    const input = screen.getAllByPlaceholderText("Enter price")[0];
    fireEvent.change(input, { target: { value: "15.99" } });

    const button = screen.getByText("Set Price");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("✅ Price set successfully.")).toBeInTheDocument();
    });
  });

  it("shows error message for invalid input", async () => {
    render(
      <MemoryRouter>
        <SetPricePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
    });

    const button = screen.getByText("Set Price");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Please enter a valid price.")).toBeInTheDocument();
    });
  });
});
