## Balance

### Overview
This project is a personal finance application designed to help users in Mexico manage credit card purchases made with "MSI" (Meses Sin Intereses, or months without interest). The goal is to register purchases made using this common payment method, track payment progress, and provide clear, actionable insights into outstanding debts and completed purchases.

### Key Features
- **Register Purchases:** Log purchases with details such as name, date, MSI term (e.g., 3, 6, 9 months), credit card used, and amount.
- **Track Payments:** Automatically calculate and track how many payments have been made and how many remain for each purchase.
- **Debt Overview:** Display total outstanding debt and a history of all MSI transactions.
- **Completion Alerts:** Easily see which purchases have been fully paid off.
- **Visualize Data:** Simple charts and summaries to understand your spending and repayment progress.

### Tech Stack

**Frontend:**
- [React](https://react.dev/) for building a modern, responsive user interface.
- [shadcn/ui](https://ui.shadcn.com/) as a component library for elegant, accessible, and customizable UI components.
- [Vite](https://vitejs.dev/) as the frontend tooling for fast development and builds.

**Backend:**
- [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/) for a robust and lightweight API server.

**Database:**
- [SQLite](https://www.sqlite.org/) for a simple, fast, file-based database—perfect for personal, self-hosted applications.

### Hosting
- The app is intended for **personal use and self-hosting**, giving you full control over your data and privacy.

### Why this stack?
- **React + shadcn + Vite:** Provides a fast, modern, and visually appealing frontend experience with minimal configuration.
- **Node.js/Express:** Easy to set up, efficient, and widely supported for building RESTful APIs.
- **SQLite:** Zero-configuration, reliable, and ideal for apps that don’t need a heavy, external database server.
- **Self-hosted:** Keeps your financial data private and secure, with no third-party dependencies.

---