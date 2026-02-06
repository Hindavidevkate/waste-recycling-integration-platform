# ♻️ Waste Recycling Integration Platform

# Auther : Hindavi Devkate ,Akshata Autade, Sanskruti Isave
A full-stack platform connecting users, waste collectors, and recycling centers.

## Tech Stack
- React.js
- Node.js
- Express
- MongoDB
- BootStrap
## Features
- Waste pickup requests
- Collector management
- Admin analytics
- Status tracking


# from here each and every step is mention to do start my project
mkdir Waste-Recycling-Integration-Platform
cd Waste-Recycling-Integration-Platform

# This is for create react app Frontend
npx create-react-app frontend
cd frontend
npm start
# install Frontend packages 
npm install axios react-router-dom
npm install chart.js react-chartjs-2

# Now start to design a folder structure 
frontend/src
pages
    pages/Login.js
    pages/Register.js
    pages/UserDashboard.js
    pages/CollectorDashboard.js
    pages/AdminDashboard.js
    components/Navbar.js
components
    components/Navbar.js
services
    services/api.js

# Now to start setup for backend 
cd ..
mkdir backend
cd backend
npm init -y
# install backend libraries
npm install express mongoose cors dotenv bcryptjs jsonwebtoken multer

# create server file
backend/server.js

