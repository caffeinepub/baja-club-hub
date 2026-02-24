import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";

module {
  public type Person = {
    id : Principal;
    name : Text;
    image : Blob;
    roleDescription : Text;
    contactInfo : Text;
  };

  public type Achievement = {
    title : Text;
    description : Text;
    date : Text;
    images : ?[Blob];
  };

  public type Event = {
    title : Text;
    description : Text;
    date : Text;
    images : ?[Blob];
    location : ?Text;
  };

  public type LockerBill = {
    id : Text;
    title : Text;
    image : Blob;
    author : Principal;
    date : Text;
    amount : Text;
    comments : Text;
  };

  public type EquipmentItem = {
    id : Text;
    name : Text;
    image : Blob;
    purchaseDate : Text;
    quantity : Text;
    unitPrice : Text;
    description : Text;
    comments : Text;
    addedBy : Principal;
  };

  public type LockerDocument = {
    id : Text;
    title : Text;
    file : Blob;
    author : Principal;
    dateUploaded : Text;
    tags : Text;
    description : Text;
  };

  public type DriveLink = {
    id : Text;
    title : Text;
    url : Text;
    author : Principal;
    dateAdded : Text;
    description : Text;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
    joinDate : Text;
  };

  public type LockerAccessRequest = {
    requester : Principal;
    name : Text;
    requestTimestamp : Int;
    status : RequestStatus;
    decisionTimestamp : ?Int;
  };

  public type RequestStatus = {
    #pending;
    #approved;
    #denied;
  };

  type OldActor = {
    people : Map.Map<Principal, Person>;
    achievements : Map.Map<Text, Achievement>;
    events : Map.Map<Text, Event>;
    bills : Map.Map<Text, LockerBill>;
    equipment : Map.Map<Text, EquipmentItem>;
    documents : Map.Map<Text, LockerDocument>;
    driveLinks : Map.Map<Text, DriveLink>;
    userProfiles : Map.Map<Principal, UserProfile>;
    lockerAccessRequests : Map.Map<Principal, LockerAccessRequest>;
    lastDocumentId : Nat;
    lastLinkId : Nat;
  };

  type NewActor = {
    people : Map.Map<Principal, Person>;
    achievements : Map.Map<Text, Achievement>;
    events : Map.Map<Text, Event>;
    bills : Map.Map<Text, LockerBill>;
    equipment : Map.Map<Text, EquipmentItem>;
    documents : Map.Map<Text, LockerDocument>;
    driveLinks : Map.Map<Text, DriveLink>;
    userProfiles : Map.Map<Principal, UserProfile>;
    lockerAccessRequests : Map.Map<Principal, LockerAccessRequest>;
  };

  public func run(old : OldActor) : NewActor {
    {
      people = old.people;
      achievements = old.achievements;
      events = old.events;
      bills = old.bills;
      equipment = old.equipment;
      documents = old.documents;
      driveLinks = old.driveLinks;
      userProfiles = old.userProfiles;
      lockerAccessRequests = old.lockerAccessRequests;
    };
  };
};
