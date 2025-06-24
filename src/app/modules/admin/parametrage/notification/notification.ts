
export interface Notification {
    id: number;
    message: string;
    lu: boolean;
    dateEnvoi: string | null;
    dateModification:string | null;
    dateLu: string | null;
    typeNotification: string;
    utilisateur?: {
        id: number;
        nom: string;
    };
}

export interface NotificationStats {
    total: number
    unread: number
    read: number
    urgent: number
}


export interface NotificationFilter {
    search: string
    type: string | ""
    status: "all" | "read" | "unread" | "urgent"
}
