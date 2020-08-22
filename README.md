
<br><br>

<div align="center" style="display:flex;"><img width="333" alt="제목 없음" src="https://user-images.githubusercontent.com/58289478/88244621-4966ec80-cccf-11ea-99ac-fbe54bcd55cc.png"></div>

<div align="center">
⏳ 오늘의 그날, 그날을 SK Telecom이 기억합니다.
</div>

<br><br>

```
📌 그 날 여길 누구랑 왔었지?

📌 그 날 여기서 뭘 했었지?

📌 그 날 여기를 언제 왔었지?

📌 위치 기반으로 당시의 추억을 기억하고, 얼굴인식 API를 통해 지인의 추억도 함께 기억합니다.

📌 AR glass 얼굴인식 기반 SNS 앱 개발
```
<br>

- - -

<br><br>

### ⚡️ SKT AI Fellowship 2기
* 프로젝트 기간 : 2020.05.19 ~ 2020.11.18

<br>

### 📒 Main Function
- **유저**
	- 소셜 로그인(카카오)을 통해 회원가입을 하고 접속할 수 있습니다.
	- 내 얼굴을 등록하거나 삭제할 수 있습니다.
	- 회원탈퇴로 내 정보를 지울 수 있습니다.
    
- **메인**
	- 상대방의 얼굴을 인식하여 나의 지인인지를 판별합니다.
	- 감지된 인물의 목록을 조회할 수 있습니다.
	- 현재 위치를 불러와 화면에 나타내어 줍니다.
  - 상대방을 팔로우하거나 팔로우 취소할 수 있습니다.
  
- **히스토리**
	- 나와 상대방의 추억 목록을 조회하고, 나의 추억은 삭제할 수 있습니다.
	- 추억들에 대해 좋아요, 좋아요 취소를 할 수 있습니다.
	- 추억들에 대해 댓글을 달거나 댓글을 삭제할 수 있습니다.
	- 나와 친구인 사용자의 목록을 불러올 수 있습니다.
	
(미완성)
  
<br>

### 📕 Dependencies
```json
{
  "name": "arsns",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "nodemon ./bin/www"
  },
  "dependencies": {
    "aws-sdk": "^2.718.0",
    "body-parser": "^1.19.0",
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "express": "~4.16.1",
    "express-session": "^1.17.1",
    "fs": "0.0.1-security",
    "http-errors": "~1.6.3",
    "jade": "~1.11.0",
    "morgan": "~1.9.1",
    "multer": "^1.4.2",
    "multer-s3": "^2.9.0",
    "mysql": "^2.18.1",
    "mysql-promise": "^5.0.0",
    "passport": "^0.4.1",
    "passport-kakao": "^1.0.0",
    "promise": "^8.1.0",
    "promise-mysql": "^4.1.3",
    "request": "^2.88.2"
  }
}


```

<br>

### 📗 ERD
![image](https://user-images.githubusercontent.com/58289478/90951791-e668a100-e498-11ea-8d25-d6b4e8f994db.png)

  (미완성)
  
<br>

### 📗 Architecture
  (미완성)

<br>

#### [API 문서 바로가기❗️](https://github.com/SKT-AI-Fellowship-2-AR-SNS/ARSNS-server/wiki)
