import { serve } from "inngest/next";
import { inngest, syncUserCreation, syncUserUpdation,syncUserDeletion} from "@/config/inngest.js";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion
  ],
});
