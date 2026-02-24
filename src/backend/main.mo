import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

import Runtime "mo:core/Runtime";

 actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type Person = {
    id : Principal;
    name : Text;
    image : Storage.ExternalBlob;
    roleDescription : Text;
    contactInfo : Text;
  };

  public type Achievement = {
    title : Text;
    description : Text;
    date : Text;
    images : ?[Storage.ExternalBlob];
  };

  public type Event = {
    title : Text;
    description : Text;
    date : Text;
    images : ?[Storage.ExternalBlob];
    location : ?Text;
  };

  public type LockerBill = {
    id : Text;
    title : Text;
    image : Storage.ExternalBlob;
    author : Principal;
    date : Text;
    amount : Text;
    comments : Text;
  };

  public type EquipmentItem = {
    id : Text;
    name : Text;
    image : Storage.ExternalBlob;
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
    file : Storage.ExternalBlob;
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

  // Persistent Data Store
  stable var lastDocumentId = 0;
  stable var lastLinkId = 0;

  stable var people : Map.Map<Principal, Person> = Map.empty<Principal, Person>();
  stable var achievements : Map.Map<Text, Achievement> = Map.empty<Text, Achievement>();
  stable var events : Map.Map<Text, Event> = Map.empty<Text, Event>();
  stable var bills : Map.Map<Text, LockerBill> = Map.empty<Text, LockerBill>();
  stable var equipment : Map.Map<Text, EquipmentItem> = Map.empty<Text, EquipmentItem>();
  stable var documents : Map.Map<Text, LockerDocument> = Map.empty<Text, LockerDocument>();
  stable var driveLinks : Map.Map<Text, DriveLink> = Map.empty<Text, DriveLink>();
  stable var userProfiles : Map.Map<Principal, UserProfile> = Map.empty<Principal, UserProfile>();

  // Permissions Check Helpers
  func checkIsAdmin(caller : Principal) {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  func checkIsUser(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };

  func checkIsOwnerOrAdmin(caller : Principal, owner : Principal) {
    if (caller != owner and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only modify your own items");
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Team Management (Admins Only)
  public shared ({ caller }) func addPerson(person : Person) : async () {
    checkIsAdmin(caller);
    people.add(person.id, person);
  };

  public shared ({ caller }) func updatePerson(principal : Principal, updatedPerson : Person) : async Bool {
    checkIsAdmin(caller);
    let exists = people.containsKey(principal);
    people.add(principal, updatedPerson);
    exists;
  };

  public shared ({ caller }) func removePerson(principal : Principal) : async Bool {
    checkIsAdmin(caller);
    let exists = people.containsKey(principal);
    people.remove(principal);
    exists;
  };

  // Achievements (Admins Only)
  public shared ({ caller }) func addAchievement(achievement : Achievement) : async () {
    checkIsAdmin(caller);
    achievements.add(achievement.title, achievement);
  };

  public shared ({ caller }) func updateAchievement(title : Text, updatedAchievement : Achievement) : async Bool {
    checkIsAdmin(caller);
    let exists = achievements.containsKey(title);
    achievements.add(title, updatedAchievement);
    exists;
  };

  public shared ({ caller }) func removeAchievement(title : Text) : async Bool {
    checkIsAdmin(caller);
    let exists = achievements.containsKey(title);
    achievements.remove(title);
    exists;
  };

  // Events (Admins Only)
  public shared ({ caller }) func addEvent(event : Event) : async () {
    checkIsAdmin(caller);
    events.add(event.title, event);
  };

  public shared ({ caller }) func updateEvent(title : Text, updatedEvent : Event) : async Bool {
    checkIsAdmin(caller);
    let exists = events.containsKey(title);
    events.add(title, updatedEvent);
    exists;
  };

  public shared ({ caller }) func removeEvent(title : Text) : async Bool {
    checkIsAdmin(caller);
    let exists = events.containsKey(title);
    events.remove(title);
    exists;
  };

  // Bills Management (Locker - Members)
  public shared ({ caller }) func addBill(bill : LockerBill) : async Bool {
    checkIsUser(caller);
    // Verify the caller is the author
    if (bill.author != caller) {
      Runtime.trap("Unauthorized: Cannot create bills for other users");
    };
    let exists = bills.containsKey(bill.id);
    bills.add(bill.id, bill);
    not exists;
  };

  public shared ({ caller }) func deleteBill(id : Text) : async Bool {
    checkIsUser(caller);
    // Check ownership before deletion
    switch (bills.get(id)) {
      case null { false };
      case (?bill) {
        checkIsOwnerOrAdmin(caller, bill.author);
        bills.remove(id);
        true;
      };
    };
  };

  // Equipment Management (Locker - Members)
  public shared ({ caller }) func addEquipment(equipmentItem : EquipmentItem) : async Bool {
    checkIsUser(caller);
    // Verify the caller is the one adding the equipment
    if (equipmentItem.addedBy != caller) {
      Runtime.trap("Unauthorized: Cannot create equipment for other users");
    };
    let exists = equipment.containsKey(equipmentItem.id);
    equipment.add(equipmentItem.id, equipmentItem);
    not exists;
  };

  public shared ({ caller }) func deleteEquipment(id : Text) : async Bool {
    checkIsUser(caller);
    // Check ownership before deletion
    switch (equipment.get(id)) {
      case null { false };
      case (?item) {
        checkIsOwnerOrAdmin(caller, item.addedBy);
        equipment.remove(id);
        true;
      };
    };
  };

  // Document Management (Locker - Members)
  public shared ({ caller }) func addDocument(doc : LockerDocument) : async Bool {
    checkIsUser(caller);
    // Verify the caller is the author
    if (doc.author != caller) {
      Runtime.trap("Unauthorized: Cannot create documents for other users");
    };
    let exists = documents.containsKey(doc.id);
    documents.add(doc.id, doc);
    not exists;
  };

  public shared ({ caller }) func deleteDocument(id : Text) : async Bool {
    checkIsUser(caller);
    // Check ownership before deletion
    switch (documents.get(id)) {
      case null { false };
      case (?doc) {
        checkIsOwnerOrAdmin(caller, doc.author);
        documents.remove(id);
        true;
      };
    };
  };

  // Drive Link Management (Locker - Members)
  public shared ({ caller }) func addDriveLink(link : DriveLink) : async Bool {
    checkIsUser(caller);
    // Verify the caller is the author
    if (link.author != caller) {
      Runtime.trap("Unauthorized: Cannot create links for other users");
    };
    let exists = driveLinks.containsKey(link.id);
    driveLinks.add(link.id, link);
    not exists;
  };

  public shared ({ caller }) func deleteDriveLink(id : Text) : async Bool {
    checkIsUser(caller);
    // Check ownership before deletion
    switch (driveLinks.get(id)) {
      case null { false };
      case (?link) {
        checkIsOwnerOrAdmin(caller, link.author);
        driveLinks.remove(id);
        true;
      };
    };
  };

  // Queries - Public Information (Open Access)
  public query ({ caller }) func getAllPeople() : async [Person] {
    people.values().toArray();
  };

  public query ({ caller }) func getAllAchievements() : async [Achievement] {
    achievements.values().toArray();
  };

  public query ({ caller }) func getAllEvents() : async [Event] {
    events.values().toArray();
  };

  // Queries - Locker Information (Members Only)
  public query ({ caller }) func getAllBills() : async [LockerBill] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only members can access locker bills");
    };
    bills.values().toArray();
  };

  public query ({ caller }) func getAllEquipment() : async [EquipmentItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only members can access locker equipment");
    };
    equipment.values().toArray();
  };

  public query ({ caller }) func getAllDocuments() : async [LockerDocument] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only members can access locker documents");
    };
    documents.values().toArray();
  };

  public query ({ caller }) func getAllDriveLinks() : async [DriveLink] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only members can access locker drive links");
    };
    driveLinks.values().toArray();
  };
};
