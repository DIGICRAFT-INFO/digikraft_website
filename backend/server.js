const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js"); // ✅ Fixed: db.js is in config/

dotenv.config();

const app = express();

// ✅ Connect MongoDB
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS — CMS (digikraftsocial.com) + CRM (crm.digikraftsocial.com or same domain /crm)
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // server-to-server
    const allowed = [
      'https://digikraftsocial.com',
      'https://www.digikraftsocial.com',
      'https://crm.digikraftsocial.com',
      'https://hrm.digikraftsocial.com',
      'https://emp.digikraftsocial.com',
      'http://localhost:3000',
      'http://localhost:3001',
      ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) : []),
    ];
    if (allowed.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// ======= CMS ROUTES (existing DigiKraft Social website admin) =======
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/projects", require("./routes/projectsRoutes"));
app.use("/api/pages", require("./routes/homepageRoutes"));
app.use("/api/about", require("./routes/aboutRoutes.js"));
app.use("/api/services-section", require("./routes/servicesRoutes.js"));
app.use("/api/contact-info", require("./routes/contactInfoRoutes.js"));
app.use("/api/enquiry", require("./routes/enquiryRoutes.js"));
app.use("/api/seo-submissions", require("./routes/seoSubmissionRoutes"));
app.use("/api/integrations", require("./routes/socialIntegrationRoutes"));
app.use("/api/telegram", require("./routes/telegramRoutes"));
app.use("/api/messaging", require("./routes/socialMessagingRoutes"));
app.use("/api/logs", require("./routes/activityLogRoutes"));
app.use("/api/slides", require("./routes/slideRoutes"));

// ======= CRM ROUTES (DigiKraft Social internal CRM — separate login) =======
app.use("/api/crm/auth",          require("./routes/crm/crmAuthRoutes"));
app.use("/api/crm/dashboard",     require("./routes/crm/crmDashboardRoutes"));
app.use("/api/crm/clients",       require("./routes/crm/crmClientRoutes"));
app.use("/api/crm/services",      require("./routes/crm/crmServiceRoutes"));
app.use("/api/crm/projects",      require("./routes/crm/crmProjectRoutes"));
app.use("/api/crm/proposals",     require("./routes/crm/crmProposalRoutes"));
app.use("/api/crm/quotations",    require("./routes/crm/crmQuotationRoutes"));
app.use("/api/crm/invoices",      require("./routes/crm/crmInvoiceRoutes"));
app.use("/api/crm/payments",      require("./routes/crm/crmPaymentRoutes"));
app.use("/api/crm/portfolio",     require("./routes/crm/crmPortfolioRoutes"));
app.use("/api/crm/enquiries",     require("./routes/crm/crmEnquiryRoutes"));
app.use("/api/crm/notifications", require("./routes/crm/crmNotificationRoutes"));
app.use("/api/crm/history",       require("./routes/crm/crmHistoryRoutes"));
app.use("/api/crm/settings",      require("./routes/crm/crmSettingsRoutes"));

// ======= HRM ROUTES (Human Resource Management — separate login) =======
app.use("/api/hrm/auth",          require("./routes/hrm/hrmAuthRoutes"));
app.use("/api/hrm/employees",     require("./routes/hrm/hrmEmployeeRoutes"));
app.use("/api/hrm/org",           require("./routes/hrm/hrmDeptRoutes"));
app.use("/api/hrm/attendance",    require("./routes/hrm/hrmAttendanceRoutes"));
app.use("/api/hrm/leaves",        require("./routes/hrm/hrmLeaveRoutes"));
app.use("/api/hrm/payroll",       require("./routes/hrm/hrmPayrollRoutes"));
app.use("/api/hrm/holidays",      require("./routes/hrm/hrmHolidayRoutes"));
app.use("/api/hrm/announcements", require("./routes/hrm/hrmAnnouncementRoutes"));
app.use("/api/hrm/reports",       require("./routes/hrm/hrmReportRoutes"));
app.use("/api/hrm/tasks",         require("./routes/hrm/hrmTaskRoutes"));
app.use("/api/hrm",               require("./routes/hrm/hrmMiscRoutes"));

// ======= EMP ROUTES (Employee Self-Service — separate login) =======
app.use("/api/emp",               require("./routes/emp/empRoutes"));

// ======= GLOBAL ERROR HANDLERS =======
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ DigiKraft Social Server running on port ${PORT}`);
  console.log(`   CMS  → /api/*`);
  console.log(`   CRM  → /api/crm/*`);
});






// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");

// dotenv.config();

// const app = express();

// app.use(express.json());
// app.use(cors({
//   origin: ['https://digikraftsocial.com', 'https://www.digikraftsocial.com', 'https://backend.digikraftsocial.com', 'http://localhost:3000'],
//   credentials: true,
// }));
// app.use(cookieParser());

// app.use("/uploads", express.static("uploads"));

// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/posts", require("./routes/postRoutes"));
// app.use("/api/categories", require("./routes/categoryRoutes"));
// app.use("/api/projects", require("./routes/projectsRoutes"));
// app.use("/api/projects", require("./routes/homepageRoutes")); 
// app.use("/api/pages",require("./routes/homepageRoutes"));
// app.use("/api/about",require("./routes/aboutRoutes.js"));
// app.use("/api/services-section",require("./routes/servicesRoutes.js"));
// app.use("/api/contact-info",require("./routes/contactInfoRoutes.js"));
// app.use("/api/enquiry",require("./routes/enquiryRoutes.js"));
// app.use("/api/seo-submissions", require("./routes/seoSubmissionRoutes"));
// app.use("/api/integrations", require("./routes/socialIntegrationRoutes"));
// app.use("/api/telegram", require("./routes/telegramRoutes"));
// app.use("/api/messaging", require("./routes/socialMessagingRoutes"));
// app.use("/api/logs", require("./routes/activityLogRoutes"));
// app.use("/api/slides", require("./routes/slideRoutes"));

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB Connected");

//     app.listen(process.env.PORT, () => {
//       console.log(`Server running on port ${process.env.PORT}`);
//     });
//   })
//   .catch((err) => console.log(err));