import React, { useState, useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import './Feed.css';
import {Navbar} from '../../UI_Elements/Navbar/Navbar';
import {FeedCard} from '../../UI_Elements/FeedCard/FeedCard';
import {AlbumCard} from '../../UI_Elements/AlbumCard/AlbumCard';
import {CustomButton} from '../../UI_Elements/CustomButton/CustomButton';
import axios from "axios";
import {conn_path} from '../../host_config';
import {Popup} from '../../UI_Elements/Popup/Popup';
import {ToastContainer, toast} from 'react-toastify';
import {Input} from '../../UI_Elements/Input/Inputs';

export function Feed({navigation}) {
  const [image, setImage] = useState({preview: '', data: ''});
  const [caption, setCaption] = useState('');
  const [posts, setPosts] = useState([{caption: '', photo: ''}]);
  const [albumPosts, setAlbumPosts] = useState([]);
  const [showPhotoPopup, setShowPhotoPopup] = useState(false);
  const [tag, setTag] = useState('');
  const [tagArray, setTagArray] = useState('');
  const [renderPosts, setRenderPosts] = useState(0);
  const [showSearchTag, setShowSearchTag] = useState(false);
  const [searchTagName, setSearchTagName] = useState('');
  const [reccomendedFriends, setReccomendedFriends] = useState([]);
  const [triggerReccomendFriend, setTriggerReccomdFriend] = useState(0);
  const [comments, setComments] = useState('');
  const [likedPhotos, setLikedPhotos] = useState([]);

  // get all of the posts
  useEffect(() => {
      axios.get(conn_path + '/getAllPosts')
      .then(res => {
          setPosts(res.data); 
      });
  }, [renderPosts]);


  // upload photo event handler
  const handleFileChange = event => {
    
    const image = {
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0],
    }
    setImage(image);
  }

  // get a list of all liked photos. a list will prevent too many calls to DB
  useEffect(() => {
    axios.get(conn_path + '/likes/getLikedPhotos')
    .then(res => {
      setLikedPhotos(res.data);
    });
  }, [])

  // get reccomened freinds
  useEffect(() => {
    axios.get(conn_path + '/friend/reccomendedFriends')
    .then(res => {
      setReccomendedFriends(res.data);
    });
  },[triggerReccomendFriend])

  // upload photos event
  const uploadPhotos = () =>  {
    
    let formData = new FormData();
    formData.append('file', image.data);
    formData.append('caption', caption);
    formData.append('tags', tagArray);
    
    // check if file was chosen
    if (image.data === '') {
      return;
    }

    axios.post(conn_path + "/uploadPhotos", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then((res) => {
      console.log(res.data);
      //reload posts using useState var
      setRenderPosts(renderPosts+1);

      // empty tag array 
      setTagArray([]);

      // close window
      setShowPhotoPopup(false);
    });
  }

  // add tagname to tag array
  function addTag() {
    const newTagArray = tagArray + '#' + tag + ' ';

    setTagArray(newTagArray);
  }

  // search for tag name
  const searchTag = () => {
    // if search is empty then load all posts
    // if else check if request is coming from feed or profile
    if (searchTagName === '') {
      axios.get(conn_path + '/tags/getAllPosts')
      .then(res => {
        setShowSearchTag(false);
        setPosts(res.data);  
      });
    } else {
      axios.get(conn_path + '/tags/searchByTag',{
        params: {tagName: searchTagName}
      })
      .then(res => {
        setPosts(res.data); 
        setShowSearchTag(false);
        setSearchTagName('');
      });
    }
  }

  // get posts with the most popular tags
  const getPopularTags = () => {
    axios.get(conn_path + '/tags/getPopularTags')
    .then(res => {
      setPosts(res.data); 
      setShowSearchTag(false);
      setSearchTagName('');
    });
  }


  // send friend request
  const addFriend = (user_id) => {

    axios.post(conn_path + '/friend/addFriend', {
        friend_id: user_id
    })
    .then(res => {
        // updata reccomended friends
        if (res.data === 'success')
           setTriggerReccomdFriend(reccomendedFriends + 1);
    });
  }

  return (
    <div className='feed-container'>
        
        <Navbar profilePhotoTrigger={true}/>

        {/* Add photo popup */}
        <Popup trigger={showPhotoPopup} setTrigger={setShowPhotoPopup}>
          <div className='feed-add-photo'>
            <h1>Add Photo</h1>
              
            <div className="feed-add-photo-upload">
              {image.preview && <img src={image.preview} width='180' height='180' />}
              <input type="file" name="file" onChange={handleFileChange}/>
            </div>
  
            <div className='tag-list'>
              <h3>Tags</h3>
              
              <input placeholder='Add Tag' onChange={(e) => setTag(e.target.value)} />
              <button onClick={() => addTag(tag.value)}>Add Tag</button>

              <p>{tagArray}</p>

            </div>

            <div className="feed-add-photo-enter-caption">
              <p>Enter Caption</p>
              <textarea onChange={(e) => setCaption(e.target.value)}/>
            </div>

            <div className="feed-add-photo-buttons">  

              <div className="feed-add-photo-upload-button">
                <CustomButton 
                  title="Upload"
                  onPress={uploadPhotos}
                />
              </div> 

            </div>

          </div>
        </Popup>


        {/* Search Tag popup */}
        <Popup trigger={showSearchTag} setTrigger={setShowSearchTag}>
          <input 
            placeholder='Enter Tag Name' 
            onChange={(e) => setSearchTagName(e.target.value)}
        />
        
          <button onClick={searchTag}>Seach Tag</button>
        </Popup>

        <div className='feed-create-post'>
            <ul>
              <li>
                <CustomButton 
                  title="Add Post"
                  onPress={() => setShowPhotoPopup(true)}
                />
              </li>
              {/*<li>
                <CustomButton 
                  title="Search Tag"
                  onPress={() => setShowSearchTag(true)}
                />
              </li>
              <li>
                <CustomButton 
                  title="Popular Tags"
                  onPress={() => getPopularTags()}
                />
              </li>*/}
            </ul>
        </div>


        <div className='reccomended-friends'>
          <ul>
            {reccomendedFriends.map((friend) => (
              
              <li>
                <div className='friend-card'>
                  <div className='reccomend-friend-img'>
                    <td><Image style={styles.profile_photo}  source={{uri: friend.profile_photo}} /></td>
                  </div>
                  
                  <h3>{friend.first_name + ' ' + friend.last_name}</h3>
                  <CustomButton title='Add Friend' onPress={() => addFriend(friend.user_id)} />

                </div>
              </li>

            ))}
          </ul>
        </div>


        <div className="feed">
          {posts.slice(0).reverse().map((post) => (
            <FeedCard
              key={Math.random()}
              post={post}
              setPosts = {setPosts}
              renderTrigger={setRenderPosts}
              likedPhotos={likedPhotos}
              fromProfile={false}
            />
          ))}

          {albumPosts.slice(0).reverse().map((post) => (
              <AlbumCard 
                name={post.first_name + " " + post.last_name}
                profilePhoto={post.profile_photo}
                date={post.date} 
                photos={post.photos}// array of photos urls
                album_name={post.name}
              />
          ))}
        </div>

        <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
    </div>
  );
}


const styles = StyleSheet.create ({
  profile_photo: {
      width: 80,
      height: 80,
      borderRadius: 360,
  }
});