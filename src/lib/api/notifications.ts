import { apiRequest } from "./client";

export type NotificationType =
  | "new_recommendation"
  | "deadline_approaching"
  | "tender_updated"
  | "system";

export interface AppNotification {
  id: string;
  notification_type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown>;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface NotificationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AppNotification[];
}

export interface NotificationPreferences {
  email_enabled: boolean;
  whatsapp_enabled: boolean;
  notify_new_recommendation: boolean;
  notify_deadline_approaching: boolean;
  notify_tender_updated: boolean;
  updated_at: string;
}

// ── List ─────────────────────────────────────────────────────────────────────

export async function getNotifications(unreadOnly = false): Promise<NotificationListResponse> {
  const qs = unreadOnly ? "?unread_only=true" : "";
  return apiRequest<NotificationListResponse>(`/notifications/${qs}`);
}

// ── Unread badge count ────────────────────────────────────────────────────────

export async function getNotificationUnreadCount(): Promise<{ unread_count: number }> {
  return apiRequest<{ unread_count: number }>("/notifications/unread-count/");
}

// ── Mark single as read ───────────────────────────────────────────────────────

export async function markNotificationRead(id: string): Promise<void> {
  await apiRequest<{ detail: string }>(`/notifications/${id}/read/`, { method: "POST" });
}

// ── Mark all as read ─────────────────────────────────────────────────────────

export async function markAllNotificationsRead(): Promise<void> {
  await apiRequest<{ detail: string }>("/notifications/read-all/", { method: "POST" });
}

// ── Preferences ───────────────────────────────────────────────────────────────

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  return apiRequest<NotificationPreferences>("/notifications/preferences/");
}

export async function updateNotificationPreferences(
  data: Partial<NotificationPreferences>
): Promise<NotificationPreferences> {
  return apiRequest<NotificationPreferences>("/notifications/preferences/", {
    method: "PATCH",
    body: data,
  });
}
