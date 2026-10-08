
const { XMLParser } = require("fast-xml-parser");

// Google Cloud Translation API
async function translateTexts(texts) {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

  if (!apiKey) {
    console.warn("Google 번역 API 키가 없습니다.");
    return texts;
  }

  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: texts,
        source: "en",
        target: "ko",
        format: "text"
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Google 번역 오류: ${response.status}`);
  }

  const data = await response.json();

  // 번역 결과의 HTML 엔티티 복원
  return data.data.translations.map((item) =>
    decodeHtml(item.translatedText)
  );
}

function decodeHtml(text = "") {
  return String(text)
    .replace(/&#(\d+);/g, (_, n) =>
      String.fromCodePoint(Number(n))
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
      String.fromCodePoint(parseInt(n, 16))
    )
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function cleanHtml(text = "") {
  return decodeHtml(
    String(text)
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "GET 요청만 허용됩니다."
    });
  }

  try {
    // NME 음악 뉴스 RSS 수집
    const response = await fetch(
      "https://www.nme.com/news/music/feed"
    );

    if (!response.ok) {
      throw new Error(`NME RSS 오류: ${response.status}`);
    }

    const xml = await response.text();
    const parser = new XMLParser();
    const parsed = parser.parse(xml);

    const items = parsed?.rss?.channel?.item;
    if (!items) {
      throw new Error("RSS 기사 목록을 찾을 수 없습니다.");
    }

    const articles = (Array.isArray(items) ? items : [items])
      .slice(0, 3)
      .map((item) => ({
        title: cleanHtml(item.title),
        description: cleanHtml(item.description).slice(0, 160),
        link: item.link,
        pubDate: item.pubDate
      }));

    // 제목 3개 + 요약 3개를 한 번에 번역
    const texts = articles.flatMap((article) => [
      article.title,
      article.description
    ]);

    try {
      const translated = await translateTexts(texts);

      articles.forEach((article, index) => {
        article.title = translated[index * 2];
        article.description = translated[index * 2 + 1];
      });
    } catch (error) {
      // 번역에 실패해도 영문 뉴스는 표시
      console.error("번역 실패:", error.message);
    }

    // 동일 뉴스의 반복 번역 요청을 줄이기 위한 캐시
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );

    return res.status(200).json(articles);

  } catch (error) {
    console.error("뉴스 수집 실패:", error.message);

    return res.status(500).json({
      error: "뉴스를 가져오지 못했습니다."
    });
  }
};
