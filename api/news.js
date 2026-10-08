
const { XMLParser } = require("fast-xml-parser");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "GET 요청만 허용됩니다." });
  }

  try {
    // NME 음악 뉴스 RSS 주소
    const rssUrl = "https://www.nme.com/news/music/feed";

    // NME 서버에서 RSS 데이터 가져오기
    const response = await fetch(rssUrl);

    if (!response.ok) {
      throw new Error(`NME 응답 오류: ${response.status}`);
    }

    // XML 데이터를 JavaScript 객체로 변환
    const rssData = await response.text();
    const parser = new XMLParser();
    const parsedRss = parser.parse(rssData);

    const items = parsedRss.rss.channel.item;

    // HTML 태그와 일부 특수문자 제거
    function cleanHtml(text = "") {
      return String(text)
        .replace(/<[^>]*>/g, " ")
        .replace(/&#8217;|&#x2019;/g, "'")
        .replace(/&#8216;|&#x2018;/g, "'")
        .replace(/&#8220;|&#x201C;/g, '"')
        .replace(/&#8221;|&#x201D;/g, '"')
        .replace(/&#038;|&amp;/g, "&")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    // 최신 기사 3개를 JSON 배열로 만들기
    const news = items.slice(0, 3).map((item) => {
      const cleanDescription = cleanHtml(item.description);

      return {
        title: cleanHtml(item.title),
        link: item.link,
        pubDate: item.pubDate,
        description:
          cleanDescription.length > 160
            ? cleanDescription.slice(0, 160) + "..."
            : cleanDescription
      };
    });

    // 브라우저에 뉴스 데이터 전달
    return res.status(200).json(news);

  } catch (error) {
    console.error("RSS 수집 오류:", error);

    return res.status(500).json({
      error: "NME RSS를 가져오지 못했습니다."
    });
  }
};
