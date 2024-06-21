import React, { useEffect, useState } from 'react'
import Main from '../components/section/Main'

import { Link, useParams } from 'react-router-dom';
import Loading from '../components/section/Loading';
import ReactPlayer from 'react-player';

import { CiChat1 } from "react-icons/ci";
import { CiStar } from "react-icons/ci";
import { CiRead } from "react-icons/ci";

const VideoPage = () => {
    const { videoID } = useParams();
    const [videoDetail, setVideoDetail] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideoDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoID}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`)
                const data = await response.json();
                setVideoDetail(data.items[0]);
                // console.log(data);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }

        const fetchComments = async () => {
            try {
                const response = await fetch(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoID}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`);
                const data = await response.json();
                setComments(data.items);
                setLoading(false);
                console.log(data);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        fetchVideoDetails();
        fetchComments();
    }, [videoID])

    return (
        <Main
            title="비디오 상세 페이지"
            description="Music 비디오 페이지입니다."
        >
            {loading ? (
                <Loading />
            ) : (
                videoDetail && (
                    <section id='videoPage' className='fade-in'>
                        <div className='video__detail'>
                            <div className='video__play'>
                                <div className='left'>
                                    <ReactPlayer
                                        playing={true}
                                        url={`https://www.youtube.com/watch?v=${videoID}`}
                                        width='100%'
                                        style={{ poasition: 'absolute', top: 0, left: 0 }}
                                    />
                                </div>
                                <div className='right'>
                                    <h3>Comments</h3>
                                    {comments.length > 0 ? (
                                        <ul>
                                            {comments.map(comment => (
                                                <li key={comment.id}>
                                                    <p><strong>{comment.snippet.topLevelComment.snippet.authorDisplayName}:</strong> {comment.snippet.topLevelComment.snippet.textDisplay}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No comments available.</p>
                                    )}
                                </div>
                            </div>
                            <div className='video__info'>
                                <h2 className='title'>{videoDetail.snippet.title}</h2>
                                <div className='channel'>
                                    <div>
                                        <Link to={`/channel/${videoDetail.snippet.channelId}`} className='channelTitle'>{videoDetail.snippet.channelTitle}</Link>
                                    </div>
                                    <div>
                                        <span className='view'><CiRead />{videoDetail.statistics.viewCount}</span>
                                        <span className='like'><CiStar />{videoDetail.statistics.likeCount}</span>
                                        <span className='comment'><CiChat1 />{videoDetail.statistics.commentCount}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="video__desc">
                                {videoDetail.snippet.description}
                            </div>
                        </div>
                    </section>
                )
            )}
        </Main>
    )
}

export default VideoPage