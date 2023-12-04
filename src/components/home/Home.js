import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import Posts from "../posts/Posts";
import {
  selectHomePosts,
  fetchPostsHomeAsync,
  selectStatus,
} from "../posts/postSlice";
import Post from "../posts/Post";
import {
  addDays,
  formatISO,
  subDays,
  setHours,
  setMinutes,
  setSeconds,
  subHours,
} from "date-fns";
import { selectNewUser } from "../sessions/sessionSlice";
import { View, ScrollView } from "react-native";
import { Appbar, Portal, Dialog, Text, Button } from "react-native-paper";

function Home({ navigation }) {
  const homePosts = useSelector(selectHomePosts);
  const dispatch = useDispatch();
  const newUser = useSelector(selectNewUser);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {}, [homePosts]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      newUserFlow();
      refresh(); // Call the function when the screen is focused (navigated to)
    });
    return () => {
      unsubscribe(); // Clean up the listener when the component is unmounted (navigated away)
    };
  }, [newUser]);

  function refresh() {
    dispatch(fetchPostsHomeAsync());
  }

  function newUserFlow() {
    if (newUser) {
      navigation.navigate("InfoStackScreen");
    }
  }

  const examplePost = JSON.parse(`{
        "id": 16,
        "body": "Got my Grandma’s birthday that day… someone please cover 🙏🥳",
        "user_id": 1,
        "created_at": "${formatISO(subDays(new Date(), 1))}",
        "updated_at": "${formatISO(subDays(new Date(), 1))}",
        "group_id": 21,
        "hide": false,
        "solution": "swap",
        "shift_id": 127,
        "group_name": null,
        "postor_name": "Fred Smith",
        "avatar_url": "http://192.168.0.71:3000/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--1023a7bc9187c6febb76180e67ab6537b9db20e3/007-whale.png",
        "post_admins": [
            {
                "id": 1,
                "email": "fred@bing.com",
                "created_at": "2023-11-11T07:12:14.732Z",
                "updated_at": "2023-11-11T08:08:30.083Z",
                "role": "admin",
                "name": "Fred Smith",
                "uid": null,
                "provider": null,
                "email_confirmed": false,
                "confirm_token": "6_-IwFk4BG1eqNCu-j7gQQ"
            }
        ],
        "likes": [],
        "shift": {
            "id": 127,
            "start": "${formatISO(
              setSeconds(setMinutes(setHours(addDays(new Date(), 19), 9), 0), 0)
            )}",
            "end": "${formatISO(
              setSeconds(
                setMinutes(setHours(addDays(new Date(), 19), 15), 0),
                0
              )
            )}",
            "created_at": "${formatISO(subDays(new Date(), 2))}",
            "updated_at": "${formatISO(subDays(new Date(), 2))}",
            "position": "AM",
            "description": "RN - Ward D",
            "user_id": 1,
            "status": "posting",
            "owner_name": "Fred Smith",
            "avatar_url": "http://192.168.0.71:3000/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--1023a7bc9187c6febb76180e67ab6537b9db20e3/007-whale.png"
        },
        "comments": [],
        "bids": [
            {
                "id": 5,
                "post_id": 16,
                "user_id": 24,
                "created_at": "${formatISO(subHours(new Date(), 2))}",
                "updated_at": "${formatISO(subHours(new Date(), 2))}",
                "approved": false,
                "shift_id": 149,
                "shift_bidded": {
                    "id": 149,
                     "start": "${formatISO(
                       setSeconds(
                         setMinutes(setHours(addDays(new Date(), 19), 9), 0),
                         0
                       )
                     )}",
                    "end": "${formatISO(
                      setSeconds(
                        setMinutes(setHours(addDays(new Date(), 19), 15), 0),
                        0
                      )
                    )}",
                    "created_at": "${formatISO(subDays(new Date(), 2))}",
                    "updated_at": "${formatISO(subDays(new Date(), 2))}",
                    "position": "PM",
                    "description": "",
                    "user_id": 24,
                    "status": "no"
                },
                "avatar_url": "http://192.168.0.71:3000/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBIUT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--135397931e88819892a4785f081bbca13865da28/027-deer.png",
                "bidder_name": "Laurel Schuppe"
            }
        ]
    }`);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "stretch",
      }}
    >
      <Appbar.Header mode="small">
        <Appbar.Content title="Swaps" />
        <Appbar.Action
          icon="information"
          onPress={() => {
            setVisible(true);
          }}
        />
        <Appbar.Action
          icon="magnify"
          onPress={() => {
            setVisible(true);
          }}
        />
      </Appbar.Header>

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Button fucntionality not yet implemented for MVP 2.0
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <ScrollView>
        {homePosts.length > 0 ? (
          homePosts.map((item, i) => {
            return (
              <Post
                post={item}
                key={i}
                navigation={navigation}
                singularView={false}
                example={true}
              />
            );
          })
        ) : (
          <View>
            <View
              style={{
                display: "flex",
                marginTop: 5,
                alignItems: "center",
              }}
            >
              <Text>Example Post</Text>
            </View>
            <Post
              post={examplePost}
              key={examplePost.id}
              navigation={navigation}
              singularView={false}
              example={true}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default Home;
