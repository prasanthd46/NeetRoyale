import React, {
  useState,
  useEffect,
  ChangeEventHandler,
  ChangeEvent,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../Redux/hooks";
import {
  setHost,
  setPlayers,
  setRoomId,
  setRoomSize,
} from "../Redux/slices/socketSlice";

import Navbar from "../Components/Navbar";
import PowerUps from "../Components/Powerups";
import { useSocket } from "../providers/socketProvider";

interface roomDetails {
  size: number;
  roomId: string;
}

const Home = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [secondBox, showSecondBox] = useState<boolean>(false);
  const [roomDetails, setRoomDetails] = useState<roomDetails>({size: 0,roomId: "",});
  
  const players = useAppSelector((state) => state.socketRoom.players);
  
  const createRoom = (size: number): Promise<void> => {
    dispatch(setRoomSize(size));
    return new Promise((resolve) => {
      socket?.emit("createRoom", size, (response: any) => {
        dispatch(setHost(response.host));
        setRoomDetails({ size: size, roomId: response.roomId });
        resolve();
      });
    });
  };
  
  
  const joinRoom = (
    roomId: string
  ): Promise<{ status: string; message: string }> => {
    return new Promise((resolve) => {
      socket?.emit("joinRoom", roomId, (response: any) => {
        if (response.status == "ok") {
          setRoomDetails({
            size: response.maxplayers,
            roomId: response.roomId,
          });
          dispatch(setHost(response.host));
          resolve({ status: "ok", message: "" });
        } else {
          if (response.status == "error") {
            resolve({
              status: "error",
              message: "room does not exits or is full",
            });
          }
        }
      });
    });
  };

  useEffect(() => {
    dispatch(setRoomId(roomDetails.roomId));
    console.log(roomDetails);
  }, [roomDetails.roomId]);

  useEffect(() => {
    socket?.on(
      "playerJoined",
      (response: { players: string[]; host: string }) => {
        dispatch(setPlayers(response.players));
      }
    );
    return () => {
      socket?.off("playerJoined");
    };
  }, [socket, players]);


  return (
    <>
      <div className="bg-black h-[100vh] max-w-screen  ">
        <Navbar />
        <div className="h-screen  bg-white ">
          <div className="bg-black flex justify-center w-full h-full">
            <div className="flex flex-col justify-center items-center  bg-black text-white h-full w-[50%] p-10">
              <div className="text-[110px] font-mono h-[40%px] flex items-center font-extrabold">
                neetRoyale
              </div>
              <div className="h-[70px] text-2xl italic text-gray-500 font-bold">
                ~ Not Just a Test. It's a Royale.
              </div>
              <div className="h-[30%]  flex items-center">
                <div
                  onClick={() => {
                    showSecondBox((v) => !v);
                  }}
                  className="rounded-full p-2 font-bold text-2xl ring-2 hover:ring-purple-500 hover:scale-102 transition-all duration-400 ring-white/20 w-[100px] flex justify-center  hover:text-purple-400 items-center cursor-pointer"
                >
                  Play
                </div>
              </div>
            </div>
            <div className="h-[93%] w-[50%] p-10  ">
              <div className="relative text-white  overflow-hidden ring-1 p-10  ring-white/10 rounded-4xl bg-white/3 h-full ">
                <div
                  style={{
                    perspective: "1000px",
                  }}
                  className={`relative h-full w-full justify-start mt-10  `}
                >
                  <div
                    style={{
                      transformStyle: "preserve-3d",
                      transformOrigin: "left",
                      transform: secondBox
                        ? " translateZ(-400px) rotateY(-70deg)"
                        : "rotateY(0deg)",
                      opacity: secondBox ? "0" : "1",
                      backfaceVisibility: "hidden",
                    }}
                    className={`absolute flex flex-col justify-evenly items-center  h-full w-full backface-hidden transition-all duration-800 oveflow-hidden  ${
                      secondBox ? "" : "delay-600"
                    }`}
                  >
                    <div className="font-semibold text-lg tracking-widest ">
                      What is NeetRoyale{" "}
                      <span className="text-xl text-purple-500">?</span>
                    </div>
                    <div className=" font-semibold tracking-wider px-10 ">
                      NeetRoyale is not your regular NEET quiz. It's a
                      fast-paced, real-time battle where you compete against
                      your friends to answer NEET-level questions live.
                    </div>
                    <div className=" font-semibold tracking-wider px-10">
                      On Exam Day , There will be two things that matters - one
                      is preparation that you did and another one - the state of
                      your mind. The preparation is in your hands. But the State
                      of mind could be improved using this fast paced game to
                      stable your mind in situations of tackling difficuly
                      questions.
                    </div>
                    <div className=" font-semibold tracking-wider px-10 pb-10">
                      This Game is designed in a way to keep the POV of person
                      who is playing , to improve handling their situation in
                      tackling hard questions . It practices your mind to have a
                      better state in exam.
                    </div>
                    <div className="italic text-white/20  font-semibold tracking-wider px-10 pb-5">
                      Survive. Compete. Conquer NEET
                    </div>
                    <div className="italic text-white/20 font-semibold tracking-wider px-10"></div>
                    <div className=" italic font-semibold tracking-wider px-10 pb-10">
                      Dude , Dont stress out ~ Just Play and Chill
                    </div>
                  </div>

                  <div
                    style={{
                      opacity: secondBox ? "1" : "0",
                    }}
                    className={`absolute  h-[70%] w-full flex justify-center text-white transition-all duration-1000 ${
                      secondBox ? "delay-600" : ""
                    }`}
                  >
                    <div className="flex flex-col justify-center items-center gap-15 ">
                      <div className="mt-10 pb-20 text-xl font-mono tracking-widest font-bold">
                        The ultimate battleground for future doctors.{" "}
                        <span className="text-purple-500 italic">PLAY!</span>
                      </div>
                      <div className="text-white flex flex-col justify-center items-center h-20">
                        <div className="italic text-mono font-medium text-xl">
                          Be The <span className="text-purple-500">Host</span>
                        </div>
                        <div className="flex ">
                          <button
                            onClick={async () => {
                              if (roomDetails.size > 4) {
                                alert("size should not be greater than 4");
                              } else {
                                await createRoom(roomDetails.size);

                                navigate(`/waitingroom`);
                              }
                            }}
                            className="bg-white h-10 mt-10  mr-10 font-medium cursor-pointer rounded-full text-black px-7 py-2 "
                          >
                            Create Room
                          </button>
                          <div className="mt-3 flex flex-col items-center h-30">
                            <div className="mt-4 mb-2 font-semibold">
                              Choose Player Size:
                            </div>
                            <input
                              type="number"
                              onChange={(e) => {
                                const roomSize = parseInt(e.target.value, 10);
                                setRoomDetails({ size: roomSize, roomId: "" });
                              }}
                              placeholder="Size"
                              className="no-spinner bg-white placeholder:font-mono placeholder:text-right placeholder:font-bold overflow-ellipsis placeholder:italic rounded-full p-2 h-6 w-20 text-black  "
                            />
                          </div>
                        </div>
                      </div>
                      <div className="italic text-white/50 ">(or)</div>
                      <div>
                        <div className="flex flex-col justify-evenly gap-10 items-center">
                          <div className="italic font-medium  text-xl">
                            <span className="text-purple-500">Join</span> The
                            Room
                          </div>
                          <div className="flex items-center text-white ">
                            <input
                              onChange={(e) => {
                                const id = e.target.value;
                                setRoomDetails((prevDetails) => ({
                                  ...prevDetails,
                                  roomId: id,
                                }));
                              }}
                              placeholder="Enter Room Code"
                              className="bg-white rounded-full text-black p-1 placeholder:text-center align-top placeholder:font-mono placeholder:font-bold placeholder:italic"
                            />
                            <button
                              onClick={() => {
                                joinRoom(roomDetails.roomId).then((result) => {
                                  if (result.status == "error") {
                                    alert(result.message);
                                  } else if (players) {
                                    navigate("/waitingroom");
                                  }
                                });
                              }}
                              className="ml-8 border-2  rounded-full px-5 py-1 font-semibold cursor-pointer"
                            >
                              Join Room
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[110vh] bg-black">
          <div className="flex flex-col h-full p-10 gap-10">
            <div className="flex justify-evenly  h-full p-10">
              <div
                className="transition-transform duration-200 flex  justify-between"
                style={{
                  perspective: "1000px",
                }}
              >
                <img
                  src="/vite.svg"
                  alt="adada"
                  className=" h-[80%] transform -skew-y-0 skew-40 transition-transform"
                />
              </div>
              <div>
                <div className="text-white  flex flex-col gap-10 p-15 items-center">
                  <div className="text-3xl font-bold italic">
                    Match <span className="text-purple-500">History</span>
                  </div>
                  <div className="text-xl italic">
                    Track your victories and learn from every battle. Your full
                    journey — from epic wins to close calls—lives here.
                  </div>
                  <button className="transition-all cursor-pointer duration-400 transform ring-1 ring-white rounded-full p-4 font-bold hover:scale-105 hover:text-purple-500 hover:ring-purple-500">
                    View Matches
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-evenly  h-full p-10">
              <div>
                <PowerUps />
              </div>
              <div
                className="transition-transform duration-200 flex  justify-between"
                style={{
                  perspective: "1000px",
                }}
              >
                <img
                  src="/vite.svg"
                  alt="adada"
                  className=" h-[90%] transform skew-y-10 -skew-30 transition-transform"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-black h-screen p-10 ">
          <div className="ring-1   h-full">
            <div className="p-10 flex gap-20 h-full justify-center">
              <img
                src="/vite.svg"
                alt="adada"
                className=" h-[80%] transform -skew-y-0 skew-30 transition-transform p-10"
              />
              <div className="w-full flex text-white flex-col gap-10  p-10 rounded-xl  italic bg-white/4 border border-[#303030] ">
                <div className="text-2xl flex justify-center font-medium italic gap-1 ">
                  Game{" "}
                  <span className="text-purple-800 brightness-150 ">
                    Structure
                  </span>
                </div>
                <div className="flex flex-col gap-5 items-center ">
                  <div className="text-2xl font-extrabold text-transparent bg-clip-text [clip-path:polygon(0_0,100%_0,100%_100%,0_80%)] bg-gradient-to-br from-purple-900 via-purple-500 filter brightness-120 via-60% to-white">
                    Round 1
                  </div>
                  <div className="flex flex-col items-center gap-5 opacity-95 ">
                    <div className="flex gap-10 ">
                      <div className=" bg-white text-black px-4  py-1 font-medium rounded ">
                        Async Play
                      </div>
                      <div className="bg-white text-black px-4 py-1 font-medium rounded">
                        10 mins ~ T
                      </div>
                    </div>
                    <div className="bg-white text-black px-4 py-1 font-medium rounded">
                      Two consecutive correct answers ~ Earn Power-Ups
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-10 items-center ">
                  <div className="text-2xl font-extrabold text-transparent bg-clip-text [clip-path:polygon(0_0,100%_0,100%_100%,0_80%)] bg-gradient-to-br from-purple-900 via-purple-500 filter brightness-120 via-60% to-white">
                    Round 2
                  </div>
                  <div className="flex flex-col opacity-95">
                    <div className="flex justify-center gap-10">
                      <div className="bg-white text-black font-medium rounded px-4 py-1">
                        30s per Question
                      </div>
                      <div className="bg-white text-black font-medium rounded px-4 py-1">
                        Power-Ups must be used within Round 2
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
                <div className="flex flex-col gap-10 items-center ">
                  <div className="text-2xl font-extrabold text-transparent bg-clip-text [clip-path:polygon(0_0,100%_0,100%_100%,0_80%)] bg-gradient-to-br from-purple-900 via-purple-500 filter brightness-120 via-60% to-white">
                    Round 3
                  </div>

                  <div className=" flex flex-col gap-10 items-center opacity-95 ">
                    <div className="flex justify-center gap-10">
                      <div className="bg-white text-black rounded px-4 py-1 font-medium">
                        Speed Zone Based
                      </div>
                    </div>
                    <div className="flex gap-5">
                      <div className="bg-white text-black rounded px-4 py-1 font-medium">
                        5 sec ~ Max Points
                      </div>
                      <div className="bg-white text-black rounded px-4 py-1 font-medium">
                        6–10 sec ~ Moderate Points
                      </div>
                      <div className="bg-white text-black rounded px-4 py-1 font-medium">
                        11–30 sec ~ Min Points
                      </div>
                    </div>
                  </div>
                  <div className="font-medium text-xl mt-10  ">
                    Highest Cumulative Score at the end of Round 3 is declared
                    the <span className="italic text-purple-500">Winner</span>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
