import './salesmanager.css';
import { useNavigate } from 'react-router-dom';

const SalesManager = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: 'Product name',
      image: 'https://cdn.usegalileo.ai/sdxl10/76b44542-8993-4c4c-8143-be412431b788.png'
    },
    {
      id: 2,
      name: 'Product name',
      image: 'https://cdn.usegalileo.ai/sdxl10/084477fe-c112-4389-9ed8-07795f28e9cd.png'
    },
    {
      id: 3,
      name: 'Product name',
      image: 'https://cdn.usegalileo.ai/sdxl10/7e96a26e-42dd-461a-8c99-68d35a5f1f1d.png'
    },
    {
      id: 4,
      name: 'Product name',
      image: 'https://cdn.usegalileo.ai/sdxl10/d6b12ddf-ae45-4c0f-9785-39c5c7e5b42b.png'
    }
  ];

  return (
    <div className="salesmanager-container">
      <h1 className="salesmanager-title">Sales Manager</h1>

      <div className="feature-list">
        <button
          className="feature-block large-blue-btn"
          onClick={() => navigate('/setprices')}
        >
          <div className="feature-icon">🏷️</div>
          <div className="feature-content">
            <h4>Set product prices</h4>
            <p>Set the price of a product, or create a sale for a group of products</p>
          </div>
        </button>
      </div>

      <h3 className="section-title">New products pending pricing</h3>
      <div className="product-section">
        {products.slice(0, 2).map((product) => (
          <div key={product.id} className="product-row">
            <div className="product-info">
              <div
                className="product-image"
                style={{ backgroundImage: `url(${product.image})` }}
              ></div>
              <div>
                <div className="product-name">{product.name}</div>
                <div className="product-sub">{product.name}</div>
              </div>
            </div>
            <button className="price-btn">Set Price</button>
          </div>
        ))}
      </div>

      <h3 className="section-title">Invoices</h3>
      <div className="product-section">
        <div className="invoice-row">
          <div>
            <div className="invoice-month">January 2023</div>
            <div className="invoice-range">January 1, 2023 - January 31, 2023</div>
          </div>
          <button className="download-btn">Download</button>
        </div>
        <div className="invoice-row">
          <div>
            <div className="invoice-month">December 2022</div>
            <div className="invoice-range">December 1, 2022 - December 31, 2022</div>
          </div>
          <button className="download-btn">Download</button>
        </div>
        <div className="invoice-row">
          <div>
            <div className="invoice-month">November 2022</div>
            <div className="invoice-range">November 1, 2022 - November 30, 2022</div>
          </div>
          <button className="download-btn">Download</button>
        </div>
      </div>

      <h3 className="section-title">Calculate loss/profit chart</h3>
      <div className="loss-profit">
        <label className="calculator-label">Enter product cost</label>
        <input placeholder="$0.00" className="calculator-input" type="number" />
        <button className="calculator-btn">Calculate</button>
      </div>
    </div>
  );
};

export default SalesManager;
