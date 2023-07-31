import React, {useState, useEffect, useRef} from 'react';
import { Image, StyleSheet } from 'react-native';
import './FeedCard.css';
import axios from 'axios';
import {CustomButton, customButton} from '../CustomButton/CustomButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as faHeart } from '@fortawesome/free-solid-svg-icons'
import { faComment as faComment} from '@fortawesome/free-solid-svg-icons'
import { faXmark as faXmark } from '@fortawesome/free-solid-svg-icons'
import {conn_path} from '../../host_config'
import {Popup} from '../Popup/Popup';
import {ToastContainer, toast} from 'react-toastify';

export function FeedCard(props) {
    const post = props.post;
    const [likeCount, setLikeCount] = useState(post.like_count);
    const [likeStyle, setLikeStyle] = useState('');
    const [likeState, setLikeState] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([{comment: '', data: '', first_name:'', last_name: '', profile_photo: ''}]);
    const commentInput = useRef(null);
    const [commentState, setCommentState] = useState(0);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [tags, setTags] = useState([{tag: ''}]);
    
    // set profile photo if its null
    if (post.profile_photo === null) {
        post.profile_photo = "no-photo" + ".png";
    }

    // makes the date look pretty
    function formatDate (d) {
        var tempDate = new Date(d);

        var month = tempDate.getMonth()+1;
        var year = tempDate.getFullYear();
        var day = tempDate.getDate();
        var hour = tempDate.getHours();
        var min = tempDate.getMinutes();
        var suf = (hour < 12) ? 'AM' : 'PM';
        
        if (min < 10) min = '0'+ min;

        return (month+'/'+day+'/'+year+' @'+hour+':'+min+suf);
    };

    // check if the photo is liked or not 
    // only run once we do not need to update this list
    useEffect(() => {
        var likedPhotos = props.likedPhotos;
        
        for (var i = 0; i < likedPhotos.length; i++) {
            if (post.photo_id === likedPhotos[i].photo_id) {
                setLikeStyle('show-liked');
                setLikeState(true);
                break;
            }
        }
    }, []);

    // like a photo when like button pressed
    function likePhoto() {

        if (likeState) {
            axios.post(conn_path + '/likes/unlikePhoto', {
                photoId: post.photo_id
            })
            .then(res => {
                setLikeCount(likeCount - 1);
                setLikeState(false);
                setLikeStyle('');
            });
        } else {
            axios.post(conn_path + '/likes/likePhoto', {
                photoId: post.photo_id
            })
            .then(res => {
                setLikeCount(likeCount + 1);
                setLikeState(true);
                setLikeStyle('show-liked');
            });
        }
    }

    // get the comments of a photo
    useEffect(() => {
        axios.get(conn_path + '/comments/getComments', {
            params: {photoId: post.photo_id}
        })
        .then(res => {
            setComments(res.data);
        });
    }, [commentState]);

    // add comment to post
    function addCommentToPost() {

        axios.post(conn_path + '/comments/addComment', {
            comment: commentInput?.current?.value,
            photoId: post.photo_id
        })
        .then(res => {
            setCommentState(commentState + 1);
        });
    }

    // change style to show comment section
    const showCommentSection = () => {
        if (showComments === '') {
            setShowComments("show-comment-section");
        } else {
            setShowComments("");
        }
    }

    // get tags
    useEffect(() => {
        axios.get(conn_path + '/tags/getTags', {
            params: {photoId: post.photo_id}
        })
        .then(res => {
            setTags(res.data);
        });
    },[])

    const searchByTagLink = (tagName) => {
        // remove # from the beggining
        tagName = tagName.substring(1);
        
        // check if request is coming from user profile screen
        if (props.fromProfile) {
            axios.get(conn_path + '/tags/searchByTagUser',{
                params: {tagName: tagName}
            })
              .then(res => {
                props.setPosts(res.data);
            });
        } else {
            axios.get(conn_path + '/tags/searchByTag',{
                params: {tagName: tagName}
            })
              .then(res => {
                props.setPosts(res.data);
            });
        }
    }

    // only visable from user profile
    const deltePost = () => {
        axios.post(conn_path + '/deletePost', {
            photoId: post.photo_id
        })
        .then(res => {
            console.log(res.data);
            
            if (res.data == 'fail') {
                toast.error('There was a problem deleting the post. Try again later', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            } else {
                props.renderTrigger(props.rederPostsTrigger+1)
            }
        });
    }

    const showDeleteButton = () => {

        if (props.fromProfile == true) {
            return (
                <div className='feed-card-delete'>
                    <button onClick={() => setShowEditPopup(true)}>Edit</button>
                    
                    <FontAwesomeIcon 
                        className='delete-btn'
                        onClick={() => deltePost()}
                        icon={faXmark} 
                    />
                </div>
            )
        }

        return (<div></div>)        
    }

    return (
        <div className='feed-card'>

            <Popup trigger={showComments} setTrigger={setShowComments}>
                <div className="comment-section">
                    
                    <div className='comment'>

                        <ul className='comment-list'>
                            
                            {comments.slice(0).map((com) => (
                                <li key={Math.random()} className='comment-list-item'>
                                    <p>{com.first_name} {com.last_name}</p>
                                    
                                    <div className='comment-list-image'>
                                        <Image 
                                            style={styles.commentPhoto} 
                                            source={{uri: com.profile_photo}} 
                                        />
                                    </div>
                                    
                                    <div className='comment-list-comment'>
                                        <p>{com.comment}</p>
                                    </div>

                                    <p>{formatDate(com.date)}</p>
                                </li>
                            ))}
                        </ul>

                        <div className='add-comment-section'>
                            <textarea 
                                ref={commentInput}
                                type='text'
                            />

                            <div className='add-comment-button'>
                                <CustomButton 
                                    title='Comment'
                                    onPress={addCommentToPost}
                                />    
                            </div>          
                        </div>
                    </div>

                </div>
            </Popup>
            
            {showDeleteButton()}

            <div className='feed-card-title'>
                <div className='feed-card-profile-image'>
                    <Image style={styles.profilePhoto} source={{uri: post.profile_photo}} />
                </div>

                <div className='feed-card-user-name'>
                    <h4>{post.first_name + ' ' + post.last_name}</h4>  
                    <p>{formatDate(post.date)}</p>
                </div>
            </div>

            <div className="feed-card-divider">
            </div>

            <div className='feed-card-text'>
                <p>{post.caption}</p>
            </div>

            <div className='feed-card-image'>
                <Image source={{uri: post.photo}} />
            </div>

            <div className='tag-list'>
                <ul>
                    {tags.map((tag) => (
                        <li key={Math.random()}>
                            <a onClick={() => searchByTagLink(tag.tag)}>{tag.tag}</a>
                        </li>
                    ))}
                </ul>
            </div>

            <div className='feed-card-like-section'>
                <h4 className={likeStyle} >{likeCount} Likes</h4>
                <FontAwesomeIcon 
                    onClick={likePhoto} 
                    id="heart-icon"
                    className={likeStyle} 
                    icon={faHeart} 
                />

                <FontAwesomeIcon 
                    id="comment-icon"
                    onClick={() => setShowComments(true)}
                    icon={faComment} 
                />
            </div>
        </div> 
    );
}


const styles = StyleSheet.create ({
    profilePhoto: {
        width: 60,
        height: 60,
        borderRadius: 360,
        margin: 5,
        marginRight: 15,
    },
    commentPhoto: {
        width: 45,
        height: 45,
        borderRadius: 360,
    }
});