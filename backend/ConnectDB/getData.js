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
const Followers=async ()=>{
  const db=await getDb();
  const followers=db.collection("Followers");
  return followers;
}
const Following = async () => {
  const db = await getDb();
  const following = db.collection("Following");
  return following;
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
export { Users, Posts,Followers,Following,Likes,Replies,PostsMIS};