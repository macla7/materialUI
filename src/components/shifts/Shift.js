import React from "react";
import { format } from "date-fns";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { useTheme } from "react-native-paper";
import { Image, View } from "react-native";

function Shift({ shift }) {
  const theme = useTheme();

  function formatDateTime(date, formatter) {
    if (date === undefined) {
      return "loading...";
    } else {
      return format(new Date(date), formatter);
    }
  }

  function getColor(designPart) {
    if (shift.position === undefined) {
      return "";
    }

    if (designPart === "container") {
      return shiftsColors[shift.position].container;
    }

    if (designPart === "color") {
      return shiftsColors[shift.position].container;
    }
  }

  const shiftsColors = {
    PM: {
      key: "PM",
      container: theme.colors.customBlueContainer,
      color: theme.colors.customBlue,
    },
    AM: {
      key: "AM",
      container: theme.colors.customOrangeContainer,
      color: theme.colors.customOrange,
    },
    Night: {
      key: "Night",
      container: theme.colors.customPurpleContainer,
      color: theme.colors.customPurple,
    },
    Custom: {
      key: "Custom",
      container: theme.colors.customPinkContainer,
      color: theme.colors.customPink,
    },
    personal: { key: "personal", color: "black" },
  };

  const LeftContent = (source) => (
    <Avatar.Image
      source={() => (
        <Image
          source={{ uri: source }}
          style={{
            width: 30,
            height: 30,
          }} // Set the width and height of the image
        />
      )}
      size={48}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        shadowRadius: "5",
        shadowColor: theme.colors.shadow,
        shadowOffset: "1 1",
        shadowOpacity: 0.1,
        backgroundColor: "white",
      }}
    />
  );

  return (
    <Card style={{ backgroundColor: getColor("container") }}>
      <Card.Title
        title={formatDateTime(shift.start, "EEE do LLL")}
        subtitle={shift.owner_name}
        titleVariant="titleLarge"
        subtitleVariant="bodyMedium"
        left={() => LeftContent(shift.avatar_url)}
      />

      <Card.Content>
        {shift.description == "" ? null : (
          <Text variant="bodyMedium">{shift.description}</Text>
        )}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text variant="bodyLarge">{shift.position}</Text>
          <Text variant="bodyLarge">
            {formatDateTime(shift.start, "p") +
              " → " +
              formatDateTime(shift.end, "p")}
          </Text>
        </View>
      </Card.Content>
      <Card.Actions>
        {/* <Button
              // textColor={shiftsColors[shift.position].color}
              onPress={() => {
                const currentDate = new Date();
                navigation.navigate("Add Shift", {
                  returnScreen: "Create Post",
                });
              }}
            >
              Edit
            </Button> */}
        {/* <Button buttonColor={shiftsColors[shifts.position].color}>
                  Delete
                </Button> */}
      </Card.Actions>
    </Card>
  );
}

export default Shift;
