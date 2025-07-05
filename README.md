# BookShop Application

A full-stack web application for managing an online bookshop, built with Spring Boot (backend) and React (frontend).

## 🏗️ Architecture

- **Backend**: Spring Boot 3.5.0 with JPA/Hibernate
- **Frontend**: React with Tailwind CSS
- **Database**: MySQL 9.3.0
- **Containerization**: Docker Compose for database

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- **Java 17 or higher** (for Spring Boot)
- **Node.js 16+ and npm** (for React frontend)
- **Docker and Docker Compose** (for MySQL database)
- **Git** (to clone the repository)

## 🚀 Getting Started

Follow these steps to run the complete application:

### 1. Start the MySQL Database

First, start the MySQL database using Docker Compose:

```bash
# Navigate to the project root directory
cd ucdcomp47910-bookshop-sec-review

# Start MySQL database in the background
docker-compose up -d mysql
```

**Verify MySQL is running:**

```bash
# Check container status
docker-compose ps

# Check MySQL logs (optional)
docker logs bookshop-mysql
```

The database will be initialized with sample data from `scripts/bookshopdb_10567499.sql` including:

- Sample books (Les Misérables, To Kill a Mockingbird, etc.)
- Default users:
  - **Admin**: username `admin`, password `111adminpowershopefullywork111`
  - **Customer**: username `jlaz`, password `0000`

### 2. Start the Spring Boot Backend

Open a new terminal and start the backend server:

```bash
# Navigate to the project root directory
cd ucdcomp47910-bookshop-sec-review

# Make the Maven wrapper executable (if needed)
chmod +x mvnw

# Start the Spring Boot application
./mvnw spring-boot:run
```

**Alternative method using Maven (if installed globally):**

```bash
mvn spring-boot:run
```

The backend will start on <http://localhost:8080>

**Verify backend is running:**

- Look for the message: `Started BookShopApplication in X.XXX seconds`
- The application will automatically create database tables if they don't exist

### 3. Start the React Frontend

Open another terminal and start the frontend development server:

```bash
# Navigate to the frontend directory
cd ucdcomp47910-bookshop-sec-review/frontend/bookshop-frontend

# Install dependencies (first time only)
npm install

# Start the React development server
npm start
```

The frontend will automatically open in your browser at <http://localhost:3000>

## 🌐 Application URLs

Once all services are running:

- **Frontend (React)**: <http://localhost:3000>
- **Backend API (Spring Boot)**: <http://localhost:8080>
- **MySQL Database**: localhost:3306

## 📊 Database Configuration

The application uses the following database configuration:

- **Host**: localhost
- **Port**: 3306
- **Database**: bookshopdb
- **Username**: bookshop
- **Password**: BookShop456!

These settings are configured in:

- `src/main/resources/application.properties` (Spring Boot)
- `docker-compose.yml` (MySQL container)

## 🔧 Development Features

### Backend Features

- REST API endpoints for books, users, and cart management
- JPA/Hibernate for database operations
- Spring Boot DevTools for hot reloading
- MySQL database integration

### Frontend Features

- React with modern hooks
- Tailwind CSS for styling
- Hot reloading for development
- Responsive design

## 🛠️ Troubleshooting

### Common Issues

#### 1. MySQL Container Fails to Start

```bash
# Stop and remove containers with volumes
docker-compose down -v

# Start fresh
docker-compose up -d mysql
```

#### 2. Spring Boot Connection Issues

- Ensure MySQL container is running: `docker-compose ps`
- Check if port 3306 is available: `lsof -i :3306`
- Verify database credentials in `application.properties`

#### 3. Frontend Build Issues

```bash
# Clear npm cache and reinstall
cd frontend/bookshop-frontend
rm -rf node_modules package-lock.json
npm install
```

#### 4. Port Already in Use

- Backend (8080): Change `server.port` in `application.properties`
- Frontend (3000): Use `PORT=3001 npm start` to use a different port

### Logs and Debugging

**View application logs:**

```bash
# Spring Boot logs (in the terminal where you ran mvnw)
# Look for startup messages and any error traces

# MySQL logs
docker logs bookshop-mysql

# Frontend logs (in the browser console and terminal)
```

## 📁 Project Structure

```text
ucdcomp47910-bookshop-sec-review/
├── src/main/java/com/example/bookshop/    # Spring Boot source code
│   ├── controller/                        # REST controllers
│   ├── model/                            # Entity classes
│   └── repository/                       # Data access layer
├── src/main/resources/                   # Application configuration
├── frontend/bookshop-frontend/           # React frontend
│   ├── src/                             # React source code
│   └── public/                          # Static assets
├── scripts/                             # Database initialization
├── docker-compose.yml                  # Docker services configuration
├── pom.xml                             # Maven dependencies
└── README.md                           # This file
```

## 🔒 Default Login Credentials

For testing the application:

**Administrator Account:**

- Username: `admin`
- Password: `111adminpowershopefullywork111`
- Role: ADMIN

**Customer Account:**

- Username: `jlaz`
- Password: `0000`
- Role: CUSTOMER

## 🛑 Stopping the Application

To stop all services:

```bash
# Stop Spring Boot (Ctrl+C in the terminal)
# Stop React frontend (Ctrl+C in the terminal)

# Stop and remove Docker containers
docker-compose down

# Stop and remove containers with volumes (clears database)
docker-compose down -v
```

## 📝 Notes

- The application uses Spring Boot DevTools, so backend changes will automatically reload
- The React frontend has hot reloading enabled for development
- Database schema is automatically created by Hibernate on first run
- Sample data is loaded from the SQL script in the `scripts/` directory

## 🤝 Contributing

1. Ensure all services are running correctly
2. Make your changes
3. Test the application thoroughly
4. Submit your changes

---

Happy coding! 🚀
