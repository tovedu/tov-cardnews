import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/*
  Supabase 설정 방법
  1. Supabase 프로젝트 생성
  2. Storage > Buckets > New bucket
  3. bucket name: tov-cardnews
  4. Public bucket 체크
  5. 아래 SUPABASE_URL / SUPABASE_ANON_KEY 입력
*/
const SUPABASE_URL = 'https://chteygulcweyekcumnpo.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'sb_publishable__raD5sfaXnIXFv-cgPM68A_64PIM_LM';
const BUCKET_NAME = 'tov-cardnews';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const uploadBtn = document.getElementById('uploadBtn');
const statusEl = document.getElementById('status');
const previewImage = document.getElementById('previewImage');
const emptyState = document.getElementById('emptyState');
const htmlOutput = document.getElementById('htmlOutput');

const labelInput = document.getElementById('labelInput');
const titleInput = document.getElementById('titleInput');
const bodyInput = document.getElementById('bodyInput');
const footerInput = document.getElementById('footerInput');
const xPos = document.getElementById('xPos');
const yPos = document.getElementById('yPos');

const cardLabel = document.getElementById('cardLabel');
const cardTitle = document.getElementById('cardTitle');
const cardBody = document.getElementById('cardBody');
const cardFooter = document.getElementById('cardFooter');

const copyUrlBtn = document.getElementById('copyUrlBtn');
const copyHtmlBtn = document.getElementById('copyHtmlBtn');
const downloadHtmlBtn = document.getElementById('downloadHtmlBtn');

let selectedFile = null;
let publicImageUrl = '';

function safeText(text) {
  return String(text || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function updatePreviewText() {
  cardLabel.textContent = labelInput.value;
  cardTitle.textContent = titleInput.value;
  cardBody.textContent = bodyInput.value;
  cardFooter.textContent = footerInput.value;
  updateImagePosition();
  generateHtml();
}

function updateImagePosition() {
  previewImage.style.objectPosition = `${xPos.value} ${yPos.value}`;
}

function previewLocalFile(file) {
  selectedFile = file;
  const url = URL.createObjectURL(file);
  previewImage.src = url;
  previewImage.style.display = 'block';
  emptyState.style.display = 'none';
  statusEl.textContent = `선택된 이미지: ${file.name || 'clipboard-image.png'}`;
}

fileInput.addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (file) previewLocalFile(file);
});

document.addEventListener('paste', (event) => {
  const items = event.clipboardData?.items || [];
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file) {
        const pastedFile = new File([file], `clipboard-${Date.now()}.png`, { type: file.type });
        previewLocalFile(pastedFile);
      }
      break;
    }
  }
});

['dragenter', 'dragover'].forEach((name) => {
  dropZone.addEventListener(name, (event) => {
    event.preventDefault();
    dropZone.classList.add('active');
  });
});

['dragleave', 'drop'].forEach((name) => {
  dropZone.addEventListener(name, (event) => {
    event.preventDefault();
    dropZone.classList.remove('active');
  });
});

dropZone.addEventListener('drop', (event) => {
  const file = event.dataTransfer?.files?.[0];
  if (file && file.type.startsWith('image/')) previewLocalFile(file);
});

async function uploadToSupabase() {
  if (!selectedFile) {
    statusEl.textContent = '먼저 이미지를 선택하거나 붙여넣어 주세요.';
    return;
  }
  if (SUPABASE_URL.includes('여기에') || SUPABASE_ANON_KEY.includes('여기에')) {
    statusEl.textContent = 'script.js에 Supabase URL과 anon key를 먼저 입력해야 합니다.';
    return;
  }

  uploadBtn.disabled = true;
  uploadBtn.textContent = '업로드 중...';
  statusEl.textContent = 'Supabase Storage에 업로드하고 있습니다.';

  const ext = selectedFile.type.split('/')[1] || 'png';
  const fileName = `cardnews/${new Date().toISOString().slice(0,10)}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, selectedFile, {
      cacheControl: '3600',
      upsert: false,
      contentType: selectedFile.type,
    });

  if (error) {
    statusEl.textContent = `업로드 실패: ${error.message}`;
    uploadBtn.disabled = false;
    uploadBtn.textContent = 'Supabase에 저장하기';
    return;
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
  publicImageUrl = data.publicUrl;
  previewImage.src = publicImageUrl;
  statusEl.textContent = `저장 완료: ${publicImageUrl}`;
  uploadBtn.disabled = false;
  uploadBtn.textContent = 'Supabase에 저장하기';
  generateHtml();
}

function generateHtml() {
  const imgSrc = publicImageUrl || '업로드 후 이미지 URL이 여기에 들어갑니다';
  const position = `${xPos.value} ${yPos.value}`;
  const html = `<section style="width:100%;max-width:720px;margin:0 auto;background:#FAF7F2;border-radius:28px;overflow:hidden;border:1px solid #E8DED2;font-family:-apple-system,BlinkMacSystemFont,'Pretendard','Noto Sans KR',sans-serif;color:#111;">
  <div style="height:380px;overflow:hidden;background:#F1E8DD;">
    <img src="${safeText(imgSrc)}" alt="토브에듀 카드뉴스 이미지" style="width:100%;height:100%;object-fit:cover;object-position:${position};display:block;">
  </div>
  <div style="padding:34px 38px 36px;">
    <p style="margin:0 0 12px;color:#2F6BFF;font-size:14px;font-weight:900;letter-spacing:.08em;">${safeText(labelInput.value)}</p>
    <h2 style="margin:0;font-size:34px;line-height:1.28;letter-spacing:-.05em;">${safeText(titleInput.value)}</h2>
    <p style="margin:18px 0 0;color:#555;font-size:17px;line-height:1.7;">${safeText(bodyInput.value)}</p>
    <p style="margin:24px 0 0;color:#777;font-size:14px;font-weight:700;">${safeText(footerInput.value)}</p>
  </div>
</section>`;
  htmlOutput.value = html;
}

uploadBtn.addEventListener('click', uploadToSupabase);
[labelInput, titleInput, bodyInput, footerInput, xPos, yPos].forEach((el) => {
  el.addEventListener('input', updatePreviewText);
  el.addEventListener('change', updatePreviewText);
});

copyUrlBtn.addEventListener('click', async () => {
  if (!publicImageUrl) {
    statusEl.textContent = '먼저 이미지를 Supabase에 저장해 주세요.';
    return;
  }
  await navigator.clipboard.writeText(publicImageUrl);
  statusEl.textContent = '이미지 URL을 복사했습니다.';
});

copyHtmlBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(htmlOutput.value);
  statusEl.textContent = 'HTML 코드를 복사했습니다.';
});

downloadHtmlBtn.addEventListener('click', () => {
  const blob = new Blob([htmlOutput.value], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tov-cardnews-${Date.now()}.html`;
  a.click();
  URL.revokeObjectURL(url);
});

updatePreviewText();
