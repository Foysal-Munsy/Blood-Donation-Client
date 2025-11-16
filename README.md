# 🩸 RedDrop - Blood Donation Platform

A modern, full-stack blood donation management platform connecting donors with those in need. Built with cutting-edge technologies and featuring a beautiful glassmorphism UI design.

**🌐 Live App:** [blood-donation-app-ff014.web.app](https://blood-donation-app-ff014.web.app/)  
**🔗 Backend API:** [Blood Donation Server](https://github.com/Foysal-Munsy/Blood-Donation-Server)

---

## 🔐 Admin Panel Access

- 👤 **Email:** foysal@m.com
- 🔑 **Password:** 123456

---

## ✨ Key Features

### 🏠 Public Features
- **Modern Hero Section** with real-time active donor count from database
- **Impact Statistics Dashboard** displaying live data:
  - Total registered donors
  - Active donors ready to donate
  - Total donation requests
  - Lives saved (calculated as completed donations × 3)
- **Donation Process Guide** - 4-step visual journey
- **Blood Helper AI Assistant** - Interactive Q&A about blood donation
- **Search Donors** by blood group, district, and upazila
- **View Blood Requests** with detailed information
- **Blog Section** for blood donation awareness
- **Responsive Design** - Optimized for all devices

### 👥 User Dashboard
- **Profile Management** with avatar and personal details
- **Role-based Access** (Admin, Donor, Volunteer)
- **Donation Request Creation** for donors
- **Request Status Tracking** (pending, inprogress, done, canceled)

### 🛡️ Admin Dashboard
- **User Management** - View, block/unblock, change roles (admin/donor/volunteer)
- **All Donation Requests** - Approve, delete, or change status
- **Content Management** - Publish/unpublish/delete blogs
- **Blog Creation** with rich content and thumbnails
- **Comprehensive Statistics** overview

### 🎨 Design Features
- **Glassmorphism UI** - Modern frosted glass effects
- **Gradient Text & Buttons** - Rose to red color scheme
- **Smooth Animations** - Hover effects and transitions
- **Consistent Typography** - Inter font family throughout
- **Accessible Color Palette** - High contrast for readability

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS v4** - Utility-first styling with @theme
- **React Router v7** - Client-side routing
- **Firebase Authentication** - Secure user authentication

### Backend & Database
- **Node.js & Express** - RESTful API server
- **MongoDB** - NoSQL database
- **JWT** - Token-based authentication

### Additional Libraries
- **Axios** - HTTP client
- **React Helmet Async** - Dynamic page titles
- **Lottie React** - Smooth animations
- **SweetAlert2** - Beautiful alerts
- **React Icons** - Comprehensive icon library

---

## 📸 Screenshots

### Hero Section 
![Hero Section](https://github.com/Foysal-Munsy/readme-assets/blob/main/blood-donation-client/hero.png)

### Impact Statistics 
![Impact Statistics](https://github.com/Foysal-Munsy/readme-assets/blob/main/blood-donation-client/impact.png)

### Donation Process Guide
![Donation Process](https://github.com/Foysal-Munsy/readme-assets/blob/main/blood-donation-client/donation-process.png)

### Blood Helper AI Assistant
![Blood Helper](https://github.com/Foysal-Munsy/readme-assets/blob/main/blood-donation-client/blood-helper.png)

### Search Donors
![Search Donors](https://github.com/Foysal-Munsy/readme-assets/blob/main/blood-donation-client/search-donors.png)

### Blood Donation Requests
![Donation Requests](https://github.com/Foysal-Munsy/readme-assets/blob/main/blood-donation-client/donation-request.png)

### Donor Dashboard
![Donor Dashboard](https://github.com/Foysal-Munsy/readme-assets/blob/main/blood-donation-client/user-dashboard.png)

### Create Donation Request
![Create Request](https://github.com/Foysal-Munsy/readme-assets/blob/main/blood-donation-client/create-request.png)

### My Donation Requests
![My Requests](https://github.com/Foysal-Munsy/readme-assets/blob/main/blood-donation-client/my-request.png)

### Admin Dashboard
![Admin Dashboard](https://github.com/Foysal-Munsy/readme-assets/blob/main/blood-donation-client/admin-dashboard.png)

### User Management
![User Management](https://github.com/Foysal-Munsy/readme-assets/blob/main/blood-donation-client/user-management.png)

### All Donation Requests (Admin)
![Admin Requests](https://github.com/Foysal-Munsy/readme-assets/blob/main/blood-donation-client/all-donation-request-admin.png)

### Content Management
![Content Management](https://github.com/Foysal-Munsy/readme-assets/blob/main/blood-donation-client/content-management.png)

### Blog Page
![Blog](https://github.com/Foysal-Munsy/readme-assets/blob/main/blood-donation-client/blog-page.png)

### Blog Details
![Blog Details](https://github.com/Foysal-Munsy/readme-assets/blob/main/blood-donation-client/blog-details.png)

### Add Blog (Admin)
![Add Blog](https://github.com/Foysal-Munsy/readme-assets/blob/main/blood-donation-client/add-blog.png)

### Footer
![Footer](https://github.com/Foysal-Munsy/readme-assets/blob/main/blood-donation-client/footer.png)

---

## 📁 Project Structure

```
src/
├── assets/          # Lottie animations and images
├── components/      # Reusable UI components
│   ├── Banner.jsx
│   ├── DonationProcess.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── ImpactStatistics.jsx
│   └── ...
├── hooks/           # Custom React hooks
│   ├── axiosPublic.js
│   ├── useAxiosSecure.js
│   ├── useCurrentUser.js
│   └── useRole.jsx
├── layouts/         # Layout components
│   ├── DashboardLayout.jsx
│   └── RootLayout.jsx
├── pages/           # Page components
│   ├── adminDashboard/
│   ├── donorDashboard/
│   ├── dashboard/
│   ├── BloodHelper.jsx
│   ├── Home.jsx
│   └── ...
├── providers/       # Context providers
│   └── AuthProvider.jsx
├── Routers/         # Route configuration
│   ├── mainRoutes.jsx
│   └── PrivateRoute.jsx
└── index.css        # Global styles
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- MongoDB database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Foysal-Munsy/Blood-Donation-Client.git
   cd Blood-Donation-Client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_apiKey=your_firebase_api_key
   VITE_authDomain=your_firebase_auth_domain
   VITE_projectId=your_firebase_project_id
   VITE_storageBucket=your_firebase_storage_bucket
   VITE_messagingSenderId=your_firebase_messaging_sender_id
   VITE_appId=your_firebase_app_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

---

## 🎯 User Roles & Permissions

### 👤 Donor
- Create donation requests
- View their own donation requests
- Update/delete pending requests
- View profile and update information

### 🌟 Volunteer
- Same as donor
- View all donation requests
- Manage content (future feature)

### 👑 Admin
- All volunteer permissions
- Manage users (block/unblock, change roles)
- Approve/delete any donation request
- Change donation request status
- Publish/unpublish/delete blogs
- Full platform control

---

## 📊 Database Collections

### Users
- `name`, `email`, `image`
- `role` (donor, volunteer, admin)
- `status` (active, blocked)
- `bloodGroup`, `district`, `upazila`

### Donation Requests
- `requesterName`, `requesterEmail`
- `recipientName`, `recipientDistrict`, `recipientUpazila`
- `hospitalName`, `fullAddress`
- `donationDate`, `donationTime`
- `bloodGroup`
- `donationStatus` (pending, inprogress, done, canceled)
- `requestMessage`

### Blogs
- `title`, `content`, `thumbnail`
- `author`, `authorEmail`
- `status` (draft, published)
- `createdAt`, `updatedAt`

---

## 🎨 Color Scheme

- **Primary:** Rose 600 (#E11D48) to Red 600 (#DC2626)
- **Background:** Rose 50 to Red 50 gradients
- **Text:** Gray 600-900
- **Accents:** Blue, Green, Orange for statistics
- **Glass Effect:** White with 70% opacity + backdrop blur

---

## 📞 Contact

**Developer:** Foysal Munsy  
**Email:** munsy.foysal613@gmail.com  
**Phone:** +8801731681426  
**Location:** Dhaka, Bangladesh

---

## 📝 License

This project is open source and available for educational purposes.

---

## 🙏 Acknowledgments

- Blood donors who save lives every day
- Open source community for amazing tools
- Firebase for reliable hosting and authentication
- Tailwind CSS for the utility-first approach

---

**Made with ❤️ for humanity | Every drop counts, every donor matters**
