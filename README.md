# A simple backend for a to-do list

Built using Typescript, Express, Sequelize with Postgres

#### Installation

0. Spin up an Ubuntu EC2 instance with ports 3000 and 22 open and install Docker on it (https://docs.docker.com/engine/install/ubuntu/)
1. Make sure you have a postgres container running:
   `docker run --name postgres -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:alpine`
2. Clone this repo and build the Docker image for this project:
   `docker build -t todo .`
3. Run the newly built image:
   `docker run -d --net host --env DB_USERNAME=postgres --env DB_PASSWORD=postgres --env DB_NAME=todo todo`

#### Supported Endpoints and HTTP Verbs

Note: The default username and password for this endpoint is admin:NotSoSecurePassword

1. `/todo`:
   - `GET /`: Returns all todo items
   - `GET /:id`: Returns item for an ID
   - `POST /`: Creates a new todo item. Body should include:
     `{"title": "Buy stuff"}`
   - `PATCH /:id`: Updates a todo item. Body should include:
     `{"title": "Buy stuff"}`
   - `DELETE /:id`: Deletes a todo item.

#### Testing

Run `npm install` and `npm run test` to run tests
