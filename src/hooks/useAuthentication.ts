import { FirebaseService } from "../services";
import { authenticatedChange } from "../store/slices";
import { selectAuthenticated } from "../store/store";
import { useAppDispatch, useAppSelector } from "./hooks";

export const useAuthentication = (): {
    authenticated: boolean;
    singer: string;
    isAdmin: boolean;
    login:(isAdmin: boolean, controllerId: string, singerName: string)=> Promise<boolean>
} => {
    const { authenticated, singer, isAdmin } = useAppSelector(selectAuthenticated);
    const dispatch = useAppDispatch();

    const login = (isAdmin: boolean, controller: string, singerName: string): Promise<boolean> => {
        return new Promise(function (resolve) {
          let success: boolean = false;
          let promise = FirebaseService.controllerExists(controller);
          promise.then(snapshot => {
            if (snapshot.exists()) {
              success = true;
            }
            resolve(success);
            if (success) {
              dispatch(authenticatedChange({ isAdmin: isAdmin, singer: singerName, controller: controller, authenticated: true }));
            }
          })
        });
      }
    
    return { authenticated, singer, isAdmin, login}
}