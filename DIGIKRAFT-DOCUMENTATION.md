# DigiKraft Social — Internal System Documentation

**Document Version:** 5.0
**Last Updated:** October 2026
**Project:** DigiKraft Social Portal System
**Prepared By:** Development Team
**Status:** Production Ready

---

## Table of Contents

| # | Section |
|---|---|
| 1 | [System Overview](#1-system-overview) |
| 2 | [Technology Stack](#2-technology-stack) |
| 3 | [Portal Architecture](#3-portal-architecture) |
| 4 | [Portal Access — Login URLs & Credentials](#4-portal-access--login-urls--credentials) |
| 5 | [CMS Portal — Website Administration](#5-cms-portal--website-administration) |
| 6 | [CRM Portal — Client Relationship Management](#6-crm-portal--client-relationship-management) |
| 7 | [HRM Portal — Human Resource Management](#7-hrm-portal--human-resource-management) |
| 8 | [EMP Portal — Employee Self-Service](#8-emp-portal--employee-self-service) |
| 9 | [Task Management System](#9-task-management-system) |
| 10 | [Attendance & Check-In/Out System](#10-attendance--check-inout-system) |
| 11 | [Leave Management](#11-leave-management) |
| 12 | [Payroll & Salary System](#12-payroll--salary-system) |
| 13 | [Holiday Calendar](#13-holiday-calendar) |
| 14 | [Announcements & Notice Board](#14-announcements--notice-board) |
| 15 | [Reports & Analytics](#15-reports--analytics) |
| 16 | [Employee Onboarding Tracker](#16-employee-onboarding-tracker) |
| 17 | [Team Directory](#17-team-directory) |
| 18 | [Roles & Permissions Matrix](#18-roles--permissions-matrix) |
| 19 | [Security Architecture](#19-security-architecture) |
| 20 | [Server Setup & Commands](#20-server-setup--commands) |
| 21 | [API Reference](#21-api-reference) |
| 22 | [Troubleshooting Guide](#22-troubleshooting-guide) |

---

## 1. System Overview

DigiKraft Social operates **four independent portals** on a single unified backend. Each portal serves a distinct user group, maintains its own authentication system, and stores data in dedicated database collections — ensuring complete role isolation and data security.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    digikraftsocial.com                               │
│                                                                     │
│   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐      │
│   │    CMS    │  │    CRM    │  │    HRM    │  │    EMP    │      │
│   │ Website   │  │  Client   │  │   Human   │  │ Employee  │      │
│   │  Admin    │  │  Mgmt     │  │ Resources │  │   Self    │      │
│   │           │  │           │  │           │  │  Service  │      │
│   │/admin/    │  │/crm/      │  │/hrm/      │  │/emp/      │      │
│   │login      │  │login      │  │login      │  │login      │      │
│   └───────────┘  └───────────┘  └───────────┘  └───────────┘      │
│                                                                     │
│                    ↓  Single Backend API  ↓                         │
│              backend.digikraftsocial.com:5000                        │
│                                                                     │
│                    ↓  Single Database  ↓                            │
│                  MongoDB Atlas — dks-website                         │
└─────────────────────────────────────────────────────────────────────┘
```

### Portal Summary

| Portal | Users | Purpose | Theme |
|---|---|---|---|
| **CMS** | Website editors, content team | Manage website content, blogs, projects, SEO | Green |
| **CRM** | Sales, accounts, executives | Manage clients, projects, proposals, invoices, payments | Green |
| **HRM** | HR Admin, HR Manager, Dept Manager | Manage employees, attendance, payroll, leaves, tasks | Purple |
| **EMP** | All company employees | Self-service — attendance, tasks, leaves, salary, profile | Blue |

---

## 2. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend** | Next.js | 14.x |
| **Backend** | Node.js + Express | 5.x |
| **Database** | MongoDB Atlas | Cloud |
| **Authentication** | JWT (JSON Web Tokens) | Per-portal secrets |
| **Password Hashing** | bcryptjs | 12 rounds |
| **Security** | Helmet, express-mongo-sanitize, HPP, express-rate-limit | Latest |
| **PDF Generation** | html2pdf.js | Client-side |
| **File Hosting** | Static uploads / Cloudinary | — |

---

## 3. Portal Architecture

### Database Collections

| Collection | Used By | Purpose |
|---|---|---|
| `users` | CMS | CMS admin users |
| `crm_users` | CRM | CRM staff accounts |
| `hrm_users` | HRM | HR team accounts |
| `hrm_employees` | HRM + EMP | All employees (dual-use — HRM manages, EMP self-service login) |
| `hrm_attendance` | HRM + EMP | Daily attendance records |
| `hrm_leaves` | HRM + EMP | Leave requests & approvals |
| `hrm_leave_types` | HRM + EMP | Leave type configuration (EL/SL/CL/OL) |
| `hrm_payrolls` | HRM | Monthly payroll runs |
| `hrm_salary_slips` | HRM + EMP | Individual salary slips |
| `hrm_daily_tasks` | HRM + EMP | Daily task log & HR-assigned tasks |
| `hrm_holidays` | HRM + EMP | Company holiday calendar |
| `hrm_announcements` | HRM + EMP | Company-wide broadcast messages |
| `hrm_departments` | HRM | Department structure |
| `hrm_designations` | HRM | Designation levels |
| `hrm_regularizations` | HRM + EMP | Attendance correction requests |
| `hrm_history` | HRM | Full audit trail |
| `hrm_notifications` | HRM + EMP | In-app notifications |
| `hrm_settings` | HRM | HR configuration (singleton) |
| `crm_clients` + others | CRM | All CRM business data |

### JWT Token Architecture

Each portal uses a **dedicated JWT secret** — a token from one portal is **cryptographically invalid** in another.

| Portal | Secret Env Variable | Expiry | Portal Claim |
|---|---|---|---|
| CMS | `JWT_SECRET` | 7 days | — |
| CRM | `JWT_CRM_SECRET` | 8 hours | `portal: 'crm'` |
| HRM | `JWT_HRM_SECRET` | 8 hours | `portal: 'hrm'` |
| EMP | `JWT_EMP_SECRET` | 12 hours | `portal: 'emp'` |

> **Security Note:** Even if someone extracts a CRM token, attempting to use it on the HRM or EMP API will fail with `401 Invalid portal token`.

---

## 4. Portal Access — Login URLs & Credentials

### 🌐 Portal Chooser
> **URL:** `http://localhost:3000/portals` — Single page showing all 4 portal cards

---

### 🟢 CMS Portal — Website Administration

| Field | Value |
|---|---|
| **Login URL (Local)** | `http://localhost:3000/admin/login` |
| **Login URL (Production)** | `https://digikraftsocial.com/admin/login` |
| **Email** | `srdani12@gmail.com` |
| **Password** | `digikraftsocial@2026` |
| **Role** | `superadmin` |
| **Token Storage** | `localStorage → token` |

---

### 🟢 CRM Portal — Client Management

| Field | Value |
|---|---|
| **Login URL (Local)** | `http://localhost:3000/crm/login` |
| **Login URL (Production)** | `https://digikraftsocial.com/crm/login` |
| **Email** | `admin@digikraftsocial.com` |
| **Password** | `Dks@Admin2024` |
| **Role** | `owner` |
| **Token Storage** | `localStorage → crm_token` |

---

### 🟣 HRM Portal — HR Admin

| Field | Value |
|---|---|
| **Login URL (Local)** | `http://localhost:3000/hrm/login` |
| **Login URL (Production)** | `https://digikraftsocial.com/hrm/login` |
| **Email** | `hradmin@digikraftsocial.com` |
| **Password** | `HRM@Admin2024` |
| **Role** | `hr_admin` — Full access |
| **Token Storage** | `localStorage → hrm_token` |

### 🟣 HRM Portal — HR Manager

| Field | Value |
|---|---|
| **Email** | `hrmanager@digikraftsocial.com` |
| **Password** | `HRM@Manager2024` |
| **Role** | `hr_manager` — Most access (no Settings, no User Management) |

---

### 🔵 EMP Portal — Test Employee

| Field | Value |
|---|---|
| **Login URL (Local)** | `http://localhost:3000/emp/login` |
| **Login URL (Production)** | `https://digikraftsocial.com/emp/login` |
| **Work Email** | `rahul@digikraftsocial.com` |
| **Password** | `EMP@Rahul2024` |
| **Employee ID** | `DKS-EMP-001` |
| **Name** | Rahul Sharma |
| **Token Storage** | `localStorage → emp_token` |

---

## 5. CMS Portal — Website Administration

### Purpose
Manage all public-facing content on digikraftsocial.com — blog posts, project portfolio, homepage sections, services, SEO, and contact enquiries.

### Modules

| Module | Functionality |
|---|---|
| **Blog Posts** | Create, edit, publish/unpublish articles |
| **Projects** | Portfolio project management with images |
| **Homepage** | Hero banner, services section, features edit |
| **About** | About page content management |
| **SEO** | Meta tags, keywords, sitemap settings |
| **Enquiries** | View contact form submissions |
| **Users** | Manage CMS user accounts and roles |
| **Settings** | Site-wide configuration |

### CMS Roles

| Role | Permissions |
|---|---|
| `superadmin` | Full access — all modules + user management |
| `admin` | Blog, projects, pages — no user management |
| `author` | Blog posts only |
| `user` | Dashboard view only |

---

## 6. CRM Portal — Client Relationship Management

### Purpose
Complete business operations management — clients, projects, proposals, quotations, invoices, payments, and portfolio.

### Modules

| Module | Functionality |
|---|---|
| **Dashboard** | Revenue overview, pending invoices, recent activity |
| **Clients** | Client profiles, contact details, full history |
| **Client Detail** | 4 tabs: Projects · Proposals · Quotations · Invoices |
| **Services** | Service catalogue management |
| **Projects** | Active/completed project tracking |
| **Proposals** | Create proposals, PDF download, share with clients |
| **Quotations** | Price quotations with line items, PDF download, copy |
| **Invoices** | Professional invoices, PDF download, mark as paid |
| **Payments** | Payment record tracking |
| **Portfolio** | Company work portfolio management |
| **Enquiries** | New business leads and inquiries |
| **Pending Users** | Approve/reject new CRM staff registrations |
| **History** | Complete audit trail of all CRM actions |
| **Notifications** | In-app system notifications |
| **Settings** | Brand theme, bank details, document numbering |

### PDF Generation
All proposals, quotations, and invoices support direct **PDF download** (no browser print dialog). Powered by `html2pdf.js` — captures the document layout and downloads as a PDF file automatically.

### CRM Roles

| Role | Clients | Projects | Proposals | Quotations | Invoices | Payments | Settings |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `owner` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `manager` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `accountant` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| `executive` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

### New Staff Onboarding Flow

```
1. Staff member registers at /crm/login → "Register"
2. Account created with is_active: false (pending)
3. Owner/Manager → Pending Users → Approve + Assign Role + Select Page Access
4. Staff member can now log in
```

### Security
- Rate limited login: **10 attempts per 15 minutes**
- Brute-force lockout: **5 wrong passwords → 30-minute account lock**
- Portal-isolated JWT (`portal: 'crm'` claim)

---

## 7. HRM Portal — Human Resource Management

### Purpose
Complete HR operations — employee lifecycle management, attendance tracking, leave approvals, payroll processing, task assignment, onboarding, announcements, and analytics.

### Modules

| Module | Description |
|---|---|
| **Dashboard** | Live stats — attendance rate, headcount, pending leaves, payroll status |
| **Employees** | Full employee profiles, add/edit, department/designation assignment |
| **Employee Detail** | 5 tabs: Overview · Personal · Salary & Bank · Attendance · Leaves |
| **Departments** | Department structure + designation level management |
| **Attendance** | Daily attendance view, regularization request approvals |
| **Leaves** | Leave request approvals/rejections + leave type configuration |
| **Holidays** | Holiday calendar management, India preset import |
| **Task Log** | View employee daily task logs + assign tasks (see Section 9) |
| **Payroll** | Monthly payroll processing, salary slip generation |
| **Onboarding** | 5-step onboarding checklist per new joiner |
| **Announcements** | Create company-wide broadcast messages with scheduling |
| **Reports** | Analytics — Headcount, Attendance, Leave Utilisation, Payroll Cost |
| **Pending Users** | Approve/reject HRM staff registrations *(hr_admin only)* |
| **History** | Full audit trail with single/bulk delete option |
| **Notifications** | System event notifications |
| **Settings** | Company info, working hours, payroll config, leave policy *(hr_admin only)* |

### Employee Detail Page — 5 Tabs

| Tab | Visible To | What It Shows |
|---|---|---|
| **Overview** | All HRM roles | Work info, contact details, emergency contact, salary summary card |
| **Personal** | All HRM roles | DOB, gender, blood group, current/permanent address |
| **Salary & Bank** | `hr_admin` + `hr_manager` | CTC, basic salary, bank details, PF/ESI/UAN numbers |
| **Attendance** | All HRM roles | Monthly attendance records (filterable by month/year) |
| **Leaves** | All HRM roles | Complete leave history |

### HRM Roles Comparison

| Feature | `hr_admin` | `hr_manager` | `dept_manager` |
|---|:---:|:---:|:---:|
| View all employees | ✅ | ✅ | Own dept only |
| Add / Edit employees | ✅ | ✅ | ❌ |
| View Salary & Bank details | ✅ | ✅ | ❌ |
| Edit Salary & Bank details | ✅ | ✅ | ❌ |
| Reset employee EMP password | ✅ | ❌ | ❌ |
| Deactivate employee | ✅ | ❌ | ❌ |
| Process payroll | ✅ | ✅ | ❌ |
| Assign tasks to employees | ✅ | ✅ | ❌ |
| View employee task logs | ✅ | ✅ | Own dept only |
| Approve leaves | ✅ | ✅ | Own dept only |
| Approve attendance regularization | ✅ | ✅ | Own dept only |
| Manage departments/designations | ✅ | ❌ | ❌ |
| Create announcements | ✅ | ✅ | ❌ |
| View reports | ✅ | ✅ | ❌ |
| Manage onboarding checklist | ✅ | ✅ | ❌ |
| Approve HRM users | ✅ | ❌ | ❌ |
| Access Settings | ✅ | ❌ | ❌ |
| View history/audit | ✅ | ✅ | ❌ |

### New HRM Staff Registration Flow

```
1. Staff registers at /hrm/login
2. Account created with is_active: false
3. HR Admin → Pending Users → Approve + Assign Role + Page Access
4. Staff can log in
```

---

## 8. EMP Portal — Employee Self-Service

### Purpose
Employees manage their own workday — clock in/out, log daily tasks, apply for leaves, download salary slips, view company announcements, and connect with colleagues.

### Modules

| Module | Description |
|---|---|
| **Dashboard** | Check-in/out button, daily stats, leave balance, last salary |
| **Attendance** | Monthly attendance history, regularization requests |
| **My Tasks** | Daily work log + HR-assigned task management (see Section 9) |
| **My Leaves** | Apply for leave, check balance, cancel pending requests |
| **Holidays** | Company holiday calendar (read-only) |
| **Salary** | All salary slips with PDF download, monthly CTC breakup |
| **Announcements** | Company-wide HR messages with read receipts |
| **Team Directory** | Browse all colleagues by department, click for contact info |
| **My Profile** | Update contact info, view bank details (read-only), change password |
| **Notifications** | System events — leave approvals, salary slips, etc. |

### Employee First Login

| Step | Action |
|---|---|
| 1 | HR creates employee → system auto-generates temp password: `firstname@year` (e.g. `rahul@2026`) |
| 2 | HR shares password securely (WhatsApp/email) |
| 3 | Employee logs in at `/emp/login` |
| 4 | Employee goes to **My Profile → Change Password** |

### EMP Permissions

| Action | Allowed |
|---|---|
| Check In / Check Out | ✅ |
| View own attendance history | ✅ |
| Request attendance regularization | ✅ |
| Add own daily tasks | ✅ |
| Update status on HR-assigned tasks | ✅ |
| Comment on assigned tasks | ✅ |
| Apply for leave | ✅ |
| Cancel pending leave | ✅ |
| View leave balance | ✅ |
| Download own salary slips (PDF) | ✅ |
| View CTC breakup | ✅ |
| Edit contact / emergency info | ✅ |
| Change own password | ✅ |
| View bank details | ✅ *(read-only)* |
| Edit bank / salary details | ❌ *(HR only)* |
| View other employees' salary | ❌ |
| Approve leaves | ❌ |

---

## 9. Task Management System

### Overview

The system supports **two types of tasks** across both HRM and EMP portals:

| Type | Created By | Visible To |
|---|---|---|
| **Daily Log Task** | Employee (self) | Employee + HR (read) |
| **HR-Assigned Task** | HR Manager / HR Admin | Employee (action) + HR (kanban) |

---

### HRM Portal — Task Log (`/hrm/dashboard/tasks`)

#### Tab 1: Daily Log
View all employees' self-logged tasks for any date.

| Feature | Detail |
|---|---|
| Date picker | View any date's logs |
| Department filter | Filter by department |
| Employee search | Search by name or ID |
| Expandable cards | Click employee row to see full task list |
| Team summary | Total employees, submitted vs no-log, hours worked, completion % |

#### Tab 2: Assign Task
Assign work items directly to employees with full project context.

| Field | Purpose |
|---|---|
| Employee selector | Single employee or bulk (multiple checkboxes) |
| Title | Task name |
| Description | Detailed instructions for the employee |
| Category | Design / Development / Meeting / Research / Review / Client / Admin / Other |
| Priority | 🟢 Low · 🟡 Medium · 🟠 High · 🔴 Urgent |
| Task Date | Date the task is assigned for |
| Due Date | Hard deadline — overdue is flagged automatically |
| Project Name | Links task to a project |
| Estimated Hours | Time estimate set by HR |

#### Tab 3: Assigned Tasks (Kanban Board)
Visual board showing all assigned tasks across 4 columns.

| Column | Status |
|---|---|
| To Do | Not yet started |
| In Progress | Employee is working on it |
| Blocked | Employee has raised a blocker |
| Done | Completed |

**Filters:** Status · Priority · Employee · ⚠️ Overdue Only

Each task card shows:
- Employee name, priority badge, overdue warning
- Due date, estimated hours, project name
- Comment thread count
- Edit / Delete / 💬 Comment buttons

---

### EMP Portal — My Tasks (`/emp/dashboard/tasks`)

#### Section 1: My Daily Log
Employees log their own daily work with time tracking.

| Feature | Detail |
|---|---|
| Add Task | Title, category, start/end time, **duration auto-calculated**, priority, project, notes |
| Status toggle | Click status icon → cycles: To Do → In Progress → Done |
| Today view | All tasks for selected date with summary bar |
| History | Last 7 / 14 / 30 days, grouped by date with progress bar |

#### Section 2: HR Assigned Tasks
All tasks assigned by HR management.

| Feature | Detail |
|---|---|
| Active tab | Shows pending + in-progress + blocked tasks |
| Overdue alert | Red banner if any task has passed its deadline |
| Status update | One-click status change buttons on each card |
| Comment thread | Real-time two-way messaging with HR |
| Completed tab | History of all done tasks |

### Task Communication Flow

```
HR assigns task
       ↓
Employee sees it in "HR Assigned" section
       ↓
Employee updates status (In Progress)
       ↓
HR sees status change on Kanban board
       ↓
Employee marks Done + adds comment: "Completed. File uploaded."
       ↓
HR reviews + responds in comment thread
```

---

## 10. Attendance & Check-In/Out System

### Employee Check-In/Out (EMP Dashboard)

The **Check In** button appears on the employee dashboard. The system automatically determines attendance status based on time.

| Check-In Time | Status Assigned |
|---|---|
| Before 9:45 AM | `present` |
| 9:45 AM – 10:00 AM | `late` |
| After 10:00 AM | `late` |
| Work hours < 4.5h | Overrides to `half_day` at checkout |

### Check-In Button States

| State | Display |
|---|---|
| Not checked in | `🟢 Check In` (green button) |
| Checked in | `🟥 Check Out` (red button) + check-in time shown |
| Day complete | `✅ Day Complete — X.Xh worked` |

### All Attendance Statuses

| Status | Meaning |
|---|---|
| `present` | On time, 4.5h+ work |
| `late` | Checked in after 9:45 AM |
| `half_day` | Less than 4.5 hours worked |
| `absent` | No check-in recorded |
| `on_leave` | Approved leave |
| `wfh` | Work from home |
| `holiday` | Company holiday |
| `weekly_off` | Saturday / Sunday |

### Regularization Request (Missed Check-In)

| Step | Action |
|---|---|
| 1 | Employee → Attendance → `Request Regularization` |
| 2 | Fill: Date, Actual check-in time, Actual check-out time, Reason |
| 3 | Request submitted to HR |
| 4 | HR → HRM Attendance → Regularizations tab → Approve / Reject |
| 5 | If approved — attendance record updates automatically |

---

## 11. Leave Management

### Leave Types & Annual Quota

| Code | Type | Annual Days |
|---|---|---|
| EL | Earned Leave | 12 days |
| SL | Sick Leave | 12 days |
| CL | Casual Leave | 8 days |
| OL | Optional Leave | 2 days |

### Leave Application Flow

| Step | Portal | Action |
|---|---|---|
| 1 | EMP | Employee → My Leaves → Apply → Select type, dates, reason |
| 2 | Backend | Balance check → if sufficient → status: `pending` |
| 3 | HRM | HR → Leaves → Pending requests → Approve ✅ or Reject ❌ |
| 4 | On Approve | Leave balance deducted + employee notification sent |
| 5 | On Reject | Reason saved + employee notification sent |

> Employee can cancel a **pending** leave before it is reviewed by HR.

---

## 12. Payroll & Salary System

### Salary Components Calculation

| Component | Formula |
|---|---|
| Basic Salary | Set by HR per employee |
| HRA | 40% of Basic |
| Conveyance | ₹1,600 (fixed) |
| Medical Allowance | ₹1,250 (fixed) |
| Special Allowance | CTC/12 − Basic − HRA − Conv − Medical |
| **Gross Salary** | Basic + HRA + Conv + Medical + Special |
| PF (Employee) | 12% of Basic (max ₹15,000 ceiling) |
| ESI | 0.75% of Gross (only if Gross ≤ ₹21,000) |
| Professional Tax | ₹200 (fixed) |
| LWP Deduction | (Gross ÷ Working Days) × Absent Days |
| **Net Salary** | Gross − PF − ESI − PT − LWP |

### Payroll Processing Flow

| Step | Action |
|---|---|
| 1 | HRM → Payroll → **Run Payroll Preview** |
| 2 | Review — verify every employee's gross, deductions, LWP, net |
| 3 | Click **Process Payroll** → confirm (irreversible) |
| 4 | System generates individual salary slips for all employees |
| 5 | Click **Mark as Paid** when salaries are disbursed |
| 6 | Employees see new slip in EMP → Salary → Salary Slips |

### Salary Slip PDF

Employees can view and download professional salary slips from the EMP portal.

| PDF Contains |
|---|
| Company header (DigiKraft Social, GST number, address) |
| Employee details — name, ID, department, designation |
| Pay period, working days, days present, LWP |
| Earnings table (Basic, HRA, Conveyance, Medical, Special) |
| Deductions table (PF, ESI, Professional Tax) |
| Net Salary (highlighted) |
| Bank account details (last 4 digits masked) |

---

## 13. Holiday Calendar

### HRM Portal (`/hrm/dashboard/holidays`)

| Feature | Detail |
|---|---|
| Year filter | 2024 / 2025 / 2026 / 2027 |
| Import Preset | One-click import of India's major national holidays |
| Add Holiday | Name, date, type, description |
| Edit / Delete | Full CRUD management |
| Upcoming strip | Next 3 upcoming holidays with days-remaining countdown |

### Holiday Types

| Type | Color | Examples |
|---|---|---|
| National | 🔴 Red | Republic Day, Independence Day, Gandhi Jayanti |
| Optional | 🟡 Yellow | Regional festivals |
| Regional | 🔵 Blue | State-specific holidays |
| Company | 🟣 Purple | Team events, office closures |

### EMP Portal (`/emp/dashboard/holidays`)

Read-only calendar view. Shows the **Next Holiday** highlight card with days remaining, past holidays grayed out.

---

## 14. Announcements & Notice Board

### HRM Portal — Create Announcements

| Field | Detail |
|---|---|
| Title | Announcement headline |
| Body | Full message content |
| Priority | 🔴 High · 🟡 Medium · 🟢 Low |
| Publish At | Schedule for future date/time (blank = publish now) |
| Expires At | Auto-expire after date (blank = never expires) |
| Status toggle | Pause/unpublish any time |

HR Managers and HR Admins can both create announcements. Read receipt count (`👁 X read`) is visible on each announcement card.

### EMP Portal — View Announcements

| Feature | Detail |
|---|---|
| Unread badge | Red number badge on sidebar "Announcements" link (auto-refreshes every 60s) |
| 🚨 Urgent banner | Red alert at top if unread High-priority message exists |
| Expand to read | Click announcement → expands full content → auto-marks as read |
| Mark as Read | Manual button also available |

---

## 15. Reports & Analytics

Location: HRM Portal → `/hrm/dashboard/reports`

### Available Reports

| Report | Description | Key Metrics |
|---|---|---|
| **Headcount** | Employee strength overview | Total, Active, Probation, Resigned; by Dept, by Type, Monthly Joinings chart |
| **Attendance** | Month-wise attendance summary | Per-employee: Present, Late, Absent, On Leave, WFH, Total Hours |
| **Leave Utilisation** | Annual leave analysis | By leave type (days used + requests), monthly distribution chart |
| **Payroll Cost** | Payroll spend history | Total paid, average monthly net, per-month breakdown, cost trend chart |

All reports support **PDF export** via the Download button.

---

## 16. Employee Onboarding Tracker

Location: HRM Portal → `/hrm/dashboard/onboarding`

Shows all employees who joined in the **last 90 days** plus employees on **probation**.

### 5-Step Onboarding Checklist

| Step | Icon | Task |
|---|---|---|
| 1 | 📧 | Welcome email sent — login credentials and company overview |
| 2 | 📄 | Documents collected — Aadhaar, PAN, degree certificates, experience letters |
| 3 | 💻 | System access given — work email, EMP portal login, tools and apps |
| 4 | 🎓 | Induction completed — HR orientation, company policies, team introduction |
| 5 | 🖥️ | Equipment issued — laptop, ID card, access cards |

Each checkbox **auto-saves** on click. Progress bar shows 0–100% completion per employee.

---

## 17. Team Directory

Location: EMP Portal → `/emp/dashboard/team`

All active employees displayed in a **department-wise card grid**.

| Feature | Detail |
|---|---|
| Search | By name or email |
| Filter | By department |
| Employee card | Avatar (colored initials), name, designation, active/probation status |
| Click card | Opens popup with email (clickable), phone (clickable), join date |

---

## 18. Roles & Permissions Matrix

### CRM Portal

| Module | `owner` | `manager` | `accountant` | `executive` |
|---|:---:|:---:|:---:|:---:|
| Clients | ✅ | ✅ | ❌ | ✅ |
| Projects | ✅ | ✅ | ❌ | ✅ |
| Proposals | ✅ | ✅ | ❌ | ✅ |
| Quotations | ✅ | ✅ | ❌ | ❌ |
| Invoices | ✅ | ✅ | ✅ | ❌ |
| Payments | ✅ | ✅ | ✅ | ❌ |
| Portfolio | ✅ | ✅ | ❌ | ❌ |
| Enquiries | ✅ | ✅ | ❌ | ✅ |
| Pending Users | ✅ | ✅ | ❌ | ❌ |
| Settings | ✅ | ✅ | ❌ | ❌ |

### HRM Portal

| Module | `hr_admin` | `hr_manager` | `dept_manager` |
|---|:---:|:---:|:---:|
| All Employees | ✅ | ✅ | Own Dept |
| Add/Edit Employee | ✅ | ✅ | ❌ |
| Salary & Bank (View + Edit) | ✅ | ✅ | ❌ |
| Reset EMP Password | ✅ | ❌ | ❌ |
| Deactivate Employee | ✅ | ❌ | ❌ |
| Attendance | ✅ | ✅ | Own Dept |
| Approve Leaves | ✅ | ✅ | Own Dept |
| Process Payroll | ✅ | ✅ | ❌ |
| Assign Tasks | ✅ | ✅ | ❌ |
| View Task Logs | ✅ | ✅ | Own Dept |
| Holidays (Manage) | ✅ | ✅ | View Only |
| Create Announcements | ✅ | ✅ | ❌ |
| Reports | ✅ | ✅ | ❌ |
| Onboarding Checklist | ✅ | ✅ | ❌ |
| History + Delete | ✅ | View Only | ❌ |
| Approve HRM Users | ✅ | ❌ | ❌ |
| Settings | ✅ | ❌ | ❌ |

### EMP Portal

All employees have the same level. They can only see and modify **their own data**.

---

## 19. Security Architecture

### Implemented Security Measures

| Layer | Measure | Detail |
|---|---|---|
| **Headers** | `helmet` | X-Frame-Options, HSTS, X-Content-Type, Referrer-Policy, and more |
| **Injection** | `express-mongo-sanitize` | Strips `$` and `.` from all inputs — blocks NoSQL injection |
| **Pollution** | `hpp` | HTTP Parameter Pollution prevention |
| **Body Size** | Request limit | `10kb` cap on JSON and URL-encoded bodies |
| **HTTPS** | Redirect | Auto `301` redirect in `NODE_ENV=production` |
| **Passwords** | `bcryptjs` | 12 rounds of hashing (stronger than industry standard of 10) |
| **JWT** | Per-portal secrets | 4 separate 128-character secrets — one per portal |
| **Token Isolation** | Portal claim check | `portal: 'crm'` claim verified — CRM token rejected on HRM/EMP APIs |
| **Rate Limiting** | Login endpoints | 10 requests per 15 minutes per IP |
| **Brute Force** | Account lockout | 5 failed attempts → 30-minute automatic lock (all 3 portals) |
| **Input Validation** | Auth controllers | Email format regex, password minimum length, field length caps |
| **Approval Gate** | New accounts | All new users start `is_active: false` — manual approval required |
| **Dept Scope** | `dept_manager` | API queries auto-filtered to manager's department only |
| **Error Masking** | Production mode | `500` errors never expose stack traces or internal messages |
| **Sensitive Fields** | API responses | Aadhaar, account number, PAN never returned to non-admin roles |

### Brute-Force Lockout (All Portals)

| Attempt | Response |
|---|---|
| 1–4 wrong passwords | `401 Invalid credentials` |
| 5th wrong password | `423 Account locked for 30 minutes` |
| After 30 minutes | Auto-unlock — can try again |

> **Manual unlock (if needed):** In MongoDB, set `login_attempts: 0` and `locked_until: null` for the user document.

### Portal Token Isolation

```
CRM Token → HRM API  →  ❌  401 "Invalid portal token"
HRM Token → EMP API  →  ❌  401 "Invalid portal token"
EMP Token → CRM API  →  ❌  401 "Invalid portal token"
```

### Production Security Checklist

| Item | Action Required |
|---|---|
| JWT Secrets | Generate new 64-byte secrets for production server |
| MongoDB Atlas | Whitelist production server IP only |
| NODE_ENV | Set to `production` |
| CORS | Set `CORS_ORIGIN` to production domain only |
| HTTPS | Ensure SSL certificate is active |
| Credentials | Change all default passwords before go-live |

---

## 20. Server Setup & Commands

### Prerequisites

- Node.js 18+
- MongoDB Atlas account with IP whitelisted
- Git

### Start Development Servers

```bash
# Terminal 1 — Backend API (Port 5000)
cd DKS-WEBSITE_latest-deployed/backend
npm start

# Terminal 2 — Frontend (Port 3000)
cd DKS-WEBSITE_latest-deployed/website
npm run dev
```

### Environment Variables (backend/.env)

| Variable | Purpose |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | CMS portal JWT signing key |
| `JWT_CRM_SECRET` | CRM portal JWT signing key |
| `JWT_HRM_SECRET` | HRM portal JWT signing key |
| `JWT_EMP_SECRET` | EMP portal JWT signing key |
| `CORS_ORIGIN` | Comma-separated list of allowed frontend origins |

> **Generate a JWT secret:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

---

## 21. API Reference

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/crm/auth/login` | ❌ | CRM login |
| POST | `/api/hrm/auth/login` | ❌ | HRM login |
| POST | `/api/emp/auth/login` | ❌ | EMP login |
| GET | `/api/hrm/auth/verify` | ✅ HRM | Verify token + live DB check |
| GET | `/api/emp/auth/verify` | ✅ EMP | Verify token |
| GET | `/api/hrm/auth/pending-users` | ✅ Admin | Pending HRM registrations |
| PUT | `/api/hrm/auth/users/:id/approve` | ✅ Admin | Approve + assign role |

### Employee Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/hrm/employees` | ✅ HRM | List all employees |
| POST | `/api/hrm/employees` | ✅ Manager+ | Add new employee |
| GET | `/api/hrm/employees/:id` | ✅ HRM | Employee detail |
| PATCH | `/api/hrm/employees/:id` | ✅ HRM | Update employee |
| PUT | `/api/hrm/employees/:id/deactivate` | ✅ Manager+ | Deactivate |
| POST | `/api/hrm/employees/:id/reset-password` | ✅ Admin | Reset EMP password |

### Attendance Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/emp/attendance/checkin` | ✅ EMP | Employee check-in |
| POST | `/api/emp/attendance/checkout` | ✅ EMP | Employee check-out |
| GET | `/api/emp/attendance/history` | ✅ EMP | Monthly history |
| GET | `/api/hrm/attendance` | ✅ HRM | Daily view (all employees) |
| PATCH | `/api/hrm/attendance/regularizations/:id` | ✅ HRM | Approve/reject request |

### Task Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/emp/tasks` | ✅ EMP | My tasks for a date |
| POST | `/api/emp/tasks` | ✅ EMP | Add own task |
| PATCH | `/api/emp/tasks/:id` | ✅ EMP | Update task / status |
| POST | `/api/emp/tasks/:id/comment` | ✅ EMP | Add comment |
| GET | `/api/emp/tasks/assigned` | ✅ EMP | HR-assigned active tasks |
| POST | `/api/hrm/tasks/assign` | ✅ Manager+ | Assign task to employee |
| POST | `/api/hrm/tasks/bulk-assign` | ✅ Manager+ | Assign to multiple employees |
| GET | `/api/hrm/tasks/assigned` | ✅ HRM | All assigned tasks (kanban) |
| POST | `/api/hrm/tasks/:id/comment` | ✅ HRM | HR comment on task |

### Payroll Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/hrm/payroll/preview` | ✅ Manager+ | Preview month's payroll |
| POST | `/api/hrm/payroll/process` | ✅ Manager+ | Process and generate slips |
| PATCH | `/api/hrm/payroll/:month/:year/mark-paid` | ✅ Manager+ | Mark as paid |
| GET | `/api/emp/salary/slips` | ✅ EMP | My salary slips |
| GET | `/api/emp/salary/slips/:id` | ✅ EMP | Single slip (for PDF) |
| GET | `/api/emp/salary/ctc` | ✅ EMP | CTC breakup |

### Other Key Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/hrm/holidays` | ✅ HRM | Holiday list |
| POST | `/api/hrm/holidays/import-preset` | ✅ Manager+ | Import India holidays |
| GET | `/api/emp/holidays` | ✅ EMP | Holiday calendar |
| GET | `/api/hrm/announcements` | ✅ HRM | All announcements |
| POST | `/api/hrm/announcements` | ✅ Manager+ | Create announcement |
| GET | `/api/emp/announcements` | ✅ EMP | Live announcements |
| GET | `/api/hrm/reports/headcount` | ✅ Manager+ | Headcount report |
| GET | `/api/hrm/reports/attendance` | ✅ Manager+ | Attendance report |
| GET | `/api/hrm/reports/payroll` | ✅ Manager+ | Payroll cost report |
| GET | `/api/emp/team` | ✅ EMP | Team directory |
| DELETE | `/api/hrm/history/:id` | ✅ Admin | Delete single history record |
| DELETE | `/api/hrm/history/clear` | ✅ Admin | Clear history (with filters) |

---

## 22. Troubleshooting Guide

| Issue | Cause | Solution |
|---|---|---|
| `MongooseServerSelectionError` | IP not whitelisted on Atlas | Atlas → Network Access → Add Current IP → Confirm → wait 2 min |
| `Failed to download Urbanist font` | Google Fonts blocked on network | Harmless warning — app works normally. Fixed with `preload: false` in `layout.js` |
| Login error — `Account locked` | 5+ wrong password attempts | Wait 30 minutes OR set `login_attempts: 0`, `locked_until: null` in MongoDB |
| Login error — `Account pending approval` | New user not yet approved | HRM: HR Admin → Pending Users → Approve / CRM: Owner → Pending Users → Approve |
| Login error — `Invalid portal token` | Using wrong portal's token | Log out completely, clear localStorage, log in again |
| Check-in button not visible | Already checked in or day complete | Button changes to Check Out after check-in, disappears after checkout |
| PDF not downloading | Pop-up blocker active | Disable browser pop-up blocker for this site |
| HR-assigned task not showing in EMP | Task already completed | Check the "Completed" tab in HR Assigned section |
| `npm run dev` slow start | Google font timeout | Fixed with `preload: false` — startup is fast now |
| Backend `'next' is not recognized` | `node_modules` corrupted | Run: `Remove-Item -Recurse -Force node_modules` then `npm install` |

---

## Appendix — Feature Release History

| Version | Date | Key Features Added |
|---|---|---|
| v1.0 | Aug 2026 | CMS Portal (existing), CRM Portal (14 modules, PDF, RBAC) |
| v2.0 | Sep 2026 | HRM Portal (10 modules, payroll, attendance), EMP Portal (6 modules) |
| v3.0 | Oct 2026 | Employee detail page (5 tabs), Salary slip detail, payroll route fix |
| v4.0 | Oct 2026 | Task Management, Holiday Calendar, Announcements, Reports, Onboarding, Team Directory, Announcement badge, hr_manager salary access |
| v4.1 | Oct 2026 | **Security hardening** — helmet, mongo-sanitize, HPP, per-portal JWT secrets, CRM brute-force, HTTPS redirect, body limits, error masking |

---

*DigiKraft Social — Internal System Documentation v5.0*
*Confidential — For internal use only*
*GitHub: https://github.com/DIGICRAFT-INFO/digikraft_website*
