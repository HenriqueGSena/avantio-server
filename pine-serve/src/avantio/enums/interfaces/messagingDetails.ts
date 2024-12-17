export interface MessagingDetails {
    id: string;
    threadId: string;
    channel: string[];
    booking_Id: string;
    notified_count: string;
    send_count: string;
    total_messages: string;
    average_time: number;
    max_time: number;
    min_time: number;
    source: string;
    sync_status: string;
    created_at: Date;
}