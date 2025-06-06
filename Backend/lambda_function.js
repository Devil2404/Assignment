import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  ScanCommand,
  PutCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB DocumentClient
const dynamoDBClient = new DynamoDBClient({ region: "eu-north-1" });
const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);
const TABLE_NAME = "ResidentsUser";

// Main Lambda handler
export async function handler(event) {
  let requestBody;

  try {
    requestBody =
      typeof event === "string" ? JSON.parse(event) : event;
    console.log("Request Body:", requestBody);
  } catch (e) {
    return errorResponse(400, "Invalid JSON format in request body.");
  }
  console.log("Parsed Request Body:", requestBody);

  const { operation, item } = requestBody || {};

  if (!operation) {
    return errorResponse(400, "Missing 'operation' field.");
  }

  try {
    if (operation === "get-all") {
      const result = await documentClient.send(
        new ScanCommand({ TableName: TABLE_NAME })
      );
      return successResponse(200, "Fetched all items.", result.Items);
    }

    if (operation === "store-it") {
      // Validation
      if (!item || typeof item !== "object") {
        return errorResponse(400, "Missing or invalid 'item' object.");
      }

      const requiredFields = [
        "id",
        "first_name",
        "last_name",
        "role",
        "profile_url",
      ];
      for (const field of requiredFields) {
        if (!item[field]) {
          return errorResponse(400, `Missing required field: ${field}`);
        }
      }

      // Check for duplicates based on rules
      const { Items = [] } = await documentClient.send(
        new ScanCommand({ TableName: TABLE_NAME })
      );

      const isDuplicate = Items.some((existing) =>
        existing.last_name === item.last_name &&
        existing.role === item.role &&
        existing.profile_url === item.profile_url &&
        (!item.linkedin_url || existing.linkedin_url === item.linkedin_url) &&
        (!item.twitter_url || existing.twitter_url === item.twitter_url)
      );

      if (isDuplicate) {
        return errorResponse(409, "Duplicate resident found. Not stored.");
      }

      // Store item
      await documentClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: item,
        })
      );

      return successResponse(201, "Resident stored successfully.", item);
    }

    return errorResponse(400, `Unknown operation: ${operation}`);
  } catch (err) {
    console.error("Internal error:", err);
    return errorResponse(500, "Internal server error: " + err.message);
  }
}

// Utility: success response
function successResponse(statusCode, message, data) {
  console.log("✅ Success:", message);
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({ statusCode, message, data }),
  };
}

// Utility: error response
function errorResponse(statusCode, message) {
  console.error("❌ Error:", message);
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({ statusCode, message, data: null }),
  };
}
