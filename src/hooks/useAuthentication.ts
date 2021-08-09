import { useSelector } from "react-redux";
import FirebaseService from "../services/FirebaseService";
import { authenticatedChange } from "../store/slices/authenticated";
import { selectAuthenticated } from "../store/store";
import { useAppDispatch } from "./hooks";

export function useAuthentication(): {
    authenticated: boolean;
    singer: string;
    isAdmin: boolean;
    login:(controllerId: string, singerName: string)=> Promise<boolean>
} {
    const { authenticated, singer, isAdmin } = useSelector(selectAuthenticated);
    const dispatch = useAppDispatch();

    const login = (controllerId: string, singerName: string): Promise<boolean> => {
        return new Promise(function (resolve) {
          let success: boolean = false;
          let promise = FirebaseService.controllerExists(controllerId);
          promise.then(snapshot => {
            if (snapshot.exists()) {
              success = true;
            }
            resolve(success);
            if (success) {
              dispatch(authenticatedChange({ isAdmin: false, singer: singerName, authenticated: true }));
            }
          })
        });
      }
    
    return { authenticated, singer, isAdmin, login}
}