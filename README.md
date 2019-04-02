# StoryBook

*This is a Simple Story Blog page with google & facebook auth service api*


## Sounds good? Give it a try!
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/surabharch/Story)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsaurabharch%2FStory.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsaurabharch%2FStory?ref=badge_shield)

"My instance is deployed, what now?"

### Steps

1. ```npm install```

1. ```npm start```

1. ```npm app.js```

1. ```module.exports = {```

   ``` mongoURI: '<MONGODB URL>',```

   ``` googleClientID: '<GOOGLE CLIENT ID>',```

  ```  googleClientSecret: '<GOOGLE SECRET ID>',```

  ```  clientID: '<FACEBOOK APP ID>',```

   ``` clientSecret: '<FACEBOOK APP SECRET CODE>' ```

```}```

1. * In config folder 

        * keys_dev.js

        * keys_prod.js 
        
        updated only clienID and clientSecrete respectively in keys_dev.js or keys_prod.js

1. ```Open url in browser at http://localhost:5000```

##### Note: Reference Education Purpose only and facebook authenctication is only success at https://

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsaurabharch%2FStory.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsaurabharch%2FStory?ref=badge_large)