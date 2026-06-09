const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: ['https://royalblue-camel-149209.hostingersite.com', 'https://aqua-pigeon-679923.hostingersite.com', 'http://localhost:3000'],
  credentials: true,
}));
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/projects", require("./routes/projectsRoutes"));
app.use("/api/projects", require("./routes/homepageRoutes")); 
app.use("/api/pages",require("./routes/homepageRoutes"));
app.use("/api/about",require("./routes/aboutRoutes.js"));
app.use("/api/services-section",require("./routes/servicesRoutes.js"));
app.use("/api/contact-info",require("./routes/contactInfoRoutes.js"));
app.use("/api/enquiry",require("./routes/enquiryRoutes.js"));
app.use("/api/seo-submissions", require("./routes/seoSubmissionRoutes"));
app.use("/api/integrations", require("./routes/socialIntegrationRoutes"));
app.use("/api/telegram", require("./routes/telegramRoutes"));
app.use("/api/messaging", require("./routes/socialMessagingRoutes"));
app.use("/api/logs", require("./routes/activityLogRoutes"));
app.use("/api/slides", require("./routes/slideRoutes"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));