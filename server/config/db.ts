let LOCAL = false;

let HostName, URI;

if(LOCAL){
    URI = "mongodb://localhost/contacts";
    HostName = "localhost";
}else{
    HostName = "Mongo DB Atlas";
    URI= "mongodb+srv://estebanarch:j4pUQSvuu4mW4Nxf@esteban.w494tfe.mongodb.net/contacts?retryWrites=true&w=majority&appName=esteban"

}

export { HostName, URI }
export const SessionSecret = "INFT2202SessionSecret";

//estebanarch
//j4pUQSvuu4mW4Nxf


