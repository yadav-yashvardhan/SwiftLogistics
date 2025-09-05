📦 SwiftLogistics

A full-stack MERN logistics management platform designed to simplify and automate multi-point shipment workflows. SwiftLogistics enables users to seamlessly book, track, and manage shipments with multiple pickups, drops, and items — all in real-time.

🔗 Live Demo: SwiftLogistics on Render

💻 GitHub Repo: SwiftLogistics Repository

🚀 Features
👤 User Features

User Authentication → Secure signup/login with JWT-based sessions.

Create Shipments → Add multiple pickups, multiple drops, and multiple items in a single order.

Interactive Maps → Integrated Leaflet.js for real-time pickup & drop location selection.

Payment Gateway → Secure payments powered by Razorpay.

Order Tracking → Each order gets a unique tracking ID with live status updates (Pickup → Transit → Delivered).

Booking History → Users can view past and current shipments.

🚚 Driver/Agent Features

Driver Registration → Drivers can list themselves as available for deliveries.

Order Management → Drivers get assigned shipments, update order status (Pickup, Transit, Delivered).

🛠️ Tech Stack

Frontend: React.js, Leaflet.js, TailwindCSS

Backend: Node.js, Express.js

Database: MongoDB (Atlas)

Payments: Razorpay API

Deployment: Render (Full MERN Deployment)

📍 How It Works

User Signup/Login → Create an account.

Create Shipment → Add multiple pickups, drops & items.

Driver Assignment → Nearest available driver gets assigned.

Payment → User pays via Razorpay.

Live Tracking → Monitor shipment on map with unique order ID.

History → Access booking history anytime.

🎯 Why SwiftLogistics?

No need for multiple bookings — manage all shipments in one go.

Real-time tracking ensures transparency.

Secure and smooth payment integration.

Built with modern MERN stack for performance and scalability.

🖥️ Deployment

Frontend + Backend deployed on Render for production-ready hosting.

Uses environment variables for security (API keys, DB connection, Razorpay).

📸 Screenshots (Optional if you want to add later)

Dashboard

Shipment Creation Page

Live Tracking on Map

Razorpay Payment Screen

📌 Installation (For Local Development)
# Clone the repository
git clone https://github.com/yadav-yashvardhan/SwiftLogistics.git

# Navigate to project folder
cd SwiftLogistics

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Run backend
npm run server

# Run frontend
npm start

🙌 Acknowledgements

Leaflet.js
 – Maps & location services

Razorpay
 – Secure payments

MongoDB Atlas
 – Cloud database

✨ SwiftLogistics is not just a project but a step towards modernizing logistics automation. Built with passion and attention to detail by Yashvardhan Rao
.
