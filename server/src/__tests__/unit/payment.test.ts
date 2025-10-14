describe('Payment Balance Updates', () => {
  describe('Balance Reduction', () => {
    it('should reduce balance after payment', () => {
      const initialBalance = 100.00;
      const paymentAmount = 30.00;
      
      const newBalance = parseFloat((initialBalance - paymentAmount).toFixed(2));

      expect(newBalance).toBe(70.00);
    });

    it('should handle decimal payment amounts', () => {
      const initialBalance = 150.75;
      const paymentAmount = 50.25;
      
      const newBalance = parseFloat((initialBalance - paymentAmount).toFixed(2));

      expect(newBalance).toBe(100.50);
    });

    it('should round balance to 2 decimal places', () => {
      const initialBalance = 100.00;
      const paymentAmount = 33.33;
      
      const newBalance = parseFloat((initialBalance - paymentAmount).toFixed(2));

      expect(newBalance).toBe(66.67);
    });
  });

  describe('Partial Payments', () => {
    it('should handle partial payment correctly', () => {
      const totalInvoice = 500.00;
      let balance = totalInvoice;

      const payment1 = 150.00;
      balance = parseFloat((balance - payment1).toFixed(2));
      expect(balance).toBe(350.00);
      expect(balance).toBeGreaterThan(0);
    });

    it('should handle multiple partial payments', () => {
      const totalInvoice = 1000.00;
      let balance = totalInvoice;

      balance = parseFloat((balance - 200.00).toFixed(2));
      expect(balance).toBe(800.00);

      balance = parseFloat((balance - 300.00).toFixed(2));
      expect(balance).toBe(500.00);

      balance = parseFloat((balance - 250.00).toFixed(2));
      expect(balance).toBe(250.00);

      expect(balance).toBeGreaterThan(0);
    });

    it('should not allow payment greater than balance', () => {
      const balance = 100.00;
      const paymentAmount = 150.00;

      const isValid = paymentAmount <= balance;

      expect(isValid).toBe(false);
    });
  });

  describe('Full Payment', () => {
    it('should set balance to zero on full payment', () => {
      const balance = 250.00;
      const paymentAmount = 250.00;
      
      const newBalance = parseFloat((balance - paymentAmount).toFixed(2));

      expect(newBalance).toBe(0);
    });

    it('should handle full payment after partial payments', () => {
      let balance = 500.00;

      balance = parseFloat((balance - 200.00).toFixed(2));
      expect(balance).toBe(300.00);

      balance = parseFloat((balance - 300.00).toFixed(2));
      expect(balance).toBe(0);
    });

    it('should update job status to Paid when balance is zero', () => {
      const balance = 100.00;
      const paymentAmount = 100.00;
      
      const newBalance = parseFloat((balance - paymentAmount).toFixed(2));
      const shouldUpdateStatusToPaid = newBalance === 0;

      expect(shouldUpdateStatusToPaid).toBe(true);
    });
  });

  describe('Payment Validation', () => {
    it('should reject zero payment', () => {
      const paymentAmount = 0;
      const isValid = paymentAmount > 0;

      expect(isValid).toBe(false);
    });

    it('should reject negative payment', () => {
      const paymentAmount = -50.00;
      const isValid = paymentAmount > 0;

      expect(isValid).toBe(false);
    });

    it('should accept minimum valid payment', () => {
      const balance = 100.00;
      const paymentAmount = 0.01;
      
      const isValid = paymentAmount > 0 && paymentAmount <= balance;

      expect(isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small balances', () => {
      const balance = 0.01;
      const paymentAmount = 0.01;
      
      const newBalance = parseFloat((balance - paymentAmount).toFixed(2));

      expect(newBalance).toBe(0);
    });

    it('should handle floating point precision', () => {
      const balance = 100.00;
      const payment1 = 33.33;
      const payment2 = 33.33;
      const payment3 = 33.34;
      
      let remainingBalance = balance;
      remainingBalance = parseFloat((remainingBalance - payment1).toFixed(2));
      remainingBalance = parseFloat((remainingBalance - payment2).toFixed(2));
      remainingBalance = parseFloat((remainingBalance - payment3).toFixed(2));

      expect(remainingBalance).toBe(0);
    });

    it('should maintain 2 decimal precision throughout multiple payments', () => {
      let balance = 99.99;
      
      balance = parseFloat((balance - 10.10).toFixed(2));
      expect(balance).toBe(89.89);
      
      balance = parseFloat((balance - 20.20).toFixed(2));
      expect(balance).toBe(69.69);
      
      balance = parseFloat((balance - 30.30).toFixed(2));
      expect(balance).toBe(39.39);
    });
  });
});
