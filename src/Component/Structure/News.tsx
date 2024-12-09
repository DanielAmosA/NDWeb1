import React from 'react'
import { IGetTopNews } from '../Interfaces/ApiRes/Top/IGetTopNews'
import { Carousel, Col, Row } from 'react-bootstrap'
import { format } from 'date-fns'
import '../../Styles/PagesSections/News.css';

const News = (
    {
        groupeNews
    } :
    {
        groupeNews : IGetTopNews[][]
    }
) => {
  return (
    <div>      
              <Carousel interval={3000} controls={true} indicators={true} className="carouselCustom">      
              {     
              groupeNews.map((group, index) => (
                <Carousel.Item key={index}>
                  <Row>
                    {group.map((news, newsInd) => (
                      <Col key={newsInd} className="articleCol">
                        <div className="articleSlide">
                        {
                        news.main_media.map((media, mediaInd) => (
                          <img key={mediaInd}
                            className="d-block w-100 articleImage"
                            src={media.data.urls.uploaded.original}
                            alt={news.title}
                          />
                        ))
                      }
                          <div className="articleContent">
                            <h2 className='articleTitle'>{news.title}</h2>
                            <h4 className='articleSubTitle'>{news.subtitle}</h4>
                            <h6 className='articlePublish'>{format(new Date(news.published_at), "dd/MM/yyyy HH:mm")}</h6>
                            <div className="articleIcons">
                              {news.sports_related.map((sport, sportInd) => (
                                <p key={sportInd}>{sport.type}
                                <span key={sportInd} className="icon">
                                   <img
                                  className="d-block w-100 articleIconImg"
                                  src={sport.data.url_logo}
                                  alt={sport.data.name}
                                />
                                </span>
                                {sport.data.name}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Carousel.Item>
              ))}
                        </Carousel>
                    
    </div>
  )
}

export default News
