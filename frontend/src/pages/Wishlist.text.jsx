import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import Wishlist from "./Wishlist"
import { vi } from "vitest"
import "@testing-library/jest-dom"

// Helper: render with router
const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>)

describe("Wishlist Page", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // clear mocks
    global.fetch = vi.fn()
    sessionStorage.clear()
  })

  it("shows login warning if userId is missing", async () => {
    sessionStorage.setItem("tabId", "test-tab")
    renderWithRouter(<Wishlist />)
    expect(await screen.findByText(/please log in/i)).toBeInTheDocument()
  })

  it("shows error if API fails", async () => {
    sessionStorage.setItem("tabId", "test-tab")
    sessionStorage.setItem("test-tab-userId", "user123")
    fetch.mockResolvedValueOnce({ ok: false })
    //test
    renderWithRouter(<Wishlist />)
    expect(await screen.findByText(/failed to load wishlist/i)).toBeInTheDocument()
  })

  it("shows empty wishlist if no products", async () => {
    sessionStorage.setItem("tabId", "test-tab")
    sessionStorage.setItem("test-tab-userId", "user123")
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    renderWithRouter(<Wishlist />)
    expect(await screen.findByText(/your wishlist is empty/i)).toBeInTheDocument()
  })

  it("renders wishlist items", async () => {
    sessionStorage.setItem("tabId", "test-tab")
    sessionStorage.setItem("test-tab-userId", "user123")

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          productId: "p1",
          productName: "Wireless Mouse",
          price: 49.99,
          stockCount: 10,
        },
      ],
    })

    renderWithRouter(<Wishlist />)
    expect(await screen.findByText("Wireless Mouse")).toBeInTheDocument()
    expect(screen.getByText("$49.99")).toBeInTheDocument()
    expect(screen.getByText("In stock: 10")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /add to cart/i })).toBeInTheDocument()
  })

  it("removes item from wishlist", async () => {
    sessionStorage.setItem("tabId", "test-tab")
    sessionStorage.setItem("test-tab-userId", "user123")

    // 1. Load wishlist
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          productId: "p1",
          productName: "Gaming Keyboard",
          price: 89.99,
          stockCount: 5,
        },
      ],
    })

    // 2. DELETE wishlist item
    fetch.mockResolvedValueOnce({ ok: true })

    renderWithRouter(<Wishlist />)
    expect(await screen.findByText("Gaming Keyboard")).toBeInTheDocument()

    const removeBtn = document.querySelector(".wishlist-icon")
    fireEvent.click(removeBtn)

    await waitFor(() =>
      expect(screen.queryByText("Gaming Keyboard")).not.toBeInTheDocument()
    )
  })

  it("adds item to cart successfully", async () => {
    sessionStorage.setItem("tabId", "test-tab")
    sessionStorage.setItem("test-tab-userId", "user123")

    // mock TAB_CART_ID cookie
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "TAB_CART_ID=cart123;",
    })

    // 1. Load wishlist
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          productId: "p5",
          productName: "Headphones",
          price: 59.99,
          stockCount: 12,
        },
      ],
    })

    // 2. Add to cart
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "added to cart!" }),
    })

    renderWithRouter(<Wishlist />)

    const addButton = await screen.findByText("Add to Cart")
    fireEvent.click(addButton)

    expect(await screen.findByText(/added to cart/i)).toBeInTheDocument()
  })

  it("shows error message if add to cart fails", async () => {
    sessionStorage.setItem("tabId", "test-tab")
    sessionStorage.setItem("test-tab-userId", "user123")

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          productId: "p10",
          productName: "Monitor",
          price: 299.99,
          stockCount: 3,
        },
      ],
    })

    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "failed to add" }),
    })

    renderWithRouter(<Wishlist />)

    const addButton = await screen.findByText("Add to Cart")
    fireEvent.click(addButton)

    expect(await screen.findByText(/failed to add/i)).toBeInTheDocument()
  })
})
