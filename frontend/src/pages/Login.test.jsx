import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";
import axios from "axios";
import '@testing-library/jest-dom';
import { vi } from "vitest";

// mock axios
vi.mock("axios");

// helper to wrap with Router context
const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe("Login Page", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders email and password inputs", () => {
    renderWithRouter(<Login />);
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it("allows user to type email and password", () => {
    renderWithRouter(<Login />);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("123456");
  });

  it("shows error on failed login", async () => {
    axios.post.mockRejectedValueOnce(new Error("Login failed"));

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByText(/sign in/i));

    await waitFor(() =>
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
    );
  });

  it("saves data in sessionStorage and navigates on success", async () => {
    const mockResponse = {
      data: {
        token: "test-token",
        userId: "user123",
        name: "John",
        surname: "Doe",
        role: "Customer",
        specificAddress: "Earth",
        email: "john@example.com",
      },
    };
    axios.post.mockResolvedValueOnce(mockResponse);

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText(/sign in/i));

    await waitFor(() =>
      expect(sessionStorage.getItem(expect.stringContaining("-authToken"))).toBe("test-token")
    );
  });
});
