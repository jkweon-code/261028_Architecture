# 건축설계연구실 웹사이트

연구·수업 자료를 정리해 보여 주고, 대학원생과 연구 결과를 토론하는 연구실 웹사이트입니다.

- **1단계(현재)**: 사이트 화면 전체 + Netlify 배포. 토론 게시판은 **브라우저에만 저장**되는 임시 방식입니다.
- **2단계(예정)**: Firebase(Google 로그인, Firestore)를 연결해 토론 글을 구성원끼리 공유합니다.

---

## 1. 내 컴퓨터에서 실행하기

### 준비물 (처음 한 번만)
1. **Node.js 22 LTS** 설치: https://nodejs.org 에서 "LTS" 버전을 내려받아 설치합니다.
2. **Git** 설치: https://git-scm.com 에서 내려받아 설치합니다.
3. 설치 확인: 터미널(Mac은 "터미널", Windows는 "PowerShell")을 열고 아래를 입력합니다.

```bash
node -v
```
↑ `v22.`으로 시작하는 숫자가 나오면 Node.js가 제대로 설치된 것입니다.

### 실행
터미널에서 이 프로젝트 폴더로 이동한 뒤 차례로 입력합니다.

```bash
npm install
```
↑ 사이트에 필요한 부품(라이브러리)을 내려받습니다. 처음 한 번, 또는 `package.json`이 바뀌었을 때만 하면 됩니다.

```bash
npm run dev
```
↑ 내 컴퓨터에서만 보이는 개발용 사이트를 띄웁니다. 화면에 나온 주소(보통 http://localhost:5173)를 브라우저로 열면 됩니다. 파일을 고치고 저장하면 화면이 바로 바뀝니다. 끄려면 터미널에서 `Ctrl + C`.

```bash
npm run build
```
↑ 실제 배포용 파일을 `dist/` 폴더에 만듭니다. 오류 없이 끝나는지 확인할 때 씁니다 (Netlify가 배포할 때 자동으로 실행하는 명령과 같습니다).

### 개발용 사용자 전환 (1단계 전용)
`npm run dev`로 띄운 화면 **오른쪽 아래의 노란 `DEV` 버튼**으로 교수(admin) · 구성원(member) · 승인 대기(pending) · 비로그인 상태를 바꿔 가며 화면을 확인할 수 있습니다.
이 버튼은 **배포된 사이트에는 나타나지 않습니다.**

> ℹ️ 1단계에서는 실제 로그인이 없으므로, **배포된 사이트에서는 토론 게시판에 "로그인 준비 중" 안내만 보입니다.** 토론 기능은 `npm run dev`에서 확인하세요.
> 또한 1단계 토론 글은 각자의 브라우저에만 저장되어 다른 사람에게 보이지 않습니다. 2단계에서 Firestore로 바뀌면 공유됩니다.
> 저장된 토론 데이터를 처음 상태로 되돌리려면 브라우저 개발자 도구(F12) → Application → Local Storage에서 `archlab.`으로 시작하는 항목을 지우세요.

---

## 2. 내용 수정하기

코드를 몰라도 아래 파일의 글자만 고치면 됩니다. 각 파일 맨 위에 **작성법 주석**이 있습니다.

| 바꾸고 싶은 것 | 파일 |
|---|---|
| 연구실 이름, 소개 문구, 포인트 색, 연락처, 토론 분류 | `src/config/site.ts` |
| 연구 프로젝트 | `src/data/research.ts` |
| 수업(과목)과 자료 링크 | `src/data/courses.ts` |
| 논문·발표 | `src/data/publications.ts` |
| 구성원 | `src/data/members.ts` |

### 수정 요령
- 항목을 추가할 때는 기존 `{ ... },` 블록 하나를 통째로 복사해 붙여 넣고 내용만 바꾸세요.
- 글자는 작은따옴표 `'...'` 안에 씁니다. 여러 줄 문장은 백틱 `` `...` `` 으로 감싸세요.
- 블록 사이의 쉼표 `,` 를 지우면 오류가 납니다.
- 고친 뒤 `npm run build`가 오류 없이 끝나는지 확인하면 안전합니다. 오류가 나면 메시지에 파일 이름과 줄 번호가 나옵니다.

### 수업 자료와 파일 연결
파일 업로드 기능은 없습니다. 자료는 다음 두 가지 방법으로 연결합니다.

1. **외부 링크(권장)**: Google Drive에서 파일 → 공유 → "링크가 있는 모든 사용자" → 링크 복사 → `url: '...'`에 붙여 넣기.
   Drive의 공유 범위를 "우리 학교 계정만" 등으로 정하면 접근을 제한할 수 있습니다.
2. **사이트에 함께 올리기**: `public/files/` 폴더에 파일(예: `syllabus.pdf`)을 넣고 `url: '/files/syllabus.pdf'` 로 적습니다.

> ⚠️ **`public/` 폴더의 파일은 로그인과 무관하게 누구나 접근할 수 있습니다.** 주소만 알면 누구든 내려받을 수 있으므로 **미공개 자료, 학생 개인정보, 저작권 자료는 절대 넣지 마세요.**

구성원 사진은 `public/images/` 폴더를 만들어 넣고 `photo: '/images/hong.jpg'` 처럼 적습니다.

---

## 3. GitHub Private 저장소 만들고 올리기

### 3-1. 저장소 만들기 (웹)
1. https://github.com 에 로그인합니다.
2. 오른쪽 위 `+` → **New repository**.
3. Repository name을 정하고(예: `lab-website`) **Private**을 선택합니다.
4. "Add a README", ".gitignore", "license"는 **모두 체크하지 않은 채** **Create repository**를 누릅니다.
5. 다음 화면에 나오는 주소(`https://github.com/내아이디/lab-website.git`)를 복사해 둡니다.

### 3-2. 처음 올리기 (터미널, 프로젝트 폴더에서)

```bash
git init
```
↑ 이 폴더를 Git으로 관리하기 시작합니다. (이미 Git 폴더라면 생략)

```bash
git add .
```
↑ 올릴 파일을 모두 담습니다. `.gitignore`에 적힌 `node_modules`, `dist`, `.env`는 자동으로 빠집니다.

```bash
git commit -m "연구실 웹사이트 1단계"
```
↑ 담은 파일을 하나의 기록(커밋)으로 저장합니다.

```bash
git branch -M main
```
↑ 기본 가지 이름을 `main`으로 맞춥니다.

```bash
git remote add origin https://github.com/내아이디/lab-website.git
```
↑ 3-1에서 복사한 GitHub 저장소 주소를 연결합니다.

```bash
git push -u origin main
```
↑ GitHub에 올립니다. 처음에는 GitHub 로그인 창이 뜰 수 있습니다.

### 3-3. 내용을 고친 뒤 다시 올리기

```bash
git add .
```
```bash
git commit -m "연구 프로젝트 추가"
```
```bash
git push
```
↑ 이 세 줄이면 됩니다. Netlify가 연결되어 있으면 1~2분 뒤 사이트에 자동 반영됩니다.

---

## 4. Netlify로 배포하기

1. https://app.netlify.com 에 접속해 **GitHub 계정으로 가입/로그인**합니다.
2. **Add new project**(또는 Add new site) → **Import an existing project** → **GitHub**를 선택합니다.
3. GitHub 권한 창이 뜨면 Netlify가 저장소에 접근하도록 허용합니다. Private 저장소가 목록에 없으면 **Configure Netlify on GitHub**에서 해당 저장소를 추가하세요.
4. 저장소를 고르면 설정 화면이 나옵니다. 이 프로젝트의 `netlify.toml`이 값을 자동으로 채워 줍니다. 아래와 같은지만 확인하세요.
   - Branch to deploy: `main`
   - Build command: `npm run build`
   - Publish directory: `dist`
5. 1단계에서는 환경변수를 넣지 않아도 됩니다. **Deploy**를 누릅니다.
6. 1~2분 뒤 `https://임의이름.netlify.app` 주소가 생깁니다.
7. 주소 이름 바꾸기: Project configuration → General → **Change project name**에서 원하는 이름(예: `archlab-xxx`)으로 바꿉니다.
   학교 도메인 등 개인 도메인은 Domain management에서 연결할 수 있습니다.

이후에는 GitHub에 `git push`할 때마다 자동으로 다시 배포됩니다. 배포 기록과 오류는 Netlify의 **Deploys** 메뉴에서 확인합니다.

> 하위 주소(예: `/research/urban-housing`)에서 새로고침해도 404가 나지 않도록 `public/_redirects` 파일이 들어 있습니다. 지우지 마세요.

---

## 5. 폴더 구조

```
public/            누구나 접근 가능한 정적 파일 (_redirects, files/)
src/config/        사이트 설정 (site.ts)
src/types/         데이터 모양(타입) 정의
src/data/          연구·수업·성과·구성원 데이터 ← 주로 여기를 고칩니다
src/services/      토론 데이터 접근 (1단계: localStorage, 2단계: Firestore)
src/context/       로그인 상태와 역할 (AuthContext)
src/components/    헤더, 푸터 등 공통 화면 조각
src/pages/         페이지별 화면
src/lib/           날짜 표시 등 작은 도구
```

2단계에서 바뀔 곳에는 코드에 `// TODO(Phase2):` 주석이 달려 있습니다.

## 6. 환경변수

`.env.example`에 2단계에서 쓸 Firebase 설정값 이름만 적혀 있습니다. 실제 값은 `.env` 파일(로컬)과 Netlify 환경변수에만 넣고, `.env`는 GitHub에 올라가지 않습니다.
