import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { selectUserId, selectUserAvatarUrl } from "../sessions/sessionSlice";
import {
  fetchUserAsync,
  selectUser,
  updateUserAsync,
  destroyUserAsync,
} from "./userSlice";
import {
  destroyPushTokenAsync,
  selectCurrentPushToken,
} from "../users/pushTokenSlice";
import { logoutUserAsync } from "../sessions/sessionSlice";
import { View, Text } from "react-native";

function Profile({ navigation }) {
  // const user = useSelector(selectUser);
  // const userId = useSelector(selectUserId);
  // const [name, setName] = useState(user.name);
  // const [image, setImage] = useState(null);
  // const [editingProfile, setEditingProfile] = useState(false);
  // const [editingName, setEditingName] = useState(false);
  // const [formData, setFormData] = useState({ name: user.name });
  // const [errors, setErrors] = useState({});
  // const dispatch = useDispatch();
  // const userAvatarUrl = useSelector(selectUserAvatarUrl);
  // const currentPushToken = useSelector(selectCurrentPushToken);

  // useEffect(() => {
  //   dispatch(fetchUserAsync(userId));
  // }, []);

  // useEffect(() => {
  //   setFormData({ name: user.name });
  //   setName(user.name);
  //   setImage(userAvatarUrl);
  // }, [user, userAvatarUrl]);

  // // Method from expo docs https://docs.expo.dev/versions/latest/sdk/imagepicker/
  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setImage(result.assets[0].uri);
  //     setEditingProfile(true);
  //   }
  // };

  // function cancelEditing() {
  //   setEditingName(false);
  //   setEditingProfile(false);
  //   setFormData({ ...formData, name: name });
  //   setImage(null);
  // }

  // function submitUser() {
  //   const data = new FormData();
  //   data.append("user[id]", userId);
  //   data.append("user[name]", formData.name);

  //   if (image) {
  //     let uriParts = image.split(".");
  //     let fileType = uriParts[uriParts.length - 1];

  //     data.append("user[avatar]", {
  //       uri: image,
  //       name: `profilePictureUser${userId}.${fileType}`,
  //       type: `image/${fileType}`,
  //     });
  //   }

  //   setName(formData.name);
  //   dispatch(updateUserAsync(data));
  // }

  // const validate = () => {
  //   if (formData.name === undefined || formData.name === "") {
  //     setErrors({ ...errors, name: "Name is required" });
  //     return false;
  //   } else if (formData.name.length < 3) {
  //     setErrors({ ...errors, name: "Name is too short" });
  //     return false;
  //   }
  //   submitUser();
  //   setEditingProfile(false);
  //   setEditingName(false);
  //   return true;
  // };

  // const onSubmit = () => {
  //   validate() ? console.log("Submitted") : console.log("Validation Failed");
  // };

  // function onDestroy() {
  //   if (currentPushToken.id != 0) {
  //     console.log("deleting push Token");
  //     dispatch(destroyPushTokenAsync(currentPushToken));
  //   }
  //   dispatch(destroyUserAsync(userId));
  //   dispatch(logoutUserAsync());
  // }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Profile!</Text>
    </View>
  );
}

export default Profile;
