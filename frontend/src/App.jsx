import React, { useEffect, useState } from "react";
import "./App.css";

const PRODUCTS_API = "http://localhost:8000/api/v1/products";
const ORDERS_API = "http://localhost:8000/api/v1/orders";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showAdminOrders, setShowAdminOrders] = useState(false);
  const [showAdminProducts, setShowAdminProducts] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const [showAddProduct, setShowAddProduct] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    ratings: "",
    category: "",
    seller: "",
    stock: "",
    image: "",
  });

  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(PRODUCTS_API);

      if (!response.ok) {
        throw new Error("Products API error");
      }

      const data = await response.json();

      console.log("PRODUCT DATA:", data);

      setProducts(
        Array.isArray(data.products)
          ? data.products
          : []
      );
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load products. Please check the backend."
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // PRODUCT IMAGE
  // =========================

  const getImage = (product) => {
    if (
      product &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      const firstImage = product.images[0];

      if (typeof firstImage === "string") {
        return firstImage;
      }

      if (firstImage?.image) {
        return firstImage.image;
      }

      if (firstImage?.url) {
        return firstImage.url;
      }
    }

    return "https://via.placeholder.com/300x250?text=No+Image";
  };

  // =========================
  // HOME
  // =========================

  const goHome = () => {
    setShowCart(false);
    setShowCheckout(false);
    setShowOrders(false);
    setShowAdminOrders(false);
    setShowAdminProducts(false);
    setShowProductDetails(false);
    setShowAddProduct(false);
    setEditingProduct(null);
    setSelectedProduct(null);
  };

  // =========================
  // PRODUCT DETAILS
  // =========================

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);

    setShowCart(false);
    setShowCheckout(false);
    setShowOrders(false);
    setShowAdminOrders(false);
    setShowAdminProducts(false);
    setShowAddProduct(false);
    setEditingProduct(null);
  };

  // =========================
  // CART
  // =========================

  const addToCart = (product) => {
    setCart((oldCart) => {
      const existing = oldCart.find(
        (item) => item._id === product._id
      );

      if (existing) {
        return oldCart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...oldCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    alert("Product added to cart!");
  };

  const removeFromCart = (id) => {
    setCart((oldCart) =>
      oldCart.filter((item) => item._id !== id)
    );
  };

  const increaseQuantity = (id) => {
    setCart((oldCart) =>
      oldCart.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((oldCart) =>
      oldCart
        .map((item) =>
          item._id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) * item.quantity,
    0
  );

  const openCart = () => {
    setShowCart(true);
    setShowCheckout(false);
    setShowOrders(false);
    setShowAdminOrders(false);
    setShowAdminProducts(false);
    setShowProductDetails(false);
    setShowAddProduct(false);
    setEditingProduct(null);
    setSelectedProduct(null);
  };

  const openCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setShowCheckout(true);
    setShowCart(false);
    setShowOrders(false);
    setShowAdminOrders(false);
    setShowAdminProducts(false);
    setShowProductDetails(false);
    setShowAddProduct(false);
    setEditingProduct(null);
    setSelectedProduct(null);
  };

  // =========================
  // ORDERS
  // =========================

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);

      const response = await fetch(ORDERS_API);

      if (!response.ok) {
        throw new Error("Orders API error");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders(
          Array.isArray(data.orders)
            ? data.orders
            : []
        );
      }
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const openOrders = () => {
    setShowOrders(true);
    setShowCart(false);
    setShowCheckout(false);
    setShowAdminOrders(false);
    setShowAdminProducts(false);
    setShowProductDetails(false);
    setShowAddProduct(false);
    setEditingProduct(null);
    setSelectedProduct(null);

    fetchOrders();
  };

  const openAdminOrders = () => {
    setShowAdminOrders(true);
    setShowOrders(false);
    setShowCart(false);
    setShowCheckout(false);
    setShowAdminProducts(false);
    setShowProductDetails(false);
    setShowAddProduct(false);
    setEditingProduct(null);
    setSelectedProduct(null);

    fetchOrders();
  };

  const updateOrderStatus = async (
    orderId,
    status
  ) => {
    try {
      const response = await fetch(
        `${ORDERS_API}/order/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Update failed"
        );
      }

      alert("Order status updated successfully!");

      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Unable to update order status.");
    }
  };

  // =========================
  // PLACE ORDER
  // =========================

  const placeOrder = async (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (
      customerName.trim() === "" ||
      customerEmail.trim() === "" ||
      customerAddress.trim() === ""
    ) {
      alert("Please fill all details.");
      return;
    }

    const orderData = cart.map((item) => ({
      product: {
        _id: item._id,
        name: item.name,
        price: Number(item.price || 0),
      },
      qty: item.quantity,
    }));

    try {
      const response = await fetch(
        `${ORDERS_API}/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.message || "Order failed"
        );
      }

      alert("Order placed successfully!");

      setCart([]);
      setCustomerName("");
      setCustomerEmail("");
      setCustomerAddress("");

      setShowCheckout(false);
      setShowOrders(true);

      fetchOrders();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert(
        "Order could not be placed. Please check the backend."
      );
    }
  };

  // =========================
  // ADMIN PRODUCTS
  // =========================

  const openAdminProducts = () => {
    setShowAdminProducts(true);
    setShowAdminOrders(false);
    setShowOrders(false);
    setShowCart(false);
    setShowCheckout(false);
    setShowProductDetails(false);
    setShowAddProduct(false);
    setEditingProduct(null);
    setSelectedProduct(null);

    fetchProducts();
  };

  // =========================
  // EDIT PRODUCT
  // =========================

  const openEditProduct = (product) => {
    setEditingProduct({
      _id: product._id,
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
      ratings: product.ratings || "",
      category: product.category || "",
      seller: product.seller || "",
      stock: product.stock || "",
      image: getImage(product),
    });

    setShowAddProduct(false);
  };

  const saveEditedProduct = async () => {
    if (!editingProduct) {
      return;
    }

    try {
      const response = await fetch(
        `${PRODUCTS_API}/${editingProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editingProduct.name,
            price: editingProduct.price,
            description: editingProduct.description,
            ratings: editingProduct.ratings,
            category: editingProduct.category,
            seller: editingProduct.seller,
            stock: editingProduct.stock,
            images: [
              {
                image: editingProduct.image,
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Update failed"
        );
      }

      alert("Product updated successfully!");

      setEditingProduct(null);

      await fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Unable to update product.");
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const deleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${PRODUCTS_API}/${productId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Delete failed"
        );
      }

      alert("Product deleted successfully!");

      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Unable to delete product.");
    }
  };

  // =========================
  // ADD PRODUCT
  // =========================

  const addProduct = async () => {
    if (newProduct.name.trim() === "") {
      alert("Enter product name");
      return;
    }

    if (newProduct.price.trim() === "") {
      alert("Enter product price");
      return;
    }

    try {
      const response = await fetch(
        PRODUCTS_API,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newProduct.name,
            price: newProduct.price,
            description: newProduct.description,
            ratings: newProduct.ratings,
            category: newProduct.category,
            seller: newProduct.seller,
            stock: newProduct.stock,
            images: [
              {
                image: newProduct.image,
              },
            ],
            numOfReviews: "0",
            createdAt: new Date(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Create product failed"
        );
      }

      alert("Product added successfully!");

      setNewProduct({
        name: "",
        price: "",
        description: "",
        ratings: "",
        category: "",
        seller: "",
        stock: "",
        image: "",
      });

      setShowAddProduct(false);

      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Unable to add product.");
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredProducts = products.filter(
    (product) => {
      const text = search
        .toLowerCase()
        .trim();

      if (text === "") {
        return true;
      }

      return (
        product.name
          ?.toLowerCase()
          .includes(text) ||
        product.category
          ?.toLowerCase()
          .includes(text) ||
        product.description
          ?.toLowerCase()
          .includes(text)
      );
    }
  );

  // =========================
  // RETURN
  // =========================

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">

        <div
          className="logo"
          onClick={goHome}
        >
          <span>JVL</span>
          <span>Cart</span>
        </div>

        <div className="search-box">

          <input
            type="text"
            placeholder="Enter Product Name ..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <button
            onClick={() => {
              goHome();
            }}
          >
            🔍
          </button>

        </div>

        <div className="header-buttons">

          <button
            className="header-btn"
            onClick={openOrders}
          >
            Orders
          </button>

          <button
            className="header-btn"
            onClick={openAdminOrders}
          >
            Admin
          </button>

          <button
            className="header-btn"
            onClick={openAdminProducts}
          >
            Products
          </button>

          <button
            className="cart-button"
            onClick={openCart}
          >
            Cart
            <span className="cart-count">
              {cartCount}
            </span>
          </button>

        </div>

      </header>

      {/* PRODUCT DETAILS */}

      {showProductDetails &&
        selectedProduct && (
          <section className="details-section">

            <button
              className="back-button"
              onClick={goHome}
            >
              ← Back
            </button>

            <div className="details-card">

              <div className="details-image">

                <img
                  src={getImage(selectedProduct)}
                  alt={selectedProduct.name}
                />

              </div>

              <div className="details-info">

                <p className="category">
                  {selectedProduct.category ||
                    "Product"}
                </p>

                <h1>
                  {selectedProduct.name}
                </h1>

                <p className="details-rating">
                  ⭐{" "}
                  {selectedProduct.ratings ||
                    "0"}{" "}
                  / 5
                </p>

                <h2 className="details-price">
                  $
                  {Number(
                    selectedProduct.price || 0
                  ).toFixed(2)}
                </h2>

                <p className="details-description">
                  {selectedProduct.description ||
                    "No description available."}
                </p>

                <p>
                  <strong>Seller:</strong>{" "}
                  {selectedProduct.seller ||
                    "Unknown"}
                </p>

                <p>
                  <strong>Stock:</strong>{" "}
                  {selectedProduct.stock || 0}
                </p>

                <button
                  className="primary-button"
                  onClick={() =>
                    addToCart(selectedProduct)
                  }
                >
                  Add to Cart
                </button>

              </div>

            </div>

          </section>
        )}

      {/* CART */}

      {showCart && (
        <section className="page-section">

          <button
            className="back-button"
            onClick={goHome}
          >
            ← Continue Shopping
          </button>

          <h1 className="page-title">
            Your Cart
          </h1>

          {cart.length === 0 ? (
            <div className="empty-box">

              <h2>
                Your cart is empty
              </h2>

              <button
                className="primary-button"
                onClick={goHome}
              >
                Shop Now
              </button>

            </div>
          ) : (
            <>
              <div className="cart-list">

                {cart.map((item) => (
                  <div
                    className="cart-item"
                    key={item._id}
                  >

                    <img
                      src={getImage(item)}
                      alt={item.name}
                    />

                    <div className="cart-item-info">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        $
                        {Number(
                          item.price || 0
                        ).toFixed(2)}
                      </p>

                    </div>

                    <div className="quantity">

                      <button
                        onClick={() =>
                          decreaseQuantity(
                            item._id
                          )
                        }
                      >
                        -
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(
                            item._id
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                    <strong>
                      $
                      {(
                        Number(
                          item.price || 0
                        ) * item.quantity
                      ).toFixed(2)}
                    </strong>

                    <button
                      className="remove-button"
                      onClick={() =>
                        removeFromCart(item._id)
                      }
                    >
                      Remove
                    </button>

                  </div>
                ))}

              </div>

              <div className="cart-summary">

                <h2>
                  Total: $
                  {cartTotal.toFixed(2)}
                </h2>

                <button
                  className="primary-button"
                  onClick={openCheckout}
                >
                  Proceed to Checkout
                </button>

              </div>
            </>
          )}

        </section>
      )}

      {/* CHECKOUT */}

      {showCheckout && (
        <section className="page-section">

          <button
            className="back-button"
            onClick={openCart}
          >
            ← Back to Cart
          </button>

          <h1 className="page-title">
            Checkout
          </h1>

          <form
            className="checkout-form"
            onSubmit={placeOrder}
          >

            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(event) =>
                setCustomerName(
                  event.target.value
                )
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={customerEmail}
              onChange={(event) =>
                setCustomerEmail(
                  event.target.value
                )
              }
            />

            <textarea
              placeholder="Delivery Address"
              value={customerAddress}
              onChange={(event) =>
                setCustomerAddress(
                  event.target.value
                )
              }
            />

            <h2>
              Total: $
              {cartTotal.toFixed(2)}
            </h2>

            <button
              type="submit"
              className="primary-button"
            >
              Place Order
            </button>

          </form>

        </section>
      )}

      {/* USER ORDERS */}

      {showOrders && (
        <section className="page-section">

          <button
            className="back-button"
            onClick={goHome}
          >
            ← Back
          </button>

          <h1 className="page-title">
            My Orders
          </h1>

          {ordersLoading ? (
            <div className="message">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-box">
              <h2>No orders found</h2>
            </div>
          ) : (
            <div className="orders-grid">

              {orders.map((order, index) => (
                <div
                  className="order-card"
                  key={order._id || index}
                >

                  <h3>
                    Order #
                    {order._id || index + 1}
                  </h3>

                  <p>
                    <strong>
                      Customer:
                    </strong>{" "}
                    {order.customerName ||
                      "Customer"}
                  </p>

                  <p>
                    <strong>
                      Total:
                    </strong>{" "}
                    $
                    {Number(
                      order.amount ||
                        order.totalPrice ||
                        0
                    ).toFixed(2)}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{" "}
                    <span className="status">
                      {order.status ||
                        "pending"}
                    </span>
                  </p>

                </div>
              ))}

            </div>
          )}

        </section>
      )}

      {/* ADMIN ORDERS */}

      {showAdminOrders && (
        <section className="page-section">

          <button
            className="back-button"
            onClick={goHome}
          >
            ← Back to Shop
          </button>

          <h1 className="page-title">
            Admin Orders
          </h1>

          {ordersLoading ? (
            <div className="message">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-box">
              <h2>
                No orders available
              </h2>
            </div>
          ) : (
            <div className="admin-orders-grid">

              {orders.map((order, index) => (
                <div
                  className="admin-order-card"
                  key={order._id || index}
                >

                  <div className="order-header">

                    <h3>
                      Order #
                      {order._id ||
                        index + 1}
                    </h3>

                    <span className="status">
                      {order.status ||
                        "pending"}
                    </span>

                  </div>

                  <hr />

                  <p>
                    <strong>
                      Customer:
                    </strong>{" "}
                    {order.customerName ||
                      "Customer"}
                  </p>

                  <p>
                    <strong>
                      Email:
                    </strong>{" "}
                    {order.customerEmail ||
                      "Not available"}
                  </p>

                  <p>
                    <strong>
                      Address:
                    </strong>{" "}
                    {order.address ||
                      "Not available"}
                  </p>

                  <p>
                    <strong>
                      Total:
                    </strong>{" "}
                    $
                    {Number(
                      order.amount ||
                        order.totalPrice ||
                        0
                    ).toFixed(2)}
                  </p>

                  <p>
                    <strong>
                      Date:
                    </strong>{" "}
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>

                  <div className="status-update">

                    <select
                      value={
                        order.status ||
                        "pending"
                      }
                      onChange={(event) => {
                        const newStatus =
                          event.target.value;

                        setOrders(
                          (oldOrders) =>
                            oldOrders.map(
                              (item) =>
                                item._id ===
                                order._id
                                  ? {
                                      ...item,
                                      status:
                                        newStatus,
                                    }
                                  : item
                            )
                        );
                      }}
                    >

                      <option value="pending">
                        Pending
                      </option>

                      <option value="processing">
                        Processing
                      </option>

                      <option value="shipped">
                        Shipped
                      </option>

                      <option value="delivered">
                        Delivered
                      </option>

                      <option value="cancelled">
                        Cancelled
                      </option>

                    </select>

                    <button
                      className="update-status-button"
                      onClick={() =>
                        updateOrderStatus(
                          order._id,
                          order.status ||
                            "pending"
                        )
                      }
                    >
                      Update Status
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>
      )}

      {/* ADMIN PRODUCTS */}

      {showAdminProducts && (
        <section className="page-section">

          <button
            className="back-button"
            onClick={goHome}
          >
            ← Back to Shop
          </button>

          <h1 className="page-title">
            Admin Products
          </h1>

          <p>
            Manage your products here.
          </p>

          <button
            className="primary-button"
            onClick={() => {
              setShowAddProduct(true);
              setEditingProduct(null);
            }}
          >
            + Add Product
          </button>

          {/* ADD PRODUCT */}

          {showAddProduct && (
            <div className="admin-form">

              <h2>Add Product</h2>

              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    name: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Description"
                value={
                  newProduct.description
                }
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    description:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    category:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Seller"
                value={newProduct.seller}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    seller: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    stock: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Rating"
                value={newProduct.ratings}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    ratings:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Image URL"
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    image: e.target.value,
                  })
                }
              />

              <button
                className="primary-button"
                onClick={addProduct}
              >
                Save Product
              </button>

              <button
                className="back-button"
                onClick={() =>
                  setShowAddProduct(false)
                }
              >
                Cancel
              </button>

            </div>
          )}

          {/* EDIT PRODUCT */}

          {editingProduct && (
            <div className="admin-form">

              <h2>Edit Product</h2>

              <input
                type="text"
                placeholder="Product Name"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    name: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Price"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Description"
                value={
                  editingProduct.description
                }
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    description:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Category"
                value={
                  editingProduct.category
                }
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    category:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Seller"
                value={editingProduct.seller}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    seller: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Stock"
                value={editingProduct.stock}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    stock: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Rating"
                value={
                  editingProduct.ratings
                }
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    ratings:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Image URL"
                value={editingProduct.image}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    image: e.target.value,
                  })
                }
              />

              <button
                className="primary-button"
                onClick={
                  saveEditedProduct
                }
              >
                Update Product
              </button>

              <button
                className="back-button"
                onClick={() =>
                  setEditingProduct(null)
                }
              >
                Cancel
              </button>

            </div>
          )}

          {/* PRODUCTS */}

          <div className="admin-products-grid">

            {products.length === 0 ? (
              <div className="empty-box">
                <h2>
                  No products found
                </h2>
              </div>
            ) : (
              products.map((product) => (
                <div
                  className="admin-product-card"
                  key={product._id}
                >

                  <div className="product-image">

                    <img
                      src={getImage(product)}
                      alt={product.name}
                    />

                  </div>

                  <p className="category">
                    {product.category ||
                      "Product"}
                  </p>

                  <h2>
                    {product.name}
                  </h2>

                  <p>
                    {product.description ||
                      "No description"}
                  </p>

                  <p>
                    <strong>
                      Price:
                    </strong>{" "}
                    $
                    {Number(
                      product.price || 0
                    ).toFixed(2)}
                  </p>

                  <p>
                    <strong>
                      Stock:
                    </strong>{" "}
                    {product.stock || 0}
                  </p>

                  <p>
                    <strong>
                      Rating:
                    </strong>{" "}
                    ⭐
                    {product.ratings || "0"}
                  </p>

                  <p>
                    <strong>
                      Seller:
                    </strong>{" "}
                    {product.seller ||
                      "Unknown"}
                  </p>

                  <div className="admin-product-actions">

                    <button
                      className="edit-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        openEditProduct(product);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteProduct(
                          product._id
                        );
                      }}
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))
            )}

          </div>

        </section>
      )}

      {/* HOME */}

      {!showCart &&
        !showCheckout &&
        !showOrders &&
        !showAdminOrders &&
        !showAdminProducts &&
        !showProductDetails &&
        !showAddProduct &&
        !editingProduct && (
          <>

            <section className="hero">

              <p className="hero-small">
                WELCOME TO MY SHOP
              </p>

              <h1>
                Find Your Perfect Product
              </h1>

              <p>
                Browse our products and
                discover something you love.
              </p>

            </section>

            <main className="products-section">

              <h2>
                Latest Products
              </h2>

              {loading && (
                <div className="message">
                  Loading products...
                </div>
              )}

              {!loading && error && (
                <div className="error">
                  {error}
                </div>
              )}

              {!loading &&
                !error &&
                filteredProducts.length === 0 && (
                  <div className="message">
                    No products found.
                  </div>
                )}

              {!loading &&
                !error &&
                filteredProducts.length > 0 && (
                  <div className="products-grid">

                    {filteredProducts.map(
                      (product) => (
                        <div
                          className="product-card"
                          key={product._id}
                          onClick={() =>
                            openProductDetails(
                              product
                            )
                          }
                        >

                          <div className="product-image">

                            <img
                              src={getImage(product)}
                              alt={product.name}
                            />

                          </div>

                          <div className="product-info">

                            <p className="category">
                              {product.category ||
                                "Product"}
                            </p>

                            <h3>
                              {product.name}
                            </h3>

                            <div className="rating">

                              {"⭐".repeat(
                                Math.max(
                                  0,
                                  Math.min(
                                    5,
                                    Math.round(
                                      Number(
                                        product.ratings ||
                                          0
                                      )
                                    )
                                  )
                                )
                              )}

                            </div>

                            <div className="price">

                              $
                              {Number(
                                product.price ||
                                  0
                              ).toFixed(2)}

                            </div>

                            <div className="stock">

                              {product.stock ||
                                0}{" "}
                              left

                            </div>

                            <button
                              className="view-details"
                              onClick={(event) => {
                                event.stopPropagation();

                                openProductDetails(
                                  product
                                );
                              }}
                            >
                              View Details
                            </button>

                          </div>

                        </div>
                      )
                    )}

                  </div>
                )}

            </main>

          </>
        )}

    </div>
  );
}

export default App;