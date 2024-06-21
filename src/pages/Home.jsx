import React, { useEffect, useState } from 'react';
import Main from '../components/section/Main';
import ReactPlayer from 'react-player/youtube';

const Home = () => {
    const [recommendedVideos, setRecommendedVideos] = useState([]);
    const [popularVideos, setPopularVideos] = useState([]);
    const [countryVideos, setCountryVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async (query, setState) => {
            try {
                const response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=10&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`);
                const data = await response.json();
                const videoIds = data.items.map(item => item.id.videoId).join(',');

                const detailsResponse = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=player&id=${videoIds}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`);
                const detailsData = await detailsResponse.json();

                const playableVideos = data.items.filter((item, index) => {
                    const playerData = detailsData.items.find(detail => detail.id === item.id.videoId);
                    return playerData && playerData.player.embedHtml;
                });

                setState(playableVideos);
            } catch (error) {
                console.error(error);
            }
        };

        fetchVideos('추천 음식', setRecommendedVideos);
        fetchVideos('인기 음식', setPopularVideos);
        fetchVideos('나라별 음식', setCountryVideos);
        setLoading(false);
    }, []);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    return (
        <Main
            title="오늘은 뭐 먹지?"
            description="뭐 먹을지 고민될 때 음식을 찾아보는 사이트입니다."
        >
            <div className="video-section">
                <h2>추천 음식 영상</h2>
                <div className="video-content">
                    {recommendedVideos.map(video => (
                        <div key={video.id.videoId} className="video-wrapper">
                            <div className="thumbnail">
                                <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
                            </div>
                            <div className="video-info">
                                <p className="video-title">{video.snippet.title}</p>
                                <p className="video-channel">{video.snippet.channelTitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="video-section">
                <h2>인기 많은 음식 영상</h2>
                <div className="video-content">
                    {popularVideos.map(video => (
                        <div key={video.id.videoId} className="video-wrapper">
                            <div className="thumbnail">
                                <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
                            </div>
                            <div className="video-info">
                                <p className="video-title">{video.snippet.title}</p>
                                <p className="video-channel">{video.snippet.channelTitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="video-section">
                <h2>나라별 음식 영상</h2>
                <div className="video-content">
                    {countryVideos.map(video => (
                        <div key={video.id.videoId} className="video-wrapper">
                            <div className="thumbnail">
                                <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
                            </div>
                            <div className="video-info">
                                <p className="video-title">{video.snippet.title}</p>
                                <p className="video-channel">{video.snippet.channelTitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Main>
    );
};

export default Home;
