# Instruction
## Highlight - Game draw and guess

## Tool

- Docker 
- Postgres
- Pgadmin
- Redis

## Configuration

- Front End environment variables
```
VITE_REACT_API_URL=yourapiurl
VITE_REACT_SOCKET_URL=yoursocketurl
VITE_REACT_CLIENT_DEV_URL=yourlocalclienturl
VITE_REACT_CLIENT_PROD_URL=yourhostedclienturl
VITE_REACT_GOOGLE_CLIENT_ID=yourgoogleclientid
```
 - Back End environment variables
```
PORT=server_port
DATABASE_USERNAME=db_name
DATABASE_PASSWORD=db_pw
DATABASE_NAME=db_name
DATABASE_HOST=db_host
DATABASE_PORT=db_post
SOCKET_PORT=socket_port
REDIS_HOST=redis_host
REDIS_PORT=redis_port
TIME_EXPIRED_ONE_DAY=time_expired
JWT_ACCESSKEY=jwt_key
JWT_ACCESSKEY_EXPIRE=jwt_expire_time
JWT_REFRESHKEY=jwt_refresh_key
GOOGLE_CLIENT_ID=google_client_id
GOOGLE_CLIENT_SECRET=google_client_secret
```

## Installation

Dillinger requires [Node.js](https://nodejs.org/) v18+ to run.

Install the dependencies and devDependencies and start the server.

Clone project
```
git clone https://github.com/cvn-intern/Highlight-team2-project
```
### BackEnd
- Development

Requirement: 
File .production.env in backend folder
Run redis in port 6379 or any port (Note: config port to env file)
Run pgadmin and config port 5432 or any port (Note: config port to env file). 
Create database and copy the name of database to paste to env file.
```sh
cd backend
npm install
npm run start:dev
```

- Production 

Requirement: 
File .production.env in backend folder
Run redis in port 6379 or any port (Note: config port to env file)
Run pgadmin and config port 5432 or any port (Note: config port to env file). 
Create database and copy the name of database to paste to env file.

```
cd backend
npm install
npm run build
npm run start:prod
```
- Using docker

Requirement: 
File .docker.env in backend folder
```
cd backend
docker compose up -d
```

### FrontEnd
- Development

Requirement: 
File .env in frontend folder

```
cd frontend
npm install
npm run dev
```

- Production

Requirement: 
File .env.production.env in frontend folder

```
cd frontend
npm install
npm run build
cd dist
run index.html
```

