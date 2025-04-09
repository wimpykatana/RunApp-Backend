import { adminDb } from "@/firebaseAdmin";
import { verifyIdToken } from "@/utils/verifyToken";


/**
 * Get user by UID from Firestore
 */
const getUserByUID = async (uid: string) => {
  try {
    if (!uid || uid.trim() === "") {
      console.log("Invalid UID provided");
      return null;
    }

    console.log("Getting user by UID:", uid);
    
    // Query where 'userUid' is a field in the document
    const querySnapshot = await adminDb.collection("users")
      .where("userUid", "==", uid)
      .limit(1)
      .get();
      
    if (querySnapshot.empty) {
      console.log(`No user found with UID: ${uid}`);
      return null;
    }
    
    // Return the first matching document
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error("Error fetching user by UID:", error);
    return null;
  }
};

export async function GET(
    request: Request,
    //{ params }: { params: {uid: string} }
) {
    try {
        // Get the UID from the URL parameter
        //const { uid } = params;
        //console.log("Searching for user with uid:", uid);

        // Extract the UID from the URL path
        const url = new URL(request.url);
        const uid = url.pathname.split("/").pop(); // Extract the last part of the path
        
        // If no UID is provided, return a 400
        if (!uid) {
            return new Response(
                JSON.stringify({ message: "required uid", isError: true }),
                {
                    headers: { "Content-Type": "application/json" },
                    status: 400,
                }
            );
        }

        // Authenticate the request if needed
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.split('Bearer ')[1];

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

        const user = await getUserByUID(uid);

        if (!user) {
            console.log(`No user found with UID: ${uid}`);
            return new Response(
                JSON.stringify({ message: "User not found", isError: true }),
                {
                    headers: { "Content-Type": "application/json" },
                    status: 404,
                }
            );
        }

        return new Response(
            JSON.stringify({ message: "User found", user, isError: false }),
            {
                headers: { "Content-Type": "application/json" },
                status: 200,
            }
        );
        
    } catch (error) {
        console.error(`Error fetching user with this ID:`, error);
        return new Response(
        JSON.stringify({ 
            message: "Failed to retrieve user", 
            error: error instanceof Error ? error.message : "Unknown error",
            isError: true 
        }),
        {
            headers: { "Content-Type": "application/json" },
            status: 500,
        }
        );
    }
}