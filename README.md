# real-time-db-monitor-MEAN
Real time database updates monitor

Run npm install

Create a mongoDb database with collections users and user_daemon. Refer to server/models for schema.

Create another mongoDb database and start it as a replica set. Follow this https://docs.mongodb.com/manual/tutorial/convert-standalone-to-replica-set/

Create .env files and add the following
  MONGO_USER_URI= your-user-db-with-collections-'users'-and-'user_daemon'
  MONGO_REPL_URI= your-db-started-as-a-replica-set
  MONGO_OPLOG_URI=mongodb://your-url:port/local
  PORT=3000

That's all.
