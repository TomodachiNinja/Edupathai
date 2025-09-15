import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68c7d883f06cf31d79a9f9af", 
  requiresAuth: true // Ensure authentication is required for all operations
});
