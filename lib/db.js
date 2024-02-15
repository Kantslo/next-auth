import { MongoClient } from "mongodb";

export const connectToDatabase = async () => {
  const client = MongoClient.connect(
    "mongodb+srv://gqancliani:rwP9noyufsCzsADB@next-app-cluster.ezrdsgt.mongodb.net/next-auth-demo"
  );

  return client;
};
