import './setprices.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const SetPrices = () => {
  const [option, setOption] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [productName, setProductName] = useState('');
  const [productInfo, setProductInfo] = useState('');
  const [stockCount, setStockCount] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/main/getCategories')
      .then(res => {
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else if (res.data.categories) {
          setCategories(res.data.categories);
        } else {
          console.error('Invalid response for categories:', res.data);
        }
      })
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

    if (option === 'existing') {
      try {
        const res = await axios.get(`http://localhost:8080/api/main/category/${categoryId}/getProductsByCategory`);
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (option === 'new') {
      try {
        const queryParams = new URLSearchParams({
          name: productName,
          info: productInfo,
          categoryName: selectedCategory,
          stock: stockCount,
          imageUrl: imageUrl
        }).toString();

        const productPayload = {
          price: parseFloat(newPrice),
          stockCount: parseInt(stockCount),
          productName,
          productInfo,
          imageUrl
        };

        await axios.post(`http://localhost:8080/api/main/addProduct?${queryParams}`, productPayload, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        alert('Product added successfully!');
      } catch (err) {
        console.error('Error adding product:', err);
      }
    } else if (option === 'existing') {
      try {
        await axios.put(`http://localhost:8080/api/main/updatePrice/${selectedProduct}/${newPrice}`);
        alert('Price updated successfully!');
      } catch (err) {
        console.error('Error updating price:', err);
      }
    }
  };

  return (
    <div className="set-prices-container">
      <h1 className="set-prices-title">Set Prices</h1>
      <p className="set-prices-subtext">
        Set prices for new products or update prices for existing products.
      </p>

      <form className="set-prices-form" onSubmit={handleSubmit}>
        <select
          className="set-prices-select"
          value={option}
          onChange={(e) => {
            setOption(e.target.value);
            setSelectedCategory('');
            setSelectedProduct('');
            setProductName('');
            setProductInfo('');
            setStockCount('');
            setNewPrice('');
            setImageUrl('');
          }}
        >
          <option value="" disabled>
            Select an option
          </option>
          <option value="new">Set prices for new products</option>
          <option value="existing">Update existing product prices</option>
        </select>

        {option && (
          <>
            <select
              className="set-prices-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option
                  key={cat.categoryId || cat._id}
                  value={option === 'new' ? cat.categoryName : cat.categoryId || cat._id}
                >
                  {cat.categoryName || cat.name}
                </option>
              ))}
            </select>

            {option === 'new' && (
              <>
                <input
                  className="set-prices-select"
                  type="text"
                  placeholder="Product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
                <input
                  className="set-prices-select"
                  type="text"
                  placeholder="Product info"
                  value={productInfo}
                  onChange={(e) => setProductInfo(e.target.value)}
                />
                <input
                  className="set-prices-select"
                  type="number"
                  placeholder="Stock count"
                  value={stockCount}
                  onChange={(e) => setStockCount(e.target.value)}
                />
                <input
                  className="set-prices-select"
                  type="text"
                  placeholder="Image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <input
                  className="set-prices-select"
                  type="number"
                  placeholder="Price"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </>
            )}

            {option === 'existing' && (
              <>
                <select
                  className="set-prices-select"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="" disabled>Select a product</option>
                  {products.map((prod) => (
                    <option key={prod._id} value={prod._id}>{prod.name}</option>
                  ))}
                </select>
                <input
                  className="set-prices-select"
                  type="number"
                  placeholder="New Price"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </>
            )}

            <button className="calculator-btn" type="submit">Submit</button>
          </>
        )}
      </form>
    </div>
  );
};

export default SetPrices;