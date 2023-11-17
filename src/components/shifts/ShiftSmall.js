import React from "react";
import { format } from "date-fns";
import { View } from "react-native";
import { Avatar, IconButton, Card, Text, useTheme } from "react-native-paper";

function ShiftSmall({ shift }) {
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

  return (
    <Card
      style={{
        backgroundColor: theme.shifts[shift.position].container,
        flex: 1,
      }}
    >
      <Card.Title
        title={shift.position}
        subtitle={shift.description}
        titleVariant="titleLarge"
        subtitleVariant="bodySmall"
        left={() => LeftContent()}
        leftStyle={{ width: "auto" }}
        titleStyle={{ paddingRight: 0 }}
        right={() => (
          <Card.Actions>
            <IconButton
              icon="pencil"
              mode="contained"
              iconColor={theme.shifts[shift.position].onColor}
              containerColor={theme.shifts[shift.position].color}
            />
          </Card.Actions>
        )}
      />
    </Card>
  );
}

export default ShiftSmall;
