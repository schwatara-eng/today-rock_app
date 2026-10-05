let songs = [];
let songsLoaded = false;

const moodNames = {
  tired: "지친", calm: "평온한", blue: "울적한",
  excited: "신나는", frustrated: "답답한", focused: "집중하고 싶은"
};

const weatherNames = {
  clear: "맑은", cloudy: "흐린", rain: "비 오는", snow: "눈 오는"
};

let selectedMood = "";
let currentWeather = "cloudy";

const weatherStatus = document.querySelector("#weather-status");
const weatherDetail = document.querySelector("#weather-detail");
const weatherIcon = document.querySelector("#weather-icon");
const recommendButton = document.querySelector("#recommend-button");
const selectionMessage = document.querySelector("#selection-message");
const resultSection = document.querySelector("#result-section");

async function loadSongs() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("곡 데이터를 불러오지 못했습니다.");

    songs = await response.json();
    songsLoaded = true;
    recommendButton.disabled = false;
    selectionMessage.textContent = "기분을 고르지 않으면 세 곡을 무작위로 추천해요.";
  } catch (error) {
    songsLoaded = false;
    recommendButton.disabled = true;
    selectionMessage.textContent = "곡 데이터를 불러오지 못했어요. Live Server로 실행해주세요.";
    console.error(error);
  }
}

document.querySelectorAll(".mood-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".mood-button").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    selectedMood = button.dataset.mood;
    recommendButton.disabled = !songsLoaded;
    selectionMessage.textContent = songsLoaded
      ? `${button.textContent}을 선택했어요.`
      : "곡 데이터를 불러오는 중이에요.";
  });
});

document.querySelector("#location-button").addEventListener("click", loadWeather);
recommendButton.addEventListener("click", showRecommendations);

function weatherGroup(code) {
  if (code === 0 || code === 1) return "clear";
  if (code === 2 || code === 3 || code === 45 || code === 48) return "cloudy";
  if (code >= 71 && code <= 77) return "snow";
  return "rain";
}

function weatherEmoji(group) {
  return { clear: "☀", cloudy: "☁", rain: "☂", snow: "❄" }[group];
}

async function fetchRegionName(latitude, longitude) {
  const url =
    "https://api.bigdatacloud.net/data/reverse-geocode-client" +
    `?latitude=${latitude}&longitude=${longitude}&localityLanguage=ko`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("지역명을 가져오지 못했습니다.");

  const data = await response.json();
  const administrative = data.localityInfo?.administrative || [];
  const names = administrative.map((item) => item.name).filter(Boolean);

  const region = data.principalSubdivision || "";
  const city = names.find((name) =>
    name.endsWith("시") && name !== region
  ) || "";
  const district = names.find((name) =>
    name.endsWith("구") || name.endsWith("군")
  ) || "";

  const placeParts = [region];

  if (city && !region.includes(city)) {
    placeParts.push(city);
  }

  if (district && district !== city) {
    placeParts.push(district);
  }

  if (placeParts.filter(Boolean).length === 1) {
    const fallbackDistrict = data.locality || data.city || "";
    if (fallbackDistrict && !region.includes(fallbackDistrict)) {
      placeParts.push(fallbackDistrict);
    }
  }

  return placeParts.filter(Boolean).join(" ") || "현재 위치";
}

async function fetchWeather(latitude, longitude, placeName) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("날씨 정보를 가져오지 못했습니다.");
  const data = await response.json();

  if (!placeName) {
    try {
      placeName = await fetchRegionName(latitude, longitude);
    } catch (error) {
      placeName = "현재 위치";
    }
  }

  currentWeather = weatherGroup(data.current.weather_code);
  renderWeatherStatus(weatherNames[currentWeather], placeName);
  weatherDetail.textContent = `${Math.round(data.current.temperature_2m)}°C · 바람 ${Math.round(data.current.wind_speed_10m)}km/h`;
  weatherIcon.textContent = weatherEmoji(currentWeather);
}

function renderWeatherStatus(weatherName, placeName) {
  const [region = "", ...districtParts] = placeName.trim().split(/\s+/);
  const district = districtParts.join(" ");

  weatherStatus.replaceChildren();
  weatherStatus.append(`${weatherName} ${region}`.trim());

  if (district) {
    weatherStatus.append(document.createElement("br"), district);
  }
}

function loadWeather() {
  weatherStatus.textContent = "날씨를 불러오는 중";
  weatherDetail.textContent = "위치 권한을 허용하면 현재 지역을 기준으로 찾아요.";

  if (!navigator.geolocation) {
    useSeoulWeather();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => fetchWeather(coords.latitude, coords.longitude).catch(useSeoulWeather),
    useSeoulWeather,
    { timeout: 7000 }
  );
}

function useSeoulWeather() {
  fetchWeather(37.5665, 126.978, "서울특별시")
    .catch(() => {
      currentWeather = "cloudy";
      weatherStatus.textContent = "날씨 연결 실패";
      weatherDetail.textContent = "흐린 날을 기준으로 추천할게요.";
      weatherIcon.textContent = "☁";
    });
}

function scoreSong(song) {
  let score = 0;
  if (song.moods.includes(selectedMood)) score += 4;
  if (song.weathers.includes(currentWeather)) score += 2;
  if (selectedMood === "tired" && song.energy >= 4) score += 1;
  if (selectedMood === "calm" && song.energy <= 3) score += 1;
  if (selectedMood === "focused" && song.energy >= 2 && song.energy <= 4) score += 1;
  return score + Math.random() * 0.4;
}

function pickRandomSongs(songList, count) {
  const shuffled = [...songList];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled.slice(0, count);
}

function showRecommendations() {
  if (!songsLoaded || songs.length === 0) return;

  const picked = selectedMood
    ? [...songs].sort((a, b) => scoreSong(b) - scoreSong(a)).slice(0, 3)
    : pickRandomSongs(songs, 3);
  const list = document.querySelector("#song-list");
  list.innerHTML = "";

  picked.forEach((song, index) => {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(song.artist + " " + song.title)}`;
    const lyricsUrl = song.lyricsUrl;
    list.insertAdjacentHTML("beforeend", `
      <article class="song-card">
        <span class="song-number">0${index + 1}</span>
        <p class="song-meta">${song.year} · ${song.genre} · ENERGY ${song.energy}/5</p>
        <h3>${song.title}</h3>
        <p class="song-artist">${song.artist}</p>
        <dl class="song-analysis">
          <div><dt>곡의 주제</dt><dd>${song.theme}</dd></div>
          <div><dt>정서·분위기</dt><dd>${song.tone}</dd></div>
          <div><dt>추천 이유</dt><dd>${song.reason}</dd></div>
        </dl>
        <div class="song-links">
          <a class="listen-link" href="${searchUrl}" target="_blank" rel="noopener">YouTube ↗</a>
          <a class="lyrics-link" href="${lyricsUrl}" target="_blank" rel="noopener">가사 보기 ↗</a>
        </div>
      </article>
    `);
  });

  const top = picked[0];
  const topSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(top.artist + " " + top.title)}`;
  document.querySelector("#result-summary").textContent =
    selectedMood
      ? `${weatherNames[currentWeather]} 날씨와 ${moodNames[selectedMood]} 마음을 함께 고려했어요.`
      : "오늘은 기분 선택 없이 100곡 가운데 세 곡을 무작위로 골랐어요.";
  document.querySelector("#pick-card").innerHTML = `
    <a class="pick-card-link" href="${topSearchUrl}" target="_blank" rel="noopener" aria-label="오늘의 원픽을 YouTube에서 듣기"></a>
    <div><p class="section-label">TODAY'S ONE PICK</p></div>
    <div>
      <h3>${top.title}</h3>
      <p><strong>${top.artist}</strong></p>
      <p>${selectedMood ? `${top.reason} 오늘의 첫 곡으로 가장 잘 어울립니다.` : "무작위로 만난 오늘의 첫 곡입니다."}</p>
    </div>
  `;
  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

loadWeather();
loadSongs();
