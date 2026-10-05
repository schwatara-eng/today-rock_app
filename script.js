const songs = [
  { title: "Don't Look Back in Anger", artist: "Oasis", year: 1995, genre: "Britpop", moods: ["blue", "frustrated"], weathers: ["cloudy", "rain"], energy: 3, reason: "천천히 고조되는 합창이 복잡한 마음을 바깥으로 밀어냅니다." },
  { title: "Dreams", artist: "The Cranberries", year: 1992, genre: "Alternative Rock", moods: ["calm", "excited"], weathers: ["clear", "cloudy"], energy: 3, reason: "가볍게 떠오르는 기타와 목소리가 하루의 공기를 환기합니다." },
  { title: "Heroes", artist: "David Bowie", year: 1977, genre: "Art Rock", moods: ["tired", "frustrated"], weathers: ["cloudy", "rain", "snow"], energy: 4, reason: "지친 날에도 단 한 번은 앞으로 나아가게 만드는 거대한 곡입니다." },
  { title: "Here Comes the Sun", artist: "The Beatles", year: 1969, genre: "Folk Rock", moods: ["blue", "calm"], weathers: ["clear", "snow"], energy: 2, reason: "맑은 빛처럼 들어오는 기타가 굳은 마음을 느슨하게 풉니다." },
  { title: "Everlong", artist: "Foo Fighters", year: 1997, genre: "Alternative Rock", moods: ["excited", "frustrated"], weathers: ["clear", "rain"], energy: 5, reason: "폭발적인 기타와 달리는 리듬이 쌓인 에너지를 꺼내줍니다." },
  { title: "Linger", artist: "The Cranberries", year: 1993, genre: "Dream Pop", moods: ["blue", "calm"], weathers: ["rain", "cloudy"], energy: 2, reason: "비 오는 날의 잔상처럼 오래 남는 감정을 조용히 받아줍니다." },
  { title: "Mr. Brightside", artist: "The Killers", year: 2003, genre: "Indie Rock", moods: ["excited", "frustrated"], weathers: ["clear", "cloudy"], energy: 5, reason: "멈추지 않는 비트가 답답한 기분을 단숨에 움직이게 합니다." },
  { title: "Wish You Were Here", artist: "Pink Floyd", year: 1975, genre: "Progressive Rock", moods: ["blue", "calm"], weathers: ["cloudy", "rain"], energy: 1, reason: "여백이 많은 기타 선율이 생각을 서두르지 않게 해줍니다." },
  { title: "Song 2", artist: "Blur", year: 1997, genre: "Alternative Rock", moods: ["tired", "excited"], weathers: ["clear", "cloudy"], energy: 5, reason: "짧고 강한 폭발력으로 처진 에너지를 빠르게 끌어올립니다." },
  { title: "The Chain", artist: "Fleetwood Mac", year: 1977, genre: "Classic Rock", moods: ["focused", "frustrated"], weathers: ["cloudy", "rain"], energy: 4, reason: "팽팽한 리듬과 후반부의 추진력이 집중을 오래 붙듭니다." },
  { title: "Where Is My Mind?", artist: "Pixies", year: 1988, genre: "Alternative Rock", moods: ["tired", "focused"], weathers: ["cloudy", "rain"], energy: 2, reason: "낯설고 반복적인 리듬이 복잡한 생각에 새로운 간격을 만듭니다." },
  { title: "Friday I'm in Love", artist: "The Cure", year: 1992, genre: "Alternative Rock", moods: ["excited", "calm"], weathers: ["clear", "cloudy"], energy: 4, reason: "밝게 튀는 기타가 평범한 하루를 가볍고 선명하게 바꿉니다." },
  { title: "No Surprises", artist: "Radiohead", year: 1997, genre: "Alternative Rock", moods: ["tired", "blue"], weathers: ["rain", "cloudy"], energy: 1, reason: "차분한 반복 속에서 과열된 마음을 잠시 내려놓게 합니다." },
  { title: "Sweet Disposition", artist: "The Temper Trap", year: 2008, genre: "Indie Rock", moods: ["focused", "calm"], weathers: ["clear", "cloudy"], energy: 3, reason: "투명하게 겹치는 사운드가 집중과 낙관을 함께 끌어냅니다." },
  { title: "Immigrant Song", artist: "Led Zeppelin", year: 1970, genre: "Hard Rock", moods: ["tired", "excited"], weathers: ["snow", "clear"], energy: 5, reason: "거칠고 압축된 에너지로 몸과 마음의 시동을 겁니다." }
];

const songInsights = {
  "Don't Look Back in Anger": { theme: "후회와 분노를 지나 과거를 놓아주는 태도", mood: "쓸쓸하게 시작해 거대한 합창으로 벅차오르는 분위기" },
  "Dreams": { theme: "사랑에 빠지며 달라지는 마음과 새로운 가능성", mood: "투명하고 들뜬 공기감이 번지는 몽환적인 분위기" },
  "Heroes": { theme: "완전하지 않아도 단 하루만큼은 용기 내는 두 사람", mood: "절제된 시작에서 장엄하게 상승하는 분위기" },
  "Here Comes the Sun": { theme: "긴 어려움이 지나고 다시 찾아오는 희망", mood: "따뜻한 햇살처럼 부드럽고 낙관적인 분위기" },
  "Everlong": { theme: "시간이 멈추길 바랄 만큼 강렬한 관계의 순간", mood: "숨 가쁘게 달리면서도 아련함이 남는 분위기" },
  "Linger": { theme: "끝난 관계에서 미처 놓지 못한 미련과 상처", mood: "섬세하고 서정적이며 비 오는 날처럼 촉촉한 분위기" },
  "Mr. Brightside": { theme: "질투와 불안이 머릿속에서 걷잡을 수 없이 커지는 순간", mood: "초조하지만 춤추게 만드는 폭발적인 분위기" },
  "Wish You Were Here": { theme: "부재한 사람을 향한 그리움과 진짜 삶에 대한 질문", mood: "담담하고 고독하며 넓은 여백이 느껴지는 분위기" },
  "Song 2": { theme: "의미보다 순간의 충동과 에너지를 터뜨리는 쾌감", mood: "짧고 거칠며 장난스럽게 폭발하는 분위기" },
  "The Chain": { theme: "무너진 관계 속에서도 끊어지지 않는 연결", mood: "긴장감이 서서히 쌓여 질주로 바뀌는 분위기" },
  "Where Is My Mind?": { theme: "현실감이 흐려지는 혼란과 자기 인식의 순간", mood: "기묘하고 공중에 떠 있는 듯한 초현실적 분위기" },
  "Friday I'm in Love": { theme: "복잡한 일주일 끝에 찾아오는 단순하고 환한 사랑", mood: "경쾌하고 다채로우며 거리로 나가고 싶은 분위기" },
  "No Surprises": { theme: "과도한 압박에서 벗어나 조용한 삶을 바라는 마음", mood: "자장가처럼 평온하지만 그 아래 슬픔이 흐르는 분위기" },
  "Sweet Disposition": { theme: "사라지기 전 붙잡고 싶은 젊음과 찰나의 감정", mood: "빛이 번지듯 점차 고양되는 맑고 드넓은 분위기" },
  "Immigrant Song": { theme: "새로운 땅으로 향하는 전사의 기세와 정복의 서사", mood: "원초적이고 공격적이며 단숨에 치고 나가는 분위기" }
};

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

document.querySelectorAll(".mood-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".mood-button").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    selectedMood = button.dataset.mood;
    recommendButton.disabled = false;
    selectionMessage.textContent = `${button.textContent}을 선택했어요.`;
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

async function fetchWeather(latitude, longitude, placeName) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("날씨 정보를 가져오지 못했습니다.");
  const data = await response.json();
  currentWeather = weatherGroup(data.current.weather_code);
  weatherStatus.textContent = `${weatherNames[currentWeather]} ${placeName}`;
  weatherDetail.textContent = `${Math.round(data.current.temperature_2m)}°C · 바람 ${Math.round(data.current.wind_speed_10m)}km/h`;
  weatherIcon.textContent = weatherEmoji(currentWeather);
}

function loadWeather() {
  weatherStatus.textContent = "날씨를 불러오는 중";
  weatherDetail.textContent = "위치 권한을 허용하면 현재 지역을 기준으로 찾아요.";

  if (!navigator.geolocation) {
    useSeoulWeather();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => fetchWeather(coords.latitude, coords.longitude, "현재 위치").catch(useSeoulWeather),
    useSeoulWeather,
    { timeout: 7000 }
  );
}

function useSeoulWeather() {
  fetchWeather(37.5665, 126.978, "서울")
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

function showRecommendations() {
  const picked = [...songs].sort((a, b) => scoreSong(b) - scoreSong(a)).slice(0, 3);
  const list = document.querySelector("#song-list");
  list.innerHTML = "";

  picked.forEach((song, index) => {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(song.artist + " " + song.title)}`;
    const lyricsUrl = `https://genius.com/search?q=${encodeURIComponent(song.artist + " " + song.title)}`;
    const insight = songInsights[song.title];
    list.insertAdjacentHTML("beforeend", `
      <article class="song-card">
        <span class="song-number">0${index + 1}</span>
        <p class="song-meta">${song.year} · ${song.genre} · ENERGY ${song.energy}/5</p>
        <h3>${song.title}</h3>
        <p class="song-artist">${song.artist}</p>
        <dl class="song-analysis">
          <div><dt>곡의 주제</dt><dd>${insight.theme}</dd></div>
          <div><dt>정서·분위기</dt><dd>${insight.mood}</dd></div>
          <div><dt>추천 이유</dt><dd>${song.reason}</dd></div>
        </dl>
        <div class="song-links">
          <a class="listen-link" href="${searchUrl}" target="_blank" rel="noopener">YouTube ↗</a>
          <a class="lyrics-link" href="${lyricsUrl}" target="_blank" rel="noopener">가사 찾기 ↗</a>
        </div>
      </article>
    `);
  });

  const top = picked[0];
  document.querySelector("#result-summary").textContent =
    `${weatherNames[currentWeather]} 날씨와 ${moodNames[selectedMood]} 마음을 함께 고려했어요.`;
  document.querySelector("#pick-card").innerHTML = `
    <div><p class="section-label">TODAY'S ONE PICK</p></div>
    <div>
      <h3>${top.title}</h3>
      <p><strong>${top.artist}</strong></p>
      <p>${top.reason} 오늘의 첫 곡으로 가장 잘 어울립니다.</p>
    </div>
  `;
  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

loadWeather();
