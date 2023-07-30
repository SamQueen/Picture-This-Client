import React, {useState, useEffect} from 'react';
import {Image, StyleSheet} from 'react-native';
import './Profile.css';
import {Navbar} from '../../UI_Elements/Navbar/Navbar';
import {FeedCard} from '../../UI_Elements/FeedCard/FeedCard';
import { CustomButton } from '../../UI_Elements/CustomButton/CustomButton';
import axios from 'axios';
import {conn_path} from '../../host_config'

export function Profile() {
    const [name, setName] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    const [profileStyle, setProfileStyle] = useState('');
    const [image, setImage] = useState({preview: '', data: ''});
    const [posts, setPosts] = useState([{caption: '', photo: ''}]);
    const [renderPostsTrigger, setRenderPostsTrigger] = useState(0);
    const [profilePhotoTrigger, setProfilePhotoTrigger] = useState(0);
    const [likedPhotos, setLikedPhotos] = useState([]);

    // get all of the users posts
    useEffect(() => {
        axios.get(conn_path + '/getUserPosts')
        .then(res => {
            setPosts(res.data);  
            console.log(res.data);
        });
    }, [renderPostsTrigger]);

    // get a list of all liked photos. a list will prevent too many calls to DB
    useEffect(() => {
        axios.get(conn_path + '/likes/getLikedPhotos')
        .then(res => {
        setLikedPhotos(res.data);
        });
    }, [])

    // get user name and profile photo
    useEffect(() => {
        axios.get(conn_path + "/HandleUser/getProfileData")
        .then(res => {
            setName(res.data.first_name + " " + res.data.last_name);
            setProfilePhoto(res.data.profile_photo);
        });
    },[profilePhotoTrigger]);

    // changes the style of the change photo window from hidden to display
    function changeProfilePhoto() {
        if (profileStyle === '') {
            setProfileStyle("show-cloud");
        } else {
            setProfileStyle("");
        }
    }


    // upload photo event handler
    const handleFileChange = event => {
        
        const image = {
            preview: URL.createObjectURL(event.target.files[0]),
            data: event.target.files[0],
        }
        setImage(image);
    }

    // upload photos event
    const changeProfilePhotoPost = () =>  {
    
        let formData = new FormData();
        formData.append('file', image.data);

        // check if file has been added
        if (image.data === '') {
            return;
        }

        axios.post(conn_path + "/changeProfilePhoto", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
        })
        .then((res) => {
            console.log(res.data);
            changeProfilePhoto();
            console.log("trigger" + profilePhotoTrigger)
            setProfilePhotoTrigger(profilePhotoTrigger+1);
        });
    }

    return (
        <div className='profile-container'>
            
            <Navbar profilePhotoTrigger={profilePhotoTrigger}/>

            <div className='profile-banner'>    
                <div className='profile-banner-user'>
                    <h4>{name}</h4>

                    <div className="profile-photo">
                        <Image style={styles.profile_photo}  source={{uri: profilePhoto}} />  
                    
                        <CustomButton 
                            title='Change Photo'
                            onPress={(() => {{changeProfilePhoto()}})}
                        />
                    </div>
                </div>  

                <div className='profile-banner-image'>
                   <img src={require('../../Images/singapore.jpg')} /> 
                </div>

                <div className='profile-banner-other'>
                    
                </div>
            </div>

            <div className='profile-user-feed'>
                {posts.slice(0).reverse().map((post) => (
                    <FeedCard
                        key={Math.random()}
                        post={post}
                        setPosts = {setPosts}
                        //renderTrigger={setRenderPosts}
                        likedPhotos={likedPhotos}
                        fromProfile={false}
                    />
                ))}
            </div>

            <div className='profile-cloud' id={profileStyle} />

            <div className='change-profile-photo' id={profileStyle}>
                <h1>Change Profile Photo</h1>
                
                <div className="profile-add-photo-upload">
                    {image.preview && <img src={image.preview} width='180' height='180' />}
                    <input type="file" name="file" onChange={handleFileChange}/>
                </div>

                <div className="profile-add-photo-submit">
                    <CustomButton 
                        title='Change Photo'
                        onPress={changeProfilePhotoPost}
                    />
                </div>

                <div className="profile-add-photo-cancel">
                    <CustomButton 
                        title='Cancel'
                        onPress={changeProfilePhoto}
                    />
                </div>
                
            </div>

        </div>
    );
}


const styles = StyleSheet.create ({
    profile_photo: {
        width: 220,
        height: 220,
        borderRadius: 360,
    }
});