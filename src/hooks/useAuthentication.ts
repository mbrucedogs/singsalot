import { useSelector } from "react-redux";
import { FirebaseService } from "../services";
import { authenticatedChange } from "../store/slices/authenticated";
import { selectAuthenticated } from "../store/store";
import { useAppDispatch } from "./hooks";

export const useAuthentication = (): {
    authenticated: boolean;
    singer: string;
    isAdmin: boolean;
    login:(isAdmin: boolean, controllerId: string, singerName: string)=> Promise<boolean>
} => {
    const { authenticated, singer, isAdmin } = useSelector(selectAuthenticated);
    const dispatch = useAppDispatch();

    const login = (isAdmin: boolean, controllerId: string, singerName: string): Promise<boolean> => {
        return new Promise(function (resolve) {
          let success: boolean = false;
          let promise = FirebaseService.controllerExists(controllerId);
          promise.then(snapshot => {
            if (snapshot.exists()) {
              success = true;
            }
            resolve(success);
            if (success) {
              dispatch(authenticatedChange({ isAdmin: isAdmin, singer: singerName, authenticated: true }));
            }
          })
        });
      }
    
    return { authenticated, singer, isAdmin, login}
}