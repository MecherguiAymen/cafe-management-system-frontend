export class GlobalConstants {
    //messages
    public static genericError: string = 'Something went wrong. Please try again later.';

    public static unauthorized: string = 'you are not authorized person to access this page.';

    public static productExistError:string = 'Product already exist with this name.';

    public static productAdded:string = 'Product added successfully.'; 

    //regex
    public static nameRegex: string = '[a-zA-Z0-9 ]*';    

    public static emailRegex: string = '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';  
    
    public static contacNumberRegex: string = '^[e0-9]{10,10}$'; 
    
    //variables
    public static error: string = 'error';
}