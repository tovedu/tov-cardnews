import React, { useCallback, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Download, ImagePlus, RotateCcw, Copy, Code2, FileDown } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import './style.css';

const templates = {
  math: {
    label: '수학 문장제',
    title: '수학 문장제,\n왜 자꾸 틀릴까요?',
    subtitle: '정답보다 중요한 것은 문제를 설명하는 힘입니다.',
    keyword: '왜냐하면 → 그래서',
    body: '문장제는 계산 문제가 아니라\n상황을 읽고 관계를 연결하는 문제입니다.',
  },
  reading: {
    label: '능동적 글읽기',
    title: '책을 읽었는데\n내용을 설명하지 못한다면?',
    subtitle: '읽기는 눈으로 보는 활동이 아니라 생각을 연결하는 활동입니다.',
    keyword: '근거 찾기',
    body: '토브에듀는 아이가 읽은 내용을\n자기 말로 다시 설명하도록 지도합니다.',
  },
  english: {
    label: '영어 리딩',
    title: '영어 문장,\n감으로만 읽고 있나요?',
    subtitle: '단어 해석보다 먼저 문장 구조를 보게 합니다.',
    keyword: 'S / V / O / C',
    body: '주어와 동사를 찾고\n문장의 뼈대를 이해하면 독해가 안정됩니다.',
  },
};

const escapeHtml = (text = '') =>
  String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const nl2br = (text = '') => escapeHtml(text).replaceAll('\n', '<br>');

function App() {
  const [image, setImage] = useState(null);
  const [position, setPosition] = useState('center center');
  const [theme, setTheme] = useState('math');
  const [form, setForm] = useState(templates.math);
  const [showHtml, setShowHtml] = useState(false);
  const cardRef = useRef(null);
  const inputRef = useRef(null);

  const applyTemplate = (key) => {
    setTheme(key);
    setForm(templates[key]);
  };

  const readFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleFile = (e) => readFile(e.target.files?.[0]);

  const handlePaste = useCallback((e) => {
    const item = [...e.clipboardData.items].find((x) => x.type.startsWith('image/'));
    if (item) readFile(item.getAsFile());
  }, []);

  const htmlSnippet = useMemo(() => {
    const imgTag = image
      ? `<img src="${image}" alt="토브에듀 카드뉴스 이미지" style="object-position:${position};" />`
      : `<div class="tov-placeholder">이 영역에 이미지를 넣어주세요</div>`;

    return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(form.title).replaceAll('\n', ' ')}</title>
  <style>
    *{box-sizing:border-box}
    body{margin:0;background:#FAF7F2;font-family:Arial,'Noto Sans KR',sans-serif;color:#111}
    .tov-card{width:1080px;height:1080px;background:#FAF7F2;position:relative;overflow:hidden;padding:58px;margin:0 auto}
    .tov-topbar{height:54px;display:flex;align-items:center;justify-content:space-between;font-size:27px;font-weight:900}
    .tov-topbar span{background:#fff;border:2px solid #E8DED2;border-radius:999px;padding:12px 24px;color:#2F6BFF}
    .tov-topbar strong{letter-spacing:.08em}
    .tov-photo-box{height:430px;margin-top:34px;border-radius:42px;overflow:hidden;background:#fff;border:3px solid #fff;box-shadow:0 18px 40px rgba(0,0,0,.08)}
    .tov-photo-box img{width:100%;height:100%;object-fit:cover}
    .tov-placeholder{height:100%;display:flex;align-items:center;justify-content:center;color:#999;font-size:34px;font-weight:800;text-align:center;padding:40px;background:#F1E8DD}
    .tov-copy-box{margin-top:42px}
    .tov-keyword{display:inline-block;margin:0 0 20px;background:#2F6BFF;color:white;font-size:30px;font-weight:900;border-radius:18px;padding:14px 22px}
    .tov-title{font-size:72px;line-height:1.18;letter-spacing:-.05em;margin:0 0 22px}
    .tov-subtitle{font-size:32px;line-height:1.45;color:#555;margin:0 0 22px;font-weight:700}
    .tov-body-text{font-size:34px;line-height:1.55;margin:0;background:#fff;border-left:12px solid #2F6BFF;border-radius:24px;padding:24px 28px;font-weight:700;color:#222}
    .tov-footer{position:absolute;left:58px;right:58px;bottom:44px;border-top:2px solid #E8DED2;padding-top:22px;display:flex;justify-content:space-between;align-items:center;font-size:24px;color:#555}
    .tov-footer b{color:#111}
    @media(max-width:1080px){.tov-card{width:100vw;height:100vw;padding:5.37vw}.tov-topbar{font-size:2.5vw;height:5vw}.tov-topbar span{padding:1.1vw 2.2vw}.tov-photo-box{height:39.8vw;margin-top:3.1vw;border-radius:3.9vw}.tov-copy-box{margin-top:3.9vw}.tov-keyword{font-size:2.78vw;border-radius:1.67vw;padding:1.3vw 2vw}.tov-title{font-size:6.67vw}.tov-subtitle{font-size:2.96vw}.tov-body-text{font-size:3.15vw;border-radius:2.22vw;padding:2.22vw 2.6vw}.tov-footer{left:5.37vw;right:5.37vw;bottom:4.07vw;font-size:2.22vw}}
  </style>
</head>
<body>
  <article class="tov-card">
    <div class="tov-topbar">
      <span>${escapeHtml(form.label)}</span>
      <strong>TOV EDU</strong>
    </div>
    <div class="tov-photo-box">
      ${imgTag}
    </div>
    <div class="tov-copy-box">
      <p class="tov-keyword">${escapeHtml(form.keyword)}</p>
      <h1 class="tov-title">${nl2br(form.title)}</h1>
      <p class="tov-subtitle">${escapeHtml(form.subtitle)}</p>
      <p class="tov-body-text">${nl2br(form.body)}</p>
    </div>
    <div class="tov-footer">
      <span>왜냐하면으로 이해하고, 그래서로 설명하는 힘</span>
      <b>tov-edu.kr</b>
    </div>
  </article>
</body>
</html>`;
  }, [form, image, position]);

  const downloadPng = async () => {
    if (!cardRef.current) return;
    const dataUrl = await htmlToImage.toPng(cardRef.current, {
      width: 1080,
      height: 1080,
      pixelRatio: 2,
      cacheBust: true,
    });
    const link = document.createElement('a');
    link.download = `tov-cardnews-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const copyHtml = async () => {
    await navigator.clipboard.writeText(htmlSnippet);
    alert('HTML 코드가 복사되었습니다.');
  };

  const downloadHtml = () => {
    const blob = new Blob([htmlSnippet], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tov-cardnews-${Date.now()}.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <main className="app" onPaste={handlePaste}>
      <section className="panel">
        <p className="eyebrow">TOV EDU CARDNEWS MAKER</p>
        <h1>토브에듀 카드뉴스 메이커</h1>
        <p className="guide">이미지를 붙여넣거나 업로드하고, 문구를 바꾼 뒤 PNG 또는 HTML로 저장하세요.</p>

        <div className="buttons">
          <button onClick={() => inputRef.current.click()}><ImagePlus size={18}/> 이미지 업로드</button>
          <button onClick={downloadPng}><Download size={18}/> PNG 저장</button>
          <button onClick={() => setShowHtml(!showHtml)}><Code2 size={18}/> HTML 미리보기</button>
          <button onClick={() => setImage(null)}><RotateCcw size={18}/> 이미지 초기화</button>
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} hidden />

        <div className="field">
          <label>템플릿</label>
          <select value={theme} onChange={(e) => applyTemplate(e.target.value)}>
            <option value="math">수학 문장제</option>
            <option value="reading">능동적 글읽기</option>
            <option value="english">영어 리딩</option>
          </select>
        </div>

        <div className="field">
          <label>이미지 위치</label>
          <select value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value="center center">가운데</option>
            <option value="left center">왼쪽</option>
            <option value="right center">오른쪽</option>
            <option value="center top">위쪽</option>
            <option value="center bottom">아래쪽</option>
          </select>
        </div>

        {['label','title','subtitle','keyword','body'].map((key) => (
          <div className="field" key={key}>
            <label>{key}</label>
            <textarea
              rows={key === 'title' || key === 'body' ? 3 : 1}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}
      </section>

      <section className="preview-wrap">
        {!showHtml ? (
          <div className="card" ref={cardRef}>
            <div className="topbar">
              <span>{form.label}</span>
              <strong>TOV EDU</strong>
            </div>

            <div className="photo-box">
              {image ? (
                <img src={image} alt="업로드 이미지" style={{ objectPosition: position }} />
              ) : (
                <div className="placeholder">이 영역에 이미지를 붙여넣거나 업로드하세요</div>
              )}
            </div>

            <div className="copy-box">
              <p className="keyword">{form.keyword}</p>
              <h2>{form.title}</h2>
              <p className="subtitle">{form.subtitle}</p>
              <p className="body-text">{form.body}</p>
            </div>

            <div className="footer">
              <span>왜냐하면으로 이해하고, 그래서로 설명하는 힘</span>
              <b>tov-edu.kr</b>
            </div>
          </div>
        ) : (
          <div className="html-preview">
            <div className="html-actions">
              <button onClick={copyHtml}><Copy size={16}/> HTML 복사</button>
              <button onClick={downloadHtml}><FileDown size={16}/> HTML 파일 저장</button>
            </div>
            <iframe title="HTML 미리보기" srcDoc={htmlSnippet} />
            <textarea className="code-box" value={htmlSnippet} readOnly />
          </div>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
