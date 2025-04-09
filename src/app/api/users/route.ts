import { adminDb } from "@/firebaseAdmin";
import { verifyIdToken } from "@/utils/verifyToken" 

const getAllUsers = async () => {
  console.log("getting all users");
  const snapshot = await adminDb.collection("users").get();
  const users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return users;
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

    // If the token is valid, proceed with the request
    const users = await getAllUsers();

    // If no users are found, return a 404
    if (!users.length) {
      console.log("No users found");
      return new Response(
        JSON.stringify({ 
          message: "No users found", 
          isError: true 
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Return the users
    return new Response(
      JSON.stringify({ users, isError: false }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    
  
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error getting users", error: (error as Error).message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
 try {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split('Bearer ')[1];
  const body = await request.json();

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

  console.log("POST request received");
  console.log("Request body:", body);
  const { 
    firstName,
    lastName,
    email,
    userUid,
    gender,
    dateOfBirth,
    height,
    weight,
    fitnessLevel,
    runningGoal,
    createAt } = body;

    // Validate required fields
    if (!email || !userUid) {
      return new Response(
        JSON.stringify({ 
          message: "Missing required fields", 
          isError: true 
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Create a new user in Firestore
    const userRef = adminDb.collection("users").doc();
    await userRef.set({
      firstName,
      lastName,
      email,
      userUid,
      gender,
      dateOfBirth,
      height,
      weight,
      fitnessLevel,
      runningGoal,
      createAt,
    });

    return new Response(
      JSON.stringify({ 
        message: "User created successfully", 
        userId: userRef.id,
        isError: false 
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 201, // Created
      }
    );
  
 } catch (error) {
  console.error("Error processing POST request:", error);
  return new Response(
    JSON.stringify({ 
      message: "Failed to process request", 
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