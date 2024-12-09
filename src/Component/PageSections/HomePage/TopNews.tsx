import React, { useEffect, useState } from 'react'
import { CallLiveScoreGetAction, kindsLoadData, ShowKindLoadData } from '../../Helper/HelperFun';
import { IGetTopNews } from '../../Interfaces/ApiRes/Top/IGetTopNews';

import News from '../../Structure/News';

const TopNews = () => {

  //#region Hook & Members

  const [kindLoadData, setKindLoadData] = useState<kindsLoadData>("Wait");
  const [news, setNews] = useState<IGetTopNews[]>([]);
  //#endregion

  //#region Method

  //#endregion

  const groupeNews: IGetTopNews[][] = [];
  for (let i = 0; i < news.length; i += 3) {
    groupeNews.push(news.slice(i, i + 3));
  }

  // Calling for initialization.
  useEffect(() => {

    // Get some news details using an Football API service.
    const GetNews = async (): Promise<void> => {
      try {
        const queryParams = new URLSearchParams({
          category: "2021020913320920836",
          page: "1"
        });

        const jsonData = await CallLiveScoreGetAction('list-by-sport', queryParams);
        const newsData: IGetTopNews[] = jsonData.data;
        if (newsData) {
          setNews(newsData);
        }
      } catch (err) {
        console.log(err, "error");
        setKindLoadData("Error");
      }
    };

    GetNews();
  }, []);

  return (
    <div>
      {

        groupeNews.length > 0 ?
          (
            <News groupeNews={groupeNews} />
          )
          :
          ShowKindLoadData(kindLoadData)
      }

    </div>
  )
}

export default TopNews
