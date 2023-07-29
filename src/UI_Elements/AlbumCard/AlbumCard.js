import React from 'react';
import { Image, StyleSheet } from 'react-native';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import './AlbumCard.css'

export function AlbumCard(props) {

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

    return (
        <div className='album-card'>
            
            <div className='album-card-title'>
                <div className='feed-card-profile-image'>
                    <Image style={styles.profilePhoto} source={{uri: props.profilePhoto}} />
                </div>

                <div className='album-card-user-name'>
                    <h4>{props.name}</h4>  
                    <p>{formatDate(props.date)}</p>
                </div>

                <div className='feed-card-text'>
                    <p>{props.album_name}</p>
                </div>

                <div className="album-card-divider">
                </div>

                <Carousel>
                    {props.photos.slice(0).reverse().map((photo) => (
                        <div>
                            <img src={photo} />
                        </div>
                    ))}
                </Carousel>
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