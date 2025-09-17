import { useState, useEffect, useCallback } from "react";
import { socket } from "../../Services/Socket";

const useSocketEditing = ({ user, assignedArea }) => {

    const { name, id } = user ?? {};

    const [openNotify, setOpenNotify] = useState(false);
    const [editor, setEditor] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [show, setShow] = useState(false)
    const [editLoad, setEditLoad] = useState(false);

    // useEffect(() => {
    //     console.log('user name:', name);
    //     console.log('user id:', id)
    //     console.log('user assigned area:', assignedArea)
    // }, [name, id, assignedArea])

    //register na socket
    useEffect(() => {
        if (!assignedArea?.name) return;
        socket.emit("register-user", {
            userId: id,
            name: name,
            area: assignedArea.name,
        });
    }, [name, id, assignedArea])

    //authenticate
    useEffect(() => {
        if (!assignedArea?.name) return;
        socket.emit("authenticate", {
            id,
            area: assignedArea?.name,
        });
    }, [id, assignedArea]);

    //handle editing events
    const handleEditing = useCallback(({ editable, showEdit, editorName, editorId }) => {
        setDisabled(!editable);
        setShow(showEdit);
        setOpenNotify(editable ? false : true);
        setEditor(() => {
            return { editorName: editorName, editorId: editorId };
        });

        if (!editable) {
            return notify();
        }
    }, [])

    //register editing listener
    useEffect(() => {
        socket.on("editing", handleEditing);
        return () => {
            socket.off("editing"); // Clean up on unmount
        };
    }, [handleEditing]);

    const editSignal = useCallback(() => {
        socket.emit("start-edit", { userId: id, name, area: assignedArea?.name });
        setShow(true);
    }, [id, name, assignedArea]);

    const handleEditClick = () => {
        setEditLoad(true)
        setTimeout(() => {
            editSignal();
            setShow(true);
            setEditLoad(false)
        }, 500);
    }

    const disconnectSignal = () => {
        socket.emit('stop-edit', {
            userId: id,
            area: assignedArea?.name,
        })
        setShow(false);
        handleCloseSnack();
    }

    return {
        openNotify,
        editor,
        disabled,
        show,
        editLoad,
        disconnectSignal,
        handleEditClick,
        closeNotify: () => setOpenNotify(false),
    }
}

export default useSocketEditing;
