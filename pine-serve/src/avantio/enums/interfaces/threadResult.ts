interface metrics {
    time_min: number;
    time_max: number;
    avg_time: number;
}

export interface threadResult {
    threadId: string;
    channels: string[];
    bookings: string[];
    sentAt: string;
    metrics?: metrics;
}