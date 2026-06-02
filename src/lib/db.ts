import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DB_PATH, "users.json");

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(DB_PATH, { recursive: true });
  }
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  barCouncilId?: string;
  phone?: string;
  city?: string;
  language: string;
  createdAt: string;
}

function readUsers(): UserRecord[] {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(data);
}

function writeUsers(users: UserRecord[]) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export const db = {
  users: {
    findByEmail(email: string): UserRecord | undefined {
      return readUsers().find((u) => u.email === email);
    },
    findById(id: string): UserRecord | undefined {
      return readUsers().find((u) => u.id === id);
    },
    create(data: Omit<UserRecord, "id" | "createdAt">): UserRecord {
      const users = readUsers();
      const user: UserRecord = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      writeUsers(users);
      return user;
    },
    update(id: string, data: Partial<Omit<UserRecord, "id" | "createdAt" | "passwordHash" | "email">>): UserRecord | undefined {
      const users = readUsers();
      const idx = users.findIndex((u) => u.id === id);
      if (idx === -1) return undefined;
      users[idx] = { ...users[idx], ...data };
      writeUsers(users);
      return users[idx];
    },
  },
};
