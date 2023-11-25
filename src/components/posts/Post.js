import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
// import Bids from "./bids/Bids.js";
// import Shift from "./shifts/Shift.js";
import { createConsumer } from "@rails/actioncable";
// import DP from "../layout/DP";
import { format, formatDistanceToNow } from "date-fns";
// import ButtonGroup from "./ButtonGroup";
// import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import { faClock } from "@fortawesome/free-regular-svg-icons/faClock.js";
// import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
// import Comments from "./comments/Comments";
import HenIcon from "../../../assets/animal-pngs/002-hen.png";
import LionIcon from "../../../assets/animal-pngs/032-lion.png";
import KoalaIcon from "../../../assets/animal-pngs/036-koala.png";

import { domain } from "@env";
import { selectUserId } from "../sessions/sessionSlice.js";
// import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
// import Likes from "./likes/Likes.js";
import { Avatar, Button, Card, Text, Icon } from "react-native-paper";
import { useTheme } from "react-native-paper";
import { Image, View } from "react-native";
import Shift from "../shifts/Shift";

global.addEventListener = () => {};
global.removeEventListener = () => {};

const consumer = createConsumer(`ws://${domain}/cable`);

function Post(props) {
  const [bids, setBids] = useState(props.post.bids);
  const [minPrice, setMinPrice] = useState(null);
  const [likes, setLikes] = useState(props.post.likes);
  const [comments, setComments] = useState(props.post.comments);
  const userId = useSelector(selectUserId);
  const theme = useTheme();

  const postsChannel = useMemo(() => {
    return consumer.subscriptions.create(
      { channel: "PostsChannel", post: props.post.id },
      {
        received(postData) {
          if (postData.type == "Bids") {
            setBids(postData.body.bids);
            setMinPrice(setNewMinimumPrice(postData.body.bids));
          }
          if (postData.type == "Likes") {
            setLikes(postData.body);
          }
          if (postData.type == "Comments") {
            setComments(postData.body.comments);
          }
        },
      }
    );
  });

  useEffect(() => {
    setBids(props.post.bids);
    setLikes(props.post.likes);
    setComments(props.post.comments);
    setMinPrice(setNewMinimumPrice(props.post.bids));
    return () => {
      postsChannel.unsubscribe();
    };
  }, [
    JSON.stringify(props.post.likes),
    JSON.stringify(props.post.bids),
    JSON.stringify(props.post.comments),
  ]);

  function setNewMinimumPrice(bids) {
    if (bids == undefined || bids.length == 0) {
      return props.post.reserve;
    } else {
      return bids[0].price;
    }
  }

  function canSeeSettings(item) {
    if (item.user_id == userId || isUserAdmin(userId)) {
      return true;
    }
    return false;
  }

  function isUserAdmin(userId) {
    let post_admins = props.post.post_admins;
    if (post_admins) {
      // Loop through the post_admins array
      for (let i = 0; i < post_admins.length; i++) {
        // Check if the current user's ID matches the given userId
        if (post_admins[i].id === userId) {
          return true;
        }
      }
    }
    // If no match is found, return false
    return false;
  }

  function getColor(designPart) {
    if (props.post.shift.position === undefined) {
      return "";
    }

    if (designPart === "container") {
      return shiftsColors[props.post.shift.position].container;
    }

    if (designPart === "color") {
      return shiftsColors[props.post.shift.position].container;
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
    <Card style={{ margin: 10, backgroundColor: "#fff" }}>
      <Card style={{ backgroundColor: "#fff" }}>
        <Shift shift={props.post.shift} />
        <Text style={{ margin: 10 }} variant="bodyLarge">
          {props.post.body}
        </Text>
      </Card>
      {/* From postForm */}

      {/* {props.post.comments.map((item, i) => {
          <Card style={{ backgroundColor: "#fff", margin: 6 }}>
            <Card.Title
              title="Jeff Bing"
              subtitle="⭐️3"
              left={() => LeftContent(LionIcon)}
            />
            <Card.Content>
              <Card
                style={{
                  backgroundColor: theme.colors.customPurpleContainer,
                }}
              >
                <Card.Title title="Thursday 2 Sep" subtitle="NIGHT" />
              </Card>
            </Card.Content>
          </Card>;
        })} */}

      <View
        style={{
          borderLeftWidth: 1,
          marginLeft: 20,
          marginTop: 5,
          borderColor: theme.colors.outline,
        }}
      >
        <Card.Title
          title="Swaps Offered"
          titleVariant="titleSmall"
          titleStyle={{
            minHeight: 0,
            marginBottom: 0,
          }}
          leftStyle={{
            justifyContent: "center",
            alignItems: "center",
            marginRight: 0,
          }}
          left={() => <Icon size={16} source="calendar-multiple" />}
          style={{ minHeight: 40, paddingLeft: 2 }}
        />

        {bids.map((item, i) => {
          let newShift = {
            ...item.shift_bidded,
            avatar_url: item.avatar_url,
            owner_name: item.bidder_name,
          };
          return (
            <View style={{ marginBottom: 10, marginLeft: -20 }}>
              <Shift shift={newShift} />
              <Text style={{ marginTop: 5, marginLeft: 35 }}>
                {formatDistanceToNow(new Date(item.created_at), {
                  addSuffix: true,
                })}
              </Text>
            </View>
          );
        })}
      </View>

      <Card.Actions>
        {/* <Button mode="contained-tonal">Like</Button> */}
        <Button mode="contained-tonal">Comment</Button>
        <Button
          mode="contained"
          onPress={() => {
            props.navigation.navigate("Offer Shift", {
              postId: props.post.id,
            });
          }}
        >
          Offer Swap
        </Button>
      </Card.Actions>
    </Card>
  );
}

export default Post;
