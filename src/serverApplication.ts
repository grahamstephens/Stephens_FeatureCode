import { attachControllers } from '@decorators/express';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import { connect } from 'mongoose';
import passport from 'passport';
import { AuthController } from './controller/auth.controller';
import { createServer, Server as HTTPServer } from 'http';
import {
    ClientToServerEvents,
    ServerToClientEvents,
    QueueRequestData,
    SocketData,
    Message,
} from './models/events.model';
import { Server as SocketServer } from 'socket.io';
import { findIndexByName, findRoom } from './helpers/socketHelper';

/**
 * Keeps track of application lifecycle and maintains a testable server context.
 *
 * Not all fields or methods should be exposed as the application context. If a field is not marked as `private`, document the reason.
 */
export class ServerApplication {
    private readonly applicationServerContext: HTTPServer;

    private readonly port: string;

    constructor() {
        // Load environment variables
        dotenv.config({ path: `${__dirname}/../config/.env` });
        this.port = process.env.SERVER_PORT;

        const expressApp: Express = this.serverInit((app: Express) => {
            // Bind controllers to application
            attachControllers(app, [AuthController]);
        });

        this.applicationServerContext = createServer(expressApp);

        this.socketServerInit(this.applicationServerContext);

        this.applicationServerContext.listen(this.port, async () => {
            // tslint:disable-next-line:no-console
            console.log(`started server at http://localhost:${this.port}`);
        });
    }

    /**
     * Not private since tests will be required to confiugre their own instance of a @type {serverApplication}
     * @param configure optional callback containing additional expressJs configuration
     * @returns expressJs context
     */
    serverInit(configure: (express: Express) => void): Express {
        const app: Express = express();
        app.use(cors());
        app.use(express.json());

        // User defined configuration
        configure(app);

        // Connect to the database
        connect(process.env.MONGODB_URI);

        this.initPassportSession(app);

        return app;
    }

    /**
     * Initializes socket server with specified routes and route handlers
     * @param httpServer HTTP server where socket server will be attached
     * @returns Socket Server
     */
    private socketServerInit(httpServer: HTTPServer): SocketServer {
        const FRONTEND_URL = process.env.FRONTEND_URL;

        const io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(
            httpServer,
            {
                cors: { origin: FRONTEND_URL },
            }
        );

        const availableListeners: SocketData[] = [];
        const availableVenters: SocketData[] = [];

        // Setup and configure socket routes and events
        io.on('connection', (socket) => {
            socket.on('joinQueue', (data: QueueRequestData) => {
                // Create an entry in the queue using socket and data information
                // Entries will be unique only if name is username in the database
                const newEntry: SocketData = {
                    name: data.name,
                    room: socket.id,
                };

                // Check if I am a listener or venter
                if (data.profile === 'venter') {
                    // Check if there is available listener
                    if (availableListeners.length > 0) {
                        // Matches with first available listener if available

                        const matchedEntry: SocketData =
                            availableListeners.shift();

                        const currentRoom = findRoom(socket);
                        socket.leave(currentRoom);
                        socket.join(matchedEntry.room);

                        io.to(matchedEntry.room).emit('match', {
                            sender: 'SERVER',
                            message: `Matched ${matchedEntry.name} and ${newEntry.name}`,
                        });
                    } else {
                        // Adds user to queue if no available listener

                        // Check if user is already in queue
                        const idx = findIndexByName(
                            newEntry.name,
                            availableVenters
                        );
                        if (idx === -1) {
                            availableVenters.push(newEntry);
                            socket.emit('join', {
                                sender: 'SERVER',
                                message: 'Successfully joined queue',
                            });
                        } else {
                            socket.emit('error', {
                                sender: 'SERVER',
                                message: 'Already in queue',
                            });
                        }
                    }
                } else if (data.profile === 'listener') {
                    // Check if there is available venter
                    if (availableVenters.length > 0) {
                        // Matches with first available venter if available

                        const matchedEntry: SocketData =
                            availableVenters.shift();

                        const currentRoom = findRoom(socket);
                        socket.leave(currentRoom);
                        socket.join(matchedEntry.room);

                        io.to(matchedEntry.room).emit('match', {
                            sender: 'SERVER',
                            message: `Matched ${matchedEntry.name} and ${newEntry.name}`,
                        });
                    } else {
                        // Adds user to queue if no available venter

                        // Check if user is already in queue
                        const idx = findIndexByName(
                            newEntry.name,
                            availableListeners
                        );
                        if (idx === -1) {
                            availableListeners.push(newEntry);
                            socket.emit('join', {
                                sender: 'SERVER',
                                message: 'Successfully joined queue',
                            });
                        } else {
                            socket.emit('error', {
                                sender: 'SERVER',
                                message: 'Already in queue',
                            });
                        }
                    }
                } else {
                    socket.emit('error', {
                        sender: 'SERVER',
                        message: 'Invalid Profile Type',
                    });
                    return;
                }
            });

            socket.on('leaveQueue', (data: QueueRequestData) => {
                if (data.profile === 'venter') {
                    const idx = findIndexByName(data.name, availableVenters);
                    if (idx !== -1) {
                        availableVenters.splice(idx, 1);
                        socket.emit('leave', {
                            sender: 'SERVER',
                            message: 'Successfully left queue',
                        });
                        return;
                    }
                } else if (data.profile === 'listener') {
                    const idx = findIndexByName(data.name, availableListeners);
                    if (idx !== -1) {
                        availableListeners.splice(idx, 1);
                        socket.emit('leave', {
                            sender: 'SERVER',
                            message: 'Successfully left queue',
                        });
                        return;
                    }
                } else {
                    socket.emit('error', {
                        sender: 'SERVER',
                        message: 'Invalid Profile Type',
                    });
                    return;
                }

                socket.emit('error', {
                    sender: 'SERVER',
                    message: 'Unable to find entry in queue',
                });
            });

            socket.on('message', (data: Message) => {
                const currentRoom = findRoom(socket);
                io.to(currentRoom).emit('message', {
                    sender: data.sender,
                    message: data.message,
                });
            });
        });

        return io;
    }

    private initPassportSession(app: Express) {
        // Configure passport for authetnciation
        app.use(passport.initialize());
    }
}
