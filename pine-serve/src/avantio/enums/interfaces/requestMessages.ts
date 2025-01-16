export interface BodyMessage {
    type: string;
    attachments: any[];
    channel: string;
    content: string;
    externalSourceData: any;
    isAutomatic: boolean;
    metadata: {
        bookingId: number;
    };
    sender: {
        id: string;
        type: string;
        name: string;
        notifiedAt: Date;
    };
    recipient: {
        id: string;
        type: string;
    };
    sentAt: string;
    source: string;
    contacts: any[];
}

export interface ApiResponse {
    data: BodyMessage[];
    _links: {
        prev: string;
        next: string;
    };
}
