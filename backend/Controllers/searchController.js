import { ObjectId } from "mongodb";
import { getDb } from "../ConnectDB/connectToDb.js";
const searchByUsername = async (req, res) => {
  try {
    const db = getDb();
    const { username, lastFetchedId } = req.body;
    if (!lastFetchedId) lastFetchedId = 0;
    lastFetchedId = ObjectId(lastFetchedId);
    if (!username || username.length == 0)
      return res.status(400).json({ status: false, error: "Invalid username" });
    const pipeline = [
      {
        $match: {
          username: {
            $regex: "^" + username,
            $options: "i",
          },
          _id: { $gt: lastFetchedId },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      { $limit: 12 },
      {
        $project: {
          username: 1,
          name:1,
          profilepicture: 1,
        },
      },
    ];
    const getUsers = await db.collection("Users").aggregate(pipeline).toArray();
    return res.status(200).json({ status: true, data: getUsers });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, error: "Internal Server Error" });
  }
};
const atlasSearchByUsername = async (req, res) => {
  try {
    let reqQuery = req?.query;
    const query=reqQuery?.query || "";
    const page=reqQuery?.page || 0;
    if (query.length > 100 || query.length==0) {
      return res.status(400).json({ status: false, error: "Invalid Search Parameters" });
    }
    const db = getDb();
    const pipeline = [
      {
        $search: {
          index: "default",
          compound: {
            should: [
              // Full-text search (exact or near exact)
              {
                text: {
                  query: query,
                  path: "username",
                  score: { boost: { value: 3 } }
                }
              },
              // Autocomplete with fuzzy matching for partial matches and typos
              {
                autocomplete: {
                  query: query,
                  path: "username",
                  fuzzy: {
                    maxEdits: 2,
                    prefixLength: 1
                  },
                  score: { boost: { value: 2 } }
                }
              },
              // Fuzzy matching using text (if needed)
              {
                text: {
                  query: query,
                  path: "username",
                  fuzzy: { maxEdits: 2 },
                  score: { boost: { value: 1 } }
                }
              }
            ],
            minimumShouldMatch: 1
          }
        }
      },
      {$skip:page*10},
      { $limit: 10 },
      {
        $project: {
          _id: 1,
          username: 1,
          profilepicture:1,
          name:1,
          score: { $meta: "searchScore" }
        }
      }
    ];

    const results = await db.collection("Users").aggregate(pipeline).toArray();
    return res.status(200).json({
      status: true,
      data: results,
      message: "Fetched Results Successfully"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, error: "Oops, an error occurred" });
  }
};


export { searchByUsername ,atlasSearchByUsername};
