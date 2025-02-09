# Blood Donation Application

## Table of Contents

1. [Introduction](#introduction)
2. [Live URL](#live-url)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [Models](#models)
6. [Endpoints](#endpoints)
7. [Error Handling](#error-handling)
8. [Setup](#setup)
9. [Usage](#usage)

## Introduction

The Blood Donation Application is a web-based platform designed to facilitate blood donation by connecting donors with
those in need. It allows users to register, request donations, and manage their profiles, enhancing the efficiency and
accessibility of blood donation processes.

## Live URL

[Visit Blood Donation Application](https://blood-donation-peach.vercel.app/)

## Features

- User Registration and Login
- Profile Management
- Blood Donation Requests
- Donor Search with Filtering and Pagination
- JWT-based Authentication
- Comprehensive Error Handling

## Technology Stack

- **Programming Language**: TypeScript
- **Web Framework**: Express.js
- **Object Relational Mapping (ORM)**: Prisma for PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)

## Models

### User Model

- `id` (String): A distinctive identifier for each user.
- `name` (String): The name of the user.
- `email` (String): The email address of the user.
- `password` (String): The hashed password of the user.
- `bloodGroup` (String): The type of blood a user has. Enum values: `A_POSITIVE`, `A_NEGATIVE`, `B_POSITIVE`,
  `B_NEGATIVE`, `AB_POSITIVE`, `AB_NEGATIVE`, `O_POSITIVE`, `O_NEGATIVE`.
- `location` (String): The location of the user.
- `availability` (Boolean): The status will be false by default.
- `createdAt` (DateTime): The timestamp indicating when the user was created.
- `updatedAt` (DateTime): The timestamp indicating when the user was last updated.

### Request Model

- `id` (String): A distinctive identifier for each request.
- `donorId` (String): Id of a user. The user id will be that of a donor.
- `requesterId` (String): Id of a user. The user id will be that of a requester.
- `phoneNumber` (String): The phone number of the requester.
- `dateOfDonation` (String): The date of donation.
- `hospitalName` (String): The name of the hospital.
- `hospitalAddress` (String): The address of the hospital.
- `reason` (String): The reason for donation.
- `requestStatus` (String): Enum values: `PENDING`, `APPROVED`, `REJECTED`. Default is `PENDING`.
- `createdAt` (DateTime): The timestamp indicating when the request was created.
- `updatedAt` (DateTime): The timestamp indicating when the request was last updated.

### profile Model

- `id` (String): A distinctive identifier for each user profile.
- `userId` (String): A reference to the user associated with the profile.
- `bio` (String): A brief bio or description of the user.
- `age` (Integer): The age of the user.
- `lastDonationDate` (String): The last date of donation.
- `createdAt` (DateTime): The timestamp indicating when the user profile was created.
- `updatedAt` (DateTime): The timestamp indicating when the user profile was last updated.

## Relations

### Request Model - Donor (User) Relation

- Each request is associated with one donor user.
- A donor can have multiple associated requests.

### Request Model - Requester (User) Relation

- Each request is associated with one requester user.
- A requester can have multiple associated requests.

### profile Model - User Relation

- Each user profile corresponds to one user.
- There is a one-to-one relationship between a user and their profile.

## Error Handling

Implement proper error handling throughout the application. Use global error handling middleware to catch and handle
errors, providing appropriate error responses with status codes and error messages.

### Sample Error Response

**For Validation Error (Zod):**

```json
{
  "success": false,
  "message": "Name field is required. Email must be a valid email address.",
  "errorDetails": {
    "issues": [
      {
        "field": "name",
        "message": "Name field is required."
      },
      {
        "field": "email",
        "message": "Email must be a valid email address."
      }
    ]
  }
}
```

## Endpoints

### 1. User Registration

```cmd
POST /api/register
```

Registers a new user along with creating a user profile.

### 2. User Login

```cmd
POST /api/login
```

Logs in a user and returns a JWT token.

### 3. Get Paginated and Filtered Users (Donors)

```cmd
GET /api/donor-list
```

Retrieves a list of donors with optional filtering and pagination.

### 4. Request A Donor For Blood

```cmd
 POST /api/donation-request
```

Creates a blood donation request.

### 5. Get My Donation Request as Donor

```cmd
GET /api/donation-request
```

Retrieves donation requests directed to the authenticated donor.

### 6. Update Request Application Status

```cmd
 PUT /api/donation-request/:requestId
```

Updates the status of a donation request.

### 7. Get My Profile http

```cmd
GET /api/my-profile
```

Retrieves the profile of the authenticated user.

### 8. Update My Profile

```cmd
PUT /api/my-profile
```

Updates the profile information of the authenticated user.

## Setup

### Prerequisites

- Node.js
- PostgreSQL

### Installation

#### 1. Clone the repository:

```cmd
 git clone https://github.com/yourusername/blood-donation-app.git
```

#### 2. Navigate to the project directory:

```cmd
 cd blood-donation-app
```

#### 3. Install dependencies:

```cmd
 npm install
```

#### 4. Set up the environment variables:

```cmd
 cp .env.example .env

```

Update the .env file with your configuration.

#### 5. Run database migrations:

```cmd
 npx prisma migrate dev
```

## Usage

Running the Application Start the development server:

```cmd
npm run dev
```

The application will be accessible at http://localhost:3000.

Testing the Endpoints Use tools like Postman or Insomnia to test the API endpoints.
