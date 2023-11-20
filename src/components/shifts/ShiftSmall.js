import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { View } from "react-native";
import {
  Avatar,
  IconButton,
  Card,
  Text,
  useTheme,
  Modal,
  Portal,
  Button,
} from "react-native-paper";
import { destroyShiftAsync, fetchShiftsForMonthAsync } from "./shiftSlice";
import { selectUserId } from "../sessions/sessionSlice";
import { format } from "date-fns";
import { setPosition, setStart, setEnd, setDescription } from "./shiftSlice";

function ShiftSmall({ shift, navigation }) {
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const containerStyle = {
    backgroundColor: "white",
    padding: 10,
    marginRight: "30%",
    marginLeft: "30%",
    borderRadius: 10,
  };

  const LeftContent = () => (
    <View>
      <Text>{shift.hour}</Text>
      <Text
        style={{ color: "grey", fontSize: 12, marginTop: 4, marginLeft: 4 }}
      >
        {shift.duration}
      </Text>
    </View>
  );

  const handleDelete = async () => {
    const formattedDate = format(new Date(shift.start), "yyyy-MM");
    let shiftDetails = {
      user_id: userId,
      id: shift.id,
    };

    console.log("Trying to destroy the shift?", shiftDetails);
    console.log(formattedDate);
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

  function shiftStatusHelper(status) {
    if (status == "posting") {
      return (
        <>
          <Text>Posted shift</Text>
          <Text>for swap</Text>
        </>
      );
    } else if (status == "bidding") {
      return (
        <>
          <Text>Offering shift</Text>
          <Text>for swap</Text>
        </>
      );
    } else {
      return (
        <>
          <Text>status of</Text>
          <Text>shift unknown</Text>
        </>
      );
    }
  }

  return (
    <Card
      style={{
        backgroundColor: theme.shifts[shift.position].container,
        flex: 1,
      }}
    >
      <Card.Title
        title={shift.position}
        subtitle={shift.title}
        titleVariant="titleLarge"
        subtitleVariant="bodyMedium"
        left={() => LeftContent()}
        leftStyle={{ width: "auto" }}
        titleStyle={{ paddingRight: 0 }}
        right={() => (
          <Card.Actions>
            {shift.status !== "no" ? (
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {shiftStatusHelper(shift.status)}
              </View>
            ) : (
              <IconButton
                icon="pencil"
                mode="contained"
                iconColor={theme.shifts[shift.position].onColor}
                containerColor={theme.shifts[shift.position].color}
                onPress={showModal}
              />
            )}
            <Portal>
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
                    onPress={() => {}}
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
          </Card.Actions>
        )}
      />
    </Card>
  );
}

export default ShiftSmall;
