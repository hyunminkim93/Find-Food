# 오늘은 뭐 먹지? 프로젝트 기획안

![alt text](/src/assets/img/food.png)

## 개요

"오늘은 뭐 먹지?"는 사용자가 다양한 음식 영상을 탐색하고, 어떤 음식을 먹을지 결정하는 데 도움을 주는 웹사이트입니다. 메인 페이지에서는 추천 음식 영상, 인기 많은 음식 영상, 나라별 음식 영상을 제공합니다.

## 주요 기능

1. **메인 페이지 구성**: 사용자가 다양한 음식 영상을 탐색할 수 있도록 메인 페이지에서 추천 음식 영상, 인기 많은 음식 영상, 나라별 음식 영상을 보여줍니다.
2. **카테고리 필터**: 한식, 중식, 양식, 일식, 아시안 음식 등 다양한 카테고리를 제공하여 사용자가 원하는 종류의 음식을 쉽게 찾을 수 있습니다.
3. **검색 기능**: 사용자가 원하는 음식을 검색하여 관련 영상을 찾을 수 있습니다.
4. **반응형 디자인**: 모바일과 데스크탑 환경에서 모두 최적화된 화면을 제공합니다.
5. **로딩 화면**: 데이터를 불러오는 동안 로딩 중이라는 메시지를 표시합니다.
6. **채널 페이지 구성**: 유튜브 채널의 세부 정보와 영상을 표시합니다.

## 기능 구현

### 1. 메인 페이지 구성

**기능 설명**: 메인 페이지에서 추천 음식 영상, 인기 많은 음식 영상, 나라별 음식 영상을 표시합니다.

**구현 코드**:

```javascript
return (
  <Main
    title="오늘은 뭐 먹지?"
    description="뭐 먹을지 고민될 때 음식을 찾아보는 사이트입니다."
  >
    <div className="video-section">
      <h2>추천 음식 영상</h2>
      <div className="video-content">
        {Array.isArray(recommendedVideos) && recommendedVideos.length > 0 ? (
          recommendedVideos.map((video) => (
            <div key={video.id.videoId} className="video-wrapper">
              <div className="thumbnail">
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                />
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
          popularVideos.map((video) => (
            <div key={video.id.videoId} className="video-wrapper">
              <div className="thumbnail">
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                />
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
          countryVideos.map((video) => (
            <div key={video.id.videoId} className="video-wrapper">
              <div className="thumbnail">
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                />
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
```

### 2. 데이터 Fetching

**기능 설명**: YouTube Data API를 사용하여 영상 데이터를 가져옵니다.

**구현 코드**:

```javascript
const fetchVideos = async (query, setState) => {
  try {
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=10&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    const videoIds = data.items
      .map((item) => item.id.videoId)
      .filter((id) => id)
      .join(",");

    if (videoIds) {
      const detailsResponse = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?part=player&id=${videoIds}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
      );
      const detailsData = await detailsResponse.json();

      const playableVideos = data.items.filter((item) => {
        const playerData = detailsData.items.find(
          (detail) => detail.id === item.id.videoId
        );
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
  await fetchVideos("추천 음식", setRecommendedVideos);
  await fetchVideos("인기 음식", setPopularVideos);
  await fetchVideos("나라별 음식", setCountryVideos);
  setLoading(false);
};
```

### 3. 로딩 화면

**기능 설명**: 데이터를 불러오는 동안 사용자에게 로딩 중이라는 메시지를 표시합니다.

**구현 코드**:

```javascript
if (loading) {
  return <div>로딩 중...</div>;
}
```

### 4. 채널 페이지 구성

**기능 설명**: 유튜브 채널의 세부 정보와 영상을 표시합니다.

**구현 코드**

```javascript
import React, { useEffect, useState } from "react";
import Main from "../components/section/Main";
import { useParams } from "react-router-dom";
import { CiBadgeDollar, CiMedal, CiRead } from "react-icons/ci";
import VideoView from "../components/video/VideoView";
import Loading from "../components/section/Loading";

const ChannelPage = () => {
  const { channelID } = useParams();
  const [channelDetail, setChannelDetail] = useState(null);
  const [channelVideo, setChannelVideo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPageToken, setNextPageToken] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const detail = await fetch(
          `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,brandingSettings,statistics&id=${channelID}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
        );
        const detailData = await detail.json();
        setChannelDetail(detailData.items[0]);

        const video = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelID}&order=date&maxResults=48&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
        );
        const videoData = await video.json();
        setChannelVideo(videoData.items);
        setNextPageToken(videoData.nextPageToken);
      } catch (error) {
        console.log("데이터를 가져오지 못했습니다.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [channelID]);

  const loadMoreVideos = async () => {
    if (nextPageToken) {
      try {
        const nextVideo = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelID}&order=date&pageToken=${nextPageToken}&maxResults=48&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
        );
        const nextVideoData = await nextVideo.json();
        setChannelVideo((prevVideos) => [
          ...prevVideos,
          ...nextVideoData.items,
        ]);
        setNextPageToken(nextVideoData.nextPageToken);
      } catch (error) {
        console.log("비디오를 가져오지 못했습니다.", error);
      }
    }
  };

  return (
    <Main title="유튜버 채널" description="유튜버 채널 페이지입니다.">
      {loading ? (
        <Loading />
      ) : (
        <section id="channelPage">
          {channelDetail && (
            <div className="channel__inner">
              <div
                className="channel__header"
                style={{
                  backgroundImage: `url(${channelDetail.brandingSettings.image.bannerExternalUrl})`,
                }}
              >
                <div className="circle">
                  <img
                    src={channelDetail.snippet.thumbnails.high.url}
                    alt={channelDetail.snippet.title}
                  />
                </div>
              </div>
              <div className="channel__info">
                <h3 className="title">{channelDetail.snippet.title}</h3>
                <p className="desc">{channelDetail.snippet.description}</p>
                <div className="info">
                  <span>
                    <CiBadgeDollar />
                    {channelDetail.statistics.subscriberCount}
                  </span>
                  <span>
                    <CiMedal />
                    {channelDetail.statistics.videoCount}
                  </span>
                  <span>
                    <CiRead />
                    {channelDetail.statistics.viewCount}
                  </span>
                </div>
              </div>
              <div className="channel__video video__inner">
                <VideoView videos={channelVideo} />
              </div>
              <div className="channel__more">
                {nextPageToken && (
                  <button onClick={loadMoreVideos}>더보기</button>
                )}
              </div>
            </div>
          )}
        </section>
      )}
    </Main>
  );
};

export default ChannelPage;
```

## 어려웠던 점

1. **API 호출의 한계**

   - YouTube Data API 호출 시 할당량 제한이 있어 많은 데이터를 한번에 불러오는 데 어려움이 있었습니다. 이를 해결하기 위해 필요한 데이터만 선별적으로 불러오고, 불필요한 호출을 최소화하는 최적화 작업이 필요했습니다.
   - API 호출 실패 시 적절한 오류 처리를 구현하는 것이 필요했습니다. 특히, 네트워크 문제나 일시적인 API 장애를 감안하여 재시도 로직을 구현하고, 사용자에게 명확한 오류 메시지를 제공하여 신뢰성을 높였습니다.

2. **데이터 구조 파악**

   - YouTube API의 응답 데이터를 원하는 형태로 가공하여 화면에 표시하는 과정에서 데이터 구조를 파악하는 것이 중요했습니다. 다양한 API 엔드포인트에서 받아오는 데이터를 일관되게 처리하기 위해 데이터 모델링을 철저히 하고, 필요 시 데이터 변환 로직을 추가했습니다.

3. **반응형 디자인**

   - 다양한 화면 크기에서 최적의 사용자 경험을 제공하기 위해 CSS 미디어 쿼리를 활용하는 데 신경을 썼습니다.

4. **로딩 상태 관리**

   - 데이터를 불러오는 동안 사용자에게 로딩 중이라는 상태를 명확히 표시하여 사용자 경험을 향상시키는 것이 필요했습니다. React의 상태 관리를 통해 로딩 상태를 세밀하게 제어하였고, 사용자에게 비동기 처리의 진행 상황을 시각적으로 전달하기 위해 스피너와 같은 로딩 애니메이션을 추가했습니다.

5. **채널 페이지 구현**
   - 채널의 비디오 데이터를 페이징 처리하여 더 많은 비디오를 로드하는 기능을 구현하는 데 어려움이 있었습니다. 이는 YouTube API의 nextPageToken을 활용하여 해결하였으며, 사용자에게 더 많은 비디오를 제공할 수 있도록 하였습니다.

## 느낀 점

이 프로젝트를 통해 다양한 API를 활용하여 데이터를 Fetching하고, React를 사용해 상태 관리를 하며, 사용자에게 최적의 UI/UX를 제공하는 방법을 깊이 있게 배울 수 있었습니다. 특히, 데이터 Fetching 과정에서 발생할 수 있는 다양한 예외 상황을 처리하는 방법과 반응형 디자인을 구현하는 데 많은 노력을 기울였습니다. 이러한 경험을 바탕으로 앞으로 더욱 발전된 웹 애플리케이션을 개발할 수 있을 것이라는 자신감이 생겼습니다. 또한, 사용자 중심의 설계를 통해 사용자 경험을 어떻게 개선할 수 있는지에 대한 중요한 인사이트를 얻을 수 있었습니다. 이번 프로젝트는 저에게 실질적인 성장과 함께, 향후 프로젝트에서도 유용하게 적용할 수 있는 소중한 교훈을 안겨주었습니다.
