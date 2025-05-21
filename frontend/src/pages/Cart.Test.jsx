import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Cart from "./Cart";

// Basic mocks
const mockItems = [
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
];

const mockProductData = {
  1: { productName: "Test Product 1", price: 10 },
  2: { productName: "Test Product 2", price: 20 },
};

beforeEach(() => {
  sessionStorage.setItem("tabId", "testTab");

  global.fetch = vi.fn((url) => {
    if (url.includes("/items")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockItems),
      });
    }

    const productId = url.split("/").pop();
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProductData[productId]),
    });
  });
});

afterEach(() => {
  sessionStorage.clear();
  vi.clearAllMocks();
});

describe("Cart Page", () => {
  it("renders loading state initially", () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("shows empty message when cart is empty", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument()
    );
  });

  it("renders cart items and total correctly", async () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Your Cart")).toBeInTheDocument();
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
      expect(screen.getByText("Test Product 2")).toBeInTheDocument();
      expect(screen.getByText("Total: $40.00")).toBeInTheDocument();
    });
  });

  it("has checkout button", async () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Checkout")).toBeInTheDocument();
    });
  });
});