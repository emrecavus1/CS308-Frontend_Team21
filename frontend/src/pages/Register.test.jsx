import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import Register from "./Register"
import axios from "axios"
import { vi } from "vitest"
import "@testing-library/jest-dom"

// axios'u mockla
vi.mock("axios")

// router context helper
const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>)

describe("Register Page", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders all form fields and submit button", () => {
    renderWithRouter(<Register />)

    expect(screen.getByText("Register")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByLabelText("Name")).toBeInTheDocument()
    expect(screen.getByLabelText("Surname")).toBeInTheDocument()
    expect(screen.getByLabelText("Role")).toBeInTheDocument()
    expect(screen.getByLabelText("City")).toBeInTheDocument()
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument()
    expect(screen.getByLabelText("Specific Address")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument()
  })

  it("submits form and navigates on success", async () => {
    axios.post.mockResolvedValueOnce({ status: 201 })

    renderWithRouter(<Register />)

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "123456" } })
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "John" } })
    fireEvent.change(screen.getByLabelText("Surname"), { target: { value: "Doe" } })
    fireEvent.change(screen.getByLabelText("Phone Number"), { target: { value: "5555555" } })
    fireEvent.change(screen.getByLabelText("Specific Address"), { target: { value: "Address line" } })

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }))

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:8080/api/auth/signup",
        expect.objectContaining({
          email: "test@example.com",
          name: "John",
          surname: "Doe",
        })
      )
    )
  })

  it("shows field errors from backend", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          errors: ["Email: must be valid", "Password: too short"]
        }
      }
    })

    renderWithRouter(<Register />)

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "bad" } })
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "123" } })

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.getByText("must be valid")).toBeInTheDocument()
      expect(screen.getByText("too short")).toBeInTheDocument()
    })
  })

  it("shows global error on unexpected failure", async () => {
    axios.post.mockRejectedValueOnce(new Error("network error"))

    renderWithRouter(<Register />)

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }))

    await waitFor(() =>
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument()
    )
  })
})
