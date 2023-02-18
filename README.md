# 순수한 웃음을 만들어내는 커뮤니티 사이트 - 백엔드
프론트엔드 : [프론트엔드 코드로 이동](https://github.com/clcchosun0509/internet-forum_frontend)

[Nestjs](https://github.com/nestjs/nest)를 기반으로한 백엔드 코드입니다.

[웹사이트로 이동](https://hahahaforum.com/)하여 직접 사이트를 확인할 수 있습니다.
## 개발스택
- Nestjs
- Kubernetes
- Minikube
- Docker
- Jenkins
- Elastic Stack (Elasticsearch, logstash, kibana)
- Redis session, OAuth, Passport
- PostgreSQL
- Jest

## 아키텍처

<p align="center" class="img-box">
<img src="https://github.com/clcchosun0509/internet-forum_backend/blob/main/docs/flowchart.png" alt="flowchart" width=1000 />
</p>

## 현재까지 구현된 기능

- 네이버, 깃허브 OAuth로 회원가입/로그인 (현재 깃허브만 가입 가능)
- 로그아웃
- 글쓰기, 글수정, 글삭제
- 댓글쓰기, 댓글수정, 댓글삭제
- 대댓글쓰기, 대댓글수정, 대댓글삭제
- 제목 + 내용, 제목, 글쓴이 검색
- 추천하기
- 프로필 수정 (현재는 닉네임만 수정가능)
- 다크 모드 지원

## 예제 이미지
### 기본적인 사이트 작동 방식
<p align="center" class="img-box">
<img src="https://github.com/clcchosun0509/internet-forum_backend/blob/main/docs/internet-forum-example.gif" alt="internet forum app example" width=400 />
</p>
&nbsp;

### 검색 기능
<p align="center" class="img-box">
<img src="https://github.com/clcchosun0509/internet-forum_backend/blob/main/docs/internet-forum-example2.gif" alt="flowchart" width=1000 />
</p>
