import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';
import Participant from './Participant';

const Room = ({ roomName, token, handleLogout }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    let minutesLabel = document.getElementById("minutes");
    let secondsLabel = document.getElementById("seconds");
    let totalSeconds = 0;
    setInterval(setTime, 1000);

    function setTime()
    {
        ++totalSeconds;
        secondsLabel.innerHTML = pad(totalSeconds%60);
        minutesLabel.innerHTML = pad(parseInt(totalSeconds/60));
    }

    function pad(val)
    {
        var valString = val + "";
        if(valString.length < 2)
        {
            return "0" + valString;
        }
        else
        {
            return valString;
        }
    }

    const timeoutPromise = () => new Promise(resolve => {
      setTimeout(() => resolve(false), 5000);
    });
    
    const participantConnectedPromise = room => new Promise(resolve => {
      if (room.participants.size > 0) {
        resolve(true);
      } else {
        room.once('participantConnected', () => resolve(true));
     }
    });

    const endCallPromise = () => new Promise(resolve => {
      document.getElementById('endcall').addEventListener('click', function(e) {
        resolve(false);
      })
    });

    const participantConnected = participant => {
      setParticipants(prevParticipants => [...prevParticipants, participant]);
    };

    const participantDisconnected = participant => {
      setParticipants(prevParticipants =>
        prevParticipants.filter(p => p !== participant)
      );
    };

    let activeRoom;

    Video.connect(token, {
      name: roomName
    }).then(room => {
      activeRoom = room;
      setRoom(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
      // added 
      return Promise.race([
        participantConnectedPromise(room),
        timeoutPromise(),
        endCallPromise()
      ]);
    }).then(didParticipantConnect => {
      if (!didParticipantConnect) {
        console.log('call ended, disconnecting...');
        activeRoom.disconnect();
        handleLogout();
      }
    });

    return () => {
      setRoom(currentRoom => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function(trackPublication) {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token]);

  const remoteParticipants = participants.map(participant => (
    <Participant key={participant.sid} participant={participant} />
  ));

  return (
    <div className="room">
      <h2>Room: {roomName}</h2>
      <div id="timercontainer">
        <label id="minutes" className="timer">00</label>
        <label id="colon" className="timer">:</label>
        <label id="seconds" className="timer">00</label>
      </div>
      <button id="endcall">End Call</button>
      <div className="video-participant">
        <div className="local-participant">
            {room ? (
            <Participant
                key={room.localParticipant.sid}
                participant={room.localParticipant}
            />
            ) : (
            ''
            )}
        </div>
        {/* <h3>Remote Participants</h3> */}
        <div className="remote-participants">{remoteParticipants}</div>
      </div>
    </div>
  );
};

export default Room;