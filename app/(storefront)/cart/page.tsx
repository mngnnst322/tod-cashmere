"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/cart-provider";
import { formatPrice, isUploadedImage } from "@/lib/format";
import { createOrder } from "@/lib/actions";
import { useLang } from "@/components/lang-provider";
import { fmt } from "@/lib/i18n";

export default function CartPage() {
  const { items, total, decrementItem, addItem, removeItem, clear } = useCart();
  const { dict } = useLang();
  const [paymentMethod, setPaymentMethod] = useState("qpay");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setSubmitting(true);
    setStatus("");
    const result = await createOrder({
      customerName: String(form.get("customerName") || ""),
      phone: String(form.get("phone") || ""),
      address: String(form.get("address") || ""),
      paymentMethod,
      items,
    });
    setSubmitting(false);
    if (result.ok) {
      setOrderId(result.orderId);
      clear();
      setStatus(dict.orderSuccess);
    } else {
      setStatus(dict.cartEmpty);
    }
  };

  if (orderId) {
    return (
      <section className="section">
        <div className="section-header">
          <div>
            <div className="section-title">{dict.orderConfirmed}</div>
            <div className="section-subtitle">
              {fmt(dict.orderNumber, { id: orderId })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <div className="section-title">{dict.cart}</div>
          <div className="section-subtitle">
            {fmt(dict.cartCount, { count: items.length })}
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="container">
          <p className="muted">{dict.cartEmpty}</p>
        </div>
      ) : (
        <div className="container checkout-grid">
          <div className="card">
            {items.map((line) => (
              <div
                key={line.id}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 72,
                    height: 96,
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={line.image}
                    unoptimized={isUploadedImage(line.image)}
                    alt={line.title}
                    fill
                    sizes="72px"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="product-title">{line.title}</div>
                  <div className="product-price-current">
                    {formatPrice(line.price)}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button type="button" onClick={() => decrementItem(line.id)}>
                    −
                  </button>
                  <span>{line.qty}</span>
                  <button
                    type="button"
                    onClick={() =>
                      addItem({
                        id: line.id,
                        title: line.title,
                        price: line.price,
                        image: line.image,
                      })
                    }
                  >
                    +
                  </button>
                  <button type="button" onClick={() => removeItem(line.id)}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <div className="summary" style={{ marginTop: 16 }}>
              <div className="summary-row">
                <strong>{dict.total}</strong>
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>
          </div>

          <form
            className="card checkout-card"
            id="checkout-form"
            onSubmit={handleSubmit}
          >
            <div className="card-title">{dict.shippingInfo}</div>
            <div className="form-grid">
              <input name="customerName" placeholder={dict.fullName} required />
              <input name="phone" placeholder={dict.phone} required />
            </div>
            <input
              name="address"
              placeholder={dict.address}
              required
              style={{ marginTop: 12 }}
            />

            <div className="card-title" style={{ marginTop: 16 }}>
              {dict.paymentMethod}
            </div>
            <div className="pill-row">
              <label className="pill">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="qpay"
                  checked={paymentMethod === "qpay"}
                  onChange={() => setPaymentMethod("qpay")}
                />{" "}
                QPay
              </label>
              <label className="pill">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={() => setPaymentMethod("stripe")}
                />{" "}
                {dict.card}
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ marginTop: 16 }}
            >
              {submitting ? dict.processingPayment : dict.placeOrder}
            </button>
            <p id="payment-status">{status}</p>
          </form>
        </div>
      )}
    </section>
  );
}
