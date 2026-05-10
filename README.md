# 토브에듀 카드뉴스 메이커

Vercel에 바로 배포할 수 있는 카드뉴스 제작용 정적 사이트입니다.

## 기능

- 이미지 업로드
- 클립보드 이미지 붙여넣기
- 1080 x 1080 카드뉴스 미리보기
- PNG 저장
- HTML 미리보기
- HTML 코드 복사
- HTML 파일 저장
- 이미지 위치 조정
- 템플릿 문구 수정

## 실행 방법

```bash
npm install
npm run dev
```

## Vercel 배포

1. 이 폴더를 GitHub 저장소에 업로드합니다.
2. Vercel에서 Add New → Project를 누릅니다.
3. GitHub 저장소를 선택합니다.
4. Deploy를 누릅니다.

## 사용 팁

- 카드뉴스 이미지는 PNG 저장 후 인스타그램/블로그에 올리면 됩니다.
- HTML 미리보기에서 HTML 복사를 누르면 웹페이지나 블로그 HTML 영역에 붙여넣을 수 있습니다.
- 붙여넣은 이미지는 브라우저 내부 data URL로 들어갑니다. 파일 크기가 커질 수 있으니, 장기 운영용 이미지는 `/public/images` 폴더에 넣고 HTML의 `src`를 `/images/파일명.jpg`로 바꿔 쓰는 것을 권장합니다.
