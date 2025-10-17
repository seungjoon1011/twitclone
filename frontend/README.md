# Twitter Clone - Frontend

React와 Vite를 사용한 트위터 클론 프론트엔드 애플리케이션입니다.

## 기술 스택

- **React 19** - UI 라이브러리
- **Vite 7** - 빌드 도구 및 개발 서버
- **Tailwind CSS 4** - 스타일링
- **React Router** - 라우팅
- **Zustand** - 상태 관리
- **Axios** - HTTP 클라이언트
- **React Icons** - 아이콘 라이브러리

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
VITE_API_URL=http://localhost:8080
```

## 백엔드 연결

### 1. API 클라이언트 설정 (`src/services/api.js`)

Axios 인스턴스를 생성하여 모든 API 요청에 사용합니다:

```javascript
// API 베이스 URL 설정
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
}); 

// 요청 인터셉터: 모든 요청에 JWT 토큰 자동 추가
api.interceptors.request.use((config) => {
  const token = StorageService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 401 에러 시 자동 로그아웃
api.interceptors.response.use(
  (response) => response,
  (err) => {
    if (err.response?.status === 401) {
      StorageService.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
```

**응용 가능한 부분:**

- 다른 프로젝트에서도 동일한 패턴으로 API 클라이언트 구성 가능
- 요청/응답 인터셉터를 활용한 전역 에러 핸들링
- 토큰 갱신(refresh token) 로직 추가 가능

### 2. 서비스 레이어 (`src/services/`)

각 도메인별로 API 호출을 캡슐화합니다:

```javascript
// auth.js - 인증 관련
export const authService = {
  login: (credentials) => api.post("/api/auth/login", credentials),
  register: (userData) => api.post("/api/auth/register", userData),
  logout: () => {
    /* 로컬 스토리지 클리어 */
  },
};

// post.js - 게시물 관련
const postService = {
  getPosts: () => api.get("/api/posts"),
  createPost: (postData) => api.post("/api/posts", postData),
  deletePost: (id) => api.delete(`/api/posts/${id}`),
};

// user.js - 사용자 관련
const userService = {
  getProfile: (userId) => api.get(`/api/users/${userId}`),
  updateProfile: (data) => api.put("/api/users/profile", data),
  uploadProfileImage: (formData) =>
    api.post("/api/users/profile/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
```

**응용 가능한 부분:**

- RESTful API 패턴을 따르는 서비스 레이어 구조
- 파일 업로드 시 `multipart/form-data` 사용법
- 에러 핸들링 및 응답 데이터 가공

## 주요 구현 로직

### 1. 상태 관리 (Zustand)

전역 상태 관리를 위해 Zustand를 사용합니다. Redux보다 간결하고 보일러플레이트가 적습니다.

```javascript
// src/store/authStore.js
import { create } from "zustand";

const useAuthStore = create((set) => ({
  // 상태
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // 액션
  login: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.login(userData);
      set({ user: data.user, isAuthenticated: true, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
}));

// 컴포넌트에서 사용
function Profile() {
  const { user, logout } = useAuthStore();
  return <div>{user.username}</div>;
}
```

**응용 가능한 부분:**

- Redux 대신 가벼운 상태 관리 라이브러리 사용
- 비동기 로직을 store 내부에서 처리
- 여러 store를 도메인별로 분리 (postStore, userStore 등)

### 2. 로컬 스토리지 관리

토큰과 사용자 정보를 체계적으로 관리합니다:

```javascript
// src/services/storage.js
const StorageService = {
  getAccessToken: () => localStorage.getItem("accessToken"),
  setAccessToken: (token) => localStorage.setItem("accessToken", token),
  getUser: () => JSON.parse(localStorage.getItem("user")),
  setUser: (user) => localStorage.setItem("user", JSON.stringify(user)),
  clear: () => localStorage.clear(),
};
```

**응용 가능한 부분:**

- 일관된 스토리지 접근 패턴
- sessionStorage나 IndexedDB로 확장 가능
- 암호화된 스토리지 구현 가능

### 3. Protected Route (인증 라우팅)

인증이 필요한 페이지를 보호합니다:

```javascript
// src/components/ProtectedRoute.jsx
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
}

// App.jsx에서 사용
<Route
  path="/"
  element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  }
/>;
```

**응용 가능한 부분:**

- 역할 기반 접근 제어(RBAC)로 확장 가능
- 권한별로 다른 라우트 보호
- 리다이렉트 경로 커스터마이징

### 4. 이미지 업로드

프로필 이미지를 업로드하고 미리보기를 보여줍니다:

```javascript
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // FormData 생성
  const formData = new FormData();
  formData.append("image", file);

  // 업로드
  const response = await userService.uploadProfileImage(formData);

  // 백엔드에서 반환된 이미지 URL 사용
  setImageUrl(response.data.imageUrl);
};

// 이미지 표시
<img src={`${API_URL}${user.profileImage}`} />;
```

**응용 가능한 부분:**

- 다중 파일 업로드
- 이미지 압축 및 리사이징 (browser-image-compression 라이브러리)
- 드래그 앤 드롭 업로드
- 업로드 진행률 표시

### 5. Infinite Scroll (무한 스크롤)

게시물 목록을 스크롤하면 자동으로 더 불러옵니다:

```javascript
const [posts, setPosts] = useState([]);
const [page, setPage] = useState(0);
const [hasMore, setHasMore] = useState(true);

const loadMorePosts = async () => {
  const newPosts = await postService.getPosts(page, 10);
  setPosts([...posts, ...newPosts]);
  setPage(page + 1);
  setHasMore(newPosts.length === 10);
};

// Intersection Observer 사용
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore) {
      loadMorePosts();
    }
  });
  observer.observe(bottomRef.current);
}, []);
```

**응용 가능한 부분:**

- react-intersection-observer 라이브러리 활용
- 페이지네이션으로 전환
- 스크롤 위치 복원 (뒤로가기 시)

### 6. Optimistic UI Update

좋아요 버튼을 누르면 서버 응답 전에 UI를 먼저 업데이트합니다:

```javascript
const handleLike = async (postId) => {
  // 1. UI 먼저 업데이트 (낙관적 업데이트)
  setPosts(
    posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            liked: !post.liked,
            likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1,
          }
        : post
    )
  );

  // 2. 서버에 요청
  try {
    await likeService.toggleLike(postId);
  } catch (err) {
    // 실패 시 롤백
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likeCount: post.liked ? post.likeCount + 1 : post.likeCount - 1,
            }
          : post
      )
    );
  }
};
```

**응용 가능한 부분:**

- 사용자 경험 개선 (즉각적인 피드백)
- 에러 발생 시 롤백 처리
- React Query의 optimistic update 사용

### 7. Custom Hooks

재사용 가능한 로직을 커스텀 훅으로 추출합니다:

```javascript
// useDebounce.js - 검색창 최적화
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// 사용 예시
const searchTerm = useDebounce(inputValue, 500);
useEffect(() => {
  searchUsers(searchTerm);
}, [searchTerm]);
```

**응용 가능한 부분:**

- useIntersectionObserver (무한 스크롤)
- useLocalStorage (상태 영속화)
- useMediaQuery (반응형 디자인)
- useFetch (데이터 페칭)

### 8. Tailwind CSS 컴포넌트화

반복되는 스타일을 `@apply`로 재사용합니다:

```css
/* src/index.css */
@layer components {
  .btn-primary {
    @apply bg-blue-500 text-white hover:bg-blue-600 transition-colors;
  }

  .form-group {
    @apply space-y-4;
  }

  .card-header {
    @apply flex items-center justify-between px-4 py-4;
  }
}
```

**응용 가능한 부분:**

- 일관된 디자인 시스템 구축
- CSS-in-JS 라이브러리로 전환 가능
- 다크 모드 구현 (dark: 접두사 활용)

### 9. OAuth 소셜 로그인

GitHub OAuth를 통한 로그인 구현:

```javascript
// 로그인 버튼
<button
  onClick={() =>
    (window.location.href = `${API_URL}/oauth2/authorization/github`)
  }
>
  GitHub으로 로그인
</button>;

// OAuth 콜백 처리
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    StorageService.setAccessToken(token);
    // 사용자 정보 가져오기
    fetchUserProfile();
  }
}, []);
```

**응용 가능한 부분:**

- Google, Kakao, Naver 등 다른 OAuth 제공자 추가
- OAuth 상태 관리 및 에러 핸들링
- 소셜 로그인 후 추가 정보 입력 플로우

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── common/         # Avatar, Loading, ErrorMessage 등
│   ├── layout/         # Header, BottomNavigation, MainLayout
│   ├── post/           # PostCard, PostForm, CommentList
│   ├── profile/        # ProfileHeader, ProfileInfo, EditProfileModal
│   └── ui/             # Button, Input 등 기본 UI 컴포넌트
├── pages/              # 페이지 컴포넌트
│   ├── home.jsx
│   ├── login.jsx
│   ├── signup.jsx
│   └── profile.jsx
├── services/           # API 호출 로직
│   ├── api.js          # Axios 인스턴스
│   ├── auth.js
│   ├── post.js
│   └── user.js
├── store/              # Zustand 상태 관리
│   ├── authStore.js
│   ├── postStore.js
│   └── userStore.js
├── App.jsx             # 라우팅 설정
└── main.jsx            # 진입점
```

## 추후 개선 및 확장 아이디어

### 성능 최적화

- React Query로 서버 상태 관리 개선
- React.lazy()를 활용한 코드 스플리팅
- 이미지 최적화 (WebP, lazy loading)
- Virtual scrolling (react-window)

### 기능 추가

- 실시간 알림 (WebSocket, Server-Sent Events)
- 다이렉트 메시지 (DM)
- 북마크 기능
- 트렌딩 해시태그
- 고급 검색 필터

### UX 개선

- 스켈레톤 UI (로딩 상태 개선)
- 다크 모드
- 애니메이션 (Framer Motion)
- 반응형 디자인 완성도 향상

### 테스트

- Jest + React Testing Library
- E2E 테스트 (Playwright)
- 시각적 회귀 테스트 (Chromatic)

### DevOps

- Docker 컨테이너화
- CI/CD 파이프라인 (GitHub Actions)
- Vercel/Netlify 배포
- 환경별 설정 분리 (dev, staging, prod)

## 참고 자료

- [React 공식 문서](https://react.dev)
- [Vite 공식 문서](https://vitejs.dev)
- [Tailwind CSS 공식 문서](https://tailwindcss.com)
- [Zustand 문서](https://github.com/pmndrs/zustand)
- [Axios 문서](https://axios-http.com)
