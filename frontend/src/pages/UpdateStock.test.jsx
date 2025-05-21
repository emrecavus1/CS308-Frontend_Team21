import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import UpdateStock from "./UpdateStock"
import axios from "axios"
import { vi } from "vitest"
import "@testing-library/jest-dom"

vi.mock("axios")

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>)

describe("UpdateStock Page", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders title and initial state", async () => {
    axios.get.mockResolvedValueOnce({ data: { categories: [] } })
    renderWithRouter(<UpdateStock />)

    expect(await screen.findByText(/update product stock/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/select category/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/select product/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/new stock value/i)).toBeInTheDocument()
  })

  it("loads categories from API", async () => {
    const mockCategories = [
      { categoryId: "1", categoryName: "Electronics" },
      { categoryId: "2", categoryName: "Books" },
    ]
    axios.get.mockResolvedValueOnce({ data: { categories: mockCategories } })

    renderWithRouter(<UpdateStock />)

    const select = await screen.findByLabelText(/select category/i)
    fireEvent.change(select, { target: { value: "1" } })

    expect(screen.getByDisplayValue("Electronics")).toBeInTheDocument()
  })

  it("loads products when category is selected", async () => {
    // Step 1: load categories
    axios.get.mockResolvedValueOnce({
      data: { categories: [{ categoryId: "10", categoryName: "Tech" }] },
    })

    // Step 2: load products
    axios.get.mockResolvedValueOnce({
      data: {
        products: [
          { productId: "p1", productName: "Phone" },
          { productId: "p2", productName: "Tablet" },
        ],
      },
    })

    renderWithRouter(<UpdateStock />)

    const categorySelect = await screen.findByLabelText(/select category/i)
    fireEvent.change(categorySelect, { target: { value: "10" } })

    const productSelect = await screen.findByLabelText(/select product/i)

    await waitFor(() => {
      expect(screen.getByText("Phone")).toBeInTheDocument()
      expect(screen.getByText("Tablet")).toBeInTheDocument()
    })

    fireEvent.change(productSelect, { target: { value: "p1" } })
    expect(screen.getByDisplayValue("Phone")).toBeInTheDocument()
  })

  it("updates stock successfully", async () => {
    // categories
    axios.get.mockResolvedValueOnce({
      data: { categories: [{ categoryId: "1", categoryName: "Food" }] },
    })

    // products for category
    axios.get.mockResolvedValueOnce({
      data: { products: [{ productId: "p55", productName: "Chips" }] },
    })

    // stock update success
    axios.put.mockResolvedValueOnce({ status: 200 })

    renderWithRouter(<UpdateStock />)

    const categorySelect = await screen.findByLabelText(/select category/i)
    fireEvent.change(categorySelect, { target: { value: "1" } })

    const productSelect = await screen.findByLabelText(/select product/i)
    await waitFor(() => fireEvent.change(productSelect, { target: { value: "p55" } }))

    const stockInput = screen.getByLabelText(/new stock value/i)
    fireEvent.change(stockInput, { target: { value: "42" } })

    fireEvent.click(screen.getByText(/update stock/i))

    await waitFor(() =>
      expect(screen.getByText(/stock updated successfully/i)).toBeInTheDocument()
    )
  })

  it("shows error if stock update fails", async () => {
    // categories
    axios.get.mockResolvedValueOnce({
      data: { categories: [{ categoryId: "5", categoryName: "Shoes" }] },
    })

    // products
    axios.get.mockResolvedValueOnce({
      data: { products: [{ productId: "px", productName: "Sneakers" }] },
    })

    // error in update
    axios.put.mockRejectedValueOnce(new Error("error"))

    renderWithRouter(<UpdateStock />)

    const categorySelect = await screen.findByLabelText(/select category/i)
    fireEvent.change(categorySelect, { target: { value: "5" } })

    const productSelect = await screen.findByLabelText(/select product/i)
    await waitFor(() => fireEvent.change(productSelect, { target: { value: "px" } }))

    const stockInput = screen.getByLabelText(/new stock value/i)
    fireEvent.change(stockInput, { target: { value: "100" } })

    fireEvent.click(screen.getByText(/update stock/i))

    await waitFor(() =>
      expect(screen.getByText(/error updating stock/i)).toBeInTheDocument()
    )
  })

  it("shows error if categories fail to load", async () => {
    axios.get.mockRejectedValueOnce(new Error("fail"))

    renderWithRouter(<UpdateStock />)

    expect(await screen.findByText(/failed to load categories/i)).toBeInTheDocument()
  })

  it("shows error if products fail to load", async () => {
    axios.get.mockResolvedValueOnce({
      data: { categories: [{ categoryId: "99", categoryName: "Garden" }] },
    })

    axios.get.mockRejectedValueOnce(new Error("fail"))

    renderWithRouter(<UpdateStock />)

    const categorySelect = await screen.findByLabelText(/select category/i)
    fireEvent.change(categorySelect, { target: { value: "99" } })

    expect(await screen.findByText(/failed to load products/i)).toBeInTheDocument()
  })
})
