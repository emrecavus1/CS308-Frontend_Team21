import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProductCard from './ProductCard'
import '@testing-library/jest-dom'

// mock sessionStorage
beforeEach(() => {
  sessionStorage.setItem('tabId', 'testTab')
  sessionStorage.setItem('testTab-userId', 'user123')
})

// mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: 'added to cart' }),
  })
)

// helper to wrap with router context
const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>)

const product = {
  productId: 'p1',
  productName: 'Test Product',
  price: 99.99,
  stockCount: 5,
}

describe('ProductCard', () => {
  it('renders product name, price and stock', () => {
    renderWithRouter(<ProductCard product={product} />)

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByText('In stock: 5')).toBeInTheDocument()
    expect(screen.getByText('Add to Cart')).toBeInTheDocument()
  })

  it('calls add to cart API on button click', async () => {
    renderWithRouter(<ProductCard product={product} />)

    const button = screen.getByText('Add to Cart')
    fireEvent.click(button)

    await waitFor(() =>
      expect(screen.getByText(/added to cart/i)).toBeInTheDocument()
    )

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/main/cart/add?productId=p1&tabId=testTab'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('toggles wishlist icon on click', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true }) // POST success
    )

    renderWithRouter(<ProductCard product={product} />)

    const wishlistIcon = screen.getByRole('button') // the heart icon is a div, but with onClick; we can improve this with role

    fireEvent.click(wishlistIcon)

    await waitFor(() => {
      // check filled heart appears
      expect(document.querySelector('.filled')).toBeInTheDocument()
    })
  })
})
