"use client";

import { useState, useEffect } from "react";
import supabase from "../utils/supabase";
import styles from "../product/page.module.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: 0,
    unit_price: 0,
    admin_name: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    let { data: products, error } = await supabase.from("products").select("*");
    if (error) console.log("Error fetching products", error);
    else setProducts(products);
  };

  const handleDeleteLatestProduct = async () => {
    // Sort products by timestamp descending
    const sortedProducts = [...products].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    // Get the latest product
    const latestProduct = sortedProducts[0];

    if (!latestProduct) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", latestProduct.id);

    if (error) {
      console.log("Error deleting product:", error);
    } else {
      fetchProducts();
    }
  };

  const handleAddProduct = async () => {
    const timestamp = new Date();

    const { data, error } = await supabase.from("products").insert([
      {
        name: newProduct.name,
        quantity: newProduct.quantity,
        unit_price: newProduct.unit_price,
        admin_name: newProduct.admin_name,
        timestamp,
      },
    ]);

    if (error) {
      console.log("Error adding product", error);
    } else {
      fetchProducts(); // Refresh the product list
      setNewProduct({ name: "", quantity: 0, unit_price: 0, admin_name: "" }); // Reset form
    }
  };
  const handleSoldProduct = async (product) => {
    const { id, name, quantity, unit_price, admin_name, total_price } = product; // Remove total_price if it's auto-generated
    const timestamp = new Date().toISOString(); // Format timestamp correctly

    const { data, error } = await supabase.from("products_sold").insert([
      {
        product_id: id,
        name,
        quantity,
        unit_price,
        admin_name,
        timestamp,
        total_price,
      },
    ]); // No total_price

    if (error) {
      console.log("Error adding sold product:", error);
      return;
    }

    // Remove the product from products table after successfully adding to sold_products
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  const totalQuantity = products.reduce(
    (sum, product) => sum + product.quantity,
    0
  );
  const totalPrice = products.reduce(
    (sum, product) =>
      sum + (product.total_price || product.unit_price * product.quantity),
    0
  );

  const handleDeleteAllSoldProducts = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete ALL products?"
    );
    if (!confirm) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      console.log("Error deleting all products:", error);
    } else {
      setProducts([]);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Product Registrations</h1>

      <div className={styles.form}>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className={styles.input}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newProduct.quantity}
          onChange={(e) =>
            setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })
          }
          className={styles.input}
        />
        <input
          type="number"
          placeholder="Unit Price"
          value={newProduct.unit_price}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              unit_price: parseFloat(e.target.value),
            })
          }
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Admin Name"
          value={newProduct.admin_name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, admin_name: e.target.value })
          }
          className={styles.input}
        />
        <button onClick={handleAddProduct} className={styles.button}>
          Add Product
        </button>
      </div>

      <h2 className={styles.heading}>Product List</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Quantity</th>
            <th className={styles.th}>Unit Price</th>
            <th className={styles.th}>Total Price</th>
            <th className={styles.th}>Admin</th>
            <th className={styles.th}>Timestamp</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className={styles.tr}>
              <td className={styles.td}>{product.name}</td>
              <td className={styles.td}>{product.quantity}</td>
              <td className={styles.td}>₦{product.unit_price}</td>
              <td className={styles.td}>₦{product.total_price}</td>
              <td className={styles.td}>{product.admin_name}</td>
              <td className={styles.td}>
                {new Date(product.timestamp).toLocaleString()}
              </td>
              <td className={styles.td}>
                <button
                  onClick={() => handleSoldProduct(product)}
                  className={styles.soldButton}
                >
                  Mark as Sold
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <tfoot>
        <tr>
          <td className={styles.td}>
            <strong>Total</strong>
          </td>
          <td className={styles.td}>
            <strong>{totalQuantity}</strong>
          </td>
          <td className={styles.td}>
            <strong>₦{totalPrice.toLocaleString()}</strong>
          </td>
        </tr>
      </tfoot>

      <button onClick={handleDeleteLatestProduct} className={styles.button}>
        Delete Latest Product
      </button>
      <button
        onClick={handleDeleteAllSoldProducts}
        className={styles.button}
        style={{ backgroundColor: "red", marginLeft: "10px" }}
      >
        Delete All Products
      </button>
    </div>
  );
};

export default Products;
