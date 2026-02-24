import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Runtime "mo:core/Runtime";
import UserApproval "user-approval/approval";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // --- Data Types ---

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

  public type FeedbackEntry = {
    id : Nat;
    submitter : Principal;
    category : Text;
    message : Text;
    timestamp : Int;
  };

  // --- Persistent Maps ---
  var people = Map.empty<Principal, Person>();
  var achievements = Map.empty<Text, Achievement>();
  var events = Map.empty<Text, Event>();
  var bills = Map.empty<Text, LockerBill>();
  var equipment = Map.empty<Text, EquipmentItem>();
  var documents = Map.empty<Text, LockerDocument>();
  var driveLinks = Map.empty<Text, DriveLink>();
  var userProfiles = Map.empty<Principal, UserProfile>();
  var lockerAccessRequests = Map.empty<Principal, LockerAccessRequest>();
  var feedbackEntries = Map.empty<Nat, FeedbackEntry>();

  var nextFeedbackId = 0;

  // --- User approval system state ---
  let approvalState = UserApproval.initState(accessControlState);

  // --- User Approval Functions ---

  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  // --- Permissions Check Helpers ---
  func checkIsAdmin(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  func checkIsUser(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };

  func checkIsOwnerOrAdmin(caller : Principal, owner : Principal) {
    if (caller != owner and not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Can only modify your own items");
    };
  };

  // Admins bypass the locker access check; non-admin callers must have an approved request.
  func checkLockerAccess(caller : Principal) {
    if (AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return;
    };
    if (not (isLockerAccessGranted(caller))) {
      Runtime.trap("Unauthorized: Locker access not approved");
    };
  };

  // --- Locker Access Request Logic ---
  public shared ({ caller }) func submitLockerAccessRequest(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit locker requests");
    };

    switch (lockerAccessRequests.get(caller)) {
      case (?req) {
        if (req.status == #pending) {
          Runtime.trap("You already have a pending request");
        };
        if (req.status == #approved) {
          Runtime.trap("Access already granted");
        };
      };
      case (null) {};
    };

    let request : LockerAccessRequest = {
      requester = caller;
      name;
      requestTimestamp = Time.now();
      status = #pending;
      decisionTimestamp = null;
    };

    lockerAccessRequests.add(caller, request);
  };

  public shared ({ caller }) func approveLockerAccessRequest(requester : Principal) : async () {
    checkIsAdmin(caller);

    switch (lockerAccessRequests.get(requester)) {
      case (null) {
        Runtime.trap("Request not found");
      };
      case (?req) {
        if (req.status != #pending) {
          Runtime.trap("Cannot approve a non-pending request");
        };

        let updatedRequest = {
          req with
          status = #approved;
          decisionTimestamp = ?Time.now();
        };
        lockerAccessRequests.add(requester, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func denyLockerAccessRequest(requester : Principal) : async () {
    checkIsAdmin(caller);

    switch (lockerAccessRequests.get(requester)) {
      case (null) {
        Runtime.trap("Request not found");
      };
      case (?req) {
        if (req.status != #pending) {
          Runtime.trap("Cannot deny a non-pending request");
        };

        let updatedRequest = {
          req with
          status = #denied;
          decisionTimestamp = ?Time.now();
        };
        lockerAccessRequests.add(requester, updatedRequest);
      };
    };
  };

  public query ({ caller }) func getLockerAccessRequests() : async [LockerAccessRequest] {
    checkIsAdmin(caller);
    lockerAccessRequests.values().toArray();
  };

  // Only authenticated users can query their own request status.
  public query ({ caller }) func getMyLockerAccessStatus() : async RequestStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check their locker access status");
    };
    switch (lockerAccessRequests.get(caller)) {
      case (null) {
        Runtime.trap("No request found");
      };
      case (?req) { req.status };
    };
  };

  // Only authenticated users can query whether their access is granted.
  public query ({ caller }) func isLockerAccessGrantedQuery() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check locker access");
    };
    isLockerAccessGranted(caller);
  };

  func isLockerAccessGranted(caller : Principal) : Bool {
    switch (lockerAccessRequests.get(caller)) {
      case (?req) { req.status == #approved };
      case (null) { false };
    };
  };

  // Locker data functions (bills, equipment, documents, drive links)
  // These all require locker access (or admin role).

  // Bills
  public shared ({ caller }) func addBill(bill : LockerBill) : async Bool {
    checkLockerAccess(caller);

    if (bill.author != caller and not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Cannot create bills for other users");
    };

    let exists = bills.containsKey(bill.id);
    bills.add(bill.id, bill);
    not exists;
  };

  public shared ({ caller }) func deleteBill(id : Text) : async Bool {
    checkLockerAccess(caller);

    switch (bills.get(id)) {
      case (null) { false };
      case (?bill) {
        checkIsOwnerOrAdmin(caller, bill.author);
        bills.remove(id);
        true;
      };
    };
  };

  public query ({ caller }) func getAllBills() : async [LockerBill] {
    checkLockerAccess(caller);
    bills.values().toArray();
  };

  // Equipment
  public shared ({ caller }) func addEquipment(equipmentItem : EquipmentItem) : async Bool {
    checkLockerAccess(caller);

    if (equipmentItem.addedBy != caller and not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Cannot create equipment for other users");
    };

    let exists = equipment.containsKey(equipmentItem.id);
    equipment.add(equipmentItem.id, equipmentItem);
    not exists;
  };

  public shared ({ caller }) func deleteEquipment(id : Text) : async Bool {
    checkLockerAccess(caller);

    switch (equipment.get(id)) {
      case (null) { false };
      case (?item) {
        checkIsOwnerOrAdmin(caller, item.addedBy);
        equipment.remove(id);
        true;
      };
    };
  };

  public query ({ caller }) func getAllEquipment() : async [EquipmentItem] {
    checkLockerAccess(caller);
    equipment.values().toArray();
  };

  // Documents
  public shared ({ caller }) func addDocument(doc : LockerDocument) : async Bool {
    checkLockerAccess(caller);

    if (doc.author != caller and not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Cannot create documents for other users");
    };

    let exists = documents.containsKey(doc.id);
    documents.add(doc.id, doc);
    not exists;
  };

  public shared ({ caller }) func deleteDocument(id : Text) : async Bool {
    checkLockerAccess(caller);

    switch (documents.get(id)) {
      case (null) { false };
      case (?doc) {
        checkIsOwnerOrAdmin(caller, doc.author);
        documents.remove(id);
        true;
      };
    };
  };

  public query ({ caller }) func getAllDocuments() : async [LockerDocument] {
    checkLockerAccess(caller);
    documents.values().toArray();
  };

  // Drive Links
  public shared ({ caller }) func addDriveLink(link : DriveLink) : async Bool {
    checkLockerAccess(caller);

    if (link.author != caller and not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Cannot create links for other users");
    };

    let exists = driveLinks.containsKey(link.id);
    driveLinks.add(link.id, link);
    not exists;
  };

  public shared ({ caller }) func deleteDriveLink(id : Text) : async Bool {
    checkLockerAccess(caller);

    switch (driveLinks.get(id)) {
      case (null) { false };
      case (?link) {
        checkIsOwnerOrAdmin(caller, link.author);
        driveLinks.remove(id);
        true;
      };
    };
  };

  public query ({ caller }) func getAllDriveLinks() : async [DriveLink] {
    checkLockerAccess(caller);
    driveLinks.values().toArray();
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

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.hasPermission(accessControlState, caller, #admin)) {
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

  // --- Feedback ---
  // Public function to submit feedback
  public shared ({ caller }) func submitFeedback(category : Text, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit feedback");
    };

    let feedback : FeedbackEntry = {
      id = nextFeedbackId;
      submitter = caller;
      category;
      message;
      timestamp = Time.now();
    };

    feedbackEntries.add(nextFeedbackId, feedback);
    nextFeedbackId += 1;
  };

  // Admin-only function to get all feedback entries
  public query ({ caller }) func getAllFeedback() : async [FeedbackEntry] {
    checkIsAdmin(caller);
    feedbackEntries.values().toArray();
  };
};
