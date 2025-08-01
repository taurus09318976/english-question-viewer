# 📚 English Question Viewer

중고등학생 영어문항 검토 시스템 - Quill.js 기반 웹뷰어

## 🎯 개요

이 프로젝트는 디지털화된 중고등학생 영어문항을 웹브라우저에서 검토할 수 있는 도구입니다. 고객사에서 사용하는 Quill.js 라이브러리와 JSON delta 포맷과 호환되도록 설계되었습니다.

## ✨ 주요 기능

- **JSON 파일 업로드**: 드래그 앤 드롭 또는 파일 선택으로 JSON 파일 로드
- **문항별 구조화된 보기**: 지문, 문제, 답안, 해설 영역을 구분하여 표시
- **다중 탭 인터페이스**: 
  - 문항 보기: 구조화된 문항 내용
  - 원본 JSON: 원본 데이터 구조
  - HTML 렌더링: HTML 형식으로 렌더링된 내용
- **Quill.js 통합**: 텍스트 에디터 형식으로 내용 표시
- **반응형 디자인**: 데스크톱과 모바일 모두 지원

## 🚀 사용 방법

### 온라인 버전 (권장)

배포된 웹사이트에 직접 접속하세요:

🌐 **[https://taurus09318976.github.io/english-question-viewer/](https://taurus09318976.github.io/english-question-viewer/)**

> ⚠️ **참고**: 첫 배포 후 5-10분 정도 소요될 수 있습니다.

### 로컬 실행

1. 이 레포지토리를 클론합니다:
```bash
git clone https://github.com/[username]/english-question-viewer.git
cd english-question-viewer
```

2. 로컬 웹서버를 실행합니다:
```bash
# Python 3 사용 시
python -m http.server 8000

# Node.js serve 패키지 사용 시
npx serve .

# VS Code Live Server 확장 사용
# index.html 파일을 우클릭 → "Open with Live Server"
```

3. 브라우저에서 `http://localhost:8000` 접속

## 📁 데이터 형식

이 뷰어는 다음과 같은 JSON 구조를 지원합니다:

```json
{
  "info": {
    "html_url": "",
    "provider": "crowdworks"
  },
  "items": [
    {
      "id": 1,
      "answerType": "choice",
      "questionAreaInfo": {
        "annotationIds": [1, 2, 3]
      },
      "passageAreaInfo": {
        "annotationIds": [4, 5]
      },
      "answerAreaInfo": {
        "annotationIds": [-1]
      },
      "explanationAreaInfo": {
        "annotationIds": [-2]
      }
    }
  ],
  "annotations": [
    {
      "id": 1,
      "html": "<div>문제 내용</div>",
      "text": "문제 내용",
      "category_id": 2
    }
  ]
}
```

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Vanilla JavaScript
- **Text Editor**: Quill.js
- **Hosting**: Cloudflare Pages
- **Version Control**: Git/GitHub

## 📂 프로젝트 구조

```
english-question-viewer/
├── index.html          # 메인 HTML 파일
├── viewer.js           # 메인 JavaScript 로직
├── README.md           # 프로젝트 문서
├── data/               # 샘플 JSON 파일들
│   ├── sample1.json
│   └── sample2.json
└── output/             # 원본 JSON 파일들 (개발용)
```

## 🎨 UI 특징

- **모던한 디자인**: 그라데이션과 그림자를 활용한 현대적 UI
- **직관적인 네비게이션**: 파일 목록과 탭 기반 인터페이스
- **코드 에러 보존**: 원본 데이터의 오류를 수정하지 않고 그대로 표시
- **반응형**: 모바일 디바이스에서도 최적화된 경험

## 🔧 개발 정보

### 의존성

- Quill.js 1.3.6 (CDN)
- 모던 브라우저 (ES6+ 지원)

### 브라우저 지원

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 📝 라이센스

이 프로젝트는 MIT 라이센스 하에 제공됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 지원

문제가 발생하거나 기능 요청이 있으시면 [Issues](https://github.com/[username]/english-question-viewer/issues)에 등록해 주세요.

---

Made with ❤️ for English education 