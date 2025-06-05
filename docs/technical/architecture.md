# Architecture Overview

This document provides a high-level overview of the system architecture. It outlines the key components, their responsibilities, and how they interact with each other.

## Core Components

The system is built around a microservices architecture, promoting modularity, scalability, and independent deployment. The core components include:

*   **User Service:** Manages user accounts, authentication, and authorization.
*   **Data Service:** Provides access to core data entities and handles data persistence.
*   **API Gateway:** Acts as a single entry point for all client requests, routing them to the appropriate microservices.
*   **Notification Service:** Handles sending notifications to users via various channels (e.g., email, push notifications).
*   **Analytics Service:** Collects and analyzes system usage data to provide insights and improve performance.
*   **Discord Integration Service:** Monitors Discord channels for whale activity and processes the messages.
*   **Whale Tracker Service:** Analyzes and displays whale transaction data in real-time.

## Data Storage

The system utilizes a combination of relational and NoSQL databases to optimize for different data access patterns.

*   **Relational Database (e.g., PostgreSQL):** Used for storing structured data, such as user accounts and transactional information.
*   **NoSQL Database (e.g., MongoDB):** Used for storing unstructured or semi-structured data, such as event logs and analytics data.
*   **Supabase:** A PostgreSQL-based backend-as-a-service that provides real-time database capabilities, authentication, and storage.

## Discord Integration

The Discord Integration Service connects to Discord channels to monitor and capture whale activity:

*   **Discord Bot:** A bot that listens to specific Discord channels for whale alert messages.
*   **Message Processing:** Parses Discord messages to extract transaction details.
*   **Data Storage:** Stores processed messages in the Supabase database.
*   **Real-time Updates:** Provides real-time updates to the Whale Tracker dashboard.

## Whale Tracker Dashboard

The Whale Tracker Dashboard provides a real-time view of whale activity:

*   **3D Rendering:** Uses React Three Fiber for rendering 3D glassmorphism water drops.
*   **Data Visualization:** Displays whale transactions in a structured table.
*   **Filtering:** Allows users to filter transactions by token.
*   **Analytics:** Calculates and displays metrics such as the most traded token in the last 2 hours.

## API Design

The system exposes a RESTful API for clients to interact with. The API follows a consistent design principles, including:

*   **Resource-based URLs:** Using nouns to represent resources (e.g., `/users`, `/data`).
*   **Standard HTTP methods:** Using GET, POST, PUT, DELETE for common operations.
*   **JSON format:** Using JSON for request and response bodies.

## Deployment

The system is deployed on a cloud platform (e.g., AWS, Azure, GCP) using containerization technology (e.g., Docker, Kubernetes). This allows for easy scaling, deployment, and management of the microservices.

## Architecture Diagram

\`\`\`mermaid
graph LR
    Client --> API_Gateway;
    API_Gateway --> User_Service;
    API_Gateway --> Data_Service;
    API_Gateway --> Notification_Service;
    API_Gateway --> Analytics_Service;
    API_Gateway --> Discord_Integration_Service;
    API_Gateway --> Whale_Tracker_Service;
    User_Service --> Relational_DB;
    Data_Service --> Relational_DB;
    Data_Service --> NoSQL_DB;
    Analytics_Service --> NoSQL_DB;
    Discord_Integration_Service --> Supabase;
    Whale_Tracker_Service --> Supabase;
    Discord_Bot --> Discord_Integration_Service;

    subgraph Core Services
    User_Service;
    Data_Service;
    Notification_Service;
    Analytics_Service;
    Discord_Integration_Service;
    Whale_Tracker_Service;
    end

    subgraph Databases
    Relational_DB[Relational Database];
    NoSQL_DB[NoSQL Database];
    Supabase[Supabase];
    end

    subgraph External
    Discord_Bot[Discord Bot];
    end

    style Client fill:#f9f,stroke:#333,stroke-width:2px
    style API_Gateway fill:#ccf,stroke:#333,stroke-width:2px
    style User_Service fill:#ccf,stroke:#333,stroke-width:2px
    style Data_Service fill:#ccf,stroke:#333,stroke-width:2px
    style Notification_Service fill:#ccf,stroke:#333,stroke-width:2px
    style Analytics_Service fill:#ccf,stroke:#333,stroke-width:2px
    style Discord_Integration_Service fill:#ccf,stroke:#333,stroke-width:2px
    style Whale_Tracker_Service fill:#ccf,stroke:#333,stroke-width:2px
    style Relational_DB fill:#ffc,stroke:#333,stroke-width:2px
    style NoSQL_DB fill:#ffc,stroke:#333,stroke-width:2px
    style Supabase fill:#ffc,stroke:#333,stroke-width:2px
    style Discord_Bot fill:#f9f,stroke:#333,stroke-width:2px
\`\`\`
\`\`\`

Finally, let's update the release notes:
