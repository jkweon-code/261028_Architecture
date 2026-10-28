# 건축설계연구실 웹사이트

연구·수업 자료를 정리해 보여 주고, 대학원생과 연구 결과를 토론하는 연구실 웹사이트입니다.

- 연구·수업·성과·구성원: `src/data/` 파일로 관리하며 누구나 볼 수 있습니다.
- 토론 게시판: **Google 로그인 + 교수 승인**을 받은 구성원만 이용합니다. 글과 댓글은 Firebase(Cloud Firestore)에 저장됩니다.
- 배포: GitHub(Private) → Netlify 자동 배포. Firebase는 **Spark(무료) 요금제**의 Authentication과 Firestore만 사용합니다.

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

### 내 컴퓨터에서 로그인·토론까지 확인하려면
프로젝트 폴더에 `.env` 파일이 있어야 합니다. `.env.example`을 복사해 `.env`로 이름을 바꾸고, 아래 **7-2**에서 받은 Firebase 설정값을 채운 뒤 `npm run dev`를 다시 실행하세요.
`.env`가 없으면 로그인 버튼이 비활성화되고, 토론을 뺀 나머지 페이지만 동작합니다.

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
git commit -m "연구실 웹사이트 첫 업로드"
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
5. **Deploy**를 누릅니다. (Firebase 환경변수는 7-6에서 넣습니다. 넣기 전에도 토론을 뺀 페이지는 정상 동작합니다)
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
src/services/      토론·사용자 데이터 접근 (Firestore)
src/context/       로그인 상태와 역할 (AuthContext)
src/components/    헤더, 푸터 등 공통 화면 조각
src/pages/         페이지별 화면
src/lib/           Firebase 초기화(firebase.ts), 날짜 표시 등
firestore.rules    Firestore 보안 규칙 (콘솔에 붙여 넣어 게시)
```


## 6. 환경변수

`.env.example`에 Firebase 설정값 이름이 적혀 있습니다. 실제 값은 `.env` 파일(내 컴퓨터)과 Netlify 환경변수(7-6)에만 넣으며, `.env`는 GitHub에 올라가지 않습니다.

---

## 7. Firebase 설정 (처음 한 번)

> 모두 무료(Spark) 요금제 안에서 진행합니다. 도중에 **결제 정보 입력이나 요금제 업그레이드(Blaze)를 요구하면 진행하지 마세요.** Cloud Storage, Functions, Hosting은 사용하지 않습니다.

### 7-1. 프로젝트 만들기
1. https://console.firebase.google.com 에 Google 계정으로 로그인합니다.
2. **프로젝트 만들기**(Create a project) → 프로젝트 이름 입력(예: `archlab-site`) → 계속.
3. Google 애널리틱스는 **사용 안 함**으로 두어도 됩니다 → **프로젝트 만들기**.

### 7-2. 웹 앱 등록 (설정값 받기)
1. 프로젝트 첫 화면의 **`</>`(웹)** 아이콘을 누릅니다.
2. 앱 닉네임 입력(예: `website`). "Firebase 호스팅도 설정" 은 **체크하지 않습니다** → **앱 등록**.
3. 화면에 나오는 `firebaseConfig` 값을 메모장에 복사해 둡니다. 다음 6개를 씁니다.

| firebaseConfig 항목 | 환경변수 이름 |
|---|---|
| apiKey | `VITE_FIREBASE_API_KEY` |
| authDomain | `VITE_FIREBASE_AUTH_DOMAIN` |
| projectId | `VITE_FIREBASE_PROJECT_ID` |
| storageBucket | `VITE_FIREBASE_STORAGE_BUCKET` |
| messagingSenderId | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| appId | `VITE_FIREBASE_APP_ID` |

나중에 다시 보려면: 왼쪽 위 톱니바퀴 → **프로젝트 설정** → 아래쪽 "내 앱".

> 이 값들은 비밀번호가 아니라 "어느 Firebase 프로젝트인지"를 알려 주는 주소 같은 것입니다. 데이터 보호는 아래 보안 규칙(firestore.rules)이 담당합니다.

### 7-3. Firestore 데이터베이스 만들기
1. 왼쪽 메뉴 **빌드(Build) → Firestore Database** → **데이터베이스 만들기**.
2. 위치: **`asia-northeast3 (Seoul)`** 권장. (나중에 바꿀 수 없습니다)
3. 보안 규칙: **프로덕션 모드(production mode)**로 시작 → 만들기.
4. 이어서 **7-5**의 보안 규칙을 꼭 게시하세요.

### 7-4. Google 로그인 켜기
1. 왼쪽 메뉴 **빌드 → Authentication** → **시작하기**.
2. **로그인 방법(Sign-in method)** 탭 → **Google** → **사용 설정** 켜기.
3. 프로젝트 지원 이메일을 고르고 → **저장**.
4. 같은 Authentication 화면의 **설정(Settings) → 승인된 도메인(Authorized domains)** → **도메인 추가** → Netlify 주소를 `https://` 없이 입력합니다. 예: `archlab-xxx.netlify.app`
   - `localhost`는 기본으로 들어 있습니다.
   - 나중에 개인 도메인을 연결하면 그 도메인도 추가하세요. 추가하지 않으면 "승인된 도메인이 아닙니다" 오류가 납니다.

### 7-5. 보안 규칙(firestore.rules) 게시
1. 이 프로젝트의 `firestore.rules` 파일을 메모장 등으로 열어 **전체 내용을 복사**합니다.
2. Firebase 콘솔 **Firestore Database → 규칙(Rules)** 탭을 엽니다.
3. 기존 내용을 모두 지우고 붙여 넣은 뒤 **게시(Publish)**를 누릅니다.
4. `firestore.rules`를 고친 경우에도 같은 방법으로 다시 게시해야 반영됩니다. (GitHub에 올리는 것만으로는 반영되지 않습니다)

### 7-6. Netlify에 환경변수 입력
1. Netlify 사이트 화면 → **Project configuration(또는 Site configuration) → Environment variables** → **Add a variable → Add a single variable**.
2. 7-2 표의 **환경변수 이름 6개**를 하나씩 추가하고 값을 붙여 넣습니다. (값 앞뒤에 따옴표나 공백이 없게)
3. 환경변수는 빌드할 때 들어가므로, **Deploys → Trigger deploy → Deploy site**로 한 번 다시 배포합니다.
4. 배포된 사이트에서 "Google 로그인" 버튼이 활성화되면 성공입니다.

---

## 8. 내 계정을 첫 관리자(admin)로 만들기

처음에는 관리자가 없으므로, 교수님 계정만 콘솔에서 직접 한 번 바꿔 줍니다.

1. 배포된 사이트(또는 `npm run dev`)에서 **본인 Google 계정으로 로그인**합니다. "승인 대기 중" 화면이 나오면 정상입니다.
2. Firebase 콘솔 **Firestore Database → 데이터(Data)** 탭 → `users` 컬렉션을 엽니다.
3. 본인 이메일이 적힌 문서를 누르고 `role` 필드의 값 `pending`을 **`admin`**으로 고친 뒤 업데이트합니다.
4. 사이트로 돌아와 **"승인 여부 다시 확인"** 버튼을 누르거나 새로고침하면, 헤더에 **관리** 메뉴가 생깁니다.

이후로는 콘솔에 들어갈 필요가 없습니다.

## 9. 대학원생 승인과 권한

1. 학생이 사이트에서 Google로 로그인하면 자동으로 **승인 대기(pending)**로 등록됩니다.
2. 교수님이 헤더의 **관리** 메뉴(`/admin`)에서 학생 옆 **승인** 버튼을 누르면 **구성원(member)**이 됩니다.
3. 학생은 "승인 여부 다시 확인" 버튼을 누르거나 새로고침하면 토론 게시판을 쓸 수 있습니다.

| | 연구·수업·성과·구성원 | 토론 읽기 | 글·댓글 쓰기 | 수정·삭제 | 사용자 승인 |
|---|---|---|---|---|---|
| 비로그인 | ✅ | ❌ | ❌ | ❌ | ❌ |
| 승인 대기 (pending) | ✅ | ❌ | ❌ | ❌ | ❌ |
| 구성원 (member) | ✅ | ✅ | ✅ | 본인 것만 | ❌ |
| 교수 (admin) | ✅ | ✅ | ✅ | 모두 | ✅ |

- 이 권한은 화면뿐 아니라 `firestore.rules`가 서버에서 강제합니다. 주소를 직접 입력하거나 프로그램으로 접근해도 막힙니다.
- 졸업 등으로 권한을 거두려면 관리 화면에서 역할을 **승인 대기**로 바꾸세요.
- 본인 역할은 실수 방지를 위해 관리 화면에서 바꿀 수 없습니다.

### 무료 한도 안에서 쓰기
Spark 요금제는 하루 읽기 5만 회, 쓰기 2만 회까지 무료입니다. 연구실 규모에서는 넉넉하며, 사이트도 아끼도록 만들어져 있습니다.
- 토론 목록은 20개씩 불러오고 "더 보기"로 이어서 읽습니다.
- 실시간 갱신은 글 상세 화면의 댓글에만 씁니다.
- 한도를 넘으면 요금이 나가는 것이 아니라 그날 하루 토론 기능이 멈춥니다(다음 날 자동 복구). 사용량은 콘솔 **Firestore Database → 사용량(Usage)**에서 볼 수 있습니다.

### 자주 생기는 문제
| 증상 | 해결 |
|---|---|
| 로그인 버튼이 회색이고 "Firebase 설정 필요" | 환경변수(.env 또는 Netlify)가 비어 있음 → 7-2, 7-6 확인 후 다시 배포 |
| "승인된 도메인에 등록되어 있지 않습니다" | 7-4의 4번: 승인된 도메인에 사이트 주소 추가 |
| 로그인 창이 안 뜸 | 브라우저 주소창의 팝업 차단 아이콘 → 이 사이트 팝업 허용 |
| 로그인 후 "사용자 정보를 불러오지 못했습니다" | 7-5 보안 규칙이 게시되지 않았거나 Firestore가 만들어지지 않음 |
| 승인했는데 학생 화면이 그대로 | 학생이 "승인 여부 다시 확인" 또는 새로고침 |
