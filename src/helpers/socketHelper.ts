import { Socket } from 'socket.io';
import { SocketData } from '../models/events.model';

export function findIndexByName(name: string, availableEntries: SocketData[]): number {
    for(let i = 0; i < availableEntries.length; i++){
        if(availableEntries[i].name === name){
            return i;
        }
    }
    return -1;
}

// Finds room of given socket
export function findRoom(socket: Socket): string {
    for(const room of socket.rooms){
        if(socket.rooms.has(room)){
            return room;
        }
    }
}