# MiniMart Project Summary

Here is a comprehensive summary of the MiniMart project, categorized by commands, keywords, functions, and a breakdown of each file. 

## 1. Commands
These are the common CLI (Command Line Interface) commands typically used to interact with, install, and run the MERN stack application.

### Client (Frontend - React + Vite)
- `npm install` - Installs the necessary dependencies listed in `client/package.json`.
- `npm run dev` - Starts the Vite development server for the frontend.
- `npm run build` - Builds the application for production into the `dist` folder.
- `npm run preview` - Locally previews the production build.

### Server (Backend - Node.js + Express)
- `npm install` - Installs the backend dependencies listed in `server/package.json`.
- `node server.js` - Starts the Node.js backend server.
- `npm run dev` - Often configured with Nodemon to start the server and automatically restart on file changes.

---

## 2. Keywords
The project is built using JavaScript (and JSX), making heavy use of modern ES6+ keywords and syntax.

- **Variables & Scoping**: `const`, `let` (Used to declare block-scoped variables, avoiding `var`).
- **Module System**: 
  - *Frontend (ES Modules)*: `import`, `export`, `export default`.
  - *Backend (CommonJS)*: `require`, `module.exports`.
- **Asynchronous Programming**: `async`, `await`, `Promise` (Used extensively in controllers and API calls for non-blocking operations).
- **Control Flow**: `if`, `else`, `switch`, `case`, `return`, `try`, `catch` (Crucial for error handling in asynchronous routes).
- **React-specific (JSX)**: JSX allows mixing HTML-like syntax with JavaScript. Keywords like `className` are used instead of HTML's `class`.

---

## 3. Functions
Functions represent the core logic of the application. Here are the prominent types of functions found across the project.

### Backend Functions (Controllers & Config)
- **`connectDB()`** *(config/db.js)*: Asynchronous function that establishes a connection to MongoDB using Mongoose.
- **`seedProducts()`** *(server.js)*: An initialization function that populates the database with default products if none exist.
- **Controller Functions**: Functions like `getProducts()`, `registerUser()`, `loginUser()`, `addToCart()` which handle the business logic for specific API endpoints.
- **Middleware Functions**: Functions like `auth` *(middleware/auth.js)* that intercept requests (e.g., to verify JWT tokens) before they reach the controller.

### Frontend Functions (React Components & Hooks)
- **Component Functions**: Functional components like `App()`, `Home()`, `Navbar()`, `ProductCard()`, which return JSX to render UI.
- **Event Handlers**: Functions typically named `handleLogin()`, `handleSubmit()`, or `handleAddToCart()` that execute when a user interacts with the UI.
- **React Hooks**: Built-in functions like `useState()` (manages component state) and `useEffect()` (handles side-effects like fetching data when a component mounts).
- **Service/API Functions**: Functions defined in `services/api.js` to make HTTP requests to the backend (e.g., `fetchProducts()`, `login()`).

---

## 4. Each File in the MiniMart Folder

The project is divided into a `client` (frontend) and `server` (backend).

### Server (Backend)
- **`server.js`**: The main entry point. It configures the Express app, connects to the database, applies middleware (CORS, JSON parsing), mounts the routes, and starts the server.
- **`config/db.js`**: Contains the logic to connect to the MongoDB database using Mongoose.
- **`models/Product.js`**: Defines the Mongoose schema and model for a Product (name, price, category, etc.).
- **`models/User.js`**: Defines the Mongoose schema and model for a User, often including password hashing logic.
- **`models/Cart.js`**: Defines the Mongoose schema for a User's shopping cart.
- **`controllers/productController.js`**: Contains the logic for fetching, creating, updating, and deleting products.
- **`controllers/userController.js`**: Contains logic for user authentication (registration, login) and profile retrieval.
- **`controllers/cartController.js`**: Contains logic for managing a user's cart.
- **`routes/productRoutes.js`**: Maps HTTP methods and product URLs (e.g., `GET /api/products`) to the respective product controller functions.
- **`routes/userRoutes.js`**: Maps user-related URLs to user controller functions.
- **`routes/cartRoutes.js`**: Maps cart-related URLs to cart controller functions.
- **`middleware/auth.js`**: Middleware to verify user authentication (usually via JWT) before allowing access to protected routes.
- **`.env`**: Stores sensitive environment variables (like Database URI and JWT secrets).

### Client (Frontend)
- **`src/main.jsx`**: The entry point for the React application. It hooks React into the root HTML element (`index.html`).
- **`src/App.jsx`**: The root component. It typically sets up React Router for navigation and defines the main application layout.
- **`src/pages/Home.jsx`**: The landing page component, usually displaying a list of products.
- **`src/pages/Login.jsx` & `src/pages/Register.jsx`**: Pages containing forms for user authentication.
- **`src/pages/Cart.jsx`**: Displays the items a user has added to their shopping cart.
- **`src/pages/AdminDashboard.jsx`**: A protected page for administrators to manage products or view overall store stats.
- **`src/components/Navbar.jsx`**: The top navigation bar, linking to different pages.
- **`src/components/Footer.jsx`**: The footer component shown at the bottom of the app.
- **`src/components/ProductCard.jsx`**: A reusable UI component to display a single product's image, title, and price.
- **`src/components/ProductForm.jsx`**: A form component used to add or edit product details (likely used in the Admin Dashboard).
- **`src/services/api.js`**: A centralized file for making Axios or Fetch API calls to the backend server.
- **`src/index.css` & `src/App.css`**: CSS files for global and component-level styling.
- **`index.html`**: The main HTML file that serves the React application.
- **`vite.config.js`**: Configuration file for the Vite build tool.
