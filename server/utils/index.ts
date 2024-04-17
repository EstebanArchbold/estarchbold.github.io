import express, {Request, Response, NextFunction} from "express";


export function UserDisplayName (req: Request): string {

    //check is a user object is attached to the incoming HTTP request
    if(req.user){
        let user = req.user as UserDocument;
        return user.DisplayName.toString();
    }
    return '';
}

export function AuthGuard(req: Request, res: Response, next: NextFunction)
{
    //check if the user is authenticated
    if(!req.isAuthenticated()){
        return res.redirect('/login');
    }
    next();
}