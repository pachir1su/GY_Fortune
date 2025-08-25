# GY_Fortune (React + Vite, JavaScript)

## 설치
```bash
npm install
```

## 개발 서버
```bash
npm run dev
```

## 프로덕션 빌드
```bash
npm run build
npm run preview
```

### 폴더 구조
```
src/
  App.jsx
  main.jsx
  index.css
  components/ShareCard.jsx
  lib/fortuneEngine.js
  pages/Home.jsx
  pages/Result.jsx
  store/useFortuneStore.js
```

## 기능
- 이름/생년월일(YYYY-MM-DD) 입력 → 날짜 고정 시드 기반 운세 생성
- 카테고리별 점수/조언/럭키 키 제공
- Web Share API 지원(미지원 브라우저는 클립보드 복사)
- `zustand` 상태 관리, `react-router-dom` 라우팅
