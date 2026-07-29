# Backend Architecture

This directory contains the backend source code of the e-commerce application built with **Java** and **Spring Boot**.

---

## 🏛️ Project Structure

```text
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── eticaret/
│   │   │           └── backend/
│   │   │               ├── config/
│   │   │               ├── common/
│   │   │               ├── exception/
│   │   │               ├── security/
│   │   │               └── modules/
│   │   │                   ├── auth/
│   │   │                   ├── user/
│   │   │                   ├── category/
│   │   │                   ├── product/
│   │   │                   ├── cart/
│   │   │                   ├── order/
│   │   │                   ├── wishlist/
│   │   │                   └── review/
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/
│   └── test/
│
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

---

## 🚀 Backend Technologies

The backend is developed using the following technologies:

- Java 21
- Spring Boot 4.0.7
- Spring Web
- Spring Data JPA
- Spring Security
- Jakarta Validation
- PostgreSQL
- Lombok
- Maven
- Git & GitHub

---

## 📦 Backend Modules

The application is divided into feature-based modules:

- Authentication
- User Management
- Category Management
- Product Management
- Shopping Cart
- Order & Checkout
- Wishlist
- Review

---

## 🗄️ Database

The application uses **PostgreSQL** as its relational database.

Main entities include:

- Users
- Categories
- Products
- Cart
- Orders
- Wishlist
- Reviews

Entity relationships and database design will be documented as the project progresses.

---

## 📌 Notes

- The project follows a modular architecture.
- Spring Security and JWT will be used for authentication and authorization.
- RESTful API principles will be followed.
- Backend and frontend are developed independently and integrated through REST APIs.
