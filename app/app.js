const express = require("express");
const app = express();
const path = require("path");
const logger = require("morgan");
const methodOverride = require("method-override");
const cors = require("cors");

app.use(cors());

// Declare app local variable
app.locals.title = "COFFEE API";

// Define app settings
app.set("version", "v1"); // Define app version
app.set("env", process.env.NODE_ENV || "development");
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs"); // Set EJS as the view template engine

// Default middlewares
app.use(methodOverride("X-HTTP-Method-Override")); // Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
app.use(express.static(path.join(__dirname, "/public"))); // Store static files inside ./public folder
app.use(logger("dev")); // Logs requests from the client set in development mode
app.use(express.urlencoded({ extended: false })); // Set all parsed data is nothing unusual.
app.use(express.json()); // Parse request body from client to JSON.

// Error handler
app.use((err, req, res, next) => {
  console.error("error: " + err.stack);
});

// Routes
const productRouter = require("./routes/product.route");
const categoryRouter = require("./routes/category.route");
const variantRouter = require("./routes/variant.route");
const homeRouter = require("./routes/home.route");

// Set prefix route to the different Routers
app.use(`/api/${app.get("version")}`, [
  productRouter,
  categoryRouter,
  variantRouter,
]); // Prefix route for product endpoints
app.use("/", homeRouter); // Prefix route for home routes

// Handle 404 Http errors
app.use((req, res, next) => {
  return res
    .status(404)
    .json({ message: "Resource not found", status: res.statusCode });
});

module.exports = app;
