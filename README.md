# Employee Management & Transport Allowance API

A NestJS backend service built with Prisma ORM for managing employees, batch attendance processing, and automatically calculating employee transport allowances based on customizable business rules.

---

## 🛠 Tech Stack

* **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
* **Database & ORM:** MySQL / PostgreSQL with [Prisma ORM](https://www.prisma.io/)
* **API Documentation:** [Swagger (OpenAPI 3.0)](https://swagger.io/)
* **Validation & Transformation:** `class-validator`, `class-transformer`

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have the following installed on your machine:
* **Node.js** ($\ge v18.x$)
* **yarn**
* **MySQL** or **PostgreSQL** database instance

---

### 2. Installation

Step to install:

1. git clone <repository-url>
2. cd employee-management-api
3. yarn install
4. npx prisma migrate dev
5. yarn run seed:run
6. yarn run start
7. open "http://localhost:3001/dashboard/attendance"
8. Click button Import Excel (excel file inside of /external directory)

---

### 3. Documentation

Step to open documentation, open:

```bash
http://localhost:3000/docs