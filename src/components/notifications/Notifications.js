import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectNotifications,
  updateNotificationAsync,
} from "./notificationSlice";
import { selectUserId } from "../sessions/sessionSlice";
import { createMembershipAsync } from "../groups/memberships/membershipSlice";
import { updateInviteAsync } from "../groups/invites/inviteSlice";
import { formatDistanceToNow } from "date-fns";
import { fetchNotificationsAsync } from "./notificationSlice";
import { View, Text } from "react-native";

function Notifications({ navigation }) {
  // const notifications = useSelector(selectNotifications);
  // const userId = useSelector(selectUserId);
  // const dispatch = useDispatch();

  // function handleActionButtonText(notification) {
  //   switch (notification.notification_blueprint.notificationable_type) {
  //     case "Post":
  //       return "View Post";
  //     case "Invite":
  //       return "Accept";
  //   }
  // }

  // function startAction(notification) {
  //   if (notification.notification_blueprint.notification_type === 1) {
  //     handleAcceptInvite(notification);
  //   } else if (notification.notification_blueprint.notification_type === 3) {
  //     handleAcceptRequest(notification);
  //   } else {
  //     navigation.navigate("Home", {
  //       screen: "Post",
  //       initial: false,
  //       params: {
  //         returnScreen: "Home Feed",
  //         postId: notification.notification_blueprint.notificationable_id,
  //       },
  //     });
  //   }
  // }

  // function handleAcceptInvite(notification) {
  //   let membershipObj = createMembershipObj(notification, userId);
  //   dispatch(createMembershipAsync(membershipObj));

  //   let invite = createInviteObj(notification, true);
  //   dispatch(updateInviteAsync(invite));

  //   actionNotification(notification, true);
  // }

  // function handleAcceptRequest(notification) {
  //   let membershipObj = createMembershipObj(
  //     notification,
  //     notification.notification_origin.notifier_id
  //   );
  //   dispatch(createMembershipAsync(membershipObj));

  //   let invite = createInviteObj(notification, true);
  //   dispatch(updateInviteAsync(invite));

  //   actionNotification(notification, true);
  // }

  // function createMembershipObj(notification, userId) {
  //   return {
  //     group_id: notification.group_id,
  //     user_id: userId,
  //     role: 1,
  //     status: 0,
  //   };
  // }

  // function createInviteObj(notification, bool) {
  //   return {
  //     inviteDetails: {
  //       accepted: bool,
  //     },
  //     id: notification.notification_blueprint.notificationable_id,
  //     group_id: notification.group_id,
  //   };
  // }

  // function handleDecline(notification) {
  //   let invite = createInviteObj(notification, false);
  //   dispatch(updateInviteAsync(invite));

  //   actionNotification(notification, true);
  // }

  // function actionNotification(notification, bool) {
  //   let notificationDetails = {
  //     id: notification.id,
  //     actioned: bool,
  //   };
  //   dispatch(updateNotificationAsync(notificationDetails));
  // }

  // function refresh() {
  //   dispatch(fetchNotificationsAsync());
  // }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Notifications!</Text>
    </View>
  );
}

export default Notifications;
