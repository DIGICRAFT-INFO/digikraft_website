# DigiKraft Social — Complete System Documentation

> **Version:** 4.0
> **Date:** October 2026
> **Project:** DKS-WEBSITE_latest-deployed
> **Portals:** CMS · CRM · HRM · EMP
> **Stack:** Next.js 14 (Frontend) · Node.js + Express (Backend) · MongoDB Atlas (Database)

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Server Start kaise kare](#2-server-start-kaise-kare)
3. [Portal Chooser Page](#3-portal-chooser-page)
4. [CMS Portal — Website Admin](#4-cms-portal--website-admin)
5. [CRM Portal — Client Management](#5-crm-portal--client-management)
6. [HRM Portal — HR Management](#6-hrm-portal--hr-management)
7. [EMP Portal — Employee Self Service](#7-emp-portal--employee-self-service)
8. [EMP Check-In / Check-Out — Full Flow](#8-emp-check-in--check-out--full-flow)
9. [Task Management System — Full Flow](#9-task-management-system--full-flow)
10. [Leave Flow — Apply se Approval tak](#10-leave-flow--apply-se-approval-tak)
11. [Payroll Flow — Preview se Slip tak](#11-payroll-flow--preview-se-slip-tak)
12. [Holiday Calendar](#12-holiday-calendar)
13. [Announcements / Notice Board](#13-announcements--notice-board)
14. [Reports & Analytics](#14-reports--analytics)
15. [Onboarding Tracker](#15-onboarding-tracker)
16. [Team Directory](#16-team-directory)
17. [New Employee Add karna — Full Flow](#17-new-employee-add-karna--full-flow)
18. [Roles & Permissions](#18-roles--permissions)
19. [Security Features](#19-security-features)
20. [All Credentials — Quick Reference](#20-all-credentials--quick-reference)
21. [API Endpoints Reference](#21-api-endpoints-reference)
22. [Troubleshooting](#22-troubleshooting)

---

## 1. System Architecture

```
╔══════════════════════════════════════════════════════════════════════╗
║              digikraftsocial.com  (Frontend — Next.js 14)            ║
║                         Port: 3000 (local)                           ║
║                                                                      ║
║   /portals  ── Portal Chooser (4 cards)                              ║
║                                                                      ║
║  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌───────────────┐   ║
║  │   CMS    │  │   CRM    │  │     HRM      │  │      EMP      │   ║
║  │ Website  │  │  Client  │  │  HR Team     │  │  Employees    │   ║
║  │  Admin   │  │   Mgmt   │  │ Management   │  │ Self-Service  │   ║
║  │/admin/   │  │/crm/     │  │ /hrm/login   │  │  /emp/login   │   ║
║  │login     │  │login     │  │  (Purple)    │  │   (Blue)      │   ║
║  └──────────┘  └──────────┘  └──────────────┘  └───────────────┘   ║
╚══════════════════════════════════════════════════════════════════════╝
                               │
                               ↓
╔══════════════════════════════════════════════════════════════════════╗
║         backend.digikraftsocial.com  (Backend — Node.js)             ║
║                         Port: 5000 (local)                           ║
║                                                                      ║
║   /api/*              → CMS routes                                   ║
║   /api/crm/*          → CRM routes                                   ║
║   /api/hrm/*          → HRM routes                                   ║
║   /api/emp/*          → EMP routes                                   ║
╚══════════════════════════════════════════════════════════════════════╝
                               │
                               ↓
╔══════════════════════════════════════════════════════════════════════╗
║              MongoDB Atlas  (Database: dks-website)                  ║
║                                                                      ║
║   users               ← CMS users                                    ║
║   crm_users           ← CRM staff                                    ║
║   hrm_users           ← HRM staff (HR team login)                    ║
║   hrm_employees       ← All employees (EMP login bhi yahi se)        ║
║   hrm_attendance      ← Employee attendance records                  ║
║   hrm_leaves          ← Leave requests                               ║
║   hrm_leave_types     ← EL / SL / CL / OL types                     ║
║   hrm_payrolls        ← Monthly payroll records                      ║
║   hrm_salary_slips    ← Individual salary slips                      ║
║   hrm_daily_tasks     ← Daily task log + HR-assigned tasks           ║
║   hrm_holidays        ← Holiday calendar                             ║
║   hrm_announcements   ← Company-wide announcements                   ║
║   hrm_departments     ← Department list                              ║
║   hrm_designations    ← Designation list                             ║
║   hrm_regularizations ← Attendance correction requests               ║
║   hrm_history         ← Audit trail                                  ║
║   hrm_notifications   ← In-app notifications                         ║
║   hrm_settings        ← HRM configuration (singleton)                ║
║   crm_clients + crm_projects + crm_invoices ... (CRM collections)    ║
╚══════════════════════════════════════════════════════════════════════╝
```

### 4 Portals Comparison

| | CMS | CRM | HRM | EMP |
|---|---|---|---|---|
| **Kaun use karta hai** | Website editors | Sales/accounts team | HR team | Sab employees |
| **Login URL** | `/admin/login` | `/crm/login` | `/hrm/login` | `/emp/login` |
| **DB Collection** | `users` | `crm_users` | `hrm_users` | `hrm_employees` |
| **localStorage Token** | `token` | `crm_token` | `hrm_token` | `emp_token` |
| **JWT Expiry** | 7 days | 8 hours | 8 hours | 12 hours |
| **Theme** | Green | Green | Purple `#7c3aed` | Blue `#2563eb` |

---

## 2. Server Start kaise kare

**2 terminals mein run karo — dono zaroori hain:**

```bash
# Terminal 1 — Backend
cd DKS-WEBSITE_latest-deployed\backend
npm start
# Output: ✅ DigiKraft Social Server running on port 5000

# Terminal 2 — Frontend
cd DKS-WEBSITE_latest-deployed\website
npm run dev
# Output: ✓ Ready in 2s  →  http://localhost:3000
```

> ⚠️ **MongoDB Atlas IP Whitelist:** Agar "MongooseServerSelectionError" aaye →
> Atlas → Network Access → Add IP Address → **Add Current IP Address** → Confirm → 2 min wait

---

## 3. Portal Chooser Page

**URL:** `http://localhost:3000/portals`

Ek page jahan se sabhi 4 portals ke login pages direct open ho jaate hain. CRM/HRM sidebar mein bhi "Other Portals" quick-links hain.

---

## 4. CMS Portal — Website Admin

**Kya hai:** Website ka content manage karna — blog posts, projects, services, SEO, homepage, etc.

### Credentials
| Email | Password | Role |
|---|---|---|
| `srdani12@gmail.com` | `digikraftsocial@2026` | `superadmin` |

### CMS mein kya manage hota hai
| Section | Kaam |
|---|---|
| Blog Posts | Articles likho, publish karo |
| Projects | Portfolio projects add/edit karo |
| Homepage | Hero, services, features edit karo |
| About | About page content |
| SEO | Meta tags, sitemap |
| Enquiries | Contact form submissions |
| Users | CMS users manage karo |

---

## 5. CRM Portal — Client Management

**Kya hai:** DigiKraft ke clients, projects, proposals, invoices, payments.

### Credentials
| Email | Password | Role |
|---|---|---|
| `admin@digikraftsocial.com` | `Dks@Admin2024` | `owner` |

### CRM Modules
```
CRM Dashboard
├── Clients         → Client profiles, add/edit, click for detail
│   └── Client Detail → 4 tabs: Projects | Proposals | Quotations | Invoices
├── Services        → Services list
├── Projects        → Active/completed projects
├── Proposals       → Client proposals, PDF download
├── Quotations      → Price quotes, PDF download, copy
├── Invoices        → Bills, PDF download, mark paid
├── Portfolio       → Company portfolio
├── Payments        → Payment records
├── Enquiries       → New leads
├── Pending Users   → Naye CRM staff approve karo
├── History         → Activity log
├── Notifications   → System notifications
└── Settings        → CRM settings, brand theme, bank details
```

### PDF Download
```
List page → Row click → Detail page → ⬇️ Download PDF button
→ html2pdf.js se direct PDF save — browser print dialog NAHI aata
```

### New CRM Staff
```
1. Staff → /crm/login → Register
2. is_active: false (pending)
3. Owner/Manager → /crm/dashboard/pending-users → Approve + Role
   Roles: owner | manager | accountant | executive
4. Staff login kar sakta hai
```

---

## 6. HRM Portal — HR Management

**Kya hai:** HR team ke liye employee management, attendance, leaves, payroll, tasks, announcements sab.

### Credentials
| Email | Password | Role |
|---|---|---|
| `hradmin@digikraftsocial.com` | `HRM@Admin2024` | `hr_admin` |
| `hrmanager@digikraftsocial.com` | `HRM@Manager2024` | `hr_manager` |

### HRM Login Flow
```
/hrm/login → Email + Password
        ↓
Rate limit: 10 attempts / 15 min per IP
        ↓
"hrm_users" collection check
        ↓
is_active: false → "Account pending approval"
Locked → "Account locked for X minutes"
Wrong password → attempt++ (5 attempts → 30 min lockout)
        ↓
Success → JWT (8h, portal:'hrm') → hrm_token + hrm_user
        ↓
/hrm/dashboard
```

### HRM 3 Roles — Kya fark hai

```
hr_admin (Full Power)
├── Sabhi employees dekh + edit karo
├── Salary + bank details dekho + edit karo
├── EMP password reset karo
├── Payroll process karo
├── HRM Settings manage karo
├── Naye HRM users approve karo
├── Reports dekho
└── Sab kuch

hr_manager (Most Access)
├── Sabhi employees dekho + edit karo
├── Salary + bank details dekho + edit karo  ✅ (v4.0 updated)
├── Payroll process karo
├── Leave + attendance manage karo
├── Announcements create karo
├── Assign tasks to employees
├── Reports dekho
└── ✗ Settings nahi  ✗ Pending Users nahi  ✗ EMP password reset nahi

dept_manager (Sirf Apna Department)
├── Sirf apne dept ke employees dekho
├── ✗ Salary/bank details NAHI
├── Attendance + leave apne dept ka manage karo
└── ✗ Payroll  ✗ Settings  ✗ Tasks assign
```

### HRM Modules — Complete List
```
HRM Dashboard       → Stats: attendance rate, headcount, payroll, pending leaves
├── Employees       → Full list, add new, click for detail page
│   └── Employee Detail (5 tabs)
│       ├── Overview      → Work info, contact, emergency, salary card
│       ├── Personal      → DOB, gender, blood group, addresses
│       ├── Salary & Bank → CTC, basic, bank, PF/ESI/UAN (hr_admin + hr_manager)
│       ├── Attendance    → Monthly records
│       └── Leaves        → Leave history
├── Departments     → Departments + Designations manage karo
├── Attendance      → Daily view + Regularization approve/reject
├── Leaves          → Leave requests approve/reject + Leave types
├── Holidays        → Holiday calendar, India preset import, add/edit
├── Task Log 🆕     → 3 tabs (see Section 9)
├── Payroll         → Preview + Process + Mark Paid + Salary slips
├── Onboarding 🆕   → New employee 5-step checklist
├── Announcements 🆕 → Company-wide broadcast messages
├── Reports 🆕      → Headcount, Attendance, Leave, Payroll analytics
├── Pending Users   → HRM staff approve karo (hr_admin only)
├── History         → Full audit trail
├── Notifications   → System events
└── Settings        → Company info, working hours, payroll config, leave policy
```

---

## 7. EMP Portal — Employee Self Service

**Kya hai:** Employees apna attendance, tasks, leaves, salary sab khud manage karte hain.

### Credentials (Test Employee)
| Work Email | Password | Employee ID |
|---|---|---|
| `rahul@digikraftsocial.com` | `EMP@Rahul2024` | `DKS-EMP-001` |

### EMP Login Flow
```
/emp/login → Work Email + Password
        ↓
Rate limit: 10 attempts / 15 min per IP
        ↓
"hrm_employees" collection check (SAME collection jo HRM use karta hai)
        ↓
is_active: false → "Account disabled. Contact HR."
status: resigned/terminated → Login blocked
Wrong password → attempt++ (5 attempts → 30 min lockout)
        ↓
Success → JWT (12h, portal:'emp') → emp_token + emp_user
        ↓
/emp/dashboard
```

### EMP First Login Password
```
HR jab employee create karta hai → auto temp password:
  Format: firstname@year  →  e.g. rahul@2026

Employee first login ke baad:
  My Profile → Change Password tab → Naya strong password set karo
```

### EMP Modules — Complete List
```
EMP Dashboard       → Check-in/out button, stats, leave balance, salary info
├── Attendance      → Monthly history, regularization request
├── My Tasks 🆕     → 2 sections (see Section 9)
│   ├── My Daily Log → Apne khud ke tasks add karo time ke sath
│   └── HR Assigned → HR ke assigned tasks, status update, comment
├── My Leaves       → Leave apply, balance, cancel pending
├── Holidays 🆕     → Company holiday calendar
├── Salary          → Salary slips, PDF download, CTC breakup
├── Announcements 🆕 → HR ke broadcast messages, comment + mark read
├── Team Directory 🆕 → Colleagues list, department-wise, contact card
├── My Profile      → Contact info edit, bank details (read-only), password
└── Notifications   → System events (leave approved, slip generated, etc.)
```

---

## 8. EMP Check-In / Check-Out — Full Flow

### Dashboard pe kya dikhta hai

```
State 1 — Subah, abhi check-in nahi hua:
┌────────────────────────────────────────────┐
│  "Not checked in today"                    │
│  ┌──────────────────────────────────┐      │
│  │      🟢  Check In                │      │
│  └──────────────────────────────────┘      │
└────────────────────────────────────────────┘

State 2 — Check-in ho gaya:
┌────────────────────────────────────────────┐
│  "Checked in at 09:30 AM"                  │
│  ┌──────────────────────────────────┐      │
│  │      🟥  Check Out               │      │
│  └──────────────────────────────────┘      │
└────────────────────────────────────────────┘

State 3 — Day complete:
┌────────────────────────────────────────────┐
│  ✅ Day Complete — 9.0h worked              │
│  (No button — din khatam)                  │
└────────────────────────────────────────────┘
```

### Automatic Status Logic (Backend)

```
Check-In Time           →  Status Assigned
─────────────────────────────────────────────
Before 9:45 AM          →  ✅ "present"
9:45 AM – 10:00 AM      →  ⚠️ "late"
After 10:00 AM          →  ⚠️ "late"

At Check-Out:
Work hours < 4.5h       →  "half_day" (override)
Work hours ≥ 4.5h       →  status wahi rehta
```

### MongoDB Record (hrm_attendance)
```json
{
  "employee":           "emp-uuid",
  "date":               "2026-10-08T00:00:00",
  "check_in":           "2026-10-08T09:30:00",
  "check_out":          "2026-10-08T18:30:00",
  "work_hours":         9.0,
  "status":             "present",
  "check_in_location":  "office",
  "device_info":        "Chrome/Windows...",
  "marked_by":          "self"
}
```

### Attendance Status Meanings
| Status | Matlab |
|---|---|
| `present` | Check-in before 9:45, 4.5h+ work |
| `late` | Check-in after 9:45 AM |
| `half_day` | Work hours < 4.5 hours |
| `absent` | Koi check-in nahi |
| `on_leave` | Approved leave thi |
| `wfh` | Work from home |
| `holiday` | Company holiday |
| `weekly_off` | Saturday / Sunday |

### Regularization Request (Check-in bhool gaye)
```
EMP → Attendance → "Request Regularization" button
  → Date, Actual Check-in time, Actual Check-out time, Reason
  → POST /api/emp/attendance/regularize

HRM → Attendance → "Regularizations" tab
  → Approve → Record auto-update ho jaata hai
  → Reject → Employee ko notification
```

---

## 9. Task Management System — Full Flow

### Overview — 2 Types of Tasks

```
Type 1: Employee ka khud ka Daily Log
  ├── Employee khud add karta hai
  ├── Time ke sath (start → end, duration auto)
  ├── Category, Priority, Status, Project
  └── HR dekh sakta hai HRM portal mein

Type 2: HR-Assigned Task
  ├── HR ne employee ko assign kiya
  ├── Due date, estimated hours, priority
  ├── Employee status update karta hai
  ├── Dono (HR + Employee) comment kar sakte hain
  └── Kanban board pe HR dekh sakta hai
```

### HRM Portal — Task Log (`/hrm/dashboard/tasks`)

#### Tab 1: 📅 Daily Log
```
Date picker → Kisi bhi din ka log dekho
Department filter + Employee search

Har employee card:
  - Name, ID, Department, Designation
  - Tasks count · Done count · Hours logged · Progress %
  - "No log" badge agar kuch submit nahi kiya

Card expand → Tasks detail:
  - Task title, Category emoji, Start→End time, Duration
  - Project name, Status badge
```

#### Tab 2: ➕ Assign Task
```
Mode toggle: 👤 Single Employee  OR  👥 Multiple Employees

Single mode: Dropdown se employee choose karo
Bulk mode: Checkboxes se multiple employees select karo

Task form fields:
  Title *           → Task ka naam
  Description       → Detailed instructions
  Category          → 🎨Design / 💻Dev / 🤝Meeting / 🔍Research /
                       📋Review / 👤Client / 📁Admin / 📌Other
  Priority          → 🟢Low / 🟡Medium / 🟠High / 🔴Urgent
  Task Date         → Kab ka task hai
  Due Date          → Deadline (overdue auto-detect)
  Project Name      → Kaunse project ke liye
  Estimated Hours   → Kitna time lagega

Submit → Employee ko task assign ho jaata hai
Employee ko /emp/dashboard/tasks pe dikhta hai
```

#### Tab 3: 📋 Assigned Tasks (Kanban Board)
```
Filters: Status | Priority | Employee | ☑ Overdue Only

Summary strip: Total | To Do | In Progress | Blocked | Done | Overdue

4 Kanban Columns:
  ┌──────────┐  ┌──────────────┐  ┌─────────┐  ┌──────┐
  │  To Do   │  │ In Progress  │  │ Blocked │  │ Done │
  └──────────┘  └──────────────┘  └─────────┘  └──────┘

Har card pe:
  - Employee name
  - Priority badge (Urgent/High/Medium/Low)
  - ⚠️ OVERDUE warning agar deadline nikal gayi
  - Category, Due date, Project, Estimated hours
  - Comment count
  - [💬 Comment] [✏️ Edit] [🗑️ Delete] buttons

💬 Comment → Thread modal:
  - HR + Employee ke comments
  - Color coded: HR = purple, Employee = blue
  - New comment send karo

✏️ Edit → Modal: title, description, status, priority,
           due date, estimate, HR internal note
```

### EMP Portal — Tasks (`/emp/dashboard/tasks`)

#### Section 1: 📋 My Daily Log
```
Today tab:
  - Date picker (past dates bhi)
  - Summary: Total, Done, In Progress, Blocked, Hours
  - Add Task button

Task Card:
  - Status icon click → cycle: To Do → In Progress → Done → To Do
  - Edit button → modal
  - Delete button (sirf khud ke tasks)

Add Task Modal fields:
  Title *           → Kaam ka naam
  Category          → Category select
  Priority          → Low / Medium / High / Urgent
  Start Time        → Kab shuru kiya
  End Time          → Kab khatam hua
  Duration          → Auto-calculate dikhta hai (e.g. "2h 30m")
  Status            → To Do / In Progress / Done / Blocked
  Project Name      → Kaunse project ke liye
  Estimated Hours   → Apna estimate
  Notes             → Details, blockers, links

History tab: Last 7 / 14 / 30 days
  - Date-wise grouped
  - Progress bar per day (% tasks done)
```

#### Section 2: 📌 HR Assigned
```
Active tab: (pending + in_progress + blocked tasks)
  ⚠️ Overdue alert banner (agar koi task overdue hai)

Har assigned task card:
  - "Assigned by HR Name" label
  - Priority badge
  - ⚠️ OVERDUE warning
  - Description / Instructions
  - Category, Project, Due Date, Est. Hours

Status Update buttons (right on card):
  [To Do] [In Progress] [Done] [Blocked]
  → Ek click se status update ho jaata hai
  → HR ke kanban board pe instantly reflect hota hai

[💬 Comment / X comments] button → Thread modal:
  - HR ke sabhi comments dikhte hain
  - Employee reply kar sakta hai
  - Real-time thread (HR portal + EMP portal dono pe)

Completed tab: Done tasks history
```

### Task Data Flow (Dono sides se)
```
HR assigns task
      ↓
Employee → EMP portal → HR Assigned section mein dikhta hai
      ↓
Employee status update karta hai (In Progress)
      ↓
HR → HRM portal → Kanban board pe status change dikhta hai
      ↓
Employee completes task (Done)
      ↓
HR → Comment: "Good work! Please share the file."
      ↓
Employee → Sees HR comment → Replies
      ↓
HR → Sees reply in comment thread
```

---

## 10. Leave Flow — Apply se Approval tak

### Employee Side (EMP Portal)
```
EMP → My Leaves → Apply tab
  Form: Leave Type | From Date | To Date | Session | Reason
  → POST /api/emp/leaves (status: "pending")
  → Balance check: enough balance hai?
  → Employee "My Requests" mein "Pending" dikhta hai
  → Cancel bhi kar sakta hai (pending state mein)
```

### HR Side (HRM Portal)
```
HRM → Leaves → Leave Requests tab
  Filter: Pending / Approved / Rejected
  ✅ Approve → Balance deduct, notification
  ❌ Reject → Reason fill karo, notification
```

### Leave Types & Balance
| Type | Code | Annual Quota |
|---|---|---|
| Earned Leave | EL | 12 days |
| Sick Leave | SL | 12 days |
| Casual Leave | CL | 8 days |
| Optional Leave | OL | 2 days |

---

## 11. Payroll Flow — Preview se Slip tak

### Step 1: Preview
```
HRM → Payroll → "Run Payroll Preview"
Backend calculate karta hai:
  Gross = Basic + HRA(40%) + Conv(₹1600) + Medical(₹1250) + Special
  PF = 12% of Basic (max ₹15,000)
  ESI = 0.75% of Gross (sirf if Gross ≤ ₹21,000)
  PT = ₹200
  LWP Deduction = (Gross / 26) × LWP Days
  Net = Gross - PF - ESI - PT - LWP Deduction
```

### Step 2: Process
```
"Process Payroll" → Confirmation → Cannot undo
→ Har employee ke liye salary slip generate
→ Status: "processed"
```

### Step 3: Mark Paid
```
Payroll History → "Mark Paid" → Status: "paid"
→ Employees ko notification
```

### Step 4: Employee Slip Download
```
EMP → Salary → Salary Slips → View → ⬇️ Download PDF
PDF mein: Employee details, earnings table, deductions table, net salary, bank details
```

---

## 12. Holiday Calendar

### HRM Portal (`/hrm/dashboard/holidays`)
```
Year filter (2024/2025/2026/2027)
"Import Preset" → India ke major holidays auto-import
Add/Edit/Delete individual holidays

Holiday Types:
  National (Red)  → Republic Day, Independence Day, Diwali
  Optional (Yellow) → Festivals
  Regional (Blue)   → State-specific
  Company (Purple)  → Office events, team outings

"Upcoming" strip → Next 3 holidays with days remaining
```

### EMP Portal (`/emp/dashboard/holidays`)
```
Same calendar (read-only)
"Next Holiday" highlight card → Naam, date, days remaining
Past holidays fade out (50% opacity)
Stats: Total | Passed | Upcoming | This Month
```

---

## 13. Announcements / Notice Board

### HRM Portal (`/hrm/dashboard/announcements`)
```
HR ne broadcast message banana hai:
  Title + Body text
  Priority: 🟢 Low | 🟡 Medium | 🔴 High
  Publish At: Schedule karo (blank = abhi)
  Expires At: Auto-expire (blank = never)
  
Cards:
  "● Live" badge (agar currently visible)
  "Scheduled" badge (future publish date)
  Read receipt count (👁 X read)
  Edit → Update any field
  Toggle Active/Inactive (pause karo)
  Preview modal

HR Manager bhi create kar sakta hai
```

### EMP Portal (`/emp/dashboard/announcements`)
```
🚨 Urgent alert banner (agar High priority unread hai)

Announcement cards:
  🔴🟡🟢 Priority icons
  Unread = blue dot + bold title
  Click/expand → Full message
  Auto-mark read on expand
  "Mark as Read" button bhi hai

EMP Sidebar pe badge:
  Announcements nav item pe red number badge
  Unread count (60 second refresh)
```

---

## 14. Reports & Analytics

### HRM Portal (`/hrm/dashboard/reports`)

**4 tabs:**

#### 👥 Headcount Report
```
Stats: Total, Active, Probation, Notice Period, Resigned, Terminated
Charts:
  By Department → Bar chart
  By Employment Type → Table (Full Time / Part Time / Intern / Contract)
  Monthly Joinings (last 12 months) → Bar chart
Export: PDF download button
```

#### 📅 Attendance Report
```
Month + Year filter
Har employee ke liye:
  Present, Late, Absent, On Leave, WFH, Total Hours
Totals row at bottom
```

#### 📋 Leave Report
```
Year filter
By Leave Type → Days used + requests count
Monthly Distribution → Bar chart (all 12 months)
Total approved days, total requests
```

#### 💰 Payroll Report
```
Last 6 months payroll history
Stats: Total Paid, Avg Monthly Net, Months Processed
Table: Pay Period, Employees, Gross, PF, ESI, Net, Status
Net Payout Trend → Bar chart
```

---

## 15. Onboarding Tracker

### HRM Portal (`/hrm/dashboard/onboarding`)
```
Dikhaata hai: Recent joiners (last 90 days) + Probation employees

Har employee ke liye 5-step checklist:
  📧 Welcome Email Sent
  📄 Documents Collected (Aadhaar, PAN, certificates)
  💻 System Access Given (email, EMP login, tools)
  🎓 Induction Completed (orientation, company policy)
  🖥️ Equipment Issued (laptop, ID card, access card)

Click on checkbox → auto-save
Progress bar: 0% to 100%
Badges: "Not Started" (red) | "In Progress" (yellow) | "Complete" (green)

Search by name/employee ID bhi hai
```

---

## 16. Team Directory

### EMP Portal (`/emp/dashboard/team`)
```
Department-wise grid of all active colleagues
Search by name or email
Filter by department

Employee card:
  Avatar (colored initials)
  Name, Designation, Status (Active/Probation)
  Click → Popup with:
    - Full name, employee ID
    - Department, designation
    - Work email (clickable → opens email client)
    - Phone (clickable → opens dialer)
    - Date of joining

HR bhi dekh sakta hai sabhi employees (HRM Employees page se)
```

---

## 17. New Employee Add karna — Full Flow

```
Step 1: HR → HRM → Employees → "Add Employee"
  Fill: Full Name *, Work Email *, Phone
        Department, Designation, Employment Type
        Date of Joining, CTC, Basic Salary, Notes

Step 2: System auto-generates:
  Employee ID: DKS-EMP-001 (sequential)
  Temp Password: firstname@year  (e.g. rahul@2026)
  Response mein _temp_password field aata hai

Step 3: HR emp ko password bheje (WhatsApp / email)

Step 4: Employee /emp/login kare with temp password

Step 5: Employee → My Profile → Change Password

Step 6: HR → Onboarding page → 5-step checklist complete karo

Step 7 (HR): Departments, Designation fill karo employee ke liye
```

### Employee Deactivate
```
HRM → Employees → Employee row → Deactivate
  → Reason: Resigned / Terminated
  → is_active: false
  → Employee turant EMP portal se logout ho jaata hai
  → Attendance/leaves/slips data remain
```

---

## 18. Roles & Permissions

### CRM Portal

| Section | owner | manager | accountant | executive |
|---|:---:|:---:|:---:|:---:|
| Clients | ✅ | ✅ | ❌ | ✅ |
| Projects | ✅ | ✅ | ❌ | ✅ |
| Proposals | ✅ | ✅ | ❌ | ✅ |
| Quotations | ✅ | ✅ | ❌ | ❌ |
| Invoices | ✅ | ✅ | ✅ | ❌ |
| Payments | ✅ | ✅ | ✅ | ❌ |
| Pending Users | ✅ | ✅ | ❌ | ❌ |
| Settings | ✅ | ✅ | ❌ | ❌ |

### HRM Portal

| Section | hr_admin | hr_manager | dept_manager |
|---|:---:|:---:|:---:|
| View all employees | ✅ | ✅ | Own dept |
| Edit employees | ✅ | ✅ | ❌ |
| **Salary + Bank — View** | ✅ | ✅ | ❌ |
| **Salary + Bank — Edit** | ✅ | ✅ | ❌ |
| Reset EMP password | ✅ | ❌ | ❌ |
| Deactivate employee | ✅ | ❌ | ❌ |
| Attendance | ✅ | ✅ | Own dept |
| Regularization approve | ✅ | ✅ | Own dept |
| Approve leaves | ✅ | ✅ | Own dept |
| Process payroll | ✅ | ✅ | ❌ |
| **Assign tasks** | ✅ | ✅ | ❌ |
| **View daily log** | ✅ | ✅ | Own dept |
| Departments/Designations | ✅ | ❌ | ❌ |
| **Holidays — manage** | ✅ | ✅ | View only |
| **Announcements — create** | ✅ | ✅ | ❌ |
| **Reports** | ✅ | ✅ | ❌ |
| **Onboarding checklist** | ✅ | ✅ | ❌ |
| Pending HRM users | ✅ | ❌ | ❌ |
| Settings | ✅ | ❌ | ❌ |

### EMP Portal

| Action | Employee |
|---|:---:|
| Check In / Check Out | ✅ |
| View own attendance | ✅ |
| Request regularization | ✅ |
| **Add own daily tasks** | ✅ |
| **Update HR-assigned task status** | ✅ |
| **Comment on assigned tasks** | ✅ |
| Apply for leave | ✅ |
| Cancel own pending leave | ✅ |
| View leave balance | ✅ |
| View own salary slips + PDF | ✅ |
| View CTC breakup | ✅ |
| Edit own contact info | ✅ |
| Change own password | ✅ |
| View bank details (read-only) | ✅ |
| **View holiday calendar** | ✅ |
| **View announcements + comment** | ✅ |
| **View team directory** | ✅ |
| Edit bank details | ❌ HR karta hai |
| Approve others' leaves | ❌ |
| View others' salary | ❌ |

---

## 19. Security Features

| Feature | CMS | CRM | HRM | EMP |
|---|:---:|:---:|:---:|:---:|
| bcrypt hashing (rounds) | ✅ r10 | ✅ r12 | ✅ r12 | ✅ r12 |
| JWT portal claim isolation | ❌ | ✅ | ✅ | ✅ |
| Rate limiting (10/15min) | ❌ | ✅ | ✅ | ✅ |
| Brute-force lockout (5→30min) | ❌ | ❌ | ✅ | ✅ |
| Account approval gate | ❌ | ✅ | ✅ | ✅ |
| Live DB token verify | ❌ | ✅ | ✅ | ✅ |
| RBAC guards | ✅ basic | ✅ 4-level | ✅ 4-level | ✅ |
| Dept scope restriction | ❌ | ❌ | ✅ | ❌ |
| Sensitive field masking | ❌ | ❌ | ✅ (dept_mgr) | ✅ |

### Portal Isolation
```
CRM token → HRM API → ❌ "Invalid portal token"
HRM token → EMP API → ❌ "Invalid portal token"
EMP token → CRM API → ❌ "Invalid portal token"
```

### Account Lockout
```
5 wrong passwords → 30 min lock → Auto unlock
Manual unlock: MongoDB → set login_attempts:0, locked_until:null
```

---

## 20. All Credentials — Quick Reference

```
╔════════════════════════════════════════════════════════════════════╗
║                    ALL PORTAL CREDENTIALS                         ║
╠══════════════╦════════════════════════════╦══════════════════╦═══╣
║  PORTAL      ║  EMAIL / LOGIN              ║  PASSWORD        ║ ROLE ║
╠══════════════╬════════════════════════════╬══════════════════╬═══╣
║  CMS         ║  srdani12@gmail.com         ║ digikraftsocial  ║ superadmin ║
║              ║                             ║ @2026            ║     ║
╠══════════════╬════════════════════════════╬══════════════════╬═══╣
║  CRM         ║  admin@digikraftsocial.com  ║ Dks@Admin2024    ║ owner ║
╠══════════════╬════════════════════════════╬══════════════════╬═══╣
║  HRM Admin   ║  hradmin@                   ║ HRM@Admin2024    ║ hr_admin ║
║              ║  digikraftsocial.com        ║                  ║     ║
╠══════════════╬════════════════════════════╬══════════════════╬═══╣
║  HRM Manager ║  hrmanager@                 ║ HRM@Manager2024  ║ hr_manager ║
║              ║  digikraftsocial.com        ║                  ║     ║
╠══════════════╬════════════════════════════╬══════════════════╬═══╣
║  EMP         ║  rahul@digikraftsocial.com  ║ EMP@Rahul2024    ║ DKS-EMP-001 ║
╚══════════════╩════════════════════════════╩══════════════════╩═══╝

Portal Chooser:  http://localhost:3000/portals
Backend Port:    5000
Frontend Port:   3000
Database:        MongoDB Atlas → dks-website
```

### Login URLs
| Portal | Local URL |
|---|---|
| CMS | `http://localhost:3000/admin/login` |
| CRM | `http://localhost:3000/crm/login` |
| HRM | `http://localhost:3000/hrm/login` |
| EMP | `http://localhost:3000/emp/login` |
| Portal Chooser | `http://localhost:3000/portals` |

---

## 21. API Endpoints Reference

### EMP Task APIs
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/emp/tasks?date=2026-10-08` | Own tasks for a date |
| GET | `/api/emp/tasks/history?from=&to=` | Own tasks history |
| GET | `/api/emp/tasks/summary?date=` | Stats for a date |
| GET | `/api/emp/tasks/assigned` | HR-assigned active tasks |
| GET | `/api/emp/tasks/assigned-history` | HR-assigned completed |
| POST | `/api/emp/tasks` | Add own task |
| PATCH | `/api/emp/tasks/:id` | Update task |
| POST | `/api/emp/tasks/:id/comment` | Add comment |
| DELETE | `/api/emp/tasks/:id` | Delete own task |

### HRM Task APIs
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/hrm/tasks/daily?date=&department=` | All employees tasks for date |
| GET | `/api/hrm/tasks/summary?date=` | Team summary |
| GET | `/api/hrm/tasks/employee-history?employee_id=` | One employee history |
| GET | `/api/hrm/tasks/assigned?status=&priority=&employee_id=` | All assigned tasks |
| POST | `/api/hrm/tasks/assign` | Assign to one employee |
| POST | `/api/hrm/tasks/bulk-assign` | Assign to many employees |
| PATCH | `/api/hrm/tasks/assigned/:id` | Update assigned task |
| DELETE | `/api/hrm/tasks/assigned/:id` | Delete assigned task |
| POST | `/api/hrm/tasks/:id/comment` | HR comment |

### EMP Attendance APIs
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/emp/attendance/checkin` | Check in |
| POST | `/api/emp/attendance/checkout` | Check out |
| GET | `/api/emp/attendance/today` | Today's record |
| GET | `/api/emp/attendance/history?month=&year=` | Monthly history |
| POST | `/api/emp/attendance/regularize` | Regularization request |

### EMP Leave APIs
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/emp/leaves` | Apply leave |
| GET | `/api/emp/leaves` | My leave requests |
| PATCH | `/api/emp/leaves/:id/cancel` | Cancel pending |
| GET | `/api/emp/leaves/balance` | Current balance |
| GET | `/api/emp/leaves/types` | Leave types |

### EMP Salary APIs
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/emp/salary/slips` | All slips |
| GET | `/api/emp/salary/slips/:id` | One slip |
| GET | `/api/emp/salary/ctc` | CTC breakup |

### HRM Holiday APIs
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/hrm/holidays?year=2026` | List holidays |
| POST | `/api/hrm/holidays` | Add holiday |
| PATCH | `/api/hrm/holidays/:id` | Update |
| DELETE | `/api/hrm/holidays/:id` | Delete |
| POST | `/api/hrm/holidays/import-preset` | India preset import |

### HRM Announcement APIs
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/hrm/announcements` | All (HRM admin view) |
| POST | `/api/hrm/announcements` | Create |
| PATCH | `/api/hrm/announcements/:id` | Update |
| DELETE | `/api/hrm/announcements/:id` | Delete |
| GET | `/api/emp/announcements` | Live (EMP view) |
| PATCH | `/api/emp/announcements/:id/read` | Mark read |

### HRM Report APIs
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/hrm/reports/headcount` | Headcount report |
| GET | `/api/hrm/reports/attendance?month=&year=` | Attendance |
| GET | `/api/hrm/reports/leave?year=` | Leave utilisation |
| GET | `/api/hrm/reports/payroll?months=6` | Payroll cost |

### EMP Team & Directory
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/emp/team?search=&department=` | Team directory |
| GET | `/api/emp/holidays?year=` | Holiday calendar |

---

## 22. Troubleshooting

### MongoDB Connection Error
```
MongooseServerSelectionError: Could not connect to any servers
→ Atlas → Network Access → Add Current IP → Confirm → 2 min wait
```

### Google Font Warning (harmless)
```
⨯ Failed to download Urbanist from Google Fonts. Using fallback font instead.
→ App kaam karta rehta hai — sirf warning hai
→ Fixed: layout.js mein preload: false add kar diya gaya hai
```

### Login Failed — Account locked
```
5 baar galat password → 30 min lock
→ Wait 30 min → auto unlock
OR MongoDB mein: set login_attempts: 0, locked_until: null
```

### Login Failed — Account pending
```
HRM: HR Admin → /hrm/dashboard/pending-users → Approve
CRM: Owner → /crm/dashboard/pending-users → Approve
EMP: HR Admin → check is_active in /hrm/dashboard/employees
```

### EMP Check-In button nahi dikh raha
```
Already checked in? → "Check Out" button dikhega
Already checked out? → "✅ Day Complete" message dikhega
Backend running? → npm start terminal check karo
```

### HR-Assigned task EMP ko nahi dikh raha
```
/api/emp/tasks/assigned → status filter check karo
Default: only "todo", "in_progress", "blocked" show hote hain
Completed tab mein "done" tasks hain
```

### PDF Download nahi ho raha
```
Browser pop-up blocker OFF karo
Backend running hai confirm karo (port 5000)
Console mein error dekho (F12 → Console)
```

---

## System Summary — What's New in v4.0

| Feature | Where |
|---|---|
| ✅ **Task Management** — Employee daily log + HR assign + Kanban board + Comments | HRM + EMP |
| ✅ **Holiday Calendar** — Manage + India preset import | HRM + EMP |
| ✅ **Announcements** — Priority broadcast, schedule, read receipts, sidebar badge | HRM + EMP |
| ✅ **Reports** — Headcount, Attendance, Leave, Payroll charts | HRM |
| ✅ **Onboarding Tracker** — 5-step checklist per new employee | HRM |
| ✅ **Team Directory** — Department-wise, search, contact popup | EMP |
| ✅ **Salary & Bank visible to hr_manager** (not just hr_admin) | HRM |
| ✅ **Employee Detail Page** — 5 tabs with edit, reset password | HRM |
| ✅ **Salary Slip Detail Page** — Professional PDF | HRM |
| ✅ **Payroll route fix** — slips before :month/:year params | Backend |
| ✅ **CSS improvements** — emp-tabs, emp-search-bar, task classes | Frontend |

---

*DigiKraft Social Documentation v4.0 — October 2026*
*Portals: CMS · CRM · HRM · EMP*
*Backend: Node.js + Express + MongoDB Atlas*
*Frontend: Next.js 14*
*Document covers all features added from v1.0 to v4.0*
