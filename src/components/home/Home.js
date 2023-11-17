import React, { useEffect } from "react";
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
import { View, Text } from "react-native";

function Home({ navigation }) {
  const homePosts = useSelector(selectHomePosts);
  const dispatch = useDispatch();
  const newUser = useSelector(selectNewUser);

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    console.log("home posts are!!!");
    console.log(homePosts);
  }, [homePosts]);

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
        "id": 0,
        "body": "Got a friends birthday, could some please cover 🙏",
        "user_id": 324,
        "ends_at": "${formatISO(addDays(new Date(), 2))}",
        "created_at": "${formatISO(subDays(new Date(), 1))}",
        "updated_at": "${formatISO(subDays(new Date(), 1))}",
        "group_id": 1,
        "hide": false,
        "solution": "swap",
        "group_name": "Gotham General",
        "postor_name": "Tess Georges",
        "avatar_url": "https://shiftmarket.herokuapp.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBck1CIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--138ea1df8b223ff85a40c3146918b5570514c9cf/profilePictureUser421.jpg",
        "shift": {
            "id": 12,
            "start": "2023-11-28T20:00:24.000Z",
            "end": "2023-11-29T04:30:24.000Z",
            "created_at": "2023-11-13T04:25:40.373Z",
            "updated_at": "2023-11-13T04:25:40.373Z",
            "bid_id": null,
            "position": "AM",
            "description": "RN ward E"
        },
        "likes": [
            {
                "id": 27,
                "post_id": 4,
                "user_id": 402,
                "created_at": "2023-07-15T08:32:44.012Z",
                "updated_at": "2023-07-15T08:32:44.012Z"
            }
        ],
        "comments": [
            {
                "id": 1,
                "post_id": 4,
                "user_id": 1,
                "body": "Would love too!",
                "created_at": "${formatISO(subDays(new Date(), 2))}",
                "updated_at": "${formatISO(subDays(new Date(), 2))}",
                "avatar_url": "https://shiftmarket.herokuapp.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBckVCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--c2e88df50446700c2152f5f38f15ba4ba1801376/profilePictureUser420.jpg",
                "commentor_name": "Fred Smith"
            }
        ],
        "bids": [
            {
                "id": 16,
                "post_id": 4,
                "user_id": 402,
                "created_at": "${formatISO(subHours(new Date(), 2))}",
                "updated_at": "${formatISO(subHours(new Date(), 2))}",
                "avatar_url": "https://shiftmarket.herokuapp.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcTBCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2e9f2a9b0046539f89ac6ee560ba1ad155a5643b/profilePictureUser418.jpg",
                "bidder_name": "Bob Clark"
            },
            {
                "id": 11,
                "post_id": 4,
                "user_id": 2,
                "created_at": "${formatISO(subDays(new Date(), 1))}",
                "updated_at": "${formatISO(subDays(new Date(), 1))}",
                "avatar_url": "https://shiftmarket.herokuapp.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcThCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--e4a4a8d088c06790dc942d862602a44343f47a22/profilePictureUser419.jpg",
                "bidder_name": "Amy Chen"
            },
            {
                "id": 10,
                "post_id": 4,
                "user_id": 1,
                "created_at": "${formatISO(subDays(new Date(), 2))}",
                "updated_at": "${formatISO(subDays(new Date(), 2))}",
                "avatar_url": "https://shiftmarket.herokuapp.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBckVCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--c2e88df50446700c2152f5f38f15ba4ba1801376/profilePictureUser420.jpg",
                "bidder_name": "Fred Smith"
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
      {homePosts.length > 0 ? (
        <Post
          post={homePosts[0]}
          key={0}
          navigation={navigation}
          singularView={false}
          example={true}
        />
      ) : (
        <Post
          post={examplePost}
          key={examplePost.id}
          navigation={navigation}
          singularView={false}
          example={true}
        />
      )}
    </View>
  );
}

export default Home;
