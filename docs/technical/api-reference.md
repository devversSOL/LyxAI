# API Reference

This document provides a comprehensive reference for the core API endpoints.

## Authentication

All API requests require authentication via an API key. You can obtain an API key from the [developer portal](link-to-developer-portal).

Include your API key in the `X-API-Key` header of each request.

Example:

\`\`\`
X-API-Key: YOUR_API_KEY
\`\`\`

## Core API Endpoints

### Data Retrieval

#### Get Data by ID

Retrieves data for a specific item based on its unique ID.

**Endpoint:** `GET /data/{id}`

**Parameters:**

*   `id` (required): The unique identifier of the data item.

**Request Example:**

\`\`\`
GET /data/12345
X-API-Key: YOUR_API_KEY
\`\`\`

**Response Example:**

\`\`\`json
{
  "id": "12345",
  "name": "Example Data",
  "value": 42
}
\`\`\`

#### List Data

Retrieves a list of data items, with optional filtering and pagination.

**Endpoint:** `GET /data`

**Parameters:**

*   `limit` (optional): The maximum number of items to return per page (default: 100).
*   `offset` (optional): The starting index for the returned items (default: 0).
*   `filter` (optional): A filter to apply to the data (e.g., `name=Example`).

**Request Example:**

\`\`\`
GET /data?limit=50&offset=10
X-API-Key: YOUR_API_KEY
\`\`\`

**Response Example:**

\`\`\`json
{
  "items": [
    {
      "id": "12346",
      "name": "Example Data 1",
      "value": 43
    },
    {
      "id": "12347",
      "name": "Example Data 2",
      "value": 44
    }
  ],
  "total": 200
}
\`\`\`

### Data Modification

#### Create Data

Creates a new data item.

**Endpoint:** `POST /data`

**Request Body:**

\`\`\`json
{
  "name": "New Data",
  "value": 100
}
\`\`\`

**Request Example:**

\`\`\`
POST /data
Content-Type: application/json
X-API-Key: YOUR_API_KEY

{
  "name": "New Data",
  "value": 100
}
\`\`\`

**Response Example:**

\`\`\`json
{
  "id": "56789",
  "name": "New Data",
  "value": 100
}
\`\`\`

#### Update Data

Updates an existing data item.

**Endpoint:** `PUT /data/{id}`

**Parameters:**

*   `id` (required): The unique identifier of the data item to update.

**Request Body:**

\`\`\`json
{
  "value": 200
}
\`\`\`

**Request Example:**

\`\`\`
PUT /data/56789
Content-Type: application/json
X-API-Key: YOUR_API_KEY

{
  "value": 200
}
\`\`\`

**Response Example:**

\`\`\`json
{
  "id": "56789",
  "name": "New Data",
  "value": 200
}
\`\`\`

#### Delete Data

Deletes a data item.

**Endpoint:** `DELETE /data/{id}`

**Parameters:**

*   `id` (required): The unique identifier of the data item to delete.

**Request Example:**

\`\`\`
DELETE /data/56789
X-API-Key: YOUR_API_KEY
\`\`\`

**Response Example:**

\`\`\`json
{
  "status": "success",
  "message": "Data item deleted."
}
\`\`\`

## Error Handling

The API returns standard HTTP status codes to indicate the success or failure of a request.

*   `200 OK`: The request was successful.
*   `201 Created`: The request was successful and a new resource was created.
*   `204 No Content`: The request was successful, but there is no content to return.
*   `400 Bad Request`: The request was invalid (e.g., missing required parameters).
*   `401 Unauthorized`: The API key is missing or invalid.
*   `403 Forbidden`: The API key does not have permission to access the requested resource.
*   `404 Not Found`: The requested resource was not found.
*   `500 Internal Server Error`: An unexpected error occurred on the server.

Error responses will typically include a JSON body with more details about the error.

Example:

\`\`\`json
{
  "error": "Invalid request",
  "message": "The 'name' parameter is required."
}
