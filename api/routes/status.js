/* eslint-disable no-underscore-dangle */
const express = require('express');
const fs = require('fs');
const { ObjectId } = require('mongoose').Types;
const User = require('../model/user');
// const Message = require('../model/message');
// const Room = require('../model/room');
const Status = require('../model/status');
// const { parser } = require('../app');
// const multer = require('multer');
const { checkAuthenticated } = require('../app');
const { sendDatabaseErrorResponse } = require('../app');

const router = express.Router();
//'image/jpeg' || 'image/gif' 
// text
router.get('/getStatus',async (req,res)=> {

    const loggedUser = req.query.logUser;
    // console.log('loggedUser',loggedUser);
    const result = [];
    const currUser = await User.findOne({email:loggedUser});
    // console.log('currUser',currUser);
    const contacts = currUser.contact_list;
    // console.log('contacts',contacts);
    
    if(contacts === null){
        console.log('You need at least one contact to use status functionality! ');
        res.sendStatus(400);
    }
    else{ 
        const curStaList = currUser.status_list;
            // const status_ids = contact.status_list; //status id    
            if(curStaList != null){
                await Promise.all(curStaList.map(async statusID => {
                    try{
                        const status = await Status.findOne({_id:statusID}); // get each status schema 
                        // returnedMessage.push({content: textMessage, type: message.message_type, time:message.timeStamp, sender: message.from});
                        if(!status.viewedPeople.includes(loggedUser)){
                            result.push(status);
                        }
                    }
                    catch(err){
                        console.log(err);
                        res.sendStatus(400);
                    }
                }));
            }
            else{
                console.log('This contacts don\'t share any status yet');
                res.sendStatus(400);
            }
        res.send(result);
    }
});

// viewer, statusId
router.post('/viewStatus',async (req, res)=>{
    console.log('come');
    const currUser = req.body.viewer; // current user
    const statusID= req.body.statusId;
    
    
    const statusObj = await Status.findOne({_id: ObjectId(statusID)});
    if (statusObj != null) {
        statusObj.viewedPeople.push(currUser); //viewedPeople will have emails representing different users 
        statusObj.save();
        res.sendStatus(201);
    }
    else {
        console.log('Cannot add person to viewedPeople in the Status Schema!');
        res.sendStatus(400);
    }
})


/*
email
*/

//  image/jpeg,    const media_content = req.files.media_message_content;
//  text,      const text = req.body.text_message_content;

router.post('/sendStatus',async (req,res)=>{

    const currentUser = req.body.currentUser;
    const statusType = req.body.statusType;
  

    const timeCreated = Date.now().toString();
    const currUser = await User.findOne({email:currentUser});
    const currUserContacts = currUser.contact_list;
    console.log(currUserContacts);

    if(currUserContacts === null){
        res.sendStatus(401);
        console.log('You need to have contacts to send status!');
    }
    else{
        if(statusType === 'text'){
            const textSt = req.body.text_status_content;
            const newTextStatus = new Status ({
                textStatus: textSt,
                type : statusType,
                creationTime : timeCreated,
            });
            // console.log(newTextStatus);
            newTextStatus.save().then(async (status) => {
                const statusID = status._id;
                // console.log(statusID);
                await Promise.all(currUserContacts.map(async (currUserContact) => {  // currUserContact is email
                    const statusReceiver = await User.findOne({email: currUserContact});
                    statusReceiver.status_list.push(statusID);
                    statusReceiver.save();
                    // console.log(statusReceiver);
                }));


             })
             .catch((e) => {console.log(e)});
        }
        else if(statusType === 'image/jpeg' || statusType === 'image/gif'){
            const mediaSt = req.files.media_status_content.data;
            const newMediaStatus = new Status ({
                mediaStatus: mediaSt,
                type : statusType,
                creationTime : timeCreated
            });
            newMediaStatus.save().then(async (status) => {
                const statusID = status._id;
                // console.log(statusID);
                await Promise.all(currUserContacts.map(async (currUserContact) => {  // currUserContact is email
                    const statusReceiver = await User.findOne({email: currUserContact});
                    statusReceiver.status_list.push(statusID);
                    statusReceiver.save();
                    // console.log(statusReceiver);
                }));


             })
             .catch((e) => {console.log(e)});
        }
        else{
            res.sendStatus(401);
            console.log('only text/image/gif allowed!');
        }
    }
});

module.exports = router;