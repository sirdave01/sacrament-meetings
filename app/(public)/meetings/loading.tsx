// Reuse the detail skeleton as the meetings route's loading fallback.
import MeetingDetailSkeleton from "@/components/MeetingDetailSkeleton";

// Next renders this component while a nested meeting route is loading.
export default function Loading() {
	// Keep the loading shape consistent with the eventual detail page.
	return <MeetingDetailSkeleton />;
}
