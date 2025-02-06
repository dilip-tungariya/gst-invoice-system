# Automated GST Invoicing System Development using Firebase Firestore and Cloud Functions

## Description

This project demonstrate the automated gst invoicing system using firebase firestore and cloud functions.
The project will trigger automated function generateGSTInvoice in index.js file of functions/GST-invoice-system whenever there is change in status from any status to "finished" bookings document in firebase firestore.

## Features

- **Express.js**: Handles HTTP requests and routing for gst api.
- **Firebase**: Serves as the database for storing and retrieving data.
- **Dotenv**: Manages environment variables securely.
- **Automated GST Invoice Generation**
- **Integration with GST API**
- **Firestore PubSub Triggers for Invoice Updates**
- **Cloud Functions for Serverless Execution**
- **Secure Storage using Firebase Firestore**
- **Modular Code Structure for Easy Maintenance**

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- A Firebase account with a configured project
- Firebase CLI
- A valid GST API Key

## Installation

1. **Clone the repository**:

    git clone https://github.com/dilip-tungariya/gst-invoice-system.git

    cd gst-invoice-system

2. **Install dependencies**:
    There are different dependencies for different folders:

    a. For GST folder:
        cd GST
        npm install

    b. For GST-invoice-system folder:
        cd GST-invoice-system
        npm install

3. **Configure environment variables**:
    
    In the project there is two different environment files

    a. For GST folder which is dummy api for GST system:

        Create a .env file in the GST directory

        GST_PUBLIC_KEY=your_gst_api_key

        SECRET_KEY=your_gst_secret_key

        API_KEY=your_gst_api_key

        API_SECRET=your_gst_secret
    
    b. For GST-invoice-system:

        Create a .env file in the GST-invoice-system directory

        GST_API_URL=your_dummy_gst_api_url

        GST_PUBLIC_KEY=your_gst_api_key

        SECRET_KEY=your_gst_secret_key

        API_KEY=your_gst_api_key

        API_SECRET=your_gst_secret

    Note: Replace the placeholders with actual GST credentials details

4. **Start the application**:

    1. cd GST

        npm start

        Note: The server will run on http://localhost:3001

5. **Setup Firebase**:

    firebase login

    firebase init

6. **Deploy Cloud Functions**:

    firebase deploy --only functions

## Project Structure

    GST Application/
    │── GST/
    │   │── bin/
    │   │── node_modules/
    │   │── .env
    │   │── app.js
    │   │── package-lock.json
    │   │── package.json
    │
    │── GST-Invoice-System/
    │   │── .github/
    │   │── functions/
    │   │   │── node_modules/
    │   │   │── .eslintrc.js
    │   │   │── .gitignore
    │   │   │── gstApiService.js
    │   │   │── gstCalculator.js
    │   │   │── index.js
    │   │   │── package-lock.json
    │   │   │── package.json
    │   │── node_modules/
    │   │── public/
    │   │── .env
    │   │── .firebaserc
    │   │── .gitignore
    │   │── firebase.json
    │   │── firestore.indexes.json
    │   │── firestore.rules
    │   │── package-lock.json
    │   │── package.json
    │   │── README.md
