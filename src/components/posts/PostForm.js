import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPostAsync, selectFreshPost } from "./postSlice";
import { resetShifts, selectShifts } from "./shifts/shiftSlice";
import { createNotificationBlueprint } from "../notifications/notificationBlueprintAPI";
import { compareAsc, format, addMinutes } from "date-fns";
import { View, Text } from "react-native";

function PostForm() {
  // const dispatch = useDispatch();
  // const shifts = useSelector(selectShifts);
  // const { postEndsDate, groupId, groupName, reserve } = route.params;
  // const [formData, setData] = useState({});
  // const [description, setDescription] = useState("");
  // const [errors, setErrors] = useState({});
  // const [invalidShiftIds, setInvalidShiftIds] = useState([]);
  // const freshPost = useSelector(selectFreshPost);

  // useEffect(() => {
  //   if (freshPost.id != 0) {
  //     let notification_blueprint = {
  //       notificationable_type: "Post",
  //       notificationable_id: freshPost.id,
  //       notification_type: 4,
  //     };

  //     createNotificationBlueprint(notification_blueprint);

  //     dispatch(resetShifts());
  //   }
  // }, [freshPost.id]);

  // useEffect(() => {
  //   dispatch(resetShifts());
  // }, []);

  // useEffect(() => {
  //   setData({ ...formData, endsAt: postEndsDate });
  // }, []);

  // const onSubmit = () => {
  //   validate() ? console.log("Submitted") : console.log("Validation Failed");
  // };

  // const validate = () => {
  //   let newErrors = {};

  //   checkDescriptionForErrors(newErrors);
  //   checkShiftsForErrors(newErrors);
  //   checkPostEndsDateForErrors(newErrors);
  //   checkGroupForErrors(newErrors);

  //   setErrors({ ...errors, ...newErrors });

  //   if (areAllValuesNull(errors) && areAllValuesNull(newErrors)) {
  //     return submitPost();
  //   }
  // };

  // useEffect(() => {
  //   setData({ ...formData, endsAt: postEndsDate });
  // }, [errors]);

  // function submitPost() {
  //   let post = {
  //     body: description,
  //     ends_at: postEndsDate,
  //     group_id: groupId,
  //     reserve: reserve,
  //     shifts_attributes: shifts,
  //   };
  //   navigation.navigate({
  //     name: "Home",
  //   });
  //   dispatch(createPostAsync(post));
  //   return true;
  // }

  // const checkDescriptionForErrors = (newErrors) => {
  //   if (description === "") {
  //     newErrors["description"] = "Description required";
  //   }
  // };

  // const checkShiftsForErrors = (newErrors) => {
  //   if (shifts.length === 0) {
  //     newErrors["shifts"] = "At least one Shift is requried";
  //   }
  //   if (shifts.length > 0) {
  //     let invalidShifts = shifts.filter((shift) =>
  //       compareAsc(new Date(shift.start), new Date(postEndsDate)) === -1
  //         ? true
  //         : false
  //     );
  //     setInvalidShiftIds(invalidShifts.map((shift) => shift.tempId));
  //     if (invalidShifts.length > 0) {
  //       newErrors["shifts"] = "Shift starts before the post ends";
  //     }
  //   }
  // };

  // const checkPostEndsDateForErrors = (newErrors) => {
  //   if (!postEndsDateIsValid()) {
  //     newErrors["postEndsDate"] =
  //       "Post must be at least half an hour in the future";
  //   }
  // };

  // const checkGroupForErrors = (newErrors) => {
  //   if (groupId === 0) {
  //     newErrors["group"] = "Need to pick a group";
  //   }
  // };

  // function areAllValuesNull(obj) {
  //   for (let key in obj) {
  //     if (obj.hasOwnProperty(key) && obj[key] !== null) {
  //       return false; // At least one non-null value found
  //     }
  //   }
  //   return true; // All values are null
  // }

  // function postEndsDateIsValid() {
  //   return compareAsc(new Date(postEndsDate), addMinutes(Date.now(), 30)) === 1
  //     ? true
  //     : false;
  // }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Create Post!</Text>
    </View>
  );
}

export default PostForm;
