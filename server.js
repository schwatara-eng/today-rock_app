const http = require("http");

const PORT = 3000;

const server = http.createServer(async (req, res) => {

  // 우리가 만들 API 주소
  if (req.url === "/api/news") {

    try {
      // NME Music News RSS
      const rssUrl = "https://www.nme.com/news/music/feed";

      // 서버가 NME에 대신 요청
      const response = await fetch(rssUrl);

      if (!response.ok) {
        throw new Error(`NME 응답 오류: ${response.status}`);
      }

      const rssData = await response.text();

      // 브라우저에서 접근할 수 있도록 CORS 허용
      res.writeHead(200, {
        "Content-Type": "application/xml; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      });

      res.end(rssData);

    } catch (error) {

      console.error(error);

      res.writeHead(500, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      });

      res.end(
        JSON.stringify({
          error: "NME RSS를 가져오지 못했습니다."
        })
      );
    }

  } else {

    res.writeHead(404, {
      "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`서버 실행: http://localhost:${PORT}`);
});