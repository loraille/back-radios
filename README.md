# Back Radios API

This is the backend API for a radio streaming application. It allows you to manage a list of radio stations.

## Features

- Get all radio stations
- Create a new radio station
- Update an existing radio station
- Delete a radio station

## Technologies Used

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- [dotenv](https://www.npmjs.com/package/dotenv) for environment variables
- [cors](https://www.npmjs.com/package/cors) for handling Cross-Origin Resource Sharing
- [express-validator](https://express-validator.github.io/docs/) for request validation
- [multer](https://www.npmjs.com/package/multer) for handling form-data

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root of the project and add the following environment variables:
    ```
    MONGO_URI=<your-mongodb-connection-string>
    PORT=5000
    ```
4.  Start the server:
    `bash
npm start
`
    The server will be running on `http://localhost:5000`.

## API Endpoints

All endpoints are prefixed with `/api/radios`.

| Method   | Endpoint | Description                       |
| -------- | -------- | --------------------------------- |
| `GET`    | `/`      | Get all radio stations.           |
| `POST`   | `/`      | Create a new radio station.       |
| `PUT`    | `/:id`   | Update a radio station by its ID. |
| `DELETE` | `/:id`   | Delete a radio station by its ID. |

### `POST /`

Creates a new radio station.

**Request body:**

```json
{
  "name": "Radio Name",
  "stream_url": "http://example.com/stream",
  "image": "http://example.com/image.jpg",
  "genre": "Rock"
}
```

### `PUT /:id`

Updates an existing radio station.

**Request body:**

```json
{
  "name": "Updated Radio Name",
  "stream_url": "http://example.com/new-stream",
  "image": "http://example.com/new-image.jpg",
  "genre": "Pop"
}
```
