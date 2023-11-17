import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, FormControl, Input, Button, HStack } from "native-base";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons/faPaperPlane";
import { createCommentAsync } from "../postSlice";
import { createNotificationBlueprint } from "../../notifications/notificationBlueprintAPI";
import { selectUserId } from "../../sessions/sessionSlice";

function CommentForm({ postId, commentRef }) {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const userId = useSelector(selectUserId);

  function commentOnPost(text) {
    let commentDetails = {
      post_id: postId,
      user_id: userId,
      body: text,
    };

    dispatch(createCommentAsync(commentDetails));
    setComment("");

    // if above succeeds ..?
    let notification_blueprint = {
      notificationable_type: "Post",
      notificationable_id: postId,
      notification_type: 8,
    };
    let second_notification_blueprint = {
      notificationable_type: "Post",
      notificationable_id: postId,
      notification_type: 9,
    };

    createNotificationBlueprint(notification_blueprint);
    createNotificationBlueprint(second_notification_blueprint);
  }

  return (
    <Box p="2" width="100%" bgColor="white">
      <FormControl>
        <HStack alignItems="stretch" justifyContent="center">
          <Input
            flex="1"
            m="0"
            type="text"
            value={comment}
            onChange={(e) => setComment(e.nativeEvent.text)}
            borderRadius="50"
            ref={commentRef}
            placeholder="Comment on post..."
          />
          <Button
            ml="2"
            variant="unstyled"
            onPress={() => {
              commentOnPost(comment);
            }}
          >
            <FontAwesomeIcon icon={faPaperPlane} color="#171717" />
          </Button>
        </HStack>
      </FormControl>
    </Box>
  );
}

export default CommentForm;
