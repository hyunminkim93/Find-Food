import React, { useEffect, useState } from 'react';
import Main from '../components/section/Main';

const Home = () => {
    const [recommendedVideos, setRecommendedVideos] = useState([]);
    const [popularVideos, setPopularVideos] = useState([]);
    const [countryVideos, setCountryVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async (query, setState) => {
            try {
                const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
                if (!apiKey) {
                    throw new Error("API 키가 설정되지 않았습니다.");
                }
                const response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=10&key=${apiKey}`);
                if (!response.ok) {
                    throw new Error("유튜브 API 요청 실패");
                }
                const data = await response.json();
                const videoIds = data.items.map(item => item.id.videoId).filter(id => id).join(',');

                if (videoIds) {
                    const detailsResponse = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=player&id=${videoIds}&key=${apiKey}`);
                    if (!detailsResponse.ok) {
                        throw new Error("유튜브 비디오 세부 정보 요청 실패");
                    }
                    const detailsData = await detailsResponse.json();

                    const playableVideos = data.items.filter((item) => {
                        const playerData = detailsData.items.find(detail => detail.id === item.id.videoId);
                        return playerData && playerData.player.embedHtml;
                    });

                    setState(playableVideos);
                } else {
                    setState([]);
                }
            } catch (error) {
                console.error(error);
                setState([]);
            }
        };

        const fetchAllVideos = async () => {
            await fetchVideos('추천 음식', setRecommendedVideos);
            await fetchVideos('인기 음식', setPopularVideos);
            await fetchVideos('나라별 음식', setCountryVideos);
            setLoading(false);
        };

        fetchAllVideos();
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
                    {Array.isArray(recommendedVideos) && recommendedVideos.length > 0 ? (
                        recommendedVideos.map(video => (
                            <div key={video.id.videoId} className="video-wrapper">
                                <div className="thumbnail">
                                    <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
                                </div>
                                <div className="video-info">
                                    <p className="video-title">{video.snippet.title}</p>
                                    <p className="video-channel">{video.snippet.channelTitle}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>추천 음식 영상이 없습니다.</p>
                    )}
                </div>
            </div>
            <div className="video-section">
                <h2>인기 많은 음식 영상</h2>
                <div className="video-content">
                    {Array.isArray(popularVideos) && popularVideos.length > 0 ? (
                        popularVideos.map(video => (
                            <div key={video.id.videoId} className="video-wrapper">
                                <div className="thumbnail">
                                    <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
                                </div>
                                <div className="video-info">
                                    <p className="video-title">{video.snippet.title}</p>
                                    <p className="video-channel">{video.snippet.channelTitle}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>인기 많은 음식 영상이 없습니다.</p>
                    )}
                </div>
            </div>
            <div className="video-section">
                <h2>나라별 음식 영상</h2>
                <div className="video-content">
                    {Array.isArray(countryVideos) && countryVideos.length > 0 ? (
                        countryVideos.map(video => (
                            <div key={video.id.videoId} className="video-wrapper">
                                <div className="thumbnail">
                                    <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
                                </div>
                                <div className="video-info">
                                    <p className="video-title">{video.snippet.title}</p>
                                    <p className="video-channel">{video.snippet.channelTitle}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>나라별 음식 영상이 없습니다.</p>
                    )}
                </div>
            </div>
        </Main>
    );
};

export default Home;
