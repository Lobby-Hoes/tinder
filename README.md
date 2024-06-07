# Lobbyhoe Matcher
🔥 Die Vernetzungs Plattform für erhabene Lobbyhoes!

---
## Build it yourself
### Requirements
- NodeJS 16+
- A MongoDB Database

### Initialising the Database
1. Create a new MongoDB User with read and write permissions for all databases
2. Navigate to the tinder/db directory
3. Connect to your MongoDB Database by using the mongo shell (mongosh) and setting the following environment variables:
    - `MONGO_USER`: The username of the MongoDB User
    - `MONGO_PASSWORD`: The password of the MongoDB User
    - `MONGO_HOST`: The host of the MongoDB Database
    - `MONGO_PORT`: The port of the MongoDB Database

    Your command should look something like this:
    ```shell
    MONGO_USER="username" MONGO_PASSWORD="password" MONGO_HOST="0.0.0.0" MONGO_PORT="27017" mongosh -u "username" -p "password" ...
    ```
4. Now that you are connected to your MongoDB Database, run the following command to initialise the collections:
    ```shell
    load("create-collections.js");
    ```
5. You can now exit the mongo shell by typing `.exit` and pressing enter

### Running the Backend
1. Navigate to the tinder directory
2. Install the required dependencies by running the following command:
    ```shell
    npm install
    ```
3. Set the following environment variables:
    - `MONGO_URI`: The Connection-String of your MongoDB Database
    - `PORT`: The Port the Backend should run on
    - `SALT`: The Salt used for hashing passwords. This should be a random generated string
4. Run the backend by using the following command:
    ```shell
    npm start
    ```