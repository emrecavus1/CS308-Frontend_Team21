import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddProduct from "./AddProduct";

beforeEach(() => {
  global.fetch = vi.fn((url) => {
    if (url.includes("getCategories")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ categories: [{ categoryId: 1, categoryName: "Electronics" }] }),
      });
    }

    return Promise.reject("Unknown endpoint");
  });

  global.axios = {
    get: vi.fn(() => Promise.resolve({ data: { categories: [{ categoryId: 1, categoryName: "Electronics" }] } })),
    post: vi.fn(() => Promise.resolve({ data: "Product added successfully." })),
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("AddProduct Page", () => {
  it("renders input fields and category select", async () => {
    render(
      <MemoryRouter>
        <AddProduct />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Add Product")).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText("Product Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Product Info")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Stock Count")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Serial Number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Warranty Status")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Distributor Info")).toBeInTheDocument();
    expect(screen.getByText("➕ Add Product")).toBeInTheDocument();
  });

  it("can fill the form and submit", async () => {
    render(
      <MemoryRouter>
        <AddProduct />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Add Product")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("Product Name"), { target: { value: "Phone" } });
    fireEvent.change(screen.getByPlaceholderText("Product Info"), { target: { value: "Smartphone" } });
    fireEvent.change(screen.getByPlaceholderText("Stock Count"), { target: { value: "50" } });
    fireEvent.change(screen.getByPlaceholderText("Serial Number"), { target: { value: "ABC123" } });
    fireEvent.change(screen.getByPlaceholderText("Warranty Status"), { target: { value: "2 Years" } });
    fireEvent.change(screen.getByPlaceholderText("Distributor Info"), { target: { value: "Distributor Inc." } });
    fireEvent.change(screen.getByDisplayValue("Select Category"), { target: { value: "Electronics" } });

    fireEvent.click(screen.getByText("➕ Add Product"));

    await waitFor(() => {
      expect(screen.getByText("Product added successfully.")).toBeInTheDocument();
    });
  });
});