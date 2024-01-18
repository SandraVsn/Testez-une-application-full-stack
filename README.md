# Test a Full-stack application

Yoga-app is an application where teachers can create a yoga session and clients can participate. 

## Installation and Execution

### Clone the repository to your local machine:
    ```bash
    git clone https://github.com/SandraVsn/Testez-une-application-full-stack
    ```

## Database

### Installation

1. Ensure Docker and Docker Compose are installed on your machine.
2. Create a .env file with the necessary variables for the successful launch of the database.
3. Launch the MySQL container with the following command in the project directory:
    ```bash
    docker-compose up --build
    ```

   This will start a MySQL container based on the configuration defined in the `docker-compose.yml`.

## Run Back-end Tests

1. Navigate to the project directory:
    ```bash
    cd back
    ```

2. Install dependencies:
    ```bash
    mvn clean install
    ```

3. Run tests :
    ```bash
    mvn test
    ```

You can find the coverage report in the following folder : back/target/site/jacoco/index.html

## Run Front-end Jest Tests

1. Navigate to the project directory:
    ```bash
    cd front
    ```

2. Install dependencies:
    ```bash
    npm i
    ```

3. Run tests :
    ```bash
    npm run test
    ```
3. Run tests coverage :
    ```bash
    npm run test:coverage
    ```

## Run Front-end e2e Cypress Tests

1. Navigate to the project directory:
    ```bash
    cd front
    ```

2. Install dependencies:
    ```bash
    npm i
    ```

3. Run tests :
    ```bash
    npm run e2e
    ```
3. Run tests coverage :
    ```bash
    npm run e2e:coverage
    ```

You can find the coverage report in the following folder : front/coverage/lcov-report/index.html

## Test technologies

- JUnit
- Mockito
- AssertJ
- Jest
- Cypress
