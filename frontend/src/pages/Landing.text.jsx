import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import Landing from "./Landing"
import axios from "axios"
import { vi } from "vitest"
import "@testing-library/jest-dom"

// axios'u mockla
vi.mock("axios")

// router context ile sarmalayalım
const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>)

describe("Landing Page", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders hero section and categories heading", async () => {
    axios.get.mockResolvedValueOnce({ data: [{ categoryName: "Electronics", categoryId: "1" }] })

    renderWithRouter(<Landing />)

    expect(await screen.findByText("Welcome to Shipshak.com")).toBeInTheDocument()
    expect(screen.getByText("Categories")).toBeInTheDocument()
  })

  it("renders fetched categories", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { categoryName: "Books", categoryId: "cat1" },
        { categoryName: "Toys", categoryId: "cat2" },
      ],
    })

    renderWithRouter(<Landing />)

    expect(await screen.findByText("Books")).toBeInTheDocument()
    expect(await screen.findByText("Toys")).toBeInTheDocument()
  })

  it("sorts products by price asc on button click", async () => {
    axios.get
      .mockResolvedValueOnce({ data: [] }) // for categories
      .mockResolvedValueOnce({
        data: [
          { productId: "p1", productName: "iPhone", price: 999 },
          { productId: "p2", productName: "TV", price: 499 },
        ],
      })

    renderWithRouter(<Landing />)

    const sortButton = await screen.findByText("Price ↑")
    fireEvent.click(sortButton)

    expect(await screen.findByText("Sorted by Price (asc)")).toBeInTheDocument()
    expect(screen.getByText("iPhone — $999")).toBeInTheDocument()
    expect(screen.getByText("TV — $499")).toBeInTheDocument()
  })

  it("sorts products by rating desc on button click", async () => {
    axios.get
      .mockResolvedValueOnce({ data: [] }) // categories
      .mockResolvedValueOnce({
        data: [
          { productId: "p3", productName: "Item A", rating: 4.9 },
          { productId: "p4", productName: "Item B", rating: 4.5 },
        ],
      })

    renderWithRouter(<Landing />)

    const sortButton = await screen.findByText("Rating ↓")
    fireEvent.click(sortButton)

    expect(await screen.findByText("Sorted by Rating (desc)")).toBeInTheDocument()
    expect(screen.getByText("Item A — 4.90★")).toBeInTheDocument()
    expect(screen.getByText("Item B — 4.50★")).toBeInTheDocument()
  })
})
