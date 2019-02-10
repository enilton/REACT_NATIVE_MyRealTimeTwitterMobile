import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../services/api';
import Tweet from '../components/Tweet';
import socket from 'socket.io-client';

export default class Timeline extends Component {

    static navigationOptions = ({navigation}) => ({
        title: "Início",
        headeRight: (
            <TouchableOpacity onPress={() => navigation.navigate('New')}>
                <Icon 
                    style={{marginRight : 10 }}
                    name="add-circle-outline" 
                    size={24} 
                    color="#4BB0EE">
                </Icon>
            </TouchableOpacity>        
        ),
    });

    state = {
        tweets:[],
    }

    async componentDidMount(){
        this.subscribeToEvents();
        const response = await api.get('tweets');
        this.setState({ tweets: response.data});
    }

    subscribeToEvents = () => {
        const io = socket('http://192.168.1.4:3000');
        
        io.on('tweet', data => {
            this.setState({ tweets: [data, ...this.state.tweets] });
        })

        io.on('like', data => {
            this.setState({ tweets: this.state.tweets.map(tweet =>
                tweet._id === data._id ? data : tweet
            )});
        })
    }

    render(){
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.tweets}
                    keyExtractor={tweet => tweet._id}
                    renderItem={({item}) => <Tweet tweet={item}/>}
                />
                <TouchableOpacity 
                    style={styles.newTweetButton} 
                    onPress={() => {                                
                                this.props.navigation.navigate('New')
                                }}>
                    <Icon style={styles.newTweetIconButton}                         
                        name="add-circle-outline" 
                        size={70} 
                        color="#4BB0EE">
                    </Icon>
                </TouchableOpacity> 
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFF"
    },

    newTweetButton:{
        width: 70,  
        height: 70,   
        borderRadius: 30,      
        position: 'absolute',                                          
        bottom: 10,                                                    
        right: 0, 
        backgroundColor: 'transparent'
    },

    newTweetIconButton:{              
        position: 'absolute',
        bottom:-5,
        right:4
    },
});


