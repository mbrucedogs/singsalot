import React, { Fragment } from "react";
import { useEffect } from 'react';
import firebase from 'firebase'

interface FirebaseProps {
    databaseRef?: firebase.database.Reference | null ;
    databaseRefCallback: (a : firebase.database.DataSnapshot ,  b? :  string | null ) => any
    children: React.ReactNode;
}

const FirebaseContainer: React.FC<FirebaseProps> = ({databaseRef, databaseRefCallback, children}) => {
    useEffect(() => {
        databaseRef?.on("value", databaseRefCallback);
        return () => {
            databaseRef?.off("value", databaseRefCallback);
        }
    }, [databaseRef])

    return (
        <Fragment>
            {children}
        </Fragment>
    );
};

export default FirebaseContainer;
