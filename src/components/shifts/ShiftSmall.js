import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TouchableOpacity, View, Alert } from "react-native";
import { useTheme, Modal, Portal, Button } from "react-native-paper";
import { selectUserId } from "../sessions/sessionSlice";
import { format } from "date-fns";
import {
  setPosition,
  setStart,
  setEnd,
  setDescription,
  createProShifts,
  destroyShiftAsync,
  fetchShiftsForMonthAsync,
} from "./shiftSlice";
import ShiftSmallCard from "./ShiftSmallCard";
import { createBidAsync } from "../posts/postSlice";

function ShiftSmall({ shift, navigation, offering, postId }) {
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);
  const [confirmSwapVisible, setConfirmSwapVisible] = useState(false);
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const containerStyle = {
    backgroundColor: "white",
    padding: 10,
    marginRight: "10%",
    marginLeft: "10%",
    borderRadius: 12,
    height: 200,
  };

  const handleDelete = async () => {
    const formattedDate = format(new Date(shift.start), "yyyy-MM");
    let shiftDetails = {
      user_id: userId,
      id: shift.id,
    };

    // Dispatch destroyShiftAsync and then dispatch fetchShiftsForMonthAsync if the destroy operation is successful
    dispatch(destroyShiftAsync(shiftDetails))
      .then(() => {
        hideModal();
        // Assuming userId and formattedDate are correct, adjust as needed
        dispatch(fetchShiftsForMonthAsync({ userId, month: formattedDate }));
      })
      .catch((error) => {
        console.error("An error occurred during shift destruction:", error);
        // Handle error as needed
      });
  };

  function returnAction() {
    if (shift.status == "no") {
      if (offering) {
        offerToSwap();
      } else {
        showGeneralActions();
      }
    } else {
      // alert about it being offering / posted already
      if (shift.status == "posting") {
        Alert.alert("You have posted this shift for swap");
      } else {
        Alert.alert("You have offered this shift for swap");
      }
    }
  }

  function offerToSwap() {
    setConfirmSwapVisible(true);
    // show modal to confirm offer to swap ...
  }

  function showGeneralActions() {
    showModal();
  }

  function submitSwap() {
    let bidDetails = {
      post_id: postId,
      user_id: userId,
      approved: false,
      shift_id: shift.id,
    };
    // create Bid
    dispatch(createBidAsync(bidDetails));

    // updateshift
  }

  return (
    <TouchableOpacity style={{ flex: 1 }} onPress={returnAction}>
      <ShiftSmallCard offering={offering} shift={shift} />
      <Portal>
        <Modal
          visible={confirmSwapVisible}
          onDismiss={() => setConfirmSwapVisible(false)}
          contentContainerStyle={containerStyle}
        >
          <ShiftSmallCard offering={offering} shift={shift} />
          <Button
            mode="contained"
            style={{
              marginTop: 25,
              marginBottom: 10,
            }}
            onPress={submitSwap}
            icon="calendar-multiple"
          >
            Offer to Swap
          </Button>
        </Modal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Button
              mode="contained"
              style={{
                marginTop: 10,
                marginBottom: 10,
              }}
              onPress={() => {
                dispatch(
                  createProShifts([{ ...shift, description: shift.title }])
                );

                navigation.navigate("CreatePostStack", {
                  screen: "Create Post",
                  params: {
                    id: shift.id,
                    returnScreen: "Calendar",
                  },
                });
                hideModal();
              }}
              icon="calendar-multiple"
            >
              Swap
            </Button>
            <Button
              mode="contained"
              style={{
                marginTop: 10,
                marginBottom: 10,
              }}
              icon="pencil"
              onPress={() => {
                dispatch(setStart(shift.start));
                dispatch(setEnd(shift.end));
                dispatch(setPosition(shift.position));
                dispatch(setDescription(shift.title));

                navigation.navigate("CreatePostStack", {
                  screen: "Add Shift",
                  params: {
                    id: shift.id,
                    returnScreen: "Calendar",
                  },
                });
                hideModal();
              }}
              buttonColor={theme.colors.tertiary}
            >
              Edit
            </Button>
            <Button
              mode="contained"
              style={{
                marginTop: 10,
                marginBottom: 10,
              }}
              icon="delete"
              onPress={handleDelete}
              buttonColor={theme.colors.customPink}
            >
              Delete
            </Button>
          </View>
        </Modal>
      </Portal>
    </TouchableOpacity>
  );
}

export default ShiftSmall;
