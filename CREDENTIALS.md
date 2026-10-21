# DigiKraft Social — All Portals Credentials

> **Confidential — Internal Use Only**
> Last Updated: October 2026

---

## 🌐 Live Production URLs

| Portal | Live URL |
|--------|----------|
| 🏠 Main Website | **https://digikraftsocial.com** |
| 🔗 Portal Hub | **https://digikraftsocial.com/login** |
| 📝 CMS Admin | **https://digikraftsocial.com/admin/login** |
| 💼 CRM | **https://digikraftsocial.com/crm/login** |
| 👥 HRM | **https://digikraftsocial.com/hrm/login** |
| 👤 EMP | **https://digikraftsocial.com/emp/login** |
| ⚙️ Backend API | **https://backend.digikraftsocial.com/api/** |

---

## 💻 Local Development

```bash
# Terminal 1 — Backend (Port 5000)
cd DKS-WEBSITE_latest-deployed\backend
npm start

# Terminal 2 — Frontend (Port 3000)
cd DKS-WEBSITE_latest-deployed\website
npm run dev
```

**Local Portal Hub →** `http://localhost:3000/login`

---

## 🟢 CMS Portal — Website Admin

| Field | Local | Live |
|-------|-------|------|
| **URL** | http://localhost:3000/admin/login | https://digikraftsocial.com/admin/login |
| **Email** | srdani12@gmail.com | srdani12@gmail.com |
| **Password** | digikraftsocial@2026 | digikraftsocial@2026 |
| **Role** | superadmin | superadmin |

---

## 🟢 CRM Portal — Client Management

| Field | Local | Live |
|-------|-------|------|
| **URL** | http://localhost:3000/crm/login | https://digikraftsocial.com/crm/login |
| **Email** | admin@digikraftsocial.com | admin@digikraftsocial.com |
| **Password** | Dks@Admin2024 | Dks@Admin2024 |
| **Role** | owner | owner |

---

## 🟣 HRM Portal — HR Management

**Local →** `http://localhost:3000/hrm/login`
**Live →** `https://digikraftsocial.com/hrm/login`

| Account | Email | Password | Role |
|---------|-------|----------|------|
| HR Admin | hradmin@digikraftsocial.com | HRM@Admin2024 | hr_admin |
| HR Manager | hrmanager@digikraftsocial.com | HRM@Manager2024 | hr_manager |

---

## 🔵 EMP Portal — Employee Self-Service

| Field | Local | Live |
|-------|-------|------|
| **URL** | http://localhost:3000/emp/login | https://digikraftsocial.com/emp/login |
| **Work Email** | rahul@digikraftsocial.com | rahul@digikraftsocial.com |
| **Password** | EMP@Rahul2024 | EMP@Rahul2024 |
| **Employee ID** | DKS-EMP-001 | DKS-EMP-001 |
| **Name** | Rahul Sharma | Rahul Sharma |

---

## 🔗 All URLs at a Glance

| Portal | Local | Live |
|--------|-------|------|
| Portal Hub | http://localhost:3000/login | https://digikraftsocial.com/login |
| CMS | http://localhost:3000/admin/login | https://digikraftsocial.com/admin/login |
| CRM | http://localhost:3000/crm/login | https://digikraftsocial.com/crm/login |
| HRM | http://localhost:3000/hrm/login | https://digikraftsocial.com/hrm/login |
| EMP | http://localhost:3000/emp/login | https://digikraftsocial.com/emp/login |
| Backend API | http://localhost:5000/api/ | https://backend.digikraftsocial.com/api/ |

---

## 🔐 Security Features

- JWT secrets are **portal-isolated** (4 separate 128-char secrets)
- Brute-force lockout after **5 failed attempts** (30 min lockout)
- **Logout all devices** — one logout invalidates ALL active sessions on all devices
- Token version checking — old tokens rejected on every request after logout

---

*DigiKraft Social · Confidential · digikraftsocial.com*
