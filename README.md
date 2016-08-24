# real-time-db-monitor-using-MEAN
> Real time database updates monitor using MEAN stack

- ###Run npm install

- ###Create a mongoDb database with collections users and user_daemon. Refer to server/models for schema.

  Insert a test user in the collection `users` similar to 
  
    `db.users.insert({"username":"dummy-username","password":"dummy-password"})`
    
- ###Create another mongoDb database(you can host it on a different port than the previously created one) and start it as a replica set.

  For a database named `test`, follow the steps below 

    `mongo --replSet test`
  
  Then open a mongo shell instance by running 'mongo' in other terminal.
  
  It will connect you to Primary node of the replica set and prompt should be similar to test:PRIMARY>
  
  Under this propmt run 
  
    ```
    var config = {_id="test", members:[{ _id:0, host: "127.0.0.1:27170"}]}'
    rs.initiate(config)'
    ```
    
  Follow these

  https://docs.mongodb.com/manual/tutorial/convert-standalone-to-replica-set/
    
  https://docs.mongodb.com/manual/tutorial/deploy-replica-set-for-testing/

- ###Create a .env files and add the following

  ```
  MONGO_USER_URI= your-user-db-with-collections-'users'-and-'user_daemon'
  MONGO_REPL_URI= your-db-started-as-a-replica-set
  MONGO_OPLOG_URI=mongodb://your-url:port-on-which-replica-set-is-hosted/local
  PORT=3000
  ```
  
  *For the example above*
  
  ```
  MONGO_USER_URI=mongodb://127.0.0.1:27017/userDb
  MONGO_REPL_URI=mongodb://127.0.0.1:27017/test
  MONGO_OPLOG_URI=mongodb://127.0.0.1:27017/local
  PORT=3000
  ```
  
- ###Create some dummy collections with atleast one doccument inside in the replica set. [under `test` for the above example]

- ###Login `localhost:3000/` using the test user created in first step. 

- ###Under Settings tab subscribe to collections and its document fields.

- ###Swtich to Dashboard tab.

- ###Go to terminal run mongo instance and run some update/insert/delete queries on collection(s) subscribed earlier under settings.

- ###Real time updates will populated under Dashboard tab.


