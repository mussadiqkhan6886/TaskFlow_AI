interface logInDataType {
    username: string
    password: string
}

interface UserType {
    _id: string
    username: string
    password?: string
    email: string
    status: "Active" | "InActive"
    role: "Employee" | "Manager" | "Admin",
    createdAt: string
}

interface updateUserData {
    id: string
    username?: string
    password?: string
    email?: string
    status?: "Active" | "InActive",
    role?: "Employee" | "Admin" | "Manager"
}

interface updateNoteData {
    id: string
    noteFor?: string
    title?: string
    description?: string
    priority?: "High" | "Medium" | "Low"
    status?: "Completed" | "Working" | "Pending"
}
interface NoteType {
    _id: string
    noteFor: string
    title: string
    description: string
    priority: "High" | "Medium" | "Low"
    status: "Completed" | "Working" | "Pending"
    createdAt: string
}
interface UsersIdType{
    _id: string
    username: string
}
type Message = {
    _id: string;
    message: string;
    room: "user-room" | "staff-room";

    senderId:
        | string
        | {
            _id: string;
            username: string;
            role: string;
        };

    sender?: {
        id: string;
        username: string;
        role: string;
    };

    readBy: {
        readerId:
            | string
            | {
                _id: string;
                username: string;
            };
        readAt: string;
    }[];

    createdAt: string
};
import type { LucideIcon } from "lucide-react";

export interface EngineeringArea {
  id: string;
  title: string;
  path: string; // repo-style path shown as a mono label, e.g. "src/middleware/auth.ts"
  icon: LucideIcon;
  points: string[];
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface WorkflowStep {
  id: string;
  title: string;
  detail: string;
  icon: LucideIcon;
}

export interface TechItem {
  name: string;
  role: string;
}

export interface TechGroup {
  id: string;
  label: string;
  items: TechItem[];
}

export interface JourneyPoint {
  id: string;
  label: string;
}