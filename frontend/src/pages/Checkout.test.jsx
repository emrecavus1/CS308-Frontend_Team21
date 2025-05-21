import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Checkout from "./Checkout";
import { MemoryRouter } from "react-router-dom";

// Mock sessionStorage
beforeEach(() => {
  vi.resetAllMocks();
  sessionStorage.clear();
});

describe("Checkout page", () => {
  it("shows login error when no token is found", () => {
    sessionStorage.setItem("tabId", "tab123");

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    expect(screen.getByText(/you must be logged in to checkout/i)).toBeInTheDocument();
  });

  it("renders payment form when logged in", () => {
    sessionStorage.setItem("tabId", "tab123");
    sessionStorage.setItem("tab123-authToken", "fake-token");

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    expect(screen.getByText(/card number/i)).toBeInTheDocument();
    expect(screen.getByText(/expiry date/i)).toBeInTheDocument();
    expect(screen.getByText(/cvv/i)).toBeInTheDocument();
    expect(screen.getByText(/pay now/i)).toBeInTheDocument();
  });

  it("submits form successfully and shows invoice", async () => {
    sessionStorage.setItem("tabId", "tab123");
    sessionStorage.setItem("tab123-authToken", "fake-token");

    global.fetch = vi
      .fn()
      // First PUT to /order/order
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve("order-42"),
      })
      // Then GET to /invoices/order-42
      .mockResolvedValueOnce({
        ok: true,
        blob: () => new Blob(["fake-pdf"], { type: "application/pdf" }),
      });

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: "4111111111111111" } });
    fireEvent.change(screen.getByLabelText(/expiry date/i), { target: { value: "12/25" } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: "123" } });

    fireEvent.click(screen.getByText(/pay now/i));

    await waitFor(() => {
      expect(screen.getByText(/payment successful/i)).toBeInTheDocument();
      expect(screen.getByText(/download pdf/i)).toBeInTheDocument();
    });
  });

  it("shows error on failed order submission", async () => {
    sessionStorage.setItem("tabId", "tab123");
    sessionStorage.setItem("tab123-authToken", "fake-token");

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      text: () => Promise.resolve("Payment declined"),
    });

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: "4111111111111111" } });
    fireEvent.change(screen.getByLabelText(/expiry date/i), { target: { value: "12/25" } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: "123" } });

    fireEvent.click(screen.getByText(/pay now/i));

    await waitFor(() => {
      expect(screen.getByText(/payment declined/i)).toBeInTheDocument();
    });
  });

  it("shows error if invoice fetch fails after order success", async () => {
    sessionStorage.setItem("tabId", "tab123");
    sessionStorage.setItem("tab123-authToken", "fake-token");

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve("order-999"),
      })
      .mockResolvedValueOnce({
        ok: false,
        text: () => Promise.resolve("Invoice error"),
      });

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: "4111111111111111" } });
    fireEvent.change(screen.getByLabelText(/expiry date/i), { target: { value: "12/25" } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: "123" } });

    fireEvent.click(screen.getByText(/pay now/i));

    await waitFor(() => {
      expect(screen.getByText(/could not fetch invoice/i)).toBeInTheDocument();
    });
  });
});