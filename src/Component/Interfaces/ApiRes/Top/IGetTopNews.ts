export interface IGetTopNews {
    id: string;
    title : string;
    subtitle : string;
    published_at : string;
    main_media : {
        data : {
            urls : {
                uploaded : {
                    original : string;
                }
            }
        }
        
    }[];

    sports_related : {
        type:string;
        data : {
            name:string;
            url_logo : string;

        }
    }[] ;

   }
   
//    id:"2021020913320920836"
//    2021020913320920836 => /en/native/news/football/