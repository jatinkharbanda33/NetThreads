import {
  Modal,
  Image,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Button,
  Tooltip
} from "@chakra-ui/react";
import { useState } from "react";
import { FaEye } from "react-icons/fa";

function ImageModal({ filePreview }) {
  const { isOpen, onOpen, onClose } = useDisclosure();  
  <ModalOverlay
      bg='blackAlpha.300'
      backdropFilter='blur(10px) hue-rotate(90deg)'
    />

  return (
    <>
    <Tooltip label="View Image" fontSize={"md"}>
      <IconButton isRound size={"sm"} onClick={onOpen} fontSize={"20px"} bg={"black"} icon={<FaEye/>}></IconButton>
      </Tooltip>
      <Modal isOpen={isOpen} size={"xl"} onClose={onClose} isCentered motionPreset="slideInBottom" colorScheme="black">
        {<ModalOverlay/>}
        <ModalContent>
          <ModalBody bg={"black"}>
            <Image
              src={filePreview}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                boxShadow: "4px 4px 4px rgba(0, 0, 0, 10)",
                borderRadius: "10px",
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ImageModal;
