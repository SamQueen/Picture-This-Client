import React, { useState, useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import './Navbar.css';
import {Input} from '../Input/Inputs';
import {CustomButton} from '../CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import {conn_path} from '../../host_config';
import {Popup} from '../Popup/Popup';

export function Navbar(props) {
    const navigation = useNavigation();
    const [profilePhoto, setProfilePhoto] = useState('');
    const [friendSearch, setFriendSearch] = useState('');
    const [allFriends, setAllFriends] = useState([{date: '', first_name: '', last_name: '', hometown: '', profile_photo: ''}]);
    const [showAllFriendList, setShowAllFriendList] = useState(false);
    const [potentialFriends, setPotentialFriends] = useState([]);
    const [matchingFriends, setMatchingFriends] = useState([]);
    const [showFriendSearch, setShowFriendSearch] = useState(false);

    // makes the date look pretty
    function formatDate (d) {
        var tempDate = new Date(d);

        var month = tempDate.getMonth()+1;
        var year = tempDate.getFullYear();
        var day = tempDate.getDate();

        return (month+'/'+day+'/'+year);
    };

    // redirect to user feed when logo clicked
    function goToFeed() {
        navigation.navigate('Feed');
    }

    // filter the recomended friends based on input from search bar
    const filterFriends = () => {
        var matching = [];

        if (friendSearch === '') 
            return;

        for (var i = 0; i < potentialFriends.length; i++) {
            var friend = potentialFriends[i];
            var fName = friend.first_name.toLocaleLowerCase();
            var lName = friend.last_name.toLocaleLowerCase();
            var input = friendSearch.toLocaleLowerCase();

            if (fName.substring(0,input.length) === input)
                matching.push(friend);
            else if (lName.substring(0,input.length) === input)
                matching.push(friend);
        }
        setMatchingFriends(matching);
    }

    // check if friend search input is empty
    useEffect(() => {
        filterFriends();
        
        if (friendSearch == '') 
            setShowFriendSearch(false);
        else if (matchingFriends.length == 0)
            setShowFriendSearch(false);
        else
            setShowFriendSearch(true);

    }, [friendSearch]);

    // find a list of potetnial friends
    useEffect(() => {
        axios.get(conn_path + "/friend/getPotentialFriends")
        .then(res => {
            setPotentialFriends(res.data);
        });
    },[matchingFriends]);

    // use post request to get user photos
    useEffect(() => {
        axios.get(conn_path + "/HandleUser/getProfileData")
        .then(res => {
            setProfilePhoto(res.data.profile_photo);
        });
    }, [props.profilePhotoTrigger])


    // send friend request
    const addFriend = (user_id) => {
        axios.post(conn_path + '/friend/addFriend', {
            friend_id: user_id
        })
        .then(res => {
            setFriendSearch('');
            setMatchingFriends([]);
        });
    }

    // remove friend
    const removeFriend = (user_id) => {
        axios.post(conn_path + '/friend/removeFriend' ,{
            friend_id: user_id
        })
        .then(res => {
            getFriendList();
        });
    }

    // get friend list
    const getFriendList = () => {
        axios.get(conn_path + '/friend/getAllFriends')
        .then(res => {
            setAllFriends(res.data);
        });
    }

    return (
        <div className='navbar'>

            <Popup trigger={showAllFriendList} setTrigger={setShowAllFriendList}>
                <div className='friend-list'>
                    <h1>Friend List</h1>

                    <table className='friend-list-table'>
                        {allFriends.slice(0).reverse().map((friend) => (
                            <tr key={Math.random()}>
                                <td><Image style={styles.profile_photo}  source={{uri: friend.profile_photo}} /></td>
                                <td>{friend.first_name +' '+ friend.last_name}</td>
                                <td>
                                    <CustomButton title={'remove'} onPress={() => removeFriend(friend.user_id)}/>
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>
            </Popup>

            <div onClick={goToFeed} className='navbar-logo'>
                <img src={require('../../Images/logo2.png')} />
            </div>

            <div className='navbar-search-bar-container'>
                <div className='navbar-search-bar'>
                    
                    <div className='nav-drop-container'>
                        <Input 
                            name='Search for Friends' 
                            onChange={(e) => setFriendSearch(e.target.value)}
                        />
                        
                        {showFriendSearch &&
                            <div className='navbar-search-dropdown'>
                                <table>
                                    {matchingFriends.slice(0).map((friend, index) => (
                                        <tr key={index}>
                                            <td className='row1'> 
                                                <Image style={styles.profile_photo}  source={{uri: friend.profile_photo}} /> 
                                            </td>
                                            <td className='row2'> 
                                                {friend.first_name + ' ' + friend.last_name} 
                                            </td>
                                            <td className='row3'> 
                                                <CustomButton title={'add'} onPress={() => addFriend(friend.user_id)} /> 
                                            </td>
                                        </tr>
                                    ))}
                                </table>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div className='navbar-profile'>
                <Image style={styles.profile_photo} source={{uri: profilePhoto}} />
                
                <div className='navbar-drop-menu'>
                    <ul>
                        <li>
                            <CustomButton 
                                title="Profile"
                                onPress={() => navigation.navigate('Profile')}
                            />
                        </li>
                        <li>
                            <CustomButton 
                                title="Friends" 
                                onPress={() => {setShowAllFriendList(true); getFriendList();}}
                            />
                        </li>
                        <li><CustomButton title="Help"/></li>
                        <li><CustomButton title="Settings"/></li>
                        <li>
                            <CustomButton 
                                title="Log out"
                                onPress={() => navigation.navigate('Login')}
                            />
                        </li>
                    </ul>
                </div>

            </div>

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