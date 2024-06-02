import multer from "multer";

// we have majorly two methods one is "diskstorage" and other is "memorystorage" . Here we are using "diskStorage",  we can use any of them but using "memoryStorage" may make our memory full due to large storage like video,audio,etc hence better use "diskStoragge" but we can use any of them no such restriction or disadvantage..

const storage = multer.diskStorage({
     
    // below the "req" gives use access to all types of data like jason,xml etc.. but "file" paramater gives us the way to handle the files via "multer".. and third parameter is "cb" which is also called as callback..
    destination: function (req, file, cb) {
      
        cb(null, "./public/temp")  //first parameter is always "NULL", and second parameter is of file location in "cb"...
    },

    filename: function (req, file, cb) { 
      cb(null, file.originalname)  // notes 1.1 -> below..
    }
  })
  
  export const upload = multer({ 
    storage, 
  })




  /*Notes
  1.Multer:
  1.1)
   The callback has a field name in the file, and inside this file, you get a lot of things. I would recommend that in the file, you use the dot (.) operator, and you will see that you get destination name, field name, file name, and many other things. You also get the original name, which is the name that the user uploaded. Just let us know the original name, and we will save the file with that. Ideally, this is not a good practice because there could be multiple files with the same name (like five files named Vedant), and they would get overwritten. However, since the operation is for a tiny amount of time on the server, the file will be there for a short while, and then we will upload it to the cloud and delete it from the server. But the best option would be to add it here. These small things you should note down, and when the whole project is complete, you can make minor tweaks and minor functionality updates as needed.
  */ 