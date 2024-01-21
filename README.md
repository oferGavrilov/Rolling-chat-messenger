<h2 align="center">Rolling - Real-Time Chat Application</h2>


🚀 [Link For The live App](https://rolling-chat-messenger.vercel.app) 

Welcome to the Rolling Chat App repository! This project is a dynamic, real-time chat application designed to provide a seamless, intuitive, and engaging platform for online communication. Whether you're looking to chat with friends, collaborate with colleagues, or explore new connections, our app is tailored to facilitate effortless and enriching interactions.

With a focus on real-time messaging, Rolling Chat App caters to both personal and professional communication needs, offering a suite of features that enhance your experience. From individual chats to group collaborations, our platform ensures that every conversation is not just a message exchange, but a memorable connection.

<br>

<p align="center">
  <img src="https://res.cloudinary.com/dqkstk6dw/image/upload/v1692778381/mockup-large_mecd3s.png" width="85%" alt="Image" />
</p>

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Contact](#contact)


## Features

- **Real-Time Messaging**: Experience instant messaging with real-time text exchange.
- **Voice & Video Calls**: Make direct voice and video calls for a more personal touch.
- **Group Chats**: Collaborate effectively with group chat functionality.
- **File Sharing**: Share files and media seamlessly.
- **Secure Conversations**: Privacy-focused with end-to-end encryption.
- **Multi-Platform Support**: Accessible across various devices and platforms.

## Technologies

This project is built using a range of modern technologies and tools:

- **🧑‍💻 Programmming Language**: ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
- **Frontend**: ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black), ![Zustand](https://img.shields.io/badge/-Zustand-FF69B4?style=flat-square), ![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
- **Backend**: ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white), ![Express.js](https://img.shields.io/badge/-Express.js-black?style=flat-square&logo=express&logoColor=white&color=white&labelColor=black)
- **Database**: ![Mongoose](https://img.shields.io/badge/-Mongoose-880000?style=flat-square), ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
- **Real-Time Communication**: ![Socket.io](https://img.shields.io/badge/-Socket.io-135135?style=flat-square)
- **Testing**: ![Jest](https://img.shields.io/badge/-Jest-C21325?style=flat-square&logo=jest&logoColor=white)
- **Containerization**: ![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
- **API**: ![RESTful API](https://img.shields.io/badge/-RESTful_API-009688?style=flat-square)
- **Logging**: [![Winston](https://img.shields.io/badge/-Winston-303030?style=flat-square)](https://github.com/winstonjs/winston), [![Morgan](https://img.shields.io/badge/-Morgan-235235?style=flat-square)](https://github.com/expressjs/morgan)
- **Deployment**: ![Vercel](https://img.shields.io/badge/-Vercel-black?style=flat-square&logo=vercel&logoColor=white), [![Render](https://img.shields.io/badge/-Render-5A20CB?style=flat-square&logo=Render&logoColor=white)](https://render.com)

## Architecture
Rolling Chat App is crafted on a monolithic architecture with a strong and adaptable infrastructure, intentionally designed for an easy transition to microservices architecture as the app experiences growth and an increase in user traffic.

### Overview
The application is divided into two main components: the **Client** and the **Server**, each operating within its own Docker container for ease of deployment and scalability.

#### Client
The client side, built with React, offers a responsive and interactive user interface. It communicates with the server using RESTful APIs and Socket.io for real-time functionalities.

Key Features:
- Real-time messaging enabled by Socket.io
- Efficient state management using Zustand
- Responsive and modern UI design with TailwindCSS
- Seamless navigation and routing with React Router

#### Server

Node.js and Express.js form the backbone of the server, which handles API requests, manages user sessions, and enables real-time communication.

**Key Components:**
- **User Authentication and Authorization:** Robust mechanisms to secure user access and manage permissions.
- **Database Management:** MongoDB serves as the database, with Mongoose as the ORM for efficient data handling.
- **Real-Time Communication:** Socket.io is utilized for managing real-time messaging and event handling.
- **Mail Service:** Utilizes Nodemailer for email communications, interfacing with an SMTP server to send out mail notifications and updates, enhancing user engagement and app functionality.
- **Scheduled Tasks:** Node-cron is employed for scheduled tasks, especially for database maintenance operations like cleaning up and archiving old data, thereby ensuring optimal database performance.
- **Logging and Monitoring:** Winston and Morgan are integrated for detailed logging, which aids in effective monitoring and troubleshooting of the server operations.


**Data Flow:**

1. **User Authentication:** Secure login process with session management post-authentication.
2. **Real-Time Interactions:** Bidirectional communication channel for messaging, established and maintained through Socket.io.
3. **Data Persistence:** MongoDB effectively handles data storage, ensuring integrity and accessibility.
4. **Email Services:** Automated email notifications facilitated by Nodemailer, linked to an SMTP server.
5. **Scheduled Operations:** Regular database maintenance tasks scheduled using node-cron to optimize performance and resource utilization.
6. **Operational Monitoring:** Continuous logging of server activities for efficient monitoring and quick resolution of issues.

<br/><br/>

<p align="center" >
  <img src="https://res.cloudinary.com/dqkstk6dw/image/upload/v1705865825/wgpkdmpym4taq2gbzmd5.png" width="65%" alt="Image" />
</p>

<br/>

## Getting Started
These instructions will help you set up and run the Rolling Chat App on your local machine.

### Prerequisites
- Node.js
- npm (Node Package Manager)
- GIT

### Clone the Repository
```bash
git clone https://github.com/oferGavrilov/Rolling-chat-messenger.git
cd rolling-chat-messenger
```

### Setup and Run the Server
```bash
cd server
npm i && npm run dev
```

### Setup and Run the Client
```bash
cd client
npm i && npm run dev
```
### Start Rolling 🌊
Open Your browser and navigate to 'http://localhost:3000' to view the Rolling App

### Using Docker (Optional) 🐋
If you prefer to use Docker, ensure you have Docker installed on your system. Then, follow these steps:

#### Server:
Build the Docker image for the server:
```bash
docker build -t rolling-chat-server .
```
Run the Docker container:
```bash
docker run -p 5000:5000 rolling-chat-server
```

#### Client:
Build the Docker image for client:
```bash
docker build -t rolling-chat-client .
```
Run the Docker container:
```bash
docker run -p 3000:3000 rolling-chat-client
```



The documentation is under construction 👷🏗️ 🔨
