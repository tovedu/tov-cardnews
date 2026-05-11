# 토브에듀 카드뉴스 Supabase 업로드 사이트

이미지를 붙여넣거나 업로드하면 Supabase Storage에 저장하고, 블로그/홈페이지에 붙일 수 있는 HTML 코드를 생성하는 정적 사이트입니다.

## 1. Supabase 설정

1. https://supabase.com 에서 프로젝트 생성
2. 왼쪽 메뉴 `Storage` 클릭
3. `New bucket` 클릭
4. Bucket name: `tov-cardnews`
5. `Public bucket` 체크 후 생성

## 2. URL / anon key 확인

Supabase 프로젝트에서:

`Project Settings` → `API`

아래 2개를 복사합니다.

- Project URL
- anon public key

## 3. script.js 수정

`script.js` 상단의 아래 부분을 수정합니다.

```js
const SUPABASE_URL = '여기에_SUPABASE_PROJECT_URL을_넣으세요';
const SUPABASE_ANON_KEY = '여기에_SUPABASE_ANON_KEY를_넣으세요';
const BUCKET_NAME = 'tov-cardnews';
```

## 4. GitHub 업로드

저장소 루트에 아래 파일들이 바로 보이도록 업로드하세요.

```text
index.html
style.css
script.js
README.md
```

## 5. Vercel 배포

1. Vercel 로그인
2. Add New → Project
3. GitHub 저장소 선택
4. Framework Preset: Other
5. Deploy

## 6. 사용법

- 이미지 파일 선택 또는 Ctrl+V로 붙여넣기
- `Supabase에 저장하기` 클릭
- 이미지 URL 또는 HTML 코드 복사

## 주의

이 버전은 사이트에 접속한 사람이 anon key로 public bucket에 업로드할 수 있는 구조입니다. 혼자 쓰는 내부 도구로는 편하지만, 공개 사이트로 널리 공유하면 아무나 이미지를 올릴 수 있습니다. 공개 운영 시에는 로그인 기능 또는 서버 API를 추가하는 것이 좋습니다.
