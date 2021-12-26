# Vuetify template
웹 어플리케이션 프로젝트에서 필요한 컴포넌트들을 Vuetify를 사용하여 만든 템플릿입니다.
## 특징 
1. 서비스에서 자주 사용되는 비즈니스 로직 모음
  - 검증(Validation)
    - Email
    - 주민등록번호
    - 전화번호
    - 금액 연산
    - 위치(위도, 경도)
2. 서비스에서 자주 사용되는 컴포넌트 템플릿(BaseComponent) 제공
  - 페이지네이션
  - 콤보박스
3. 서비스에서 항상 사용되는 레이아웃 템플릿 제공
  - 회원가입
  - 로그인
  - 내정보 관리
  - 서비스내 페이지
  - 서비스 유지보수
  - 채팅 컴포넌트
4. 각 페이지별 Router 구성
  - url에 pagination을 query string으로 넘겨줘서 이를 바로 표현할 수 있어야 함
5. 레이아웃 템플릿들을 로컬 내의 서버를 띄워서 재현할 수 있도록 구성
6. 로컬에 띄울 수 있는 Api 서버들
  - Rest: Express(Auth Api) [참고 소스:Token-Based Authentication](https://github.com/Code-Pop/authentication_course/releases/tag/lesson7_FINISH)
  - Rest: Graphql(Service Api) [참고 소스:Vuemastery-graphql-server](https://gitlab.com/ntepluhina/vuemastery-graphql-server)
  - Socket: Socket.io(Push & Chatting) [참고 소스](https://socket.io/get-started/chat)
7. 테스트 코드 범위
  - 유닛 단위 비즈니스 로직
  - 컴포넌트 템플릿
  - 레이아웃 템플릿
  - 페이지 단위 비즈니스 로직
## 서버 구동
### Rest(Graphql)
```bash
$ cd server/graphql
$ yarn
$ yarn serve
```
`http://localhost:50001/graphql`로 확인해주세요.
### Rest(express server)
```bash
$ cd server/rest
$ yarn
$ yarn serve
```
`http://localhost:3000/events`로 확인해주세요.
### Socket(Socket.io)
```bash
```