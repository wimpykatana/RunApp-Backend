import { adminDb } from "@/firebaseAdmin";
import { verifyIdToken } from "@/utils/verifyToken";

const getUserByUidField = async (userUid: string) => {
  console.log("---------------------------------");
  try {
    if (!userUid || userUid.trim() === "") {
      console.log("Invalid UID provided");
      return null;
    }

    console.log("getting user by userid", userUid);

   // Query where 'uid' is a field in the document
   const querySnapshot = await adminDb.collection("users")
   .where("userUid", "==", userUid)
   .limit(1)
   .get();

    if (querySnapshot.empty) {
      console.log(`No user found with userid field: ${userUid}`);
      return null;
    } 

    // Return the first matching document
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id, // This gets the document ID
      ...doc.data() // This gets all the fields in the document
    };

  } catch (error) {
    console.error("Error getting user by userid", error);
    return null;
  }

};

export async function GET(request: Request) {

  try {
    // Get the authorization token from the request headers
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];

    // If no token is provided, return unauthorized
    if (!token) {
      return new Response(
        JSON.stringify({ message: "Authentication required", isError: true }),
        {
          headers: { "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    // Verify the token
    const decodedToken = await verifyIdToken(token);

    if(!decodedToken) {
      return new Response(
        JSON.stringify({ message: "Invalid token", isError: true }),
        {
          headers: { "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    const {searchParams} = new URL(request.url);
    const useruid = searchParams.get('useruid');
    console.log("Searching for user with userid:", useruid);

  if (!useruid) {
    return new Response(
      JSON.stringify({ message: "required userid", isError: true }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    );
  }

  const user = await getUserByUidField(useruid);

  if (!user) {
    return new Response(
      JSON.stringify({ isFirstUser: true, isError: true }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
  
  return new Response(
    JSON.stringify({ 
      isFirstUser: false, 
      isError: false 
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  }catch (error) {
    return new Response(
      JSON.stringify({ message: "Error getting users", error: (error as Error).message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
    
  }

  
}