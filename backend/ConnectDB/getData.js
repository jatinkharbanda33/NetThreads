import { getDb } from "./connectToDb.js";

const Users = async () => {
  const db = await getDb();
  const users = db.collection("Users");
  return users;
};

const Posts = async () => {
  const db = await getDb();
  const posts = db.collection("Posts");
  return posts;
};
const Likes = async () => {
  const db = await getDb();
  const likes = db.collection("Likes");
  return likes;
};
const Replies=async ()=>{
  const db=await getDb();
  const replies=db.collection("Replies");
  return replies;
}
const PostsMIS=async()=>{
  const db=await getDb();
  const postMis=db.collection("PostsMis");
  return postMis;
}
export { Users, Posts,Likes,Replies,PostsMIS};