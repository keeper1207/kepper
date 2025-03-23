"use client";

import { useState, useEffect } from "react";
import supabase from "../utils/supabase";
import styles from "../expenses/page.module.css";
import Header from "../component/Header/page";

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
    let { data: products, error } = await supabase.from("productx").select("*");
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
      .from("productx")
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

    const { data, error } = await supabase.from("productx").insert([
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
      "Are you sure you want to delete ALL Expenses?"
    );
    if (!confirm) return;

    const { error } = await supabase
      .from("productx")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      console.log("Error deleting all Expenses:", error);
    } else {
      setProducts([]);
    }
  };

  return (
    <div className={styles.coner}>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.heading}>Store Expenses Registration</h1>

        <div className={styles.form}>
          <input
            type="text"
            placeholder="Title of expenses"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className={styles.input}
          />
          <input
            type="number"
            placeholder="Amount"
            value={newProduct.quantity}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                quantity: parseInt(e.target.value),
              })
            }
            className={styles.input}
          />
          <input
            type="number"
            placeholder="Quantity "
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
            Add Transaction
          </button>
        </div>

        <h2 className={styles.heading}>Store Expenditure List</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Title</th>
              <th className={styles.th}>Amount</th>
              <th className={styles.th}>quantity</th>
              <th className={styles.th}>Total Price</th>
              <th className={styles.th}>Admin</th>
              <th className={styles.th}>Timestamp</th>
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
          Delete Latest Expenditure
        </button>
        <button onClick={handleDeleteAllSoldProducts} className={styles.button}>
          Delete All Expenditure
        </button>
      </div>
    </div>
  );
};

export default Products;
