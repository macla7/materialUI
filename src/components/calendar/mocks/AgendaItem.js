import isEmpty from "lodash/isEmpty";
import React, { useCallback } from "react";
import {
  StyleSheet,
  Alert,
  View,
  TouchableOpacity,
  Button,
} from "react-native";
import ShiftSmall from "../../shifts/ShiftSmall";
import { Card, Text } from "react-native-paper";

const AgendaItem = (props) => {
  const { item, navigation } = props;

  // function itemPressedFunc() {
  //   if (item.title === "") {
  //     Alert.alert("no title");
  //   } else {
  //     Alert.alert(item.title);
  //   }
  // }

  if (isEmpty(item)) {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned Today</Text>
      </View>
    );
  }

  const LeftContent = () => (
    <View>
      <Text>{item.hour}</Text>
      <Text
        style={{ color: "grey", fontSize: 12, marginTop: 4, marginLeft: 4 }}
      >
        {item.duration}
      </Text>
    </View>
  );

  return (
    <View style={styles.item} testID="item">
      {item.position ? (
        <ShiftSmall shift={item} navigation={navigation} />
      ) : (
        <>
          <Card
            style={{
              backgroundColor: "white",
              flex: 1,
            }}
          >
            <Card.Title
              title={item.title}
              titleVariant="titleMedium"
              left={() => LeftContent()}
              leftStyle={{ width: "auto" }}
              titleStyle={{ paddingRight: 0 }}
            />
          </Card>
        </>
      )}
    </View>
  );
};

export default React.memo(AgendaItem);

const styles = StyleSheet.create({
  item: {
    padding: 10,
    paddingTop: 5,
    backgroundColor: "white",
    flexDirection: "row",
  },
  itemHourText: {
    color: "black",
  },
  itemDurationText: {
    color: "grey",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  itemTitleText: {
    color: "black",
    marginLeft: 16,
    fontWeight: "bold",
    fontSize: 16,
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: "center",
  },
  emptyItemText: {
    color: "lightgrey",
    fontSize: 14,
  },
});
