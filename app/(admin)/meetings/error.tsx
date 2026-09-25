"use client";

// Next requires route error boundaries to be client components.
// Reuse the same recovery UI as the public meetings route group.
import MeetingsError from "@/components/MeetingsError";

// Export the shared boundary as the admin meetings segment's error UI.
export default MeetingsError;