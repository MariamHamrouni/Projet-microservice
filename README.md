# 📚 Library Management System - Microservices Architecture

This project is a scalable **Library Management System** built with a **microservices architecture** using **Node.js**, **gRPC**, **GraphQL**, and **Kafka**. It is designed to demonstrate modern service-oriented application design and inter-service communication using gRPC and event-driven patterns.

---

## 🚀 Features

- 🧩 Modular microservices:
  - **Authors Service** – Manage authors (add, search, get by ID)
  - **Books Service** – Manage books and link them to authors
  - **Orders Service** – Manage borrow/return operations
- 🔗 **gRPC** for efficient inter-service communication
- 📡 **GraphQL API Gateway** with Apollo Server
- 📬 **Kafka** messaging for asynchronous event handling (e.g., book borrowed)
- 🐳 **Dockerized** for easy local deployment

---

## 🗂️ Project Structure

📦 api-gateway → GraphQL Gateway (Apollo Server)
📦 authors-service → gRPC microservice for managing authors
📦 book-service → gRPC + REST microservice for managing books
📦 kafka-producer → Publishes events (e.g. book borrowed)
📦 kafka-consumer → Listens to events (e.g. logging or analytics)
📄 docker-compose.yml → Central orchestration for all services


## 🛠️ Technologies Used

- **Node.js**: Core server-side platform
- **gRPC**: Fast RPC communication between microservices
- **GraphQL**: Unified API layer for frontend
- **Kafka**: Event-driven communication (Producer/Consumer pattern)
- **Docker**: Containerization for all services


---

## ⚙️ Getting Started

📦 Example GraphQL Queries
➕ Add an Author
graphql
mutation {
  addAuthor(name: "Victor Hugo", bio: "French writer") {
    id
    name
    bio
  }
}
📚 Get All Books
graphql

query {
  books {
    id
    title
    author {
      name
    }
  }
}
📬 Kafka Events
Kafka is used for:

Broadcasting book borrow events

Decoupling services via async communication

You can run the producer/consumer with Node.js or Docker.

✅ Improvements to Consider
🧪 Unit and integration tests
🖼️ Admin dashboard UI
🛡️ Role-based authorization per service

👩‍💻 Author
Developed by Hamrouni Mariem
Student in Computer Engineering – Data Science & AI

📄 License
This project is licensed under the MIT License.
