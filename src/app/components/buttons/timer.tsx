"use client";
import React, { useState, useRef } from "react";
import { FaClock } from "react-icons/fa";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import toast, { Toaster } from 'react-hot-toast';

const Timer = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [time, setTime] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [hovered, setHovered] = useState(false);
  const [timeUnit, setTimeUnit] = useState<"seconds" | "minutes">("seconds");
  const hasAlertedRef = useRef<boolean>(false);  // Use useRef to track the alert status
  // const audioRef = useRef(new Audio(alarmSound));
  const startTimer = (onClose: () => void) => {
    if (intervalId) clearInterval(intervalId);

    const totalTime = timeUnit === "minutes" ? time * 60 : time;
    setTime(totalTime);
    hasAlertedRef.current = false;  // Reset the alert flag


    const id = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 0) return prevTime - 1;
        clearInterval(id);
        if (!hasAlertedRef.current) {
          toast((t) => (
            <span className="flex flex-col justify-center items-center truncate text-xl w-[100px]">
              <p className="truncate px-8 mx-4 my-3">Time is <b>up!</b><br/></p>
              <Button color="success" className="my-4" variant="ghost" onClick={() => toast.dismiss(t.id)}>Dismiss</Button>
            </span>
          ));
          hasAlertedRef.current = true;  // Update the ref to prevent multiple alerts
        }
        return 0;
      });
    }, 1000);

    setIntervalId(id);
    onClose();
  };

  const cancelTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setTime(0);
      hasAlertedRef.current = false;  // Reset the alert flag when the timer is cancelled
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      <div
        className="z-50 fixed right-4 bottom-4 flex items-center justify-center w-16 h-16 bg-[#20c536] rounded-full shadow-lg cursor-pointer hover:bg-green-600 transition-colors"
        onClick={hovered && intervalId ? cancelTimer : onOpen}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span className="text-white text-lg">{hovered && intervalId ? "Cancel" : (intervalId ? formatTime() : <FaClock color="white" size={20} />)}</span>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} backdrop="opaque" placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Set Timer</ModalHeader>
              <ModalBody>
                <Dropdown>
                  <DropdownTrigger>
                    <Button color="success" variant="flat">Select Time Unit</Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem key="seconds" onClick={() => setTimeUnit("seconds")}>Seconds</DropdownItem>
                    <DropdownItem key="minutes" onClick={() => setTimeUnit("minutes")}>Minutes</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Input isClearable variant="bordered" placeholder={timeUnit == "seconds" ? "seconds" : "minutes"} type="number" onChange={(e) => setTime(parseInt(e.target.value) || 0)} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={() => onClose()}>Cancel</Button>
                <Button color="success" variant="bordered" onPress={() => startTimer(onClose)}>Start Timer</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Timer;