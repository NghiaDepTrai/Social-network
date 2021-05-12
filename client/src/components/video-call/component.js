import React, { useEffect, useState, useRef, Suspense } from 'react';
import io from "socket.io-client";
import { Button } from 'antd'
import Peer from "simple-peer";
import "./style.css";
import _ from 'lodash';
const Watermark = React.lazy(() => import('./Components/Watermark/Watermark'))
function VideoCallComponent() {
    const [yourID, setYourID] = useState("");
    const [users, setUsers] = useState({});
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callingFriend, setCallingFriend] = useState(false);
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [callRejected, setCallRejected] = useState(false);
    const userVideo = useRef();
    const partnerVideo = useRef();
    const socket = useRef();
    const myPeer = useRef();
    useEffect(() => {
        socket.current = io.connect("/");
        socket.current.on("yourID", (id) => {
            setYourID(id);
        })
        socket.current.on("allUsers", (users) => {
            setUsers(users);
        })
        socket.current.on("hey", (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setCallerSignal(data.signal);
        })
        return function cleanup() {
            socket.current.emit('close', { to: caller })
            window.location.reload()
        }
    }, []);
    function callPeer(id) {
        if (id !== '' && users[id] && id !== yourID) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
                setStream(stream);
                setCallingFriend(true)
                setCaller(id)
                if (userVideo.current) {
                    userVideo.current.srcObject = stream;
                }
                const peer = new Peer({
                    initiator: true,
                    trickle: false,
                    config: {

                        iceServers: [
                            { url: 'stun:stun01.sipphone.com' },
                            { url: 'stun:stun.ekiga.net' },
                            { url: 'stun:stun.fwdnet.net' },
                            { url: 'stun:stun.ideasip.com' },
                            { url: 'stun:stun.iptel.org' },
                            { url: 'stun:stun.rixtelecom.se' },
                            { url: 'stun:stun.schlund.de' },
                            { url: 'stun:stun.l.google.com:19302' },
                            { url: 'stun:stun1.l.google.com:19302' },
                            { url: 'stun:stun2.l.google.com:19302' },
                            { url: 'stun:stun3.l.google.com:19302' },
                            { url: 'stun:stun4.l.google.com:19302' },
                            { url: 'stun:stunserver.org' },
                            { url: 'stun:stun.softjoys.com' },
                            { url: 'stun:stun.voiparound.com' },
                            { url: 'stun:stun.voipbuster.com' },
                            { url: 'stun:stun.voipstunt.com' },
                            { url: 'stun:stun.voxgratia.org' },
                            { url: 'stun:stun.xten.com' },
                            {
                                url: 'turn:numb.viagenie.ca',
                                credential: 'muazkh',
                                username: 'webrtc@live.com'
                            },
                            {
                                url: 'turn:192.158.29.39:3478?transport=udp',
                                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                                username: '28224511:1379330808'
                            },
                            {
                                url: 'turn:192.158.29.39:3478?transport=tcp',
                                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                                username: '28224511:1379330808'
                            }
                        ]
                    },
                    stream: stream,
                });

                myPeer.current = peer;

                peer.on("signal", data => {
                    socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID })
                })

                peer.on("stream", stream => {
                    if (partnerVideo.current) {
                        partnerVideo.current.srcObject = stream;
                    }
                });

                peer.on('error', (err) => {
                    endCall()
                })

                socket.current.on("callAccepted", signal => {
                    setCallAccepted(true);
                    peer.signal(signal);
                })

                socket.current.on('close', () => {
                    window.location.reload()
                })

                socket.current.on('rejected', () => {
                    window.location.reload()
                })
            })
                .catch(() => {
                })
        } else {
            return
        }
    }

    function acceptCall() {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            setStream(stream);
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
            setCallAccepted(true);
            const peer = new Peer({
                initiator: false,
                trickle: false,
                stream: stream,
            });

            myPeer.current = peer

            peer.on("signal", data => {
                socket.current.emit("acceptCall", { signal: data, to: caller })
            })

            peer.on("stream", stream => {
                partnerVideo.current.srcObject = stream;
            });

            peer.on('error', (err) => {
                endCall()
            })

            peer.signal(callerSignal);

            socket.current.on('close', () => {
                window.location.reload()
            })
        })
            .catch(() => {
            })
    }

    function rejectCall() {
        setCallRejected(true)
        socket.current.emit('rejected', { to: caller })
        window.location.reload()
    }

    function endCall() {
        myPeer.current.destroy()
        socket.current.emit('close', { to: caller })
        window.location.reload()
    }
    function renderLanding() {
        if (!callRejected && !callAccepted && !callingFriend)
            return 'block'
        return 'none'
    }

    function renderCall() {
        if (!callRejected && !callAccepted && !callingFriend)
            return 'none'
        return 'block'
    }
    let UserVideo;
    if (stream) {
        UserVideo = (
            <video className="userVideo" playsInline muted ref={userVideo} autoPlay />
        );
    }
    let PartnerVideo;
    if (callAccepted) {
        PartnerVideo = (
            <video className="partnerVideo cover" playsInline ref={partnerVideo} autoPlay />
        );
    } else if (callAccepted) {
        PartnerVideo = (
            <video className="partnerVideo" playsInline ref={partnerVideo} autoPlay />
        );
    }

    let incomingCall;
    if (receivingCall && !callAccepted && !callRejected) {
        incomingCall = (
            <div className="incomingCallContainer">
                <div className="incomingCall flex flex-column">
                    <div><span className="callerID">{caller}</span> is calling you!</div>
                    <div className="incomingCallButtons flex">
                        <button name="accept" className="alertButtonPrimary" onClick={() => acceptCall()}>Accept</button>
                        <button name="reject" className="alertButtonSecondary" onClick={() => rejectCall()}>Reject</button>
                    </div>
                </div>
            </div>
        )
    }
   
    return (
        <>
            <div style={{ display: renderLanding() }}>
                {incomingCall}
            </div>
            <div>
                {Object.keys(users).map(key => {
                    if (key === yourID) {
                        return null;
                    }
                    return (
                        <Button onClick={() => callPeer(key)}>Call {key}</Button>
                    );
                })}
            </div>
            {Object.keys(users).map(key => {
                if (key === yourID && Object.keys(users).length === 1) {
                    return (
                        <h1 onClick={() => callPeer(key)}>NO USER ONLINE</h1>
                    );
                }
            })}
            <div className="callContainer" style={{ display: renderCall() }}>
                <Suspense fallback={<div>Loading...</div>}>
                    <Watermark />
                </Suspense>
                <div className="partnerVideoContainer">
                    {PartnerVideo}
                </div>
                <div className="userVideoContainer">
                    {UserVideo}
                </div>
            </div>
            <div className="controlsContainer flex">
                {callAccepted ? <Button onClick={() => endCall()}>End Call</Button>
                    : ""}
            </div>
        </>
    )
}
export default VideoCallComponent;