const GST_RATE = 18; // 18% GST slab

function calculateGST(amount, stateCode) {
  const gstAmount = (amount * GST_RATE) / 100;

  let IGST = 0,
    CGST = 0,
    SGST = 0;

  if (stateCode === "INTRA") {
    // Intra-state transaction
    CGST = gstAmount / 2;
    SGST = gstAmount / 2;
  } else {
    // Inter-state transaction
    IGST = gstAmount;
  }

  return {
    totalAmount: amount,
    gstAmount,
    IGST,
    CGST,
    SGST,
    grandTotal: amount + gstAmount,
  };
}

module.exports = { calculateGST };
