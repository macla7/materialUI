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
  const { item } = props;

  const buttonPressed = useCallback(() => {
    Alert.alert("Show me more");
  }, []);

  const itemPressed = useCallback(() => {
    Alert.alert(item.title);
  }, []);

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
    <TouchableOpacity onPress={itemPressed} style={styles.item} testID="item">
      {item.position ? (
        <ShiftSmall shift={item} />
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
    </TouchableOpacity>
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
