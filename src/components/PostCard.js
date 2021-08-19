import React, {useContext} from 'react';
import {
  Container,
  Card,
  UserInfo,
  UserImg,
  UserInfoText,
  PostTime,
  UserName,
  PostText,
  PostImg,
  InteractionWrapper,
  Interaction,
  InteractionText,
  Divider,
} from '../styles/FeedStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../navigation/AuthProvider';
import moment from 'moment';
import ProgressiveImage from './ProgressiveImage';
import {TouchableOpacity} from 'react-native';
import useUser from '../hooks/useUser';

const PostCard = ({item, onDelete, onPress, hideDelete}) => {
  const {user, logout} = useContext(AuthContext);
  const {userData, userLoading} = useUser(item.userId);
  const getUserImage = () => {
    if (userData && userData.userImg) {
      return {uri: userData.userImg};
    }

    return require('../assets/users/no-user-img.png');
  };

  console.log('user data', userData, item);

  likeIcon = item.liked ? 'heart' : 'heart-outline';
  likeIconColor = item.liked ? '#2e64e5' : '#333';

  if (item.likes === 1) {
    likeText = '1 Like';
  } else if (item.likes > 1) {
    likeText = item.likes + ' Likes';
  } else {
    likeText = 'Like';
  }

  if (item.comments === 1) {
    commentText = '1 Comment';
  } else if (item.comments > 1) {
    commentText = item.comments + ' Comments';
  } else {
    commentText = 'Comment';
  }

  if (userLoading) {
    return null;
  }

  return (
    <Card>
      <UserInfo>
        <UserImg source={getUserImage()} />
        <UserInfoText>
          <TouchableOpacity onPress={onPress}>
            <UserName>{userData.fname + ' ' + userData.lname}</UserName>
          </TouchableOpacity>
          <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>
        </UserInfoText>
      </UserInfo>
      <PostText>{item.post}</PostText>
      {/* {item.postImg ? <PostImg source={{uri: item.postImg}} />  */}
      {item.postImg ? (
        <ProgressiveImage
          defaultImageSource={require('../assets/imgs/default-img.jpeg')}
          source={{uri: item.postImg}}
          style={{width: '100%', height: 250}}
          resizeMode="cover"
        />
      ) : (
        <Divider />
      )}

      <InteractionWrapper>
        <Interaction active={item.liked}>
          <Ionicons name={likeIcon} size={26} color={likeIconColor} />
          <InteractionText active={item.liked}>{likeText}</InteractionText>
        </Interaction>
        <Interaction>
          <Ionicons name="md-chatbubble-outline" size={26} />
          <InteractionText>{commentText}</InteractionText>
        </Interaction>
        {user.uid === item.userId && !hideDelete ? (
          <Interaction onPress={() => onDelete(item.id)}>
            <Ionicons name="md-trash-bin-outline" size={26} />
          </Interaction>
        ) : null}
      </InteractionWrapper>
    </Card>
  );
};

export default PostCard;
