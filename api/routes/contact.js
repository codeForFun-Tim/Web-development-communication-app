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
                    // console.log('userToUpdate',user)
                    if (userToUpdate != null){
                        // const ifAdded = userToUpdate.contact_list.includes(userInDB.contact_list);
                        if(!userToUpdate.contact_list.includes(userToAdd)){ // check if the added user has already a contact
                        //update contact list TODO: TWO WAY (A -> B, THEN B -> A)
                        console.log('userToUpdate',userToUpdate);
                        userToUpdate.contact_list.push(userToAdd);
                        userToUpdate.save();   
                        // newUser must not be null
                        const newUser = await User.findOne({email:userToAdd});
                        newUser.contact_list.push(curUser);
                        newUser.save();
                        
                        res.send(201);
                    }
                    else{
                        console.log("This user is already in your contact list");
                        res.sendStatus(406);
                    }
                }
                    else{
                        console.log('60 行的400');
                        res.sendStatus(400);
                    }
                    //  res.sendStatus(201);
                }
                

        }
)

router.put('/blockUser',async (req,res) => {
    const curUser = req.body.username;
    const userToBlock = req.body.userToBlock;

    const userInDB = await User.findOne(
        {email: userToBlock}
    )
    // console.log('userInDB',userInDB);
    if(userInDB === null){
        console.log('userInDB is null');
        res.sendStatus(400);
    }

    const userToUpdate = await User.findOne({email:curUser});
    if(userToUpdate != null){ //remove userToBlock in the curUser's contact list
    const index = userToUpdate.contact_list.indexOf(userToBlock);
    // console.log('indes',index);
    // console.log('userToUpdate',userToUpdate);
        if(index != null){
            userToUpdate.contact_list.splice(index,1);
            userToUpdate.save();

            const secondIndex = userInDB.contact_list.indexOf(curUser);

            // console.log('second index',secondIndex);
            if(secondIndex != null){
                userInDB.contact_list.splice(secondIndex,1);
                userInDB.save();
               }

            res.sendStatus(201);
        }
        else{
            res.sendStatus(400);
        }
    }

})


/*
1. /getUser: usernane
response: contacts

2. /addContact: otherUsername
response: status,  200: UI refresh/add otherUsername; 5xx: alert error



*/

module.exports = router;