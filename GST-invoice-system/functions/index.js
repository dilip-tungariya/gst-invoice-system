const functions = require("firebase-functions");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
const gstCalculator = require("./gstCalculator");
const gstApiService = require("./gstApiService");

dotenv.config();
admin.initializeApp();

const db = admin.firestore();

exports.generateGSTInvoice = functions.firestore
  .document("bookings/{bookingId}")
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    // Trigger function only when status changes to "finished"
    if (beforeData.status !== "finished" && afterData.status === "finished") {
      try {
        const { name, totalAmount, stateCode } = afterData;

        if (!name || !totalAmount || !stateCode) {
          console.error("Missing required fields in the document.");
          return null;
        }

        // Calculate GST breakdown
        const gstDetails = gstCalculator.calculateGST(totalAmount, stateCode);

        // Store invoice in Firestore
        const invoiceData = {
          bookingId: context.params.bookingId,
          name,
          totalAmount,
          gstDetails,
          generatedAt: admin.firestore.Timestamp.now(),
        };

        await db
          .collection("invoices")
          .doc(context.params.bookingId)
          .set(invoiceData);

        // Send data to GST API for filing
        const response = await gstApiService.fileGST(invoiceData);
        console.log("GST Filing Response:", response);

        return response;
      } catch (error) {
        console.error("Error processing GST Invoice:", error);
        return null;
      }
    }

    return null;
  });
