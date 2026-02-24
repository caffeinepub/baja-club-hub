import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface LockerDocument {
    id: string;
    title: string;
    file: ExternalBlob;
    tags: string;
    description: string;
    dateUploaded: string;
    author: Principal;
}
export interface Event {
    title: string;
    date: string;
    description: string;
    location?: string;
    images?: Array<ExternalBlob>;
}
export interface DriveLink {
    id: string;
    url: string;
    title: string;
    description: string;
    author: Principal;
    dateAdded: string;
}
export interface FeedbackEntry {
    id: bigint;
    submitter: Principal;
    message: string;
    timestamp: bigint;
    category: string;
}
export interface Achievement {
    title: string;
    date: string;
    description: string;
    images?: Array<ExternalBlob>;
}
export interface EquipmentItem {
    id: string;
    purchaseDate: string;
    name: string;
    description: string;
    addedBy: Principal;
    quantity: string;
    image: ExternalBlob;
    comments: string;
    unitPrice: string;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface LockerAccessRequest {
    status: RequestStatus;
    requester: Principal;
    decisionTimestamp?: bigint;
    name: string;
    requestTimestamp: bigint;
}
export interface LockerBill {
    id: string;
    title: string;
    date: string;
    author: Principal;
    image: ExternalBlob;
    comments: string;
    amount: string;
}
export interface Person {
    id: Principal;
    contactInfo: string;
    name: string;
    roleDescription: string;
    image: ExternalBlob;
}
export interface UserProfile {
    joinDate: string;
    name: string;
    email?: string;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum RequestStatus {
    pending = "pending",
    denied = "denied",
    approved = "approved"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAchievement(achievement: Achievement): Promise<void>;
    addBill(bill: LockerBill): Promise<boolean>;
    addDocument(doc: LockerDocument): Promise<boolean>;
    addDriveLink(link: DriveLink): Promise<boolean>;
    addEquipment(equipmentItem: EquipmentItem): Promise<boolean>;
    addEvent(event: Event): Promise<void>;
    addPerson(person: Person): Promise<void>;
    approveLockerAccessRequest(requester: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteBill(id: string): Promise<boolean>;
    deleteDocument(id: string): Promise<boolean>;
    deleteDriveLink(id: string): Promise<boolean>;
    deleteEquipment(id: string): Promise<boolean>;
    denyLockerAccessRequest(requester: Principal): Promise<void>;
    getAllAchievements(): Promise<Array<Achievement>>;
    getAllBills(): Promise<Array<LockerBill>>;
    getAllDocuments(): Promise<Array<LockerDocument>>;
    getAllDriveLinks(): Promise<Array<DriveLink>>;
    getAllEquipment(): Promise<Array<EquipmentItem>>;
    getAllEvents(): Promise<Array<Event>>;
    getAllFeedback(): Promise<Array<FeedbackEntry>>;
    getAllPeople(): Promise<Array<Person>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLockerAccessRequests(): Promise<Array<LockerAccessRequest>>;
    getMyLockerAccessStatus(): Promise<RequestStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    isLockerAccessGrantedQuery(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    removeAchievement(title: string): Promise<boolean>;
    removeEvent(title: string): Promise<boolean>;
    removePerson(principal: Principal): Promise<boolean>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    submitFeedback(category: string, message: string): Promise<void>;
    submitLockerAccessRequest(name: string): Promise<void>;
    updateAchievement(title: string, updatedAchievement: Achievement): Promise<boolean>;
    updateEvent(title: string, updatedEvent: Event): Promise<boolean>;
    updatePerson(principal: Principal, updatedPerson: Person): Promise<boolean>;
}
