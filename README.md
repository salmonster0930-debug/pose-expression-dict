# 표정·포즈 사전 (로컬 사이트)

성인 **20+** · 태그는 성인 내용일 수 있음 · **예시 그림은 전부 옷 입은 SFW**

## 열기

```bash
cd pose-dict-site
python3 -m http.server 8765
```

브라우저에서 http://localhost:8765

(이미 서버가 떠 있으면 바로 접속)

## 구성

| 파일 | 설명 |
|------|------|
| `data.json` | 869개 태그 (A~E) |
| `app.js` | 검색·탭·복사 + 착의 SVG 일러스트 |
| `examples/` | 대표 착의 PNG (필터 회피용) |

## 참고

- NSFW 태그는 텍스트로만 복사
- 카드 그림: 기본 SVG 마네킹/얼굴(착의) + 일부는 `examples/` PNG
- 공개 호스팅(Origin)은 아직 미설정 — 로컬/정적 서버용
