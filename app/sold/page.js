"use client";

import { useState, useEffect } from "react";
import supabase from "../utils/supabase";
import styles from "../sold/page.module.css"; // Import styles
import Header from "../component/Header/page";

const SoldProducts = () => {
  const [soldProducts, setSoldProducts] = useState([]);

  useEffect(() => {
    fetchSoldProducts();
  }, []);

  const fetchSoldProducts = async () => {
    let { data: soldProducts, error } = await supabase
      .from("products_sold")
      .select("*");
    if (error) console.log("Error fetching sold products", error);
    else setSoldProducts(soldProducts);
  };

  const handleDeleteLatestProduct = async () => {
    // Sort products by timestamp descending
    const sortedProducts = [...soldProducts].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    // Get the latest product
    const latestProduct = sortedProducts[0];

    if (!latestProduct) return;

    const { error } = await supabase
      .from("products_sold")
      .delete()
      .eq("id", latestProduct.id);

    if (error) {
      console.log("Error deleting product:", error);
    } else {
      fetchSoldProducts();
    }
  };

  const handleDeleteAllSoldProducts = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete ALL sold products?"
    );
    if (!confirm) return;

    const { error } = await supabase
      .from("products_sold")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      console.log("Error deleting all products:", error);
    } else {
      setSoldProducts([]);
    }
  };

  const totalQuantity = soldProducts.reduce((sum, p) => sum + p.quantity, 0);
  const totalPrice = soldProducts.reduce(
    (sum, p) => sum + (p.total_price || p.unit_price * p.quantity),
    0
  );

  return (
    <div className={styles.coniner}>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.heading}>Sold Products</h1>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Quantity</th>
              <th className={styles.th}>Unit Price</th>
              <th className={styles.th}>Total Price</th>
              <th className={styles.th}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {soldProducts.map((product) => (
              <tr key={product.id} className={styles.tr}>
                <td className={styles.td}>{product.name}</td>
                <td className={styles.td}>{product.quantity}</td>
                <td className={styles.td}>₦{product.unit_price}</td>
                <td className={styles.td}>₦{product.total_price}</td>
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
    </div>
  );
};

export default SoldProducts;
