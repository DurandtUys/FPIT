import {User} from "./../../../data/users"

export default async function handler(req, res) {

    if(User)
    {
        res.status(200).json(User);
    }
    else
    {
        res.status(500);
    }
}