import { configureStore } from "@reduxjs/toolkit";
import groupsReducer from "../components/groups/groupSlice";
import sessionsReducer from "../components/sessions/sessionSlice";
import membershipsReducer from "../components/groups/memberships/membershipSlice";
import usersReducer from "../components/users/userSlice";
import notificationsReducer from "../components/notifications/notificationSlice";
import postsReducer from "../components/posts/postSlice";
import shiftsReducer from "../components/shifts/shiftSlice";
// import moneyReducer from "../components/posts/money/moneySlice";
import invitesReducer from "../components/groups/invites/inviteSlice";
import passwordsReducer from "../components/passwords/passwordSlice";
import pushTokensReducer from "../components/users/pushTokenSlice";
import appVersionsReducer from "../components/authFlow/appVersionSlice";

export default store = configureStore({
  reducer: {
    groups: groupsReducer,
    sessions: sessionsReducer,
    memberships: membershipsReducer,
    users: usersReducer,
    notifications: notificationsReducer,
    posts: postsReducer,
    shifts: shiftsReducer,
    invites: invitesReducer,
    passwords: passwordsReducer,
    pushTokens: pushTokensReducer,
    appVersions: appVersionsReducer,
  },
});
