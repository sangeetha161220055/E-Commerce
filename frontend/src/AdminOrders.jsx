import { useEffect, useState } from 'react'

const ORDERS_API_URL =
  'http://localhost:8000/api/v1/orders'

const UPDATE_API_URL =
  'http://localhost:8000/api/v1/orders/order'

function AdminOrders() {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  // Get all orders
  const fetchOrders = async () => {

    try {

      setLoading(true)

      const response = await fetch(
        ORDERS_API_URL
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to get orders'
        )
      }

      setOrders(data.orders || [])

    } catch (error) {

      console.error(error)

      alert(
        'Unable to load orders'
      )

    } finally {

      setLoading(false)

    }
  }


  // Update order status
  const updateStatus = async (
    orderId,
    status
  ) => {

    try {

      setUpdating(true)

      const response = await fetch(
        `${UPDATE_API_URL}/${orderId}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            status
          })
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          'Unable to update status'
        )
      }

      // Update UI
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: status
              }
            : order
        )
      )

      alert(
        'Order status updated successfully!'
      )

    } catch (error) {

      console.error(error)

      alert(
        `Update failed: ${error.message}`
      )

    } finally {

      setUpdating(false)

    }
  }


  useEffect(() => {
    fetchOrders()
  }, [])


  if (loading) {

    return (
      <section className="admin-orders">

        <h2>
          Admin Orders
        </h2>

        <p>
          Loading orders...
        </p>

      </section>
    )
  }


  return (

    <section className="admin-orders">

      <h2>
        Admin Orders
      </h2>

      {orders.length === 0 ? (

        <p>
          No orders found.
        </p>

      ) : (

        <div className="admin-orders-list">

          {orders.map((order) => (

            <div
              className="admin-order-card"
              key={order._id}
            >

              <h3>
                Order ID
              </h3>

              <p>
                {order._id}
              </p>


              <p>
                <strong>
                  Total:
                </strong>{' '}

                Rs.{' '}

                {Number(
                  order.amount || 0
                ).toLocaleString(
                  'en-IN'
                )}

              </p>


              <p>
                <strong>
                  Date:
                </strong>{' '}

                {new Date(
                  order.createdAt
                ).toLocaleString(
                  'en-IN'
                )}

              </p>


              <p>
                <strong>
                  Current Status:
                </strong>{' '}

                {order.status}

              </p>


              <label>
                Update Status:
              </label>


              <select
                value={order.status}
                disabled={updating}
                onChange={(e) =>
                  updateStatus(
                    order._id,
                    e.target.value
                  )
                }
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


              <h4>
                Products
              </h4>


              {order.cartItems &&
                order.cartItems.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="admin-order-product"
                    >

                      <span>
                        {item.product?.name ||
                          'Product'}
                      </span>

                      <span>
                        Qty: {item.qty}
                      </span>

                      <span>
                        Rs.{' '}

                        {Number(
                          item.product?.price ||
                            0
                        ).toLocaleString(
                          'en-IN'
                        )}

                      </span>

                    </div>

                  )
                )}

            </div>

          ))}

        </div>

      )}

    </section>
  )
}

export default AdminOrders