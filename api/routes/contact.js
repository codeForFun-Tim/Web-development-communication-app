/* eslint-disable no-underscore-dangle */
const express = require('express');
const fs = require('fs');
const { ObjectId } = require('mongoose').Types;
const User = require('../model/user');
const Message = require('../model/message');
const Room = require('../model/room');
// const { parser } = require('../app');
// const multer = require('multer');
// const { checkAuthenticated } = require('../app');
const { sendDatabaseErrorResponse } = require('../app');

const router = express.Router();

router.get(
    '/getUser', async (req,res) => {
        const userName = req.query.username;
        const user = await User.findOne({email: userName});
        if(user != null){
            const contacts = user.contact_list;
            const registrationDate = user.registration_date;
            const returnedObj = {contacts: contacts, registrationDate: registrationDate};
            res.send(returnedObj);
        }
        else{ // 
            console.log('not authorized!');
            res.sendStatus(401);
        }
    }
);

router.post(
    '/addContact', async (req,res) => {
        
        
        const userToAdd = req.body.addUserName; //make sure the frontend has the 'addUserName'
        const curUser = req.body.username; // make sure the frontend has the 'username' 
        // const roomID = req.body.RID;
        console.log('userToAdd',userToAdd);
        console.log('curUser', curUser);
        const userInDB = await User.findOne(
            {email: userToAdd}
        );
        if(userInDB === null){ // no such user
            console.log('userInDB is null');
            res.sendStatus(400);
        }
        else{
            console.log('inside else statement');
            // const ifRoom = Room.findOne(
            //     { $or: [{userList: [userToAdd, curUser]}, {userList: [curUser, userToAdd]} ]}, (err,room) =>{
                    const userToUpdate = await User.findOne({email:curUser});
                    if (userToUpdate != null){
                        //update contact list TODO: TWO WAY (A -> B, THEN B -> A)
                        console.log('userToUpdate type',typeof(userToUpdate));
                        userToUpdate.contact_list.push(userToAdd);
                        userToUpdate.save();       
                        res.send(201);
                    }
                    else{
                        console.log('60 行的400');
                        res.send(400);
                    }
                    //  res.sendStatus(201);
                }
                
            //)
            // if(ifRoom === null){ // no such room 
            //     const newRoom = new Room ({
            //        userList: [userToAdd,]
            //        messageList: []
            //     });
            // }

        }

        // see if userToAdd and curUser has a room: if yes, append userToAdd to curUser's contact list
        // if no, then create a new room and then append userToAdd to curUser's contact list

        
        
 
        // const userToUpdate = await User.findOneAndUpdate({username:curUser}, 
        //                         {$push: { contact_list: userToAdd }},
        //                         done
        //                      );
        // if (userToUpdate != null){
        //     res.send(201);
        // }
        // else{
        //     res.send(400);
        // }
    //}
)


/*
1. /getUser: usernane
response: contacts

2. /addContact: otherUsername
response: status,  200: UI refresh/add otherUsername; 5xx: alert error



*/

module.exports = router;