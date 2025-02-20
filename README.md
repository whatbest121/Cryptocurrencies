# Cryptocurrencies

## Prerequisites

## Built With

- [Bun](https://bun.sh) - JavaScript runtime & package manager
- [Elysia.js](https://elysiajs.com) - Web framework
- [MongoDB](https://www.mongodb.com) - Database

## Installation & Running
## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
MONGO_URI=mongodb://localhost:27017/mydb
```

1. Install Bun: curl -fsSL https://bun.sh/install | bash

2. Clone the project:
```
git clone https://github.com/whatbest121/cryptocurrencies.git
```

3. Install dependencies:
```
bun install
```

4. Run the project:
```
bun dev
```

## API Documentation

The API documentation is available at:

- [Swagger](http://localhost:3000/swagger)


# API Authentication Guide

## Authentication Flow

### 1. Login Process
When users successfully log in, the system will return a JWT (JSON Web Token) that contains user information.

### 2. Using Protected Routes
All routes under `/user` are protected and require authentication:
- `/user/order`
- `/user/pay`
- `/user/exchange`

### 3. How to Send Requests
For all protected API endpoints, you need to include the JWT token in the request headers:

```
Authorization: Bearer <JWT_TOKEN>
```


