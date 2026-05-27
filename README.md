# She Can Foundation — Letter Portal

A full-stack web application for the **She Can Foundation** (registered under the Indian Society Act, 1860) that lets the public submit letters of solidarity and enables admins to review, approve, and publish them in a public archive.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Getting Started](#4-getting-started)
5. [The Form — Letter Submission](#5-the-form--letter-submission)
6. [Public Letters Archive](#6-public-letters-archive)
7. [Admin Capabilities](#7-admin-capabilities)
8. [API Reference](#8-api-reference)
9. [Database Models](#9-database-models)
10. [Environment Variables](#10-environment-variables)

---

## 1. Project Overview

The She Can Foundation portal has two sides:

| Side | Who uses it | What it does |
|---|---|---|
| **Public Page** | Visitors | Read about the mission, submit a letter, browse approved public letters |
| **Admin Dashboard** | Foundation admins | Review all submissions, approve or discard letters, manage the form fields |

The public never sees unapproved letters. Only letters explicitly marked **Approved** by an admin appear in the public archive.

---

## 2. Tech Stack

### Frontend (`/client`)
| Tool | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| TypeScript | 4.9 | Type safety |
| Tailwind CSS | via CRA | Utility-first styling |
| Axios | 1.x | HTTP client |
| React Hot Toast | 2.x | Toast notifications |
| react-scripts (CRA) | 5.0.1 | Build toolchain |

### Backend (`/server`)
| Tool | Version | Purpose |
|---|---|---|
| Node.js + Express | 5.x | REST API server |
| TypeScript | 6.x | Type safety |
| Mongoose | 9.x | MongoDB ODM |
| MongoDB Atlas | — | Cloud database |
| JSON Web Token (JWT) | 9.x | Admin authentication |
| bcryptjs | 3.x | Password hashing |
| nodemon | 3.x | Dev hot-reload |

---

## 3. Project Structure

```
she-can-foundation/
├── client/                        # React frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── shecanfoundation.avif  # Brand logo
│   │   └── animations/
│   │       └── women.svg          # Main character illustration
│   └── src/
│       ├── components/
│       │   ├── PublicForm.tsx      # Main landing page + letter form
│       │   ├── AdminLogin.tsx      # Admin login modal
│       │   ├── AdminPanel.tsx      # Admin dashboard wrapper
│       │   ├── SubmissionsTable.tsx# Letter review interface
│       │   ├── FieldManager.tsx    # Form field configuration
│       │   └── SuccessModal.tsx    # Post-submission confirmation
│       ├── hooks/
│       │   └── useForm.ts          # Form state + validation logic
│       ├── services/
│       │   └── api.ts              # Axios instance (base URL + JWT interceptor)
│       ├── contexts/
│       │   └── AuthContext.tsx     # Admin auth state (login/logout/isAdmin)
│       └── types/
│           └── index.ts            # Shared TypeScript interfaces
│
└── server/                         # Express backend
    ├── .env                        # Environment variables
    └── src/
        ├── server.ts               # Express app entry point
        ├── models/
        │   ├── FormField.ts        # Form field schema
        │   ├── Submission.ts       # Letter submission schema
        │   └── User.ts             # Admin user schema
        ├── routes/
        │   ├── auth.ts             # POST /login, POST /setup
        │   ├── formFields.ts       # CRUD for form fields
        │   └── submissions.ts      # Submission creation, review, approval
        └── middleware/
            └── auth.ts             # JWT verification + admin role guard
```

---

## 4. Getting Started

### Prerequisites
- Node.js 18+
- npm
- A MongoDB Atlas cluster (or local MongoDB)

### Install & Run

**Terminal 1 — Backend:**
```bash
cd server
npm install
npm run dev
# Server starts at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm install
npm start
# App opens at http://localhost:3000
```

### Create the First Admin Account

Call this endpoint once after starting the server. It reads credentials from `.env`:

```bash
curl -X POST http://localhost:5000/api/auth/setup
```

Default credentials (configurable via `.env`):
- **Email:** `admin@shecan.org`
- **Password:** `admin123`

> After the first admin exists, subsequent calls to `/setup` return `"Admin already exists"` and do nothing.

---

## 5. The Form — Letter Submission

### What the Public Sees

The landing page (`PublicForm.tsx`) has two columns:

**Left column:**
- Main character illustration (SVG art)
- Spinning circular badge ("She Can Foundation • Empower • Inspire")  
  — clicking it shows a random inspirational quote from Indian and global women leaders
- Savitribai Phule's quote blockquote
- Links to the official website, Instagram, and LinkedIn

**Right column:**
- Mission statement headline and description
- The **Letter Submission Form** (dynamic, configured by the admin)

### Default Form Fields

When no custom fields are configured in the database, the form falls back to these three defaults:

| Field | Type | Required |
|---|---|---|
| Name | text | Yes |
| Email | email | Yes |
| Message | textarea | Yes |

### Dynamic Fields

The admin can add, edit, or disable fields. The public form always fetches the current active fields from `GET /api/form-fields` on page load.

**Supported field types:**

| Type | Renders as |
|---|---|
| `text` | Single-line text input |
| `email` | Single-line input with email validation |
| `textarea` | Multi-line text area (3 rows) |
| `number` | Numeric input |
| `tel` | Phone number input |
| `date` | Date picker |

### Email Validation

Email format validation is triggered under **two conditions**:
1. The field's `type` is set to `email`, OR
2. The field's internal `fieldName` contains the word `email` (case-insensitive)

This means even a `text` field named `"contactEmail"` will be validated as an email address.

The validation regex used:
```
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

### Form Submission Flow

1. User fills in all required fields
2. On submit, client-side validation runs on every field
3. If any errors exist, a toast appears: `"Please fix the errors above"`
4. If valid, the form data is `POST`ed to `/api/submissions` as `{ formData: { fieldName: value, ... } }`
5. On success, a **Success Modal** appears with a paper-plane SVG confirmation
6. The form resets to empty state
7. The public letters list refreshes automatically

### Inspirational Quote Modal

Clicking the spinning badge in the illustration area opens a modal with a random quote. The pool includes quotes from:

- Mary Kom  
- Savitribai Phule  
- Kiran Bedi  
- Sarojini Naidu  
- Sudha Murty  
- Arundhati Roy  
- Malala Yousafzai  
- Maya Angelou  
- Audre Lorde  
- Kalpana Chawla  

---

## 6. Public Letters Archive

### Accessing the Archive

The **"Letters (N)"** button in the navbar opens the Public Letters modal. `N` shows the count of currently approved letters.

### What is Shown

Only letters with `status: 'reviewed'` (i.e., approved by an admin) are returned from the backend and displayed here. Pending and discarded letters are never visible to the public.

### Archive Modal Features

| Feature | Description |
|---|---|
| **Letter cards** | Grid of approved letters showing sender name, date, and a 2-line preview of the message |
| **Postmark date** | Submission date shown in `MMM D, YYYY` format |
| **Random Read** | Button that opens a randomly selected approved letter — disabled if no letters exist |
| **Letter detail** | Clicking any card opens the full letter in a lined-paper style reader with a fixed height of `224px` and an internal vertical scroll for long messages |
| **Back to Board** | Returns to the letter grid without closing the modal |

### Letter Detail View

- Fixed height container (`224px`) with `overflow-y-auto` scroll
- Lined paper background (horizontal rules every `2rem`)
- Shows sender name and submission date in the header
- Message displayed in serif font with `whitespace-pre-line` to respect line breaks

---

## 7. Admin Capabilities

### Logging In

The **Admin** link in the public page navbar opens the login modal. Credentials are validated against the database via JWT.

- Token is stored in `localStorage`
- Token expires after **7 days**
- All admin API calls automatically attach `Authorization: Bearer <token>` via the Axios interceptor

### Admin Dashboard Overview

The dashboard (`AdminPanel.tsx`) has two tabs:

| Tab | Purpose |
|---|---|
| **Letters Received** | Review all submitted letters |
| **Customize Form** | Add, edit, or delete form fields |

---

### Tab 1: Letters Received (Submissions)

All submissions are displayed as envelope-style cards in a grid (3 columns on desktop).

#### Three-State Filter

The inbox is split into three views accessible via tab buttons:

| Tab | Shows | Count includes |
|---|---|---|
| **Inbox** | Letters with `status: pending` (new, unreviewed) | All non-approved, non-discarded |
| **Approved** | Letters with `status: reviewed` | Published to public |
| **Discarded** | Letters with `status: discarded` | Removed from inbox |

Each tab shows the current count in its label.

#### Letter Card

Each card shows:
- Postmark date (submission date)
- Status badge (`pending` / `approved` / `discarded`)
- Sender name (extracted from `formData.name` or `formData.Name` or `formData.fullName`)
- Sender email
- "Open Letter →" prompt

#### Letter Detail Modal (Admin)

Clicking a card opens the full letter. The admin sees:

| Element | Description |
|---|---|
| **Postmark** | Full timestamp (`toLocaleString()`) |
| **Status** | Current status label |
| **Sender** | Name + email |
| **Message body** | Lined paper container, `224px` fixed height, scrollable |
| **Extra fields** | Any custom fields beyond name/email/message are listed below the message |

#### Admin Actions

Three action buttons appear based on the letter's current status:

| Button | Visible when | Result |
|---|---|---|
| **Approve & Publish** | Status is NOT `reviewed` | Sets `status: 'reviewed'` — letter becomes visible on the public board |
| **Discard** | Status is NOT `discarded` | Sets `status: 'discarded'` — letter removed from public view, moved to Discarded tab |
| **Return to Inbox** | Status is NOT `pending` | Resets `status: 'pending'` — letter goes back to Inbox for re-review |

All status changes are made via `PUT /api/submissions/:id` and take effect immediately. The admin can see the change reflected without closing the modal.

---

### Tab 2: Customize Form (Field Manager)

This tab lets the admin control exactly what fields appear in the public submission form.

#### Adding a New Field

Fill in the four inputs and click **Add Field**:

| Input | Description |
|---|---|
| **Field ID / Name** | Internal key used in the database (e.g., `age`, `city`). Must be unique. |
| **Display Label** | Text shown above the input on the public form (e.g., `Your Age`) |
| **Input Type** | One of: Text, Email, Textarea, Number, Phone, Date |
| **Required** | Checkbox — if checked, the field cannot be left empty |

> Field names must be unique. Adding a duplicate name will return an error from the server.

#### Existing Fields List

All form fields (including inactive ones) are listed. Each row shows:
- Display label
- Internal key (`fieldName`)
- Type
- Required (yes/no)
- Active status (green = active, red = inactive)

#### Editing a Field

Clicking **Edit** on any row opens an inline editor for that field with inputs for Label, Type, Required, and Active. Saving calls `PUT /api/form-fields/:id`.

#### Deleting a Field

Clicking **Delete** on any row shows a browser confirmation dialog. On confirm, the field is permanently deleted via `DELETE /api/form-fields/:id`.

#### Active vs Inactive

Setting a field to **inactive** removes it from the public form without deleting it from the database. This lets admins temporarily hide fields without losing their data.

---

## 8. API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | None | Login with email + password. Returns JWT token. |
| `POST` | `/auth/setup` | None | Creates the default admin account (runs once). |

### Form Fields Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/form-fields` | None | Returns all **active** fields (for public form). |
| `GET` | `/form-fields/all` | Admin | Returns **all** fields including inactive (for admin). |
| `POST` | `/form-fields` | Admin | Creates a new form field. |
| `PUT` | `/form-fields/:id` | Admin | Updates an existing field. |
| `DELETE` | `/form-fields/:id` | Admin | Permanently deletes a field. |

### Submissions Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/submissions` | None | Submit a new letter (from public form). |
| `GET` | `/submissions/public` | None | Returns all letters with `status: reviewed`. |
| `GET` | `/submissions` | Admin | Returns **all** letters with all statuses. |
| `PUT` | `/submissions/:id` | Admin | Updates a submission's status. |

### Status Values for Submissions

| Value | Meaning |
|---|---|
| `pending` | Newly submitted, awaiting admin review |
| `reviewed` | Approved by admin — visible in public archive |
| `discarded` | Discarded by admin — hidden from all public views |

---

## 9. Database Models

### FormField

```typescript
{
  fieldName:   String    // Unique internal key (e.g., "email")
  label:       String    // Display label (e.g., "Email Address")
  type:        String    // Enum: text | email | textarea | number | tel | date | select
  required:    Boolean   // Default: false
  placeholder: String    // Default: ""
  options:     [String]  // For "select" type
  order:       Number    // Sort order on the form
  isActive:    Boolean   // Default: true
  createdAt:   Date      // Auto-set on creation
}
```

### Submission

```typescript
{
  formData:    Map<String, Mixed>  // Dynamic key-value pairs from the form
  submittedAt: Date                // Auto-set on creation
  status:      String              // Enum: pending | reviewed — Default: pending
}
```

> Note: The `status` field also accepts `'discarded'` at the application layer via admin actions, even though the Mongoose schema enum only lists `pending` and `reviewed`. The `discarded` status works correctly at runtime.

### User (Admin)

```typescript
{
  email:     String   // Unique admin email
  password:  String   // Bcrypt-hashed password
  name:      String   // Display name
  isAdmin:   Boolean  // Default: true
}
```

---

## 10. Environment Variables

Create `server/.env` with the following:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?appName=SheCan
JWT_SECRET=your_secret_key_here
ADMIN_EMAIL=admin@shecan.org
ADMIN_PASSWORD=admin123
```

| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on |
| `MONGODB_URI` | Full MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign and verify JWT tokens |
| `ADMIN_EMAIL` | Default admin email created by `/auth/setup` |
| `ADMIN_PASSWORD` | Default admin password created by `/auth/setup` |

> **Security note:** Change `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` before deploying to production. Never commit `.env` to version control.

---

## Links

- **Website:** [shecanfoundation.org](https://shecanfoundation.org/)
- **Instagram:** [@_shecanfoundation_](https://www.instagram.com/_shecanfoundation_)
- **LinkedIn:** [She Can Foundation](https://www.linkedin.com/company/shecanfoundation)
