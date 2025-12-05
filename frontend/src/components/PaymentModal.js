import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import './PaymentModal.css';

function PaymentModal({ isOpen, onClose, orderId, amount, upiId, upiUrl, bookTitle, onPaymentComplete }) {
  const { isDark } = useTheme();
  const [step, setStep] = useState(1); // 1: payment, 2: verification

  if (!isOpen) return null;

  const handleOpenUPI = () => {
    window.open(upiUrl, '_blank');
    setStep(2);
  };

  const handlePaymentComplete = () => {
    onPaymentComplete();
    onClose();
  };

  const handleCancel = () => {
    setStep(1);
    onClose();
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className={`payment-modal ${isDark ? 'dark' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="payment-modal-header">
          <h2>💳 Payment</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {step === 1 && (
          <div className="payment-content">
            <div className="payment-info">
              <div className="info-row">
                <span>Book:</span>
                <strong>{bookTitle}</strong>
              </div>
              <div className="info-row">
                <span>Order ID:</span>
                <strong>#{orderId}</strong>
              </div>
              <div className="info-row">
                <span>Amount:</span>
                <strong className="amount">₹{amount}</strong>
              </div>
              <div className="info-row">
                <span>UPI ID:</span>
                <strong className="upi-id">{upiId}</strong>
              </div>
            </div>

            <div className="payment-actions">
              <button className="btn-primary" onClick={handleOpenUPI}>
                Open UPI Payment
              </button>
              <button className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="payment-content">
            <div className="verification-step">
              <div className="verification-icon">⏳</div>
              <h3>Complete Payment</h3>
              <p>Please complete the payment in your UPI app.</p>
              <div className="payment-info">
                <div className="info-row">
                  <span>Amount:</span>
                  <strong className="amount">₹{amount}</strong>
                </div>
                <div className="info-row">
                  <span>UPI ID:</span>
                  <strong>{upiId}</strong>
                </div>
              </div>
              <div className="payment-actions">
                <button className="btn-success" onClick={handlePaymentComplete}>
                  ✓ Payment Completed
                </button>
                <button className="btn-secondary" onClick={handleCancel}>
                  Cancel Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;

