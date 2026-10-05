# 🎸 오늘의 록 (Today's Rock)

> 오늘의 날씨와 지금 내 기분에 맞춰, 실제 발매된 록 음악 세 곡을 골라주는 웹앱

**👉 바로 써보기: [today-rockapp.vercel.app](https://today-rockapp.vercel.app/)**

---

## 소개

「오늘의 록」은 접속한 위치의 **현재 날씨**와 사용자가 고른 **기분**을 조합해, 300곡의 록 음악 데이터베이스에서 오늘 듣기 좋은 세 곡을 추천합니다.
곡마다 주제·분위기·추천 이유를 함께 보여주고, YouTube와 가사 페이지로 바로 이어집니다.

## 주요 기능

- **현재 위치 날씨 자동 조회** — Open-Meteo API로 기온·날씨·풍속을 불러오고, 현재 지역 이름을 함께 표시합니다.
- **위치 권한 거부 시 서울 기본값** — 위치를 허용하지 않아도 서울 날씨로 바로 추천받을 수 있습니다. ‘내 위치로 다시 찾기’ 버튼으로 언제든 다시 시도할 수 있습니다.
- **여섯 가지 기분 선택** — 지침 · 평온 · 울적함 · 신남 · 답답함 · 집중
- **날씨 × 기분 맞춤 추천** — 조건에 가장 잘 맞는 세 곡을 고릅니다.
- **기분을 고르지 않으면 무작위 추천** — 버튼만 눌러도 전체 곡 중 세 곡을 랜덤으로 만날 수 있습니다.
- **곡 카드 정보** — 발매 연도, 장르, 에너지 지수(1~5), 곡의 주제, 정서·분위기, 추천 이유
- **바로 듣기·가사 보기** — YouTube 검색 링크와 Genius 가사 페이지 링크
- **오늘의 원픽** — 세 곡 중 첫 곡을 대표곡으로 크게 보여줍니다.
- **반응형 화면** — 모바일 1열, 데스크톱 3열 레이아웃

## 추천 방식

기분을 선택하면 곡마다 점수를 매겨 상위 세 곡을 보여줍니다.

| 조건 | 점수 |
| --- | --- |
| 선택한 기분과 곡의 기분 태그가 일치 | +4 |
| 현재 날씨와 곡의 날씨 태그가 일치 | +2 |
| 기분별 에너지 보정 (지침 → 에너지 4 이상, 평온 → 3 이하, 집중 → 2~4) | +1 |
| 매번 다른 결과를 위한 무작위 가산점 | 0~0.4 |

날씨는 Open-Meteo의 날씨 코드를 **맑음(clear) · 흐림(cloudy) · 비(rain) · 눈(snow)** 네 그룹으로 묶어 사용합니다.

## 곡 데이터

- `data.json`에 **300곡** 수록 (1964년~2024년 발매, 49개 장르)
- 곡 하나의 구조:

```json
{
  "title": "Don't Look Back in Anger",
  "artist": "Oasis",
  "year": 1995,
  "genre": "Britpop",
  "moods": ["blue", "frustrated"],
  "weathers": ["cloudy", "rain"],
  "energy": 3,
  "theme": "후회와 분노를 지나 과거를 놓아주는 태도",
  "tone": "쓸쓸하게 시작해 거대한 합창으로 벅차오르는 분위기",
  "reason": "천천히 고조되는 합창이 복잡한 마음을 바깥으로 밀어냅니다.",
  "lyricsUrl": "https://genius.com/Oasis-dont-look-back-in-anger-lyrics"
}
```

| 필드 | 설명 |
| --- | --- |
| `moods` | `tired`, `calm`, `blue`, `excited`, `frustrated`, `focused` 중 하나 이상 |
| `weathers` | `clear`, `cloudy`, `rain`, `snow` 중 하나 이상 |
| `energy` | 곡의 에너지 지수 (1~5) |
| `theme` / `tone` / `reason` | 카드에 표시되는 곡의 주제, 분위기, 추천 이유 |

곡을 추가하려면 같은 형식으로 `data.json`에 항목을 덧붙이면 됩니다.

## 기술 스택

- HTML / CSS / JavaScript (프레임워크 없는 정적 웹앱)
- [Open-Meteo API](https://open-meteo.com/) — 현재 날씨 (API 키 불필요)
- [BigDataCloud Reverse Geocoding](https://www.bigdatacloud.com/) — 위치 좌표 → 지역 이름
- [Vercel](https://vercel.com/) — 배포

## 파일 구조

```
today-rock_app/
├── index.html     # 화면 구조
├── style.css      # 반응형 디자인
├── script.js      # 날씨 조회, 곡 데이터 불러오기, 추천 로직
├── data.json      # 곡 데이터 300곡
└── images/        # 배경 및 공연 사진
```

## 로컬에서 실행하기

`data.json`을 `fetch`로 불러오기 때문에, `index.html`을 더블클릭해서 열면 곡 데이터가 로드되지 않습니다. 로컬 서버로 실행해주세요.

**VS Code Live Server**

1. VS Code에서 프로젝트 폴더를 엽니다.
2. `index.html`에서 마우스 오른쪽 버튼 → **Open with Live Server**

**또는 터미널에서**

```bash
git clone https://github.com/schwatara-eng/today-rock_app.git
cd today-rock_app
npx serve .
```

## 배포

GitHub 저장소를 Vercel에 연결해 배포했습니다. 빌드 과정이 없는 정적 사이트라 `main` 브랜치에 push하면 자동으로 다시 배포됩니다.

## 다음 단계 후보

- [x] 음악 데이터를 JSON으로 분리
- [x] 현재 지역 이름 표시
- [ ] 추천 기록을 LocalStorage에 저장
- [ ] 지역 이름 직접 검색
- [ ] 장르·시대 필터 추가
- [ ] 추천 결과 공유하기
