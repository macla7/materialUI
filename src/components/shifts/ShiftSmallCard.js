import React from "react";
import { View } from "react-native";
import { IconButton, Card, Text, useTheme } from "react-native-paper";

function ShiftSmallCard({ shift, offering }) {
  const theme = useTheme();

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
        minHeight: 50,
      }}
    >
      <Card.Title
        title={shift.position}
        subtitle={shift.title}
        titleVariant="titleLarge"
        subtitleVariant="bodyMedium"
        left={() => LeftContent()}
        leftStyle={{ width: "auto" }}
        rightStyle={{ padding: 0 }}
        titleStyle={{ paddingRight: 0 }}
        style={{ minHeight: 60 }}
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
            ) : offering ? null : (
              <IconButton
                icon="pencil"
                mode="contained"
                size={16}
                iconColor={theme.shifts[shift.position].onColor}
                containerColor={theme.shifts[shift.position].color}
              />
            )}
          </Card.Actions>
        )}
      />
    </Card>
  );
}

export default ShiftSmallCard;
