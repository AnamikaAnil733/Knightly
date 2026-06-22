import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const SOCKET_URL = new URL(BASE_URL).origin;

export const socket = io(SOCKET_URL);
