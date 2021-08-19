import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import {
  InputField,
  InputWrapper,
  AddImage,
  SubmitBtn,
  SubmitBtnText,
  StatusWrapper,
} from '../styles/AddPost';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../navigation/AuthProvider';

const AddPostScreen = () => {
  const {user, logout} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState(null);

  const takePhoto = () => {
    launchCamera(
      {
        cropping: true,
        width: 500,
        height: 500,
        mediaType: 'photo',
      },
      result => {
        console.log('GOT RESULT', result);
        const imageUri = result.uri;
        setImage(imageUri);
      },
    );
  };
  const uploadPhoto = () => {
    launchImageLibrary(
      {
        cropping: true,
        width: 500,
        height: 500,
        mediaType: 'photo',
      },
      result => {
        const imageUri = result.uri;
        setImage(imageUri);
      },
    );
  };

  const submitPost = async () => {
    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage();
        console.log('Image Url: ', imageUrl);
      }

      firestore()
        .collection('posts')
        .add({
          userId: user.uid,
          post: post,
          postImg: imageUrl,
          postTime: firestore.Timestamp.fromDate(new Date()),
          likes: null,
          comments: null,
        })
        .then(() => {
          console.log('Post Added!');
          Alert.alert(
            'Post uploaded!',
            'Your post has been uploaded  Successfully!',
          );
          setPost(null);
        })
        .catch(err => {
          console.log(
            'Something went wrong with added post to firestore.',
            err,
          );
        });
    } catch (error) {
      console.log('ERROR SUBMITTING POST', error);
    }
  };

  const uploadImage = async () => {
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(
          (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100,
        ),
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      setImage(null);
      return url;
    } catch (e) {
      console.log(e);
      setImage(null);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <InputWrapper>
        {image !== null ? <AddImage source={{uri: image}} /> : null}
        <InputField
          placeholder="What's on your mind?"
          multiline
          numberOfLines={7}
          value={post}
          onChangeText={content => setPost(content)}
        />
        {uploading ? (
          <StatusWrapper>
            <Text>{transferred} % </Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </StatusWrapper>
        ) : (
          <SubmitBtn onPress={submitPost}>
            <SubmitBtnText>Post</SubmitBtnText>
          </SubmitBtn>
        )}
      </InputWrapper>

      <ActionButton buttonColor="#2e64e5">
        <ActionButton.Item
          buttonColor="#9b59b6"
          title="Take Photo"
          onPress={takePhoto}>
          <Icon name="camera-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#3498db"
          title="Choose Photo"
          onPress={uploadPhoto}>
          <Icon name="md-images-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

export default AddPostScreen;