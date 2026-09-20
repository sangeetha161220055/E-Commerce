
import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:8000/api/v1/products'

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    ratings: '',
    category: '',
    seller: '',
    stock: '',
    numOfReviews: '',
    image: '',
  })

  const [editingId, setEditingId] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)

      const response = await fetch(API_URL)
      const data = await response.json()

      setProducts(data.products || [])
    } catch (error) {
      console.error(error)
      alert('Unable to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const resetForm = () => {
    setForm({
      name: '',
      price: '',
      description: '',
      ratings: '',
      category: '',
      seller: '',
      stock: '',
      numOfReviews: '',
      image: '',
    })

    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !form.name ||
      !form.price ||
      !form.description ||
      !form.category ||
      !form.seller ||
      !form.stock
    ) {
      alert('Please fill all required fields')
      return
    }

    const productData = {
      name: form.name,
      price: form.price,
      description: form.description,
      ratings: form.ratings || '0',
      category: form.category,
      seller: form.seller,
      stock: form.stock,
      numOfReviews: form.numOfReviews || '0',
      images: form.image
        ? [{ image: form.image }]
        : [],
    }

    try {
      let response

      if (editingId) {
        response = await fetch(
          `${API_URL}/${editingId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
          }
        )
      } else {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        })
      }

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Something went wrong'
        )
      }

      alert(
        editingId
          ? 'Product updated successfully'
          : 'Product added successfully'
      )

      resetForm()
      fetchProducts()
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  const editProduct = (product) => {
    setEditingId(product._id)

    setForm({
      name: product.name || '',
      price: product.price || '',
      description: product.description || '',
      ratings: product.ratings || '',
      category: product.category || '',
      seller: product.seller || '',
      stock: product.stock || '',
      numOfReviews: product.numOfReviews || '',
      image:
        product.images &&
        product.images.length > 0
          ? product.images[0].image || ''
          : '',
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this product?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: 'DELETE',
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to delete product'
        )
      }

      alert('Product deleted successfully')

      fetchProducts()
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  return (
    <div className="admin-products">

      <h1>Admin Products</h1>

      <form
        className="admin-product-form"
        onSubmit={handleSubmit}
      >

        <h2>
          {editingId
            ? 'Edit Product'
            : 'Add New Product'}
        </h2>

        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="ratings"
          placeholder="Rating"
          value={form.ratings}
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />

        <input
          name="seller"
          placeholder="Seller"
          value={form.seller}
          onChange={handleChange}
        />

        <input
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
        />

        <input
          name="numOfReviews"
          placeholder="Number of Reviews"
          value={form.numOfReviews}
          onChange={handleChange}
        />

        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId
            ? 'Update Product'
            : 'Add Product'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
          >
            Cancel Edit
          </button>
        )}

      </form>

      <hr />

      <h2>All Products</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="admin-product-list">

          {products.map((product) => (

            <div
              className="admin-product-card"
              key={product._id}
            >

              {product.images &&
                product.images.length > 0 &&
                product.images[0].image && (
                  <img
                    src={product.images[0].image}
                    alt={product.name}
                  />
                )}

              <h3>{product.name}</h3>

              <p>
                Category: {product.category}
              </p>

              <p>
                Price: Rs.{' '}
                {Number(
                  product.price || 0
                ).toLocaleString('en-IN')}
              </p>

              <p>
                Stock: {product.stock}
              </p>

              <p>
                Seller: {product.seller}
              </p>

              <div>

                <button
                  onClick={() =>
                    editProduct(product)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteProduct(product._id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  )
}

export default AdminProducts

