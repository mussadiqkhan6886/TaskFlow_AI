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
interface Message {
    _id:string;
    message:string;
    room:string;
    senderId:string;
    sender:{
        username:string;
        role:string;
    };

};