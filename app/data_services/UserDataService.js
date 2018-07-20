// export class UserDataService {
//     static myUserID;
//     static userDataService;
//
//     static setMyUserID() {
//         Async
//     }
//
//     static initialiseService(floDB, store) {
//         UserDataService.userDataService = new UserDataService(floDB, store);
//     }
//
//     static getInstance() {
//         if (!UserDataService.userDataService) {
//             throw new Error('user data service requested before being initialised');
//         }
//
//         return UserDataService.userDataService;
//     }
//
//     constructor(floDB, store) {
//         this.floDB = floDB;
//         this.store = store;
//     }
//
//     getUserByID(userID) {
//         return this.floDB.objectForPrimaryKey(User, userID);
//     }
//
//     getAllUsers() {
//         return this.floDB.objects(User.schema.name).filtered('archived = false');
//     }
//
//     getUsersFilteredByName(searchTerm) {
//         if (!searchTerm || searchTerm === '') return this.getAllUsers();
//         const searchTerms = searchTerm.toString().split(' ');
//         let queryStr = QueryHelper.nameContainsQuery(searchTerms.shift());
//         queryStr = searchTerms.reduce((queryAccumulator, searchTerm) =>
//             QueryHelper.andQuery(queryAccumulator, QueryHelper.nameContainsQuery(searchTerm)), queryStr);
//         return this.getAllUsers().filtered(queryStr);
//     }
//
//     getUsersSortedByName(userList) {
//         if (userList.length === 0) return userList;
//         const userDataArray = [];
//         userList.forEach(user => userDataArray.push({sortIndex: user.name.toString().toLowerCase(), data: user}));
//         const sortedSeedArray = userDataArray.sort((userData1, userData2) => userData1.sortIndex.localeCompare(userData2.sortIndex));
//         return sortedSeedArray.map(seedData => seedData.data);
//     }
//
//     createNewUser(user, isLocallyOwned = true, updateIfExisting = false) {
//         // Todo: Add proper ID generators
//         // Create a user, create & add an address, and create & add an episode
//         const userId = !isLocallyOwned && user.userID ? user.userID : Math.random().toString();
//         const episodeId = Math.random().toString();
//         const addressId = Math.random().toString();
//
//         let newUser = null;
//         const creationTimestamp = user.createdOn ? moment(user.createdOn).valueOf() : moment().utc().valueOf();
//
//         const emergencyContactNumber = user.emergencyContactInfo.contactNumber;
//         const emergencyContactName = user.emergencyContactInfo.contactName;
//         const emergencyContactRelation = user.emergencyContactInfo.contactRelation;
//
//         this.floDB.write(() => {
//             // Add the user
//             newUser = this.floDB.create(User.schema.name, {
//                 userID: userId,
//                 firstName: user.firstName.toString().trim(),
//                 lastName: user.lastName.toString().trim(),
//                 primaryContact: user.primaryContact ? parsePhoneNumber(user.primaryContact.toString().trim()) : '',
//                 notes: user.notes ? user.notes.toString().trim() : '',
//                 creationTimestamp,
//                 assignmentTimestamp: moment().utc().valueOf(),
//                 lastUpdateTimestamp: creationTimestamp,
//                 isLocallyOwned,
//                 archived: false,
//                 dateOfBirth: user.dateOfBirth,
//                 emergencyContactNumber: emergencyContactNumber ? emergencyContactNumber.toString().trim() : null,
//                 emergencyContactName: emergencyContactName ? emergencyContactName.toString().trim() : null,
//                 emergencyContactRelation: emergencyContactRelation ? emergencyContactRelation.toString().trim() : null,
//             }, updateIfExisting);
//
//             if (isLocallyOwned) {
//                 addressDataService.addAddressToTransaction(newUser, user, addressId);
//             } else addressDataService.addAddressToTransaction(newUser, user.address, user.address.id);
//
//             // Todo: Add an episode, Move this to its own Data Service
//             newUser.episodes.push({
//                 episodeID: episodeId,
//                 diagnosis: []
//             });
//         });
//         if (newUser) {
//             this.addUsersToRedux([newUser], true);
//         }
//     }
//
//     editExistingUser(user, isServerUpdate = false) {
//         const userObj = this.floDB.objectForPrimaryKey(User.schema.name, user.userID);
//
//         if (userObj) {
//             if (!isServerUpdate) { this._checkPermissionForEditing([userObj]); }
//
//             const emergencyContactNumber = user.emergencyContactInfo.contactNumber;
//             const emergencyContactName = user.emergencyContactInfo.contactName;
//             const emergencyContactRelation = user.emergencyContactInfo.contactRelation;
//
//             this.floDB.write(() => {
//                 // Edit the corresponding address info
//                 if (user.addressID) { addressDataService.addAddressToTransaction(userObj, user, user.addressID); }
//
//                 // Edit the user info
//                 this.floDB.create(User.schema.name, {
//                     userID: user.userID,
//                     firstName: user.firstName ? user.firstName.toString().trim() : undefined,
//                     lastName: user.lastName ? user.lastName.toString().trim() : undefined,
//                     primaryContact: user.primaryContact ? parsePhoneNumber(user.primaryContact.toString().trim()) : undefined,
//                     notes: user.notes ? user.notes.toString().trim() : undefined,
//                     dateOfBirth: user.dateOfBirth,
//                     emergencyContactNumber: emergencyContactNumber ? emergencyContactNumber.toString().trim() : undefined,
//                     emergencyContactName: emergencyContactName ? emergencyContactName.toString().trim() : undefined,
//                     emergencyContactRelation: emergencyContactRelation ? emergencyContactRelation.toString().trim() : undefined,
//                 }, true);
//             });
//             this.updateUsersInRedux([userObj], isServerUpdate);
//         }
//     }
//
//     archiveUser(userId, deletedOnServer = false) {
//         console.log('Archiving User from realm');
//         const user = this.floDB.objectForPrimaryKey(User.schema.name, userId);
//
//         if (user) {
//             if (!deletedOnServer) { this._checkPermissionForEditing([user]); }
//
//             let obj = null;
//             this.floDB.write(() => {
//                 user.archived = true;
//                 obj = VisitService.getInstance().deleteVisits(user);
//             });
//             if (user) {
//                 this._archiveUsersInRedux([userId]);
//             }
//             if (obj && obj.visits) {
//                 VisitService.getInstance().deleteVisitsFromRedux(obj.visits);
//             }
//             if (obj && obj.visitOrders) {
//                 for (let i = 0; i < obj.visitOrders.length; i++) {
//                     VisitService.getInstance().updateVisitOrderToReduxIfLive(obj.visitOrders[i].visitList, obj.visitOrders[i].midnightEpoch);
//                 }
//             }
//             console.log('User archived. His visits Deleted');
//         }
//     }
//
//     updateUserListFromServer() {
//         return UserAPI.getUserIDList()
//             .then(json => {
//                 const serverUserIDs = json.users;
//
//                 console.log('server user ids');
//                 console.log(serverUserIDs);
//
//                 const existingUsers = this.floDB.objects(User).filtered('isLocallyOwned = false && archived = false');
//                 const intersectingUsers = filterResultObjectByListMembership(existingUsers, 'userID', serverUserIDs);
//
//                 const intersectingUsersByID = arrayToMap(filterResultObjectByListMembership(intersectingUsers, 'userID', serverUserIDs), 'userID');
//
//                 const deletedUsers = [];
//                 existingUsers.forEach(user => {
//                     if (!intersectingUsersByID.has(user.userID.toString())) {
//                         deletedUsers.push(user);
//                     }
//                 });
//
//                 const newUserIDs = [];
//                 serverUserIDs.forEach(userID => {
//                     if (!intersectingUsersByID.has(userID.toString())) {
//                         newUserIDs.push(userID);
//                         //TODO batch it
//                     }
//                 });
//
//                 return {
//                     deletedUsers,
//                     newUserIDs
//                 };
//             })
//             .then(async ({deletedUsers, newUserIDs}) => {
//                 let additions = 0;
//                 const deletions = deletedUsers.length;
//
//                 if (newUserIDs.length > 0) {
//                     additions = await this.fetchAndSaveUsersByID(newUserIDs);
//                 }
//                 deletedUsers.forEach(user => this.archiveUser(user.userID.toString(), true));
//                 return {
//                     additions,
//                     deletions
//                 };
//             });
//     }
//
//     _fetchUsersByIDAndAdapt(userIDs) {
//         return UserAPI.getUsersByID(userIDs)
//             .then((json) => {
//                 const successfulObjects = json.success;
//                 for (const userID in successfulObjects) {
//                     const userObject = successfulObjects[userID];
//                     userObject.userID = userObject.id.toString();
//                     userObject.address.id = userObject.address.id.toString();
//                     userObject.address.lat = userObject.address.latitude;
//                     userObject.address.long = userObject.address.longitude;
//
//                     userObject.dateOfBirth = userObject.dob || null;
//                     if (userObject.dateOfBirth) {
//                         try {
//                             userObject.dateOfBirth = moment(userObject.dateOfBirth, 'YYYY-MM-DD').toDate();
//                         } catch (e) {
//                             userObject.dateOfBirth = null;
//                             console.log('Unable to parse DOB. Skipping field');
//                         }
//                     }
//                     userObject.emergencyContactInfo = {
//                         contactName: userObject.emergencyContactName || null,
//                         contactNumber: userObject.emergencyContactNumber || null,
//                         contactRelation: userObject.emergencyContactRelation || null
//                     };
//                 }
//                 return json;
//             });
//     }
//
//     fetchAndSaveUsersByID(newUserIDs) {
//         return this._fetchUsersByIDAndAdapt(newUserIDs)
//             .then((json) => {
//                 const successfulObjects = json.success;
//                 for (const userObject of successfulObjects) {
//                     this.createNewUser(userObject, false, true);
//                 }
//                 addressDataService.attemptFetchForPendingAddresses();
//                 return successfulObjects.length;
//             });
//     }
//
//     fetchAndEditUsersByID(userIDs) {
//         return this._fetchUsersByIDAndAdapt(userIDs)
//             .then((json) => {
//                 const successfulObjects = json.success;
//                 for (const userObject of successfulObjects) {
//                     this.editExistingUser(userObject, true);
//                 }
//                 addressDataService.attemptFetchForPendingAddresses();
//                 return successfulObjects.length;
//             });
//     }
//
//     updateUsersInRedux(users, isServerUpdate = false) {
//         if (!isServerUpdate) { this._checkPermissionForEditing(users); }
//
//         this.store.dispatch({
//             type: UserActions.EDIT_USERS,
//             userMap: UserDataService.getFlatUserMap(users)
//         });
//         addressDataService.updateAddressesInRedux(users.map(user => user.address));
//     }
//
//     addUsersToRedux(users, updateExisting = false) {
//         this.store.dispatch({
//             type: UserActions.ADD_USERS,
//             userMap: UserDataService.getFlatUserMap(users),
//             updateExisting
//         });
//         addressDataService.addAddressesToRedux(users.map(user => user.address));
//     }
//
//     _archiveUsersInRedux(users) {
//         this.store.dispatch({
//             type: UserActions.ARCHIVE_USERS,
//             userList: users
//         });
//     }
//
//     _checkPermissionForEditing(users) {
//         users.forEach(user => {
//             if (!user.isLocallyOwned) {
//                 console.log('illegal attempt to edit user');
//                 throw new Error('Attempting to update a user that is organisation owned');
//             }
//         });
//     }
// }
