
// The events declared in the ServerToClientEvents interface are used when sending and broadcasting events
export interface ServerToClientEvents {
    join: (data: Message) => void;
    leave: (data: Message) => void;
    match: (data: Message) => void;
    message: (data: Message) => void;
    error: (data: Message) => void;
}

// The events declared in the ClientToServerEvents interface are used when receiving events
export interface ClientToServerEvents {
    joinQueue: (data: QueueRequestData) => void;
    leaveQueue: (data: QueueRequestData) => void;
    message: (data: Message) => void;
    disconnect: () => void;
}

// Interfaces for incoming and outgoing data
export interface QueueRequestData {
    name: string;
    profile: string;
    college: string;
    major: string;
    standing: string
}

export interface SocketData{
    name: string;
    room: string;
}

export interface Message {
    sender: string;
    message: string;
}